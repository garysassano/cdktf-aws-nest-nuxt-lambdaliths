import { App } from "cdktf";
import { MyStack } from "./stacks/my-stack";

const app = new App();

new MyStack(app, "cdktf-aws-nest-nuxt-lambdaliths-dev");

app.synth();
