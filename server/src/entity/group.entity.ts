import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { Base } from './base.entity';
import { GroupMember } from './groupmember.entity';
import { MeetingChannel } from './meetingchannel.entity';
import { TextChannel } from './textchannel.entity';
import { User } from './user.entity';

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
