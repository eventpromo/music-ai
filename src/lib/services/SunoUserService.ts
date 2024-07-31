import SunoUser from "../models/SunoUser";
import { DbContext } from "@/db";
import { SunoUserStatus } from "../models/SunoUser";
import ICache, { sunoUsersCache } from "../cache";

export default class SunoUserService {
  private static instance: SunoUserService;
  private dbContext: DbContext;
  private cache: ICache<SunoUser[]>;

  private constructor() {
    this.dbContext = DbContext.getInstance();
    this.cache = sunoUsersCache;
  }

  public static getInstance(): SunoUserService {
    if (!SunoUserService.instance) {
      SunoUserService.instance = new SunoUserService();
    }

    return SunoUserService.instance;
  }

  public async blockUser(sunoUserId: string): Promise<void> {
    await this.dbContext.sunoUsersTable.update(sunoUserId, { status: SunoUserStatus.Blocked });
    this.cache.del('active');
    this.cache.del('all');
  }

  public async getSunoUserById(sunoUserId: string): Promise<SunoUser>{
    const sunoUser = await this.dbContext.sunoUsersQuery.findFirst({
      where: ((users, { eq }) => eq(users.id, sunoUserId)),
    });
    
    if (sunoUser) {
      return sunoUser;
    }
    
    throw new Error(`Suno user with Id='${sunoUserId}' not found`);
  }

  public async getSunoUsers(fromCache: boolean = false): Promise<SunoUser[]>{
    if (fromCache) {
      const sunoUsers = this.cache.get('all');
      if (sunoUsers) {
        return sunoUsers;
      }
    }
    const sunoUsers = await this.dbContext.sunoUsersQuery.findMany();
    this.cache.set('all', sunoUsers, 60 * 30); // TTL = 30 minutes
        
    return sunoUsers;
  }

  public async getActiveSunoUsers(fromCache: boolean = false): Promise<SunoUser[]>{
    if (fromCache) {
      const sunoUsers = this.cache.get('active');
      if (sunoUsers) {
        return sunoUsers;
      }
    }

    const sunoUsers = await this.dbContext.sunoUsersQuery.findMany(
      {
        where: ((users, { eq }) => eq(users.status, SunoUserStatus.Active)),
      }
    );
    this.cache.set('active', sunoUsers, 60 * 30); // TTL = 30 minutes
        
    return sunoUsers;
  }
}

export const instance = SunoUserService.getInstance();