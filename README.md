# rate-limit-concurrent

Sample typescript to code explaining working

```ts
import rateLimit from 'rate-limit-concurrent';
const mockFetch = async (reqNo: number, delay: number) => {
  console.log(`${reqNo} started at ${(Date.now() - start) / 1000}s`);
  const took = `${reqNo} took: `;
  console.time(took);
  setTimeout(() => {
    console.log(`${reqNo} ended at ${(Date.now() - start) / 1000}s`);
    console.timeEnd(took);
  }, delay);
};

const start = Date.now();
const slowFetch = rateLimit(mockFetch, 1000, 3);
// odd request are slowed down, even request complete quickly to simulate real time variations in network requests
for (let i = 1; i <= 5; i++) slowFetch(i, i % 2 === 0 ? 50 : 5000);
```

Output of code:

```
1 started at 0s
2 started at 0.005s
3 started at 0.005s
// only 3 (maxConcurrent) queued
2 ended at 0.062s
2 took: : 57.416ms
// although there is one empty slot, 4th request doesn't queue for minDelay (1s)
4 started at 1.012s
// 5th request queues despite 1 & 3 not completing because we wait only minDelay not till request completes
5 started at 1.013s
4 ended at 1.074s
4 took: : 62.147ms
1 ended at 5.015s
1 took: : 5.012s
3 ended at 5.017s
3 took: : 5.013s
5 ended at 6.016s
5 took: : 5.004s
```

Sample js code

```js
// es module
import rateLimit from 'rate-limit-concurrent';
// commonJS
const rateLimit = require('rate-limit-concurrent');
const mockFetch = async (reqNo, delay) => {
  console.log(`${reqNo} started at ${(Date.now() - start) / 1000}s`);
  const took = `${reqNo} took: `;
  console.time(took);
  setTimeout(() => {
    console.log(`${reqNo} ended at ${(Date.now() - start) / 1000}s`);
    console.timeEnd(took);
  }, delay);
};

const start = Date.now();
const slowFetch = rateLimit.default(mockFetch, 1000, 3);
// odd request are slowed down, even request complete quickly to simulate real time variations in network requests
for (let i = 1; i <= 5; i++) slowFetch(i, i % 2 === 0 ? 50 : 5000);
```
