import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { Redis } from "ioredis";

const app = new Hono();

// Initialize Redis
const getRedisUrl = () => {
  const url = process.env.REDIS_URL;
  if (!url) {
    throw new Error("Environment variable 'REDIS_URL' is required.");
  }
  return url;
};

const client = new Redis(getRedisUrl());
client.on("error", (err) => console.error("Redis Client Error:", err));

// Middleware
app.use("*", cors());

// Root route
app.get("/", (c) => {
  return c.text("Hello Node.js!");
});

// Ping route
app.get("/ping", (c) => {
  return c.text("pong");
});

// Clicks routes
app.get("/api/clicks", async (c) => {
  try {
    const clicks = parseInt((await client.get("clicks")) ?? "0");
    return c.json({ clicks });
  } catch {
    return c.json({ error: "Failed to fetch clicks" }, 500);
  }
});

app.get("/api/clicks/incr", async (c) => {
  try {
    const clicks = await client.incr("clicks");
    return c.json({ clicks });
  } catch {
    return c.json({ error: "Failed to increment clicks" }, 500);
  }
});

// Start server
serve({
  fetch: app.fetch,
});
