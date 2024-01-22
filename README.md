# cdktf-aws-nest-nuxt-lambdaliths

CDKTF app that deploys NestJS and Nuxt Lambdaliths along with a serverless Redis database to AWS.

This app leverages the [AWS Lambda Web Adapter](https://github.com/awslabs/aws-lambda-web-adapter) with Lambda Function URLs.

## Application Details

- `back-lambda`
  - Environment variables:
    - `REDIS_SERVER` - Address of the Redis database in the form of `redis://<user>:<psw>@<host>:<port>`
  - Port bindings:
    - `4000`
  - Endpoints:
    - `/api/clicks` - Returns current click count
    - `/api/clicks/incr` - Increments click count by 1 and returns new click count
    - `/api/ping` - Returns static "pong" response
- `front-lambda`
  - Environment variables:
    - `BACKEND_API_URL` - Address of the backend service reachable from the server-side in the form of `http://<host>`
    - `CLIENT_API_URL` -  Address of the backend service reachable from the client-side in the form of `http://<host>`
  - Port bindings:
    - `3000`
  - Endpoints:
    - `/`  - Click counter display/UI
    - `/ping` - Returns static "pong" response

## Prerequisites

- **_AWS:_**
  - Must have authenticated with [Default Credentials](https://registry.terraform.io/providers/hashicorp/aws/latest/docs#authentication-and-configuration) in your local environment.
- **_Upstash:_**
  - Must have set the `UPSTASH_EMAIL` and `UPSTASH_API_KEY` variables in your local environment.
- **_Node.js + npm:_**
  - Must be [installed](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) in your system.
- **_Docker:_**
  - Must be [installed](https://docs.docker.com/get-docker/) in your system and running at deployment.

## Installation

```sh
npx projen install
```

## Deployment

```sh
npx projen deploy
```

## Cleanup

```sh
npx projen destroy
```

## Architecture Diagram

![Architecture Diagram](./src/assets/arch.svg)
