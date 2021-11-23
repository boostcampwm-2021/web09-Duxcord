import { map, mapAsync, reduceAsync, filter, go, add } from './functionalProgramming';
import { makeChatSection } from './makeChatSection';

const addEventToImg = (img: HTMLElement) =>
  new Promise<void>((resolve) => {
    img.onload = () => resolve();
  });

const loadOneChatItemImages = (chatItem: HTMLElement) =>
  Promise.all(go(chatItem.querySelectorAll('img'), map(addEventToImg)));

const getChatsHeight = async (chatListRef: React.RefObject<HTMLDivElement>, length: number) => {
  const chatItems = chatListRef.current?.querySelectorAll('.ChatItem');
  const target = filter(chatItems, length);
  const dayPillHeights = Object.keys(makeChatSection(target)).length * 30;

  let count = -1;

  const getOneElement = () =>
    new Promise((resolve) => {
      count += 1;
      return resolve(target[count].clientHeight);
    });

  const result = go(
    target,
    map(loadOneChatItemImages),
    mapAsync(getOneElement),
    reduceAsync((a: number, b: number) => a + b),
    add(dayPillHeights),
  );

  return result;
};

export { getChatsHeight };
