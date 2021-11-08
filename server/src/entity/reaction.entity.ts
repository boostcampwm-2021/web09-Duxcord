import { Entity, ManyToOne } from 'typeorm';

import { Base } from './base.entity';
import { Chat } from './chat.entity';
import { User } from './user.entity';

@Entity()
export class Reaction extends Base {
  @ManyToOne(() => User, (user) => user.reactions)
  user: User;

  @ManyToOne(() => Chat, (chat) => chat.reactions)
  chat: Chat;
}
