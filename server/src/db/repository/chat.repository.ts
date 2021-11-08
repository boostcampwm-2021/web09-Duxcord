import { EntityRepository, Repository } from 'typeorm';
import { Chat } from '../../entity/chat.entity';

@EntityRepository(Chat)
export class ChatRepository extends Repository<Chat> {
  findChatsByPages(chattingChannelID: string, page: number, userID: number) {
    const chatPerPage = 20;
    return this.createQueryBuilder('chat')
      .where('chat.chattingChannel = :id', { id: chattingChannelID })
      .leftJoinAndSelect('chat.user', 'user')
      .leftJoinAndSelect('chat.reactions', 'reaction', 'reaction.user = :userID', {
        userID: userID,
      })
      .addSelect('reaction.id is NOT NULL', 'isReactioned')
      .select([
        'chat.id',
        'chat.content',
        'chat.createdAt',
        'chat.updatedAt',
        'chat.reactionsCount',
        'user.id',
        'user.username',
        'user.thumbnail',
        'reaction.id',
      ])
      .orderBy('chat.createdAt', 'DESC')
      .skip(chatPerPage * (page - 1))
      .take(chatPerPage)
      .getMany();
  }
}
