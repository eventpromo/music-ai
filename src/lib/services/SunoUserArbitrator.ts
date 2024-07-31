import SunoUser, { SunoUserStatus } from "../models/SunoUser";
import SunoUserService from "./SunoUserService";

export default class SunoUserArbitrator {
  private static instance: SunoUserArbitrator;
  private sunoUserService: SunoUserService;
  
  private constructor() {
    this.sunoUserService = SunoUserService.getInstance();
  }
  
  public static getInstance() {
    if (!SunoUserArbitrator.instance) {
        SunoUserArbitrator.instance = new SunoUserArbitrator();
    }
  
    return SunoUserArbitrator.instance;
  }
  
  public async getSunoUser(sunoUserId?: string | null): Promise<SunoUser> {
    try {
      if (!sunoUserId) {
        return this.getRandomUser();
      } else {
        return this.getUser(sunoUserId);
      }
    } catch (error) {
      throw new Error(`Failed to get suno user: ${JSON.stringify(error)}`);
    }
  }

  private async getUser(sunoUserId: string): Promise<SunoUser> {

    const sunoUser = await this.sunoUserService.getSunoUserById(sunoUserId);

    if (sunoUser && sunoUser.status === SunoUserStatus.Active) {
      return sunoUser;
    }

    throw new Error(`No active suno user found for user with Id='${sunoUserId}'`);;
  }

  private async getRandomUser(): Promise<SunoUser> {
    const sunoUsers = await this.sunoUserService.getActiveSunoUsers(true);
    if (!sunoUsers) {
      throw new Error('Users not loaded or empty');
    }
   
    return sunoUsers[Math.floor(Math.random() * sunoUsers.length)];
  }
}

export const instance = SunoUserArbitrator.getInstance();