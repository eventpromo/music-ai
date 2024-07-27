import SunoApi from "../SunoApi";

class SunoApiFactory {
  private static instance: SunoApiFactory;

  private constructor() {
  }

  public static getInstance(): SunoApiFactory {
    if (!SunoApiFactory.instance) {
      SunoApiFactory.instance = new SunoApiFactory();
    }

    return SunoApiFactory.instance;
  }

  public async create(songId?: string): Promise<SunoApi> {
    const sunoApi = new SunoApi(process.env.SUNO_COOKIE || '');
    
    return await sunoApi.init();
  }
}

export default SunoApiFactory.getInstance();