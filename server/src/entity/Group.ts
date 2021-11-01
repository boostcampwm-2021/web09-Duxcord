import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { Base } from './base/base';
import { GroupMember } from './GroupMember';
import { MeetingChannel } from './MeetingChannel';
import { TextChannel } from './TextChannel';
import { User } from './User';

@Entity()
export class Group extends Base {
  @Column()
  name: string;

  @Column()
  code: string;

  @Column({ nullable: true })
  thumbnail: string;

  @ManyToOne((type) => User, (user) => user.leadingGroups)
  leader: User;

  @OneToMany((type) => MeetingChannel, (meetingChannel) => meetingChannel.group)
  meetingChannels: MeetingChannel[];

  @OneToMany((type) => TextChannel, (textChannel) => textChannel.group)
  textChannels: TextChannel[];

  @OneToMany((types) => GroupMember, (groupMember) => groupMember.group)
  members: GroupMember[];
}
