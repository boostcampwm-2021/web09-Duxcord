import { MutableRefObject, RefObject, useCallback, useRef } from 'react';

export const useScroll = <T extends keyof HTMLElementTagNameMap>(
  targetRef: RefObject<HTMLElementTagNameMap[T]>,
) => {
  const scrollTo = useCallback((options?: ScrollToOptions) => {
    targetRef.current?.scrollTo(options);
  }, []);

  const scrollToBottom = (smooth: boolean = true) => {
    targetRef.current?.scrollTo({
      top: targetRef.current?.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto',
    });
  };

  return { scrollTo, scrollToBottom };
};
