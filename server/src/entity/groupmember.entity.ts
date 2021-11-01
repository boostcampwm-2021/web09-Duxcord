import { Column, Entity, ManyToOne } from 'typeorm';

import { Base } from './base.entity';
import { Group } from './group.entity';
import { User } from './user.entity';

@Entity()
export class GroupMember extends Base {
  @ManyToOne((type) => User, (user) => user.groups)
  user: User;

  @ManyToOne((type) => Group, (group) => group.members)
  group: Group;

  @Column()
  lastAccessTime: Date;
}
