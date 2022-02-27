import * as dotenv from 'dotenv';
import { ConnectionOptions } from 'typeorm';
import { UserEntity } from '@models/user.entity';
import { ResetEntity } from '@models/reset.entity';

export const configs_mysql = (): ConnectionOptions => {
  return {
    /**
     * Database type.
     */
    type: 'mysql',
    /**
     * Entities to be loaded for this connection.
     * Accepts both entity classes and directories where from entities need to be loaded.
     * Directories support glob patterns.
     */
    entities: [UserEntity, ResetEntity],
    /**
     * Migrations to be loaded for this connection.
     * Accepts both migration classes and directories where from migrations need to be loaded.
     * Directories support glob patterns.
     */
    migrations: [__dirname + '/**/*/*{.ts,.js}'],

    /**
     * Logging options.
     */
    logging: 'all',
    /**
     * Indicates if database schema should be auto created on every application launch.
     * Be careful with this option and don't use this in production - otherwise you can lose production data.
     * This option is useful during debug and development.
     * Alternative to it, you can use CLI and run schema:sync command.
     *
     * Note that for MongoDB database it does not create schema, because MongoDB is schemaless.
     * Instead, it syncs just by creating indices.
     */
    //synchronize: true,
    cli: {
      /**
       * Directory where migrations should be created by default.
       */
      migrationsDir: 'src/migrations',
    },
    /**
     * Database host.
     */
    host: process.env.hostname,
    /**
     * Database host port.
     */
    port: parseInt(process.env.port),
    /**
     * Database username.
     */
    username: process.env.user,
    /**
     * Database password.
     */
    password: process.env.password,
    /**
     * Database name to connect to.
     */
    database: process.env.database_mysql,
    /**
     * If `true`, entities will be loaded automatically.
     */
  };
};

//export = configs_postgres
