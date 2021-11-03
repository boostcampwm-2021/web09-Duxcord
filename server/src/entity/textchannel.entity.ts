import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { Base } from './base.entity';
import { Workgroup } from './workgroup.entity';
import { Text } from './text.entity';

@Entity()
export class TextChannel extends Base {
  @OneToMany(() => Text, (text) => text.textChannel)
  texts: Text;

  @ManyToOne(() => Workgroup, (workgroup) => workgroup.textChannels)
  group: Workgroup;

  @Column()
  name: string;
}
