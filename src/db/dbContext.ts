import { drizzle, VercelPgDatabase } from 'drizzle-orm/vercel-postgres';
import { sql } from "@vercel/postgres";

class DbContext {
  private static instance: DbContext;
  private vercelPgDatabase: VercelPgDatabase
  
  private constructor() {
    this.vercelPgDatabase = drizzle(sql);
  }

  public static getInstance(): DbContext {
    if (!DbContext.instance) {
      DbContext.instance = new DbContext();
    }

    return DbContext.instance;
  }

  get db(): VercelPgDatabase {
    return this.vercelPgDatabase;
  }
}

export default DbContext.getInstance().db;