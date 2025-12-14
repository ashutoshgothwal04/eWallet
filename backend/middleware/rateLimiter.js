import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis'

const redis = new Redis({
    redis: Redis.fromEnv(),
    rateLimit: Ratelimit()
})
        