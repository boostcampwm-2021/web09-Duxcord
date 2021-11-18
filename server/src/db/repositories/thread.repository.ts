import { EntityRepository, Repository } from 'typeorm';
import { Thread } from '../entities';

@EntityRepository(Thread)
export class ThreadRepository extends Repository<Thread> {
  findThreadsByChatID(chatID: string) {
    return this.createQueryBuilder('thread')
      .where('thread.chatId = :id', { id: chatID })
      .leftJoinAndSelect('thread.user', 'user')
      .select([
        'thread.id',
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
