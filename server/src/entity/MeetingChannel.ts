import { Entity, ManyToOne } from 'typeorm';

import { Base } from './base/base';
import { Group } from './Group';

@Entity()
export class MeetingChannel extends Base {
  @ManyToOne((type) => Group, (group) => group.meetingChannels)
  group: Group;
}
