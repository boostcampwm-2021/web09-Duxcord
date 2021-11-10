import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { Base } from './base.entity';
import { File } from './file.entity';
import { Thread } from './thread.entity';
import { Reaction } from './reaction.entity';
import { ChattingChannel as ChattingChannel } from './chattingchannel.entity';
import { User } from './user.entity';

@Entity()
export class Chat extends Base {
  @Column({ nullable: true })
  content: string;

  @Column({ default: 0 })
  reactionsCount: number;

  @Column({ default: 0 })
  threadsCount: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  threadWriter: User;

  @ManyToOne(() => User, (user) => user.chats, { onDelete: 'SET NULL' })
  user: User;

  @ManyToOne(() => ChattingChannel, (chattingChannel) => chattingChannel.chats, {
    onDelete: 'CASCADE',
  })
  chattingChannel: ChattingChannel;

  @OneToMany(() => Thread, (thread) => thread.chat)
  threads: Thread[];

  @OneToMany(() => Reaction, (reaction) => reaction.chat)
  reactions: Reaction[];

  @OneToMany(() => File, (file) => file.chat)
  files: File[];
}
