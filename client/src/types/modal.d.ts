interface ModalData {
  title?: string;
  subTitle?: string;
  middleContent: ReactElement<any, any>;
  bottomRightButton?: ModalButton | null;
}

interface ModalController {
  hide: function;
  show?: function;
  previous?: function;
  next?: function;
}

interface ModalButton {
  text: string;
  onClickHandler: function;
  color: string;
}

export { ModalData, ModalButton, ModalController };
