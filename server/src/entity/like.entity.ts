import { Entity, ManyToOne } from 'typeorm';

import { Base } from './base.entity';
import { Text } from './text.entity';
import { User } from './user.entity';

@Entity()
export class Like extends Base {
  @ManyToOne((type) => User, (user) => user.likes)
  user: User;

  @ManyToOne((type) => Text, (text) => text.likes)
  text: Text;
}