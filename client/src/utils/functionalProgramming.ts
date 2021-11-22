const map = (f: (a: HTMLElement) => Promise<any>, iter: any) => {
  let res = [];
  for (const a of iter) {
    res.push(f(a));
  }
  return res;
};

const filter = (chatsList: NodeListOf<Element> | undefined, length: number) => {
  let res: Element[] = [];
  chatsList?.forEach((v, i) => {
    if (i < length) res.push(v);
  });
  return res;
};

const mapAsync = (f: (a: Promise<any>) => Promise<any>, iter: any) => {
  let res = [];
  for (const a of iter) {
    res.push(a.then(f));
  }
  return res;
};

export { map, mapAsync, filter };
