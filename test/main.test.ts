import { App, Testing } from "cdktn";
import { beforeAll, describe, expect, it } from "vitest";

describe("MyStack", () => {
  let synthesized: string;

  beforeAll(async () => {
    // The stack validates these at import time and throws without them.
    process.env.UPSTASH_EMAIL = "test@example.com";
    process.env.UPSTASH_API_KEY = "test-key";
    const { MyStack } = await import("../src/stacks/my-stack.js");
    // `runValidations` makes synth fail on construct-level validation errors.
    synthesized = Testing.synth(new MyStack(new App(), "test"), true);
  });

  it("configures the AWS, Docker and Upstash providers", () => {
    expect(Testing.toHaveProvider(synthesized, "aws")).toBe(true);
    expect(Testing.toHaveProvider(synthesized, "docker")).toBe(true);
    expect(Testing.toHaveProvider(synthesized, "upstash")).toBe(true);
  });

  it("creates a TLS Redis database in the same region as the Lambdas", () => {
    expect(
      Testing.toHaveResourceWithProperties(synthesized, "upstash_redis_database", {
        database_name: "redis-database",
        region: "global",
        primary_region: "eu-central-1",
        tls: true,
      }),
    ).toBe(true);
  });

  it("lets destroy remove the image repositories", () => {
    const repos = JSON.parse(synthesized).resource.aws_ecr_repository;

    // ECR refuses to delete a non-empty repository, and this stack always
    // pushes an image into both.
    expect(repos.BackRepo.force_delete).toBe(true);
    expect(repos.FrontRepo.force_delete).toBe(true);
  });

  it("builds both images for arm64 and rebuilds when the Dockerfile changes", () => {
    const images = JSON.parse(synthesized).resource.docker_image;

    for (const [key, dir] of [
      ["BackImage", "back"],
      ["FrontImage", "front"],
    ] as const) {
      expect(images[key].build.platform).toBe("linux/arm64");
      // Attestations would make this an OCI manifest list, which Lambda rejects.
      expect(images[key].build.provenance).toBe("false");
      expect(images[key].build.sbom).toBe("false");
      expect(images[key].build.context).toMatch(new RegExp(`src/functions/${dir}$`));
      // A hash of the whole build context, computed at synth time.
      expect(images[key].triggers.filesha256).toMatch(/^[0-9a-f]{64}$/);
    }
  });

  it("deploys both Lambdas from their pushed image digests", () => {
    const fns = JSON.parse(synthesized).resource.aws_lambda_function;

    for (const [key, name, repo] of [
      ["BackLambda", "back-lambda", "BackEcrImage"],
      ["FrontLambda", "front-lambda", "FrontEcrImage"],
    ] as const) {
      expect(fns[key].function_name).toBe(name);
      expect(fns[key].package_type).toBe("Image");
      expect(fns[key].architectures).toEqual(["arm64"]);
      expect(fns[key].memory_size).toBe(1769);
      expect(fns[key].image_uri).toContain(`docker_registry_image.${repo}`);
      expect(fns[key].image_uri).toContain("sha256_digest");
    }
  });

  it("passes Redis to the backend and the backend URL to the frontend", () => {
    const fns = JSON.parse(synthesized).resource.aws_lambda_function;

    expect(fns.BackLambda.environment.variables.REDIS_URL).toMatch(/^rediss:\/\/default:/);
    expect(fns.FrontLambda.environment.variables.BACKEND_URL).toContain("trimsuffix(");
    expect(fns.FrontLambda.environment.variables.BACKEND_URL).toContain(
      "aws_lambda_function_url.BackLambdaUrl.function_url",
    );
  });

  it("exposes both Lambdas over unauthenticated function URLs", () => {
    const urls = JSON.parse(synthesized).resource.aws_lambda_function_url;

    expect(urls.BackLambdaUrl.authorization_type).toBe("NONE");
    expect(urls.FrontLambdaUrl.authorization_type).toBe("NONE");
    expect(Object.keys(JSON.parse(synthesized).output)).toEqual(
      expect.arrayContaining(["FrontLambdaURL", "BackLambdaURL"]),
    );
  });
});
