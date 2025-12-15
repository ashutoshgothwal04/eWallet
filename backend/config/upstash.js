// import { Ratelimit } from "@upstash/ratelimit";
// import { Redis } from "@upstash/redis";

// import "dotenv/config";

// const rateLimit = new Ratelimit({
//   redis: Redis.fromEnv(),
//   rateLimit: Ratelimit.slidingWindow(10, "60 s"),
// });

// export default rateLimit;


import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

import "dotenv/config";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "60 s"),
});

export default ratelimit;