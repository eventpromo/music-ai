import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();
 
// this is for migrations and scripts
export default defineConfig({
  schema: [
    "./src/db/sunoUsersTable.ts",
    "./src/db/sunoSongsTable.ts",
  ],
  dialect: 'postgresql',
  dbCredentials: {
    database: process.env.POSTGRES_DATABASE as string,
    host: process.env.POSTGRES_HOST as string,
    url: process.env.POSTGRES_URL as string,
    user: process.env.POSTGRES_USER as string,
    password: process.env.POSTGRES_PASSWORD as string,
    ssl: true, 
  }
});