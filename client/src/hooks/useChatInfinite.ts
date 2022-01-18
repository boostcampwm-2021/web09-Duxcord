import { useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import { useScroll, useSelectedChannel, useChats } from '.';
import { getChatsHeight, makeChatSection } from '@utils/index';

const PAGE_SIZE = 20;
const OBSERVER_ROOT_MARGIN = '300px 0px 0px 0px';

export const useChatInfinite = (chatListRef: React.RefObject<HTMLDivElement>) => {
  const { scrollTo } = useScroll(chatListRef);
  const { id } = useSelectedChannel();
  const { chats, setSize, isValidating } = useChats(id);
  const isValidatingRef = useRef(false);
  isValidatingRef.current = isValidating;
  const isEmpty = !chats?.length;
  const isReachingEnd = useRef(false);
  isReachingEnd.current =
    (isEmpty || (chats && chats[chats.length - 1]?.length < PAGE_SIZE)) ?? false;
  const observedTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isValidating) return;
    (async () => {
      if (chats) {
        const height = await getChatsHeight(
          chatListRef,
          Object.keys(makeChatSection(chats[chats.length - 1])).length,
        );
        scrollTo({ top: height });
      }
    })();
  }, [isValidating]);

  const onIntersect = useCallback(
    ([entry]) => {
      if (isValidatingRef.current) return;
      if (entry.isIntersecting && !isReachingEnd.current) {
        setSize((size) => size + 1);
      }
    },
    [setSize],
  );

  useEffect(() => {
    if (!observedTarget.current) return;
    if (!chatListRef.current) return;
    const chatListEl = chatListRef.current;
    const observer = new IntersectionObserver(onIntersect, {
      root: chatListEl,
      rootMargin: OBSERVER_ROOT_MARGIN,
    });
    observer.observe(observedTarget.current);

    return () => observer.disconnect();
  }, []);

  return { chats, observedTarget };
};
