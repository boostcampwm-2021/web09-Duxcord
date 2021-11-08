import { Column, Entity, ManyToOne } from 'typeorm';

import { Base } from './base.entity';
import { Chat } from './chat.entity';

@Entity()
export class File extends Base {
  @Column()
  src: string;

  @ManyToOne(() => Chat, (chat) => chat.files)
  chat: Chat;
}
