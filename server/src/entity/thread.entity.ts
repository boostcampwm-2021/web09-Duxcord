import { Column, Entity, ManyToOne } from 'typeorm';

import { Base } from './base.entity';
import { User } from './user.entity';
import { Chat } from './chat.entity';

@Entity()
export class Thread extends Base {
  @Column({ nullable: true })
  content: string;

  @ManyToOne(() => User, (user) => user.threads, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Chat, (chat) => chat.threads, { onDelete: 'CASCADE' })
  chat: Chat;
}
