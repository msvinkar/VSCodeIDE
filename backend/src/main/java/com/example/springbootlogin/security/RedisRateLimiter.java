package com.example.springbootlogin.security;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
public class RedisRateLimiter {

    private final StringRedisTemplate redisTemplate;
    private final int limit = 10;
    private final Duration window = Duration.ofMinutes(1);

    public RedisRateLimiter(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public boolean tryConsume(String key) {
        if (key == null || key.isBlank()) {
            key = "unknown";
        }

        String redisKey = "rl:" + key;
        try {
            Long value = redisTemplate.opsForValue().increment(redisKey);
            if (value != null && value == 1) {
                redisTemplate.expire(redisKey, window);
            }
            return value != null && value <= limit;
        } catch (Exception e) {
            // If Redis is unavailable, fail closed (deny) to prevent abuse
            return false;
        }
    }
}
