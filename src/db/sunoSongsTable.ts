import {
  pgTable,
  text,
  index,
} from 'drizzle-orm/pg-core';
import sunoUsersTable from './sunoUsersTable';

export default pgTable(
  'suno_songs',
  {
    id: text('id').primaryKey(),
    sunoUserId: text('sunoUserId').notNull().references(() => sunoUsersTable.id),
  },
  (table) => {
    return {
      sunoUserIdx: index('suno_user_idx').on(table.sunoUserId),
    }
  },
);