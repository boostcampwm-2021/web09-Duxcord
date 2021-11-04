import { Column, Entity, ManyToOne } from 'typeorm';

import { Base } from './base.entity';
import { User } from './user.entity';
import { Text } from './text.entity';

@Entity()
export class Thread extends Base {
  @Column({ nullable: true })
  content: string;

  @ManyToOne((type) => User, (user) => user.threads)
  user: User;

  @ManyToOne(() => Text, (text) => text.threads)
  text: Text;
}
