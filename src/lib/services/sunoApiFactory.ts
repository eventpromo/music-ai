import SunoApi from "../SunoApi";
import SunoCookieArbitrator from "./SunoUserArbitrator";
import SunoSongService from "./SunoSongService";

export default class SunoApiFactory {
  private static instance: SunoApiFactory;
  private sunoCookieArbitrator: SunoCookieArbitrator;
  private sunoSongService: SunoSongService;

  private constructor() {
    this.sunoCookieArbitrator = SunoCookieArbitrator.getInstance();
    this.sunoSongService = SunoSongService.getInstance();
  }

  public static getInstance(): SunoApiFactory {
    if (!SunoApiFactory.instance) {
      SunoApiFactory.instance = new SunoApiFactory();
    }

    return SunoApiFactory.instance;
  }

  public async create(sunoSongId?: string): Promise<SunoApi> {
    try {
      let sunoUserId: string | undefined;
      if (sunoSongId) {
        const song = await this.sunoSongService.getSunoSongById(sunoSongId);
        sunoUserId = song.sunoUserId;
      }
      const sunoUser = await this.sunoCookieArbitrator.getSunoUser(sunoUserId);
      const sunoApi = new SunoApi(sunoUser);
    
      return await sunoApi.init();
    } catch (error) {
      throw new Error(`Failed to create SunoApi: ${JSON.stringify(error)}`);
    }
  }
}

export const instance = SunoApiFactory.getInstance();