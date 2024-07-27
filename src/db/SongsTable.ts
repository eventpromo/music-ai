import {
  pgTable,
  text,
  index,
} from 'drizzle-orm/pg-core';
import SunoUsersTable from './SunoUsersTable';

export default pgTable(
  'songs',
  {
    id: text('id').primaryKey(),
    sunoUserId: text('cookie').notNull().references(() => SunoUsersTable.id),
  }, (table) => {
  return {
    sunoUserIdx: index('suno_user_idx').on(table.sunoUserId),
  }
},
);