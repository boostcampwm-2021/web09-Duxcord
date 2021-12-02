import { EntityRepository, Repository } from 'typeorm';
import { GroupMember } from '../entities';

@EntityRepository(GroupMember)
export class GroupMemberRepository extends Repository<GroupMember> {
  checkUserInGroup(groupID: number, userID: number) {
    return this.createQueryBuilder('group_member')
      .where('group_member.groupId = :groupID && group_member.userId = :userID', {
        groupID: groupID,
        userID: userID,
      })
      .getOne();
  }

  findGroupsByUserID(userID: number) {
    return this.createQueryBuilder('group_member')
      .where('group_member.userId = :id', { id: userID })
      .leftJoinAndSelect('group_member.group', 'group')
      .leftJoinAndSelect('group.leader', 'user')
      .select([
        'group_member.lastAccessTime',
        'group.id',
        'group.name',
        'group.thumbnail',
        'group.code',
        'user.loginID',
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
