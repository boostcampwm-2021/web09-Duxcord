import { map, mapAsync, go, add, reduce } from './functionalProgramming';

const addEventToImg = (img: HTMLElement) =>
  new Promise<void>((resolve) => {
    img.onload = () => resolve();
  });

const addLoadEvent = (chatItem: HTMLElement) =>
  Promise.all(go(chatItem.querySelectorAll('img'), map(addEventToImg)));

const getChatsHeight = async (chatListRef: React.RefObject<HTMLDivElement>, pillNumber: number) => {
  const chatItems = chatListRef.current?.querySelectorAll('.newFetched');
  const dayPillHeight = pillNumber * 30;

  const loadImage = () => new Promise<void>((resolve) => resolve());

  await go(chatItems, map(addLoadEvent), mapAsync(loadImage));

  return go(
    chatItems,
    map((chatItem: HTMLElement) => chatItem.clientHeight),
    reduce(add),
    add(dayPillHeight),
  );
};

export { getChatsHeight };
