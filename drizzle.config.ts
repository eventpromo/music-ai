import './envConfig';
import { defineConfig } from 'drizzle-kit';
 
export default defineConfig({
  schema: [
    "./src/db/SunoUsersTable.ts",
    "./src/db/SongsTable.ts",
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