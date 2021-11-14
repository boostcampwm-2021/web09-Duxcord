import { EntityRepository, Repository } from 'typeorm';
import { Thread } from '../entities/thread.entity';

@EntityRepository(Thread)
export class ThreadRepository extends Repository<Thread> {
  findThreadsByChatID(chatID: string) {
    return this.createQueryBuilder('thread')
      .where('thread.chatId = :id', { id: chatID })
      .leftJoinAndSelect('thread.user', 'user')
      .select([
        'thread.content',
        'thread.createdAt',
        'user.id',
        'user.username',
        'user.thumbnail',
        'user.loginID',
      ])
      .getMany();
  }
}
