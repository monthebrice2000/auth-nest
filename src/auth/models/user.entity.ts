import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'Users', synchronize: true })
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  first_name: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  last_name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @BeforeInsert()
  insertUser() {
    console.log(
      'New User inserted :' +
        this.id +
        ' ' +
        this.first_name +
        ' ' +
        this.last_name +
        ' ' +
        this.email,
    );
  }

  @BeforeUpdate()
  updateUser() {
    console.log('Updated User');
  }
}
