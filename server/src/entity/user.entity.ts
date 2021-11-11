import { Column, Entity, OneToMany } from 'typeorm';
import { Base } from './base.entity';
import { Workgroup } from './workgroup.entity';
import { GroupMember } from './groupmember.entity';
import { Reaction } from './reaction.entity';
import { Chat } from './chat.entity';
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

  @OneToMany(() => Workgroup, (workgroup) => workgroup.leader)
  leadingGroups: Workgroup[];

  @OneToMany(() => Reaction, (reaction) => reaction.user)
  reactions: Reaction[];

  @OneToMany(() => Chat, (chat) => chat.user)
  chats: Chat[];

  @OneToMany(() => Thread, (thread) => thread.user)
  threads: Thread[];

  @OneToMany(() => GroupMember, (groupMember) => groupMember.user)
  groups: GroupMember[];
}
