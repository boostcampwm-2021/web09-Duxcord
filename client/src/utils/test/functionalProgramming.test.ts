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

  it('filter', () => {
    const startArray = [
      document.createElement('div'),
      document.createElement('div'),
      document.createElement('div'),
    ];
    const length = 2;
    const endArray = filter(startArray, length);
    expect(endArray.length).toBe(2);
  });

  it('mapAsync', () => {
    const startArray = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];
    const f = (resolvedValue: number) => Promise.resolve(resolvedValue);
    const endPoint = mapAsync(f, startArray);
    expect(endPoint instanceof Promise).toBeTruthy();
  });

  it('reduce', () => {
    const startArray = [1, 2, 3, 4, 5];
    const f = (a: number, b: number) => a + b;
    const endPoint = reduce(f, startArray);
    expect(endPoint).toBe(15);
  });

  it('add', () => {
    const a = 1000000;
    const b = 2000000;
    const endPoint = add(a, b);
    expect(endPoint).toBe(3000000);
  });

  it('go', () => {
    const startPoint = 0;
    const endPoint = go(
      startPoint,
      add(1),
      add(2),
      add(3),
      add(4),
      add(5),
      add(6),
      add(7),
      add(8),
      add(9),
      add(10),
    );

    expect(endPoint).toBe(55);
  });
});
