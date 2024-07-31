import { SunoUserStatus } from '@/lib/models/SunoUser';
import {
  pgTable,
  text,
  pgEnum
} from 'drizzle-orm/pg-core';

export const statusEnum = pgEnum('status', [
  SunoUserStatus.Active,
  SunoUserStatus.Blocked,
]);

export default pgTable(
  'suno_users',
  {
    id: text('id').primaryKey(),
    cookie: text('cookie').notNull(),
    status: statusEnum('status').notNull()
  },
);