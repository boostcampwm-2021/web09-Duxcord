import { Column, Entity, ManyToOne } from 'typeorm';

import { Base } from './base/base';
import { User } from './User';

@Entity()
export class Thread extends Base {
  @Column({ nullable: true })
  content: string;

  @ManyToOne((type) => User, (user) => user.threads)
  user: User;
}
