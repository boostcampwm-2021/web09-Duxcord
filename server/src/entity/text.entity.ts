import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { Base } from './base.entity';
import { File } from './file.entity';
import { Reaction } from './reaction.entity';
import { TextChannel } from './textchannel.entity';
import { User } from './user.entity';

@Entity()
export class Text extends Base {
  @Column({ nullable: true })
  content: string;

  @ManyToOne((type) => User, (user) => user.texts)
  user: User;

  @ManyToOne((type) => TextChannel, (textChannel) => textChannel.texts)
  textChannel: TextChannel;

  @OneToMany((type) => Reaction, (reaction) => reaction.text)
  reactions: Reaction[];

  @OneToMany((type) => File, (file) => file.text)
  files: File[];
}
