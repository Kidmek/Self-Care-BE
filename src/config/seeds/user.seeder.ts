import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Gender, User, UserRole } from 'src/modules/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Constants } from '../constants';

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(User);

    if (
      await repository.findOneBy({
        phone: Constants.phone,
      })
    ) {
      return;
    }
    const user: User = new User();
    user.firstName = 'Admin';
    user.lastName = 'Admin';
    user.birthDate = new Date();
    user.email = Constants.email;
    user.role = UserRole.ADMIN;
    user.password = await bcrypt.hash(Constants.password, 10);
    user.gender = Gender.A;
    user.isActive = true;
    user.phone = Constants.phone.slice(-9);
    console.log('Created admin,', await repository.save(user));
  }
}
