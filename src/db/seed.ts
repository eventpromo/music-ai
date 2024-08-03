import dotenv from 'dotenv';
import DbContext from './DbContext';
import { SunoUserStatus } from '@/lib/models/SunoUser';
dotenv.config();

const context = DbContext.getInstance();

async function seed() {
  try {
    await context.sunoSongsTable.deleteAll();
    await context.sunoUsersTable.deleteAll();
      
    console.log('Seed data inserted successfully');
  } catch (error) {
    console.error('Error inserting seed data:', error);
  } finally {
  };
}

seed();