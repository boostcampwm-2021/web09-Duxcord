import { EntityRepository, Repository } from 'typeorm';
import { Chat } from '../../entity/chat.entity';

@EntityRepository(Chat)
export class ChatRepository extends Repository<Chat> {
  findChatsByPages(chattingChannelId: string, page: number) {
    const chatPerPage = 20;
    return this.createQueryBuilder('chat')
      .where('chat.chattingChannel = :id', { id: chattingChannelId })
      .leftJoinAndSelect('chat.user', 'user')
      .select([
        'chat.id',
        'chat.content',
        'chat.createdAt',
        'chat.updatedAt',
        'user.id',
        'user.username',
        'user.thumbnail',
      ])
      .orderBy('chat.createdAt', 'DESC')
      .skip(chatPerPage * (page - 1))
      .take(chatPerPage)
      .getMany();
  }
}
