import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { Base } from './base.entity';
import { Workgroup } from './workgroup.entity';
import { Chat } from './chat.entity';

@Entity()
export class ChattingChannel extends Base {
  @OneToMany(() => Chat, (chat) => chat.chattingChannel)
  chats: Chat;

  @ManyToOne(() => Workgroup, (workgroup) => workgroup.chattingChannels)
  group: Workgroup;

  @Column()
  name: string;
}
