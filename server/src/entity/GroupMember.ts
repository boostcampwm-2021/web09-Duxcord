import { Column, Entity, ManyToOne } from 'typeorm';

import { Base } from './base/base';
import { Group } from './Group';
import { User } from './User';

@Entity()
export class GroupMember extends Base {
  @ManyToOne((type) => User, (user) => user.groups)
  user: User;

  @ManyToOne((type) => Group, (group) => group.members)
  group: Group;

  @Column()
  lastAccessTime: Date;
}
