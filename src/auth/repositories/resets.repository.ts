import { DeleteResult, EntityRepository, Repository } from 'typeorm';
import { UserEntity } from '@models/user.entity';
import { ResetEntity } from '@models/reset.entity';
import { Reset } from '@models/reset.interface';

@EntityRepository(ResetEntity)
export class ResetsRepository extends Repository<ResetEntity> {
  async createReset(reset: Reset): Promise<Reset> {
    const newReset = this.create(reset);
    return await this.save(newReset);
  }

  async findResetByToken(reset: Reset): Promise<Reset> {
    const { token } = reset;
    return await this.findOne({ token });
  }

  async deleteReset(reset: Reset): Promise<DeleteResult> {
    const resetDeleted = await this.findResetByToken(reset);
    return await this.delete(resetDeleted);
  }
}
