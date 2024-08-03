import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from "@vercel/postgres";
import sunoSongsTable from './sunoSongsTable';
import sunoUsersTable from './sunoUsersTable';
import { eq } from 'drizzle-orm';

type SunoUserInsertModel = typeof sunoUsersTable.$inferInsert
type SunoUserUpdateModel = Partial<SunoUserInsertModel>;

export default class DbContext {
  private static instance: DbContext;
  private vercelPgDatabase;

  private constructor() {
    this.vercelPgDatabase = drizzle(sql,
      {
        schema: {
          sunoSongsTable,
          sunoUsersTable
        },
      },
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
      insert: (sunoSong: typeof sunoSongsTable.$inferInsert[]) => {
        return this.db.insert(sunoSongsTable).values(sunoSong);
      },
      delete: (id: string) => {
        return this.db.delete(sunoSongsTable).where(eq(sunoSongsTable.id, id));
      },
      deleteAll: () => {
        return this.db.delete(sunoSongsTable);
      }
    }
  }

  public get sunoUsersQuery() {
    return this.query.sunoUsersTable;
  }

  public get sunoUsersTable() {
    return {
      insert: (sunoUser: SunoUserInsertModel) => {
        return this.db.insert(sunoUsersTable).values(sunoUser);
      },
      update: (id: string, sunoUser: SunoUserUpdateModel) => {        
        return this.db.update(sunoUsersTable).set(sunoUser).where(eq(sunoUsersTable.id, id))
      },
      delete: (id: string) => {
        return this.db.delete(sunoUsersTable).where(eq(sunoUsersTable.id, id));
      },
      deleteAll: () => {
        return this.db.delete(sunoUsersTable);
      }
    }
  }
}