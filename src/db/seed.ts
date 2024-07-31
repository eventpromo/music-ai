import dotenv from 'dotenv';
import DbContext from './DbContext';
import { SunoUserStatus } from '@/lib/models/SunoUser';
dotenv.config();

const context = DbContext.getInstance();

async function seed() {
  try {
    await context.sunoUsersTable.insert({
      id: 'test_peda_cookie@gmail.com',
      cookie: '__stripe_mid=bf22e5b0-92f4-485b-8458-41be54235acd70128f; _cfuvid=lwEaHePt0BXS6p.JJ3YL7wR4xlNaSnQ.ayzVaL5Y.GM-1721825905216-0.0.1.1-604800000; __client=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNsaWVudF8yaHZNTVVKZDZRMUdNNHRwTjVCaDdCUlVEc0wiLCJyb3RhdGluZ190b2tlbiI6InduNGd3Ym0ydDJyYm1ib21xNGcxcHppNWU1eW41YnprcTFlZTUxNXYifQ.k819cjYUko7WHeAnlMQAh1SXiMO0WI9lnlzuWMUZXlDqtDxk7VoCjtk7jVqc_NUJpqMsBabKUgPo-X6s1ZjFueozsYWiHFz8Bpz5JKbJRXb97ZbTkG9pw8FAQFf4bEd-7BjKrUTxcATK0453F7qvFiyU2JLcWcjkjx84pMZk3Uv2c8qO50bQNz7UaojGL48JAXCQxd3-G5JMPxZapI3wjRKgqSo2jWb1ySch4NtvocmAEh-I4J5dhK71D3swMoGosx02UjecGrK4q7wCWFIML9abqCiFT9Ap1CupcR_8N1BaW2ZN8QSn-jilSFXLuXr3RSvPDwMPlG9mbEqqguV91w; __client_uat=1721825919; __cf_bm=FgbPnCfbjUFpXUiYSwZOqVMw12EuJS8f7K2HR0exajs-1722363421-1.0.1.1-LmThvrXE28K4Q9Dflf9vNyHhv6Qmc67j3sW8NrDPP3fPc.P88W5zlPp_ZJay98ZB5xb8uSgu0dAckfA4T5ma_Q; mp_26ced217328f4737497bd6ba6641ca1c_mixpanel=%7B%22distinct_id%22%3A%20%22ab3eca7c-a40e-4bfc-9b21-f86354f32d7b%22%2C%22%24device_id%22%3A%20%2218ffdc5fe7819b-0696ac6535d16f-1a525637-16a7f0-18ffdc5fe7819b%22%2C%22%24initial_referrer%22%3A%20%22https%3A%2F%2Fsuno.com%2F%22%2C%22%24initial_referring_domain%22%3A%20%22suno.com%22%2C%22__mps%22%3A%20%7B%7D%2C%22__mpso%22%3A%20%7B%7D%2C%22__mpus%22%3A%20%7B%7D%2C%22__mpa%22%3A%20%7B%7D%2C%22__mpu%22%3A%20%7B%7D%2C%22__mpr%22%3A%20%5B%5D%2C%22__mpap%22%3A%20%5B%5D%2C%22%24user_id%22%3A%20%22ab3eca7c-a40e-4bfc-9b21-f86354f32d7b%22%7D; __stripe_sid=a2f6770b-c10e-49aa-942c-56211b4c1f9ec79cc4',
      status: SunoUserStatus.Active
    });
      
    console.log('Seed data inserted successfully');
  } catch (error) {
    console.error('Error inserting seed data:', error);
  } finally {
  };
}

seed();