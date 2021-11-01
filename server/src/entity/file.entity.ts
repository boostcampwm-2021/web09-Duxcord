import { Column, Entity, ManyToOne } from 'typeorm';

import { Base } from './base.entity';
import { Text } from './text.entity';

@Entity()
export class File extends Base {
  @Column()
  src: string;

  @ManyToOne((type) => Text, (text) => text.files)
  text: Text;
}
