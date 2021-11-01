import { Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';

import { Base } from './base/base';
import { Group } from './Group';
import { Text } from './Text';

@Entity()
export class TextChannel extends Base {
  @OneToMany((type) => Text, (text) => text.textChannel)
  texts: Text;

  @ManyToOne((type) => Group, (group) => group.textChannels)
  group: Group;
}
