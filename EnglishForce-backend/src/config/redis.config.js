import { createClient } from "redis";


const USE_REDIS = process.env.USE_REDIS === "true";

var redisClient = null;

if (USE_REDIS) {
  redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
  });

  redisClient.on("connect", () => console.log("✅ Connected to Redis"));
  redisClient.on("error", (err) => console.error("❌ Redis Error:", err));

  redisClient.connect().catch((err) => {
    console.error("⚠️ Redis connect failed:", err.message);
  });
}

export default redisClient;


