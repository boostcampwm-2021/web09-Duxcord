import { Column, Entity, ManyToOne } from 'typeorm';

import { Base } from './base.entity';
import { Group } from './group.entity';

@Entity()
export class MeetingChannel extends Base {
  @ManyToOne((type) => Group, (group) => group.meetingChannels)
  group: Group;

  @Column()
  name: string;
}
