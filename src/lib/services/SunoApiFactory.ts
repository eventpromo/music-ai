import SunoApi from "../SunoApi";
import SunoUserArbitrator from "./SunoUserArbitrator";
import SunoSongService from "./SunoSongService";
import { InvalidCookieError } from "../models/exceptions";
import ICache, { sunoApiCache } from "../cache";
import SunoApiState from "../models/SunoApiState";

export default class SunoApiFactory {
  private static instance: SunoApiFactory;
  private sunoUserArbitrator: SunoUserArbitrator;
  private sunoSongService: SunoSongService;
  private cache: ICache<SunoApiState>;

  private constructor() {
    this.sunoUserArbitrator = SunoUserArbitrator.getInstance();
    this.sunoSongService = SunoSongService.getInstance();
    this.cache = sunoApiCache;
  }

  public static getInstance(): SunoApiFactory {
    if (!SunoApiFactory.instance) {
      SunoApiFactory.instance = new SunoApiFactory();
    }

    return SunoApiFactory.instance;
  }

  public async createBySunoSongId(sunoSongId?: string | null): Promise<SunoApi> {
    let sunoUserId: string | undefined;
    if (sunoSongId) {
      const song = await this.sunoSongService.getSunoSongById(sunoSongId);
      sunoUserId = song.sunoUserId;
    }
    
    return await this.createBySunoUserId(sunoUserId)
  }

  public async createBySunoUserId(sunoUserId?: string | null): Promise<SunoApi> {
    try {
      const sunoApiState = sunoUserId ? this.cache.get(sunoUserId) : null;
      if (sunoApiState) {
        return new SunoApi(sunoApiState.sunoUser).restore(sunoApiState.sid, sunoApiState.currentToken);
      }
      const sunoUser = await this.sunoUserArbitrator.getSunoUser(sunoUserId);
      const sunoApi = await new SunoApi(sunoUser).init();

      this.cache.set(sunoApi.currentUserId, {
        sunoUser: sunoUser,
        sid: sunoApi.currentSessionId,
        currentToken: sunoApi.currentUserToken,
      }, 60 * 30); // 30 minutes

      return sunoApi;
    } catch (error) {      
      if (error instanceof InvalidCookieError) {
        throw error;
      } else {
         throw new Error(`Failed to create SunoApi: ${JSON.stringify(error)}`);
      }
    }
  }
}

export const instance = SunoApiFactory.getInstance();