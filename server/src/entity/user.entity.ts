import { Column, Entity } from 'typeorm';
import { Base } from './base.entity';

@Entity()
export class User extends Base {
  @Column()
  userID: string;

  @Column()
  userName: string;

  @Column()
  password: string;
}
