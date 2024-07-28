import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from "@vercel/postgres";
import sunoSongsTable from './sunoSongsTable';
import sunoUsersTable from './sunoUsersTable';
import SunoSongEntity from './models/SunoSongEntity';
import SunoUserEntity from './models/SunoUserEntity';

export default class DbContext {
  private static instance: DbContext;
  private vercelPgDatabase;
  
  private constructor() {
    this.vercelPgDatabase = drizzle(sql,
      {
        schema: {
          sunoSongsTable,
          sunoUsersTable
        }
      }
    );
  }

  public static getInstance(): DbContext {
    if (!DbContext.instance) {
      DbContext.instance = new DbContext();
    }

    return DbContext.instance;
  }

  public get db() {
    return this.vercelPgDatabase;
  }

  public get query() {
    return this.db.query;
  }

  public get sunoSongsQuery() {
    return this.query.sunoSongsTable;    
  }

  public get sunoSongsTable() {
    return {
      insert: (sunoSong: SunoSongEntity[]) => {
        return this.db.insert(sunoSongsTable).values(sunoSong);
      }
    }
  }

  public get sunoUsersQuery() {
    return this.query.sunoUsersTable;
  }

  public get sunoUsersTable() {
    return {
      insert: (sunoUser: SunoUserEntity[]) => {
        return this.db.insert(sunoUsersTable).values(sunoUser);
      }
    }
  }
}