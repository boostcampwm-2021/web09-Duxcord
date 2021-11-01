import { Column, Entity, OneToMany } from 'typeorm';

import { Base } from './base/base';
import { Group } from './Group';
import { GroupMember } from './GroupMember';
import { Like } from './Like';
import { Text } from './Text';
import { Thread } from './Thread';

@Entity()
export class User extends Base {
  @Column()
  loginId: string;

  @Column()
  password: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ nullable: true })
  bio: string;

  @OneToMany((type) => Group, (group) => group.leader)
  leadingGroups: Group[];

  @OneToMany((type) => Like, (like) => like.user)
  likes: Like[];

  @OneToMany((type) => Text, (text) => text.user)
  texts: Text[];

  @OneToMany((type) => Thread, (thread) => thread.user)
  threads: Thread[];

  @OneToMany((type) => GroupMember, (groupMember) => groupMember.user)
  groups: GroupMember[];
}
