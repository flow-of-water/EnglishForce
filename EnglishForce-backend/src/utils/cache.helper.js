import redisClient from "../config/redis.config.js";

const DEFAULT_EXPIRATION = 60 * 5; // 5 phút

// 🧠 Lấy dữ liệu cache (nếu có)
export const getCache = async (key) => {
    try {
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    } catch (err) {
        console.error("Redis getCache error:", err);
        return null;
    }
};

// 💾 Lưu dữ liệu cache
export const setCache = async (key, value, ttl = DEFAULT_EXPIRATION) => {
    try {
        await redisClient.setEx(key, ttl, JSON.stringify(value));
    } catch (err) {
        console.error("Redis setCache error:", err);
    }
};

// 🧹 Xoá cache khi dữ liệu thay đổi
export const delCache = async (key) => {
    try {
        await redisClient.del(key);
    } catch (err) {
        console.error("Redis delCache error:", err);
    }
};


// 🔥 Xóa cache theo prefix
// This is not best practice for production: không nên dùng KEYS trong production. Nó duyệt toàn bộ keyspace → blocking Redis, 
// đặc biệt khi có nhiều key hoặc đang chạy trên Redis Cluster (thậm chí KEYS còn bị hạn chế).
export const delCacheByPrefix_DontUse = async (prefix) => {
    try {
        const keys = await redisClient.keys(`${prefix}*`);
        if (keys.length > 0) await redisClient.del(keys);
    } catch (err) {
        console.error("Redis delCacheByPrefix error:", err);
    }
};


// Xoá theo prefix bằng SCAN (Recommended)
export const delCacheByPrefix = async (prefix) => {
  try {
    let cursor = "0";
    const match = `${prefix}*`;
    do {
      const res = await redisClient.scan(cursor, { MATCH: match, COUNT: 1000 });
      cursor = res.cursor;
      const batch = res.keys;
      if (batch.length) {
        // UNLINK xóa async (ít block hơn DEL). Fallback sang DEL nếu Redis < 4.
        if (redisClient.unlink) await redisClient.unlink(batch);
        else await redisClient.del(batch);
      }
    } while (cursor !== "0");
  } catch (e) {
    console.error("Redis delCacheByPrefix (SCAN):", e);
    console.log("Prefix: ", prefix);
  }
};


//#############################################
// WRAPPERS

const use_redis = (process.env.USE_REDIS === "true") || false;

// 🧩 Wrapper CRUD 
export const cacheWrapper = {
    async create(createFn, invalidateKeys = []) {
        try {
            const result = await createFn();
            // Xóa cache list, để lần sau load lại
            if (use_redis) await Promise.all(invalidateKeys.map((k) => delCacheByPrefix(k)));
            return result;
        } catch (err) {
            console.error("❌ cacheWrapper.create error:", err.message);  throw err;
        }
    },

    async read(key, fetchFn) {
        try {
            if (use_redis) {
                const cached = await getCache(key);
                if (cached) {
                    console.log("🟢 Cache hit:", key);
                    return cached;
                }
                // console.log("🔵 Cache miss:", key);
            }
            const result = await fetchFn();
            if(use_redis) await setCache(key, result);
            return result;
        } catch (err) {
            console.error("❌ cacheWrapper.read error:", err.message);   throw err;
        }        
    },

    async update(updateFn, invalidateKeys = []) {
        try {
            const result = await updateFn();
            if (use_redis) await Promise.all(invalidateKeys.map((k) => delCacheByPrefix(k)));
            return result;
        } catch (err) {
            console.error("❌ cacheWrapper.update error:", err.message);   throw err;
        }
    },

    async delete(deleteFn, invalidateKeys = []) {
        try{
            const result = await deleteFn();
            if (use_redis) await Promise.all(invalidateKeys.map((k) => delCacheByPrefix(k)));
            return result;
        } catch (err) {
            console.error("❌ cacheWrapper.delete error:", err.message);  throw err;
        }
    },
};