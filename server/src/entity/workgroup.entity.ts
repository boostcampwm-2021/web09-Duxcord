import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { Base } from './base.entity';
import { GroupMember } from './groupmember.entity';
import { MeetingChannel } from './meetingchannel.entity';
import { ChattingChannel } from './chattingchannel.entity';
import { User } from './user.entity';

@Entity()
export class Workgroup extends Base {
  @Column()
  name: string;

  @Column()
  code: string;

  @Column({ nullable: true })
  thumbnail: string;

  @ManyToOne(() => User, (user) => user.leadingGroups)
  leader: User;

  @OneToMany(() => MeetingChannel, (meetingChannel) => meetingChannel.group)
  meetingChannels: MeetingChannel[];

  @OneToMany(() => ChattingChannel, (chattingChannel) => chattingChannel.group)
  chattingChannels: ChattingChannel[];

  @OneToMany(() => GroupMember, (groupMember) => groupMember.group)
  members: GroupMember[];
}
