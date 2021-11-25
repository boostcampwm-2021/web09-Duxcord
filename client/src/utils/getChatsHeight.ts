import { map, mapAsync, filter, go, add, reduce } from './functionalProgramming';
import { makeChatSection } from './makeChatSection';

const addEventToImg = (img: HTMLElement) =>
  new Promise<void>((resolve) => {
    img.onload = () => resolve();
  });

const addLoadEvent = (chatItem: HTMLElement) =>
  Promise.all(go(chatItem.querySelectorAll('img'), map(addEventToImg)));

const getChatsHeight = async (chatListRef: React.RefObject<HTMLDivElement>, length: number) => {
  const chatItems = chatListRef.current?.querySelectorAll('.ChatItem');
  const target = filter(chatItems, length);
  const dayPillHeights = Object.keys(makeChatSection(target)).length * 30;

  const loadImage = () => new Promise<void>((resolve) => resolve());

  await go(target, map(addLoadEvent), mapAsync(loadImage));

  return go(
    target,
    map((chatItem: HTMLElement) => chatItem.clientHeight),
    reduce(add),
    add(dayPillHeights),
  );
};

export { getChatsHeight };
