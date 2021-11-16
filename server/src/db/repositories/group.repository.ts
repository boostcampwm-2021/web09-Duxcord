import { EntityRepository, Repository } from 'typeorm';
import { Workgroup } from '../entities';

@EntityRepository(Workgroup)
export class WorkgroupRepository extends Repository<Workgroup> {
  findByIDWithLeaderID(groupID: string) {
    return this.createQueryBuilder('work_group')
      .where('work_group.id = :groupID', {
        groupID: groupID,
      })
      .leftJoinAndSelect('work_group.leader', 'user')
      .select(['work_group.id', 'user.id'])
      .getOne();
  }
}
