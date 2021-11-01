import { Column, Entity, ManyToOne } from 'typeorm';

import { Base } from './base/base';
import { Text } from './Text';

@Entity()
export class File extends Base {
  @Column()
  src: string;

  @ManyToOne((type) => Text, (text) => text.files)
  text: Text;
}
