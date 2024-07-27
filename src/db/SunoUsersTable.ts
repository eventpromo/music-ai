import {
  pgTable,
  text,
} from 'drizzle-orm/pg-core';

export default pgTable(
  'suno_users',
  {
    id: text('id').primaryKey(),
    cookie: text('cookie').notNull(),
  },
);