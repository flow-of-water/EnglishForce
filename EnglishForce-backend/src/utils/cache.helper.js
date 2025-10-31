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
export const delCacheByPrefix = async (prefix) => {
    try {
        const keys = await redisClient.keys(`${prefix}*`);
        if (keys.length > 0) await redisClient.del(keys);
    } catch (err) {
        console.error("Redis delCacheByPrefix error:", err);
    }
};

//#############################################
// WRAPPERS

const use_redis = (process.env.USE_REDIS === "true") || false;

// 🧩 Wrapper CRUD 
export const cacheWrapper = {
    async create(createFn, invalidateKeys = []) {
        const result = await createFn();
        // Xóa cache list, để lần sau load lại
        if (use_redis) await Promise.all(invalidateKeys.map((k) => delCacheByPrefix(k)));
        return result;
    },

    async read(key, fetchFn) {
        if (use_redis) {
            const cached = await getCache(key);
            if (cached) {
                console.log("🟢 Cache hit:", key);
                return cached;
            }
            console.log("🔵 Cache miss:", key);
        }
        const result = await fetchFn();
        if(use_redis) await setCache(key, result);
        return result;
    },

    async update(updateFn, invalidateKeys = []) {
        const result = await updateFn();
        // Xóa cache chi tiết và list liên quan
        if (use_redis) await Promise.all(invalidateKeys.map((k) => delCacheByPrefix(k)));
        return result;
    },

    async delete(deleteFn, invalidateKeys = []) {
        const result = await deleteFn();
        if (use_redis) await Promise.all(invalidateKeys.map((k) => delCacheByPrefix(k)));
        return result;
    },
};