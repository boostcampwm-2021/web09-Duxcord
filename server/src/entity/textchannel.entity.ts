import { Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';

import { Base } from './base/base';
import { Group } from './group.entity';
import { Text } from './text.entity';

@Entity()
export class TextChannel extends Base {
  @OneToMany((type) => Text, (text) => text.textChannel)
  texts: Text;

  @ManyToOne((type) => Group, (group) => group.textChannels)
  group: Group;
}
