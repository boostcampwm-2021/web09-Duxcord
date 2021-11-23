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
  return res;
});

const reduceAsync = curry(async (f: (a: number, b: number) => number, acc: any, iter: any) => {
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = await iter.next().value;
  }
  for await (const ab of iter) {
    acc = f(acc, ab);
  }
  return acc;
});

export { map, mapAsync, filter, reduceAsync };
