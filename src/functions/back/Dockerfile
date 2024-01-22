# Base image with node and pnpm
FROM --platform=${TARGETPLATFORM} public.ecr.aws/docker/library/node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /var/task
COPY . /var/task

# Prod-deps stage
FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Build stage
FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm build

# Final stage
FROM base
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.3 /lambda-adapter /opt/extensions/lambda-adapter
COPY --from=prod-deps /var/task/node_modules /var/task/node_modules
COPY --from=build /var/task/dist /var/task/dist
ENV AWS_LWA_READINESS_CHECK_PATH="/api/ping"
ENV AWS_LWA_READINESS_CHECK_MIN_UNHEALTHY_STATUS="400"
ENV AWS_LWA_PORT="4000"
EXPOSE 4000
CMD [ "node", "dist/main" ]
