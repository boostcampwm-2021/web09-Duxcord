import { Column, Entity, ManyToOne } from 'typeorm';

import { Base } from './base.entity';
import { Workgroup } from './workgroup.entity';

@Entity()
export class MeetingChannel extends Base {
  @ManyToOne(() => Workgroup, (workgroup) => workgroup.meetingChannels)
  group: Workgroup;

  @Column()
  name: string;
}
