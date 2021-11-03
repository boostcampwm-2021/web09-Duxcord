import { Column, Entity, OneToMany } from 'typeorm';
import { Base } from './base.entity';
import { Workgroup } from './workgroup.entity';
import { GroupMember } from './groupmember.entity';
import { Reaction } from './reaction.entity';
import { Text } from './text.entity';
import { Thread } from './thread.entity';

@Entity()
export class User extends Base {
  @Column()
  loginID: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ nullable: true })
  bio: string;

  @OneToMany((type) => Workgroup, (workgroup) => workgroup.leader)
  leadingGroups: Workgroup[];

  @OneToMany((type) => Reaction, (reaction) => reaction.user)
  reactions: Reaction[];

  @OneToMany((type) => Text, (text) => text.user)
  texts: Text[];

  @OneToMany((type) => Thread, (thread) => thread.user)
  threads: Thread[];

  @OneToMany((type) => GroupMember, (groupMember) => groupMember.user)
  groups: GroupMember[];
}
