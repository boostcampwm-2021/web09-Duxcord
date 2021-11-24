const curry =
  (f: any) =>
  (a: any, ..._: any) =>
    _.length ? f(a, ..._) : (..._: any) => f(a, ..._);

const map = curry((f: (a: HTMLElement) => Promise<any>, iter: any) => {
  const res = [];
  for (const a of iter) {
    res.push(f(a));
  }
  return res;
});

const filter = curry((chatsList: NodeListOf<Element> | undefined, length: number) => {
  const res: Element[] = [];
  chatsList?.forEach((v, i) => {
    if (i < length) res.push(v);
  });
  return res;
});

const mapAsync = curry((f: (a: Promise<any>) => Promise<any>, iter: any) => {
  const res = [];
  for (const a of iter) {
    res.push(a.then(f));
  }
  return Promise.all(res);
});

const reduce = curry((f: (a: any, b: any) => any, acc: any, iter: any) => {
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }
  for (const a of iter) {
    acc = f(acc, a);
  }
  return acc;
});

const go = (...args: any) => reduce((a: any, f: any) => f(a), args, undefined);

const add = curry((a: number, b: number) => a + b);

export { map, mapAsync, filter, reduce, go, add };
