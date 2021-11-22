const map = (f: (a: HTMLElement) => Promise<any>, iter: any) => {
  const res = [];
  for (const a of iter) {
    res.push(f(a));
  }
  return res;
};

const filter = (chatsList: NodeListOf<Element> | undefined, length: number) => {
  const res: Element[] = [];
  chatsList?.forEach((v, i) => {
    if (i < length) res.push(v);
  });
  return res;
};

const mapAsync = (f: (a: Promise<any>) => Promise<any>, iter: any) => {
  const res = [];
  for (const a of iter) {
    res.push(a.then(f));
  }
  return res;
};

const reduceAsync = async (f: (a: number, b: number) => number, acc: number, iter: any) => {
  for await (const ab of iter) {
    acc = f(acc, ab);
  }
  return acc;
};

export { map, mapAsync, filter, reduceAsync };
