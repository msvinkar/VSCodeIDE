package com.example.springbootlogin.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@Configuration
public class CacheThreadPoolConfig {

    @Bean
    public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager("users");
    }

    @Bean(name = "appTaskExecutor")
    public Executor appTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(4);
        executor.setMaxPoolSize(12);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("app-exec-");
        executor.setKeepAliveSeconds(30);
        executor.initialize();
        return executor;
    }
}
