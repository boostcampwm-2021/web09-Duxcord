interface ModalData {
  title: string;
  subTitle?: string;
  middleContent: ReactElement<any, any>;
  bottomRightButton: ModalButton;
}

interface ModalController {
  hidden: boolean;
  hide: function;
  show: function;
}

interface ModalButton {
  title: string;
  onClickHandler: function;
  color: string;
}

export { ModalData, ModalButton, ModalController };
