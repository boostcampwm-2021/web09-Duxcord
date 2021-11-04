interface ModalData {
  title: string;
  subTitle?: string;
  middleContent: ReactElement<any, any>;
  bottomRightButton: ModalButton;
}

interface ModalButton {
  title: string;
  onClickHandler: function;
  color: string;
}

export { ModalData, ModalButton };
