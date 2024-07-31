import dotenv from 'dotenv';
import DbContext from './DbContext';
import { SunoUserStatus } from '@/lib/models/SunoUser';
dotenv.config();

const context = DbContext.getInstance();

async function seed() {
  try {
    await context.sunoUsersTable.insert({
      id: 'guk3@gmail.com',
      cookie: 'ajs_anonymous_id=96bd14c1-a800-4baf-929e-0483ddc97df8; __stripe_mid=c1fbdf97-d733-4eda-bef4-e651abdf096b41c79f; __cf_bm=ldTqz5my8mlInNHfYececMtMijDepEdP43dSlABpS9A-1722423633-1.0.1.1-g02rvBuAHdh1JTELXmIU5fx7DAG1mAkgoNDRVbYciPQP1aG6e4L0Is6BsnMVhZ2jVZWMyZt15LyZu.eq_F4Ziw; _cfuvid=9yBVhJUX0JFcNY224urIDHeBT0e.20JQP0FozVFbvdk-1722423633485-0.0.1.1-604800000; __client=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNsaWVudF8yaHZNY29BS2FyRjV3WERLSjd6V1FSWGdyOTYiLCJyb3RhdGluZ190b2tlbiI6Imo3cnpta2hqdXVpMXRyNngyeTA1ejNucHd3dHp3bjFoeXhlcG1neHUifQ.WjzB-wJBa2WJYtwy-sJo95V_mcNTTUrfUZ3oy3XRAImBE9fwotciVTDnXbSureiqO0btXyxyeqrEYBFgBJMeJPYcFhMLMU5JpFM2K2lrobH9CMMMeTFNIdRb1RbXuFe1H6K8kMrk56Y-K5TWvTDEXI75Y97dGGcWdBPRDmD-RHhLnXR_6IAvJklRAKvL79_79s0ldpMGtsz0yqkUA0AQcPT0zztJBknlLS3ZCTTlYmFBdV5k-O_jbJRBBRllX7kiHc7xSIXPGo-Gx7ewZLnIMMGQUG3sh07dWHbzTpIFNsc5gWNtFJdNiONXupoj25WFfou8WO_xV_WceKldULkaUQ; __client_uat=1722423641; mp_26ced217328f4737497bd6ba6641ca1c_mixpanel=%7B%22distinct_id%22%3A%20%2211bcb0f3-57fb-4e8c-85a1-631aabf0e1cb%22%2C%22%24device_id%22%3A%20%221901cccaa04564-03a16b7f271903-26001f51-144000-1901cccaa05564%22%2C%22%24initial_referrer%22%3A%20%22https%3A%2F%2Fweb.telegram.org%2F%22%2C%22%24initial_referring_domain%22%3A%20%22web.telegram.org%22%2C%22__mps%22%3A%20%7B%7D%2C%22__mpso%22%3A%20%7B%7D%2C%22__mpus%22%3A%20%7B%7D%2C%22__mpa%22%3A%20%7B%7D%2C%22__mpu%22%3A%20%7B%7D%2C%22__mpr%22%3A%20%5B%5D%2C%22__mpap%22%3A%20%5B%5D%2C%22%24user_id%22%3A%20%2211bcb0f3-57fb-4e8c-85a1-631aabf0e1cb%22%2C%22%24search_engine%22%3A%20%22google%22%7D',
      status: SunoUserStatus.Active
    });
      
    console.log('Seed data inserted successfully');
  } catch (error) {
    console.error('Error inserting seed data:', error);
  } finally {
  };
}

seed();