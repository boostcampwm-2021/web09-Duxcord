import { Entity, ManyToOne } from 'typeorm';

import { Base } from './base/base';
import { Text } from './Text';
import { User } from './User';

@Entity()
export class Like extends Base {
  @ManyToOne((type) => User, (user) => user.likes)
  user: User;

  @ManyToOne((type) => Text, (text) => text.likes)
  text: Text;
}
