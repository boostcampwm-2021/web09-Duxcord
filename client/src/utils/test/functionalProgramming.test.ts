import { map, mapAsync, filter, reduce, go, add } from '../functionalProgramming';

describe('functionalProgramming', () => {
  it('map', () => {
    const startArray = [
      document.createElement('div'),
      document.createElement('div'),
      document.createElement('div'),
    ];
    const f = (a: HTMLElement) => Promise.resolve(a);
    const endArray = map(f, startArray);
    expect(endArray.length).toBe(3);
    const promiseCount = endArray.filter((v: Promise<any>) => v instanceof Promise).length;
    expect(promiseCount).toBe(3);
  });

  it('mapAsync', () => {
    const startArray = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];
    const f = (resolvedValue: number) => Promise.resolve(resolvedValue);
    const endPoint = mapAsync(f, startArray);
    expect(endPoint instanceof Promise).toBeTruthy();
  });
});
