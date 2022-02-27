import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from '@models/user.entity';
import { User } from '@models/user.interface';
var HmacSHA256 = require('crypto-js/sha256');

@EntityRepository(UserEntity)
export class UsersRepository extends Repository<UserEntity> {
  async createUser(user: User): Promise<User> {
    const hashedPassword = HmacSHA256(user.password, 'tontonlaforce');
    console.log(hashedPassword.words);
    const newUser = this.create({
      ...user,
      password: hashedPassword.words.join('-'),
    });
    return await this.save(newUser);
  }

  async findUserByEmail(user: User): Promise<User> {
    return await this.findOne(user);
  }

  async updateUser(user: User): Promise<User> {
    const updateUser = await this.findUserByEmail({ email: user.email });
    updateUser.password = user.password;
    return await this.save(updateUser);
  }
}
