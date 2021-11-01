import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { Base } from './base/base';
import { File } from './File';
import { Like } from './Like';
import { TextChannel } from './TextChannel';
import { User } from './User';

@Entity()
export class Text extends Base {
  @Column({ nullable: true })
  content: string;

  @ManyToOne((type) => User, (user) => user.texts)
  user: User;

  @ManyToOne((type) => TextChannel, (textChannel) => textChannel.texts)
  textChannel: TextChannel;

  @OneToMany((type) => Like, (like) => like.text)
  likes: Like[];

  @OneToMany((type) => File, (file) => file.text)
  files: File[];
}
