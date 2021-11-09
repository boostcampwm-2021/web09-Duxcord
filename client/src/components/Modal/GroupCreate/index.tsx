import React, { useState } from 'react';
import Modal from '..';
import Colors from '../../../styles/Colors';
import { ModalController } from '../../../types/modal';
import { InputForm, InputImage, InputText } from './style';

function GroupCreateModal({ controller: { hidden, hide, show } }: { controller: ModalController }) {
  const [groupName, setGroupName] = useState('');
  const finishModal = () => {
    hide();
    setGroupName('');
  };

  const InputFormComponent = (
    <InputForm>
      <InputImage>
        <input type="file" id="group_thumbnail" style={{ width: 100, height: 100, opacity: 0 }} />
      </InputImage>
      <InputText
        type="text"
        id="group_name"
        value={groupName}
        placeholder="그룹 이름을 입력해주세요"
      />
    </InputForm>
  );

  return (
    <Modal
      props={{
        title: '그룹 만들기',
        subTitle: '',
        middleContent: InputFormComponent,
        bottomRightButton: {
          text: '만들기',
          color: Colors.Blue,
          onClickHandler: () => {},
        },
      }}
      controller={{ hidden, hide: finishModal, show }}
    />
  );
}

export default GroupCreateModal;
