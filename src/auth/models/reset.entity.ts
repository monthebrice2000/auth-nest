import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'Resets', synchronize: true })
export class ResetEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 500, type: 'varchar', unique: true, nullable: false })
  token: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @BeforeInsert()
  insertUser() {
    console.log(
      'New User inserted :' + this.id + ' ' + this.email + ' ' + this.token,
    );
  }

  @BeforeUpdate()
  updateUser() {
    console.log('Updated User');
  }
}
