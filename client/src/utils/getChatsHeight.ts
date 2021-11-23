import { map, mapAsync, reduceAsync, filter } from './functionalProgramming';
import { makeChatSection } from './makeChatSection';

const getChatsHeight = async (chatListRef: React.RefObject<HTMLDivElement>, length: number) => {
  const chatItems = chatListRef.current?.querySelectorAll('.ChatItem');
  const target = filter(chatItems, length);
  const dayPillHeights = Object.keys(makeChatSection(target)).length * 30;
  console.log(target);
  let count = -1;
  const result = await reduceAsync(
    (a, b) => a + b,
    0,
    mapAsync(
      () =>
        new Promise((resolve) => {
          count += 1;
          return resolve(target[count].clientHeight);
        }),
      map(
        (chatItem: HTMLElement) =>
          Promise.all(
            map(
              (img: HTMLElement) =>
                new Promise<void>((resolve) => {
                  img.onload = () => resolve();
                }),
              chatItem.querySelectorAll('img'),
            ),
          ),
        target,
      ),
    ),
  );
  return result + dayPillHeights;
};

export { getChatsHeight };
