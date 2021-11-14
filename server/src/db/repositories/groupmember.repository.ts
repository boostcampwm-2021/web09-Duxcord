import { EntityRepository, Repository } from 'typeorm';
import { GroupMember } from '../entities/groupmember.entity';

@EntityRepository(GroupMember)
export class GroupMemberRepository extends Repository<GroupMember> {
  findGroupsByUserID(userID: number) {
    return this.createQueryBuilder('group_member')
      .where('group_member.userId = :id', { id: userID })
      .leftJoinAndSelect('group_member.group', 'group')
      .select([
        'group_member.lastAccessTime',
        'group.id',
        'group.name',
        'group.thumbnail',
        'group.code',
      ])
      .leftJoinAndSelect('group.meetingChannels', 'meetingChannels')
      .leftJoinAndSelect('group.chattingChannels', 'chattingChannels')
      .getMany();
  }

  findUsersByGroupID(groupID: number) {
    return this.createQueryBuilder('group_member')
      .where('group_member.groupId = :id', { id: groupID })
      .leftJoinAndSelect('group_member.user', 'user')
      .select([
        'group_member.lastAccessTime',
        'user.id',
        'user.username',
        'user.thumbnail',
        'user.loginID',
      ])
      .getMany();
  }
}
