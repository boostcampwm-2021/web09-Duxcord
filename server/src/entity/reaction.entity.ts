import { Entity, ManyToOne } from 'typeorm';

import { Base } from './base.entity';
import { Text } from './text.entity';
import { User } from './user.entity';

@Entity()
export class Reaction extends Base {
  @ManyToOne(() => User, (user) => user.reactions)
  user: User;

  @ManyToOne(() => Text, (text) => text.reactions)
  text: Text;
}
