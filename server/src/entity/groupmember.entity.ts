import { Column, Entity, ManyToOne } from 'typeorm';

import { Base } from './base.entity';
import { Workgroup } from './workgroup.entity';
import { User } from './user.entity';

@Entity()
export class GroupMember extends Base {
  @ManyToOne(() => User, (user) => user.groups, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Workgroup, (workgroup) => workgroup.members, { onDelete: 'CASCADE' })
  group: Workgroup;

  @Column()
  lastAccessTime: Date;
}
