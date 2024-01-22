import { javascript } from "projen";
import { CdktfTypeScriptApp } from "projen-cdktf-app-ts";
const project = new CdktfTypeScriptApp({
  cdktfVersion: "0.20.3",
  defaultReleaseBranch: "main",
  depsUpgradeOptions: { workflow: false },
  devDeps: ["projen-cdktf-app-ts"],
  eslint: true,
  minNodeVersion: "20.11.1",
  name: "cdktf-aws-nest-nuxt-lambdaliths",
  packageManager: javascript.NodePackageManager.PNPM,
  pnpmVersion: "8.15.3",
  prettier: true,
  projenrcTs: true,

  terraformProviders: [
    "hashicorp/aws@~> 5.37.0",
    "kreuzwerker/docker@~> 3.0.2",
    "upstash/upstash@~> 1.5.2",
  ],
});

// Generate CDKTF constructs after installing deps
project.tasks.tryFind("install")?.spawn(project.cdktfTasks.get);

project.synth();
