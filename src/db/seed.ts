import dotenv from 'dotenv';
import DbContext from './DbContext';
import { SunoUserStatus } from '@/lib/models/SunoUser';
dotenv.config();

const context = DbContext.getInstance();

async function seed() {
  try {
    await context.sunoUsersTable.insert({
      id: 'eventpromby@gmail.com',
      cookie: 'ajs_anonymous_id=96bd14c1-a800-4baf-929e-0483ddc97df8; __stripe_mid=c1fbdf97-d733-4eda-bef4-e651abdf096b41c79f; __cf_bm=0DnBVZd8LnxgyNwSE0shNnlPVuhp12Ogr1i5hc3Xbxg-1721769482-1.0.1.1-sLoK3wMA8eucJd8C876v5pginMfU3st6AFhVpateLcWCzrchTKVbaqBIEQW7lQM6Ts8CInv6HEwQvqilqSyaXw; _cfuvid=Aiz_qKNsSP7Ni83WYID3e6d1..EUYF42_._X5CS4TNc-1721769482562-0.0.1.1-604800000; __client=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNsaWVudF8yaHZNY29BS2FyRjV3WERLSjd6V1FSWGdyOTYiLCJyb3RhdGluZ190b2tlbiI6IjhlYm5nemhuampwNmduYzZvMzEyc2h3ZGJubDRqb2ZwemFyZ2VvdDQifQ.ZK2eRg3PB3SLKCguVnb_6X9yNqKtTxGaMpHU7hE2BKUaCzAEqIY0GQZs92SmvE9ODxJCLLKqMed2XbPhEoNxJtVWjr-MKsrb4OYSNwU5ZNuDoqjTF1sIwMVnCbb0aSmH4P0YIx-xOmUOvLXd3c2Fme1eCsytbhPwV9VN6QgWBg-enFsdr_hWX5tqKMtkctRnrVzVsbpQagad_1HD-Y0wigos2tY5sMFAP2IXRcVtoYn28YduD3-oWda7QQBOyBAKbIeTwPYw7EretcKBsXGoS_Ai2Sk8fQkTPqyuweLprhbPpT59fdaLuGLvbpitKfPL79ssU12nazsSQFZxC1lDzw; __client_uat=1721769495; mp_26ced217328f4737497bd6ba6641ca1c_mixpanel=%7B%22distinct_id%22%3A%20%2211bcb0f3-57fb-4e8c-85a1-631aabf0e1cb%22%2C%22%24device_id%22%3A%20%221901cccaa04564-03a16b7f271903-26001f51-144000-1901cccaa05564%22%2C%22%24initial_referrer%22%3A%20%22https%3A%2F%2Fweb.telegram.org%2F%22%2C%22%24initial_referring_domain%22%3A%20%22web.telegram.org%22%2C%22__mps%22%3A%20%7B%7D%2C%22__mpso%22%3A%20%7B%7D%2C%22__mpus%22%3A%20%7B%7D%2C%22__mpa%22%3A%20%7B%7D%2C%22__mpu%22%3A%20%7B%7D%2C%22__mpr%22%3A%20%5B%5D%2C%22__mpap%22%3A%20%5B%5D%2C%22%24user_id%22%3A%20%2211bcb0f3-57fb-4e8c-85a1-631aabf0e1cb%22%2C%22%24search_engine%22%3A%20%22google%22%7D',
      status: SunoUserStatus.Active
    });
      
    console.log('Seed data inserted successfully');
  } catch (error) {
    console.error('Error inserting seed data:', error);
  } finally {
  };
}

seed();