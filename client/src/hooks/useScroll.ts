import { RefObject, useCallback } from 'react';

export const useScroll = (
  targetRef: RefObject<HTMLElementTagNameMap[keyof HTMLElementTagNameMap]>,
) => {
  const scrollTo = useCallback(
    (options?: ScrollToOptions) => targetRef.current?.scrollTo(options),
    [targetRef],
  );

  const scrollToBottom = useCallback(
    ({ smooth = false }: { smooth?: boolean } = { smooth: false }) => {
      targetRef.current?.scrollTo({
        top: targetRef.current?.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    },
    [targetRef],
  );

  return { scrollTo, scrollToBottom };
};
