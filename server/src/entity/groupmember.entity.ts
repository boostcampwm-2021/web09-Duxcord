import { Column, Entity, ManyToOne } from 'typeorm';

import { Base } from './base.entity';
import { Workgroup } from './workgroup.entity';
import { User } from './user.entity';

@Entity()
export class GroupMember extends Base {
  @ManyToOne(() => User, (user) => user.groups)
  user: User;

  @ManyToOne(() => Workgroup, (workgroup) => workgroup.members)
  group: Workgroup;

  @Column()
  lastAccessTime: Date;
}
