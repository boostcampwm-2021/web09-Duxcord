const map = (f: (a: HTMLElement) => Promise<any>, iter: any) => {
  let res = [];
  for (const a of iter) {
    res.push(f(a));
  }
  return res;
};

export { map };
