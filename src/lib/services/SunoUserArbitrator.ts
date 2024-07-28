import SunoUser from "../models/SunoUser";
import SunoUserService from "./SunoUserService";

export default class SunoUserArbitrator {
  private static instance: SunoUserArbitrator;
  private sunoUserService: SunoUserService;
  private sunoUsers: Map<string, SunoUser> | null = null;
  private sunoUsersLastUpdated: Date | null = null;
  private isLoading: boolean = false;
  
  private constructor() {
    this.sunoUserService = SunoUserService.getInstance();
  }
  
  public static getInstance() {
    if (!SunoUserArbitrator.instance) {
        SunoUserArbitrator.instance = new SunoUserArbitrator();
    }
  
    return SunoUserArbitrator.instance;
  }
  
  public async getSunoUser(sunoUserId?: string): Promise<SunoUser> {
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

  private getUser(sunoUserId: string): SunoUser {
    if (!this.sunoUsers) {
      throw new Error('Suno users not loaded');
    }

    const sunoUser = this.sunoUsers.get(sunoUserId);

    if (sunoUser) {
      return sunoUser;
    }

    throw new Error(`No suno user found for user with Id='${sunoUserId}'`);;
  }

  private getRandomUser(): SunoUser {
    if (!this.sunoUsers || this.sunoUsers.size === 0) {
      throw new Error('Users not loaded or empty');
    }
    
    const sunoUsers = Array.from(this.sunoUsers.values());
    
    return sunoUsers[Math.floor(Math.random() * sunoUsers.length)];
  }

  private async loadSunoUsers() {
    if (this.isLoading) {
      while (this.isLoading) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return;
    }

    const needToUpdate = this.sunoUsersLastUpdated
      && this.sunoUsersLastUpdated < new Date(Date.now() - 1000 * 60 * 30);

    if (!this.sunoUsers || needToUpdate) {
      this.isLoading = true; 

      try {
        const sunoUsers = await this.sunoUserService.getActiveSunoUsers();
        this.sunoUsers = sunoUsers.reduce((acc, sunoUser) => {
          acc.set(sunoUser.id, sunoUser);
          return acc;
        }, new Map<string, SunoUser>());
        this.sunoUsersLastUpdated = new Date();
      } catch (error) {
        throw new Error(`Failed to load users: ${JSON.stringify(error)}`);
      } finally {
        this.isLoading = false;
      }
    }
  }
}

export const instance = SunoUserArbitrator.getInstance();