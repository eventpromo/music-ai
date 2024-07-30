import ICache, { sunoUsersCache } from "../cache";
import SunoUser from "../models/SunoUser";
import SunoUserService from "./SunoUserService";

export default class SunoUserArbitrator {
  private static instance: SunoUserArbitrator;
  private sunoUserService: SunoUserService;
  private cache: ICache<SunoUser[]>;
  private cacheKey: string = 'arbitrator';
  private isLoading: boolean = false;
  
  private constructor() {
    this.sunoUserService = SunoUserService.getInstance();
    this.cache = sunoUsersCache;
  }
  
  public static getInstance() {
    if (!SunoUserArbitrator.instance) {
        SunoUserArbitrator.instance = new SunoUserArbitrator();
    }
  
    return SunoUserArbitrator.instance;
  }
  
  public async getSunoUser(sunoUserId?: string | null): Promise<SunoUser> {
    try {
      await this.loadSunoUsers();

      if (!sunoUserId) {
        return this.getRandomUser();
      } else {
        return this.getUser(sunoUserId);
      }
    } catch (error) {
      throw new Error(`Failed to get suno user: ${JSON.stringify(error)}`);
    }
  }

  public async reload(): Promise<void> {
    this.cache.del(this.cacheKey);
    await this.loadSunoUsers();
  }

  private get sunoUsers(): SunoUser[] | undefined {
    return this.cache.get(this.cacheKey);
  }

  private getUser(sunoUserId: string): SunoUser {
    if (!this.sunoUsers) {
      throw new Error('Suno users not loaded');
    }

    const sunoUser = this.sunoUsers?.find(user => user.id === sunoUserId);

    if (sunoUser) {
      return sunoUser;
    }

    throw new Error(`No suno user found for user with Id='${sunoUserId}'`);;
  }

  private getRandomUser(): SunoUser {
    const sunoUsers = this.cache.get(this.cacheKey);
    if (!this.sunoUsers) {
      throw new Error('Users not loaded or empty');
    }

    const cachedSunoUsers = this.sunoUsers;    
    return cachedSunoUsers[Math.floor(Math.random() * cachedSunoUsers.length)];
  }

  private async loadSunoUsers() {
    if (this.isLoading) {
      while (this.isLoading) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return;
    }

    if (!this.sunoUsers?.length) {
      this.isLoading = true; 

      try {
        const activeSunoUsers = await this.sunoUserService.getActiveSunoUsers();
        this.cache.set(this.cacheKey, activeSunoUsers, 60 * 30); // 30 minutes
      } catch (error) {
        throw new Error(`Failed to load users: ${JSON.stringify(error)}`);
      } finally {
        this.isLoading = false;
      }
    }
  }
}

export const instance = SunoUserArbitrator.getInstance();