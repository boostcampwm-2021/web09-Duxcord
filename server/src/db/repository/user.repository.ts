import { EntityRepository, Repository } from 'typeorm';
import { User } from '../../entity/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  findByID(userID: number) {
    return this.createQueryBuilder('user')
      .where({ id: userID })
      .select(['user.loginID', 'user.username', 'user.thumbnail', 'user.bio'])
      .getOne();
  }
}
