import SunoApi from "../SunoApi";
import SunoUser from "../models/SunoUser";

export default class SunoApiFactory {
  private static instance: SunoApiFactory;

  private constructor() {
    // add cache and reset state
  }

  public static getInstance(): SunoApiFactory {
    if (!SunoApiFactory.instance) {
      SunoApiFactory.instance = new SunoApiFactory();
    }

    return SunoApiFactory.instance;
  }

  public async createBySunoUser(sunoUser: SunoUser): Promise<SunoApi> {
    const sunoApi = await new SunoApi(sunoUser).init();

    return sunoApi;
  }
}

export const instance = SunoApiFactory.getInstance();