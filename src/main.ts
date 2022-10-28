const resolveAfter = (ms: number) => new Promise((ok) => setTimeout(ok, ms));
function rateLimit1(fn: Function, msPerOp: number) {
  let wait: Promise<unknown> = Promise.resolve();
  return (...a: any) => {
    // We use the queue tail in wait to start both the
    // next operation and the next delay
    const res = wait.then(() => fn(...a));
    wait = wait.then(() => resolveAfter(msPerOp));
    return res;
  };
}

export default function rateLimit(
  fn: Function,
  delayMs: number,
  maxConcurrent = 1
) {
  // A battery of 1-rate-limiters
  const queue = Array.from({ length: maxConcurrent }, () =>
    rateLimit1(fn, delayMs)
  );
  // Circular queue cursor
  let i = 0;
  return (...a: any) => {
    // to enqueue, we move the cursor...
    i = (i + 1) % maxConcurrent;
    // and return the rate-limited operation.
    return queue[i](...a);
  };
}
