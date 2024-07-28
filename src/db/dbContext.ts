import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from "@vercel/postgres";
import sunoSongsTable from './sunoSongsTable';
import sunoUsersTable from './sunoUsersTable';

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

  get db() {
    return this.vercelPgDatabase;
  }

  get query() {
    return this.db.query;
  }

  get sunoSongsTable() {
    return this.query.sunoSongsTable;
  }

  get sunoUsersTable() {
    return this.query.sunoUsersTable;
  }
}