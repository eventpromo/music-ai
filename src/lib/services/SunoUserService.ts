import SunoUser from "../models/SunoUser";
import { DbContext, sunoSongsTable, sunoUsersTable } from "@/db";
import { eq } from 'drizzle-orm';
import { SunoUserStatus } from "../models/SunoUser";
import ICache, { sunoUserCache, sunoUsersCache } from "../cache";

export default class SunoUserService {
  private static instance: SunoUserService;
  private dbContext: DbContext;
  private userListCache: ICache<SunoUser[]>;
  private userCache: ICache<SunoUser>;  

  private constructor() {
    this.dbContext = DbContext.getInstance();
    this.userListCache = sunoUsersCache;
    this.userCache = sunoUserCache;
  }

  public static getInstance(): SunoUserService {
    if (!SunoUserService.instance) {
      SunoUserService.instance = new SunoUserService();
    }

    return SunoUserService.instance;
  }

  public async createSunoUser(sunoUser: SunoUser): Promise<void> {
    await this.dbContext.sunoUsersTable.insert(sunoUser);
    this.clearCache(sunoUser.id);
  }

  public async updateSunoUser(sunoUser: SunoUser): Promise<void> {
    await this.dbContext.sunoUsersTable.update(sunoUser.id, sunoUser);
    this.clearCache(sunoUser.id);
  }

  public async updateCookie(sunoUserId: string, cookie: string): Promise<void> {
    await this.dbContext.sunoUsersTable.update(sunoUserId, {
      cookie,
      status: SunoUserStatus.Active
    });
    this.clearCache(sunoUserId);
  }

  public async updateSunoUserCredits(sunoUserId: string, creditsLeft: number): Promise<void> {
    await this.dbContext.sunoUsersTable.update(sunoUserId, {
      creditsLeft,
      status: creditsLeft <= 0 ? SunoUserStatus.Blocked : SunoUserStatus.Active,
    });

    this.clearCache(sunoUserId);
  }

  public async blockSunoUser(sunoUserId: string): Promise<void> {
    await this.dbContext.sunoUsersTable.update(sunoUserId, { status: SunoUserStatus.Blocked });
    this.clearCache(sunoUserId);
  }

  public async getSunoUserById(sunoUserId: string): Promise<SunoUser>{
    let sunoUser = this.userCache.get(sunoUserId);
    if (sunoUser) {
      return sunoUser;
    }
    
    sunoUser = await this.dbContext.sunoUsersQuery.findFirst({
      where: ((users, { eq }) => eq(users.id, sunoUserId)),
    });
    
    if (sunoUser) {
      this.userCache.set(sunoUserId, sunoUser)

      return sunoUser;
    }
    
    throw new Error(`Suno user with Id='${sunoUserId}' not found`);
  }

  public async getSunoUserBySongId(sunoSongId: string) {
    let sunoUser = this.userCache.get(`song:${sunoSongId}`);
    if (sunoUser) {
      return sunoUser;
    }

    const sunoUsers = await this.dbContext.db
      .select({
        id: sunoUsersTable.id,
        cookie: sunoUsersTable.cookie,
        status: sunoUsersTable.status,
        creditsLeft: sunoUsersTable.creditsLeft,
      })
      .from(sunoUsersTable)
      .innerJoin(sunoSongsTable, eq(sunoUsersTable.id, sunoSongsTable.sunoUserId))
      .where(eq(sunoSongsTable.id, sunoSongId))
      .execute();
    
    if (sunoUsers.length > 1) {
      throw new Error(`Multiple users found for song with Id='${sunoSongId}'`);
    } else if (sunoUsers.length === 0) {
      throw new Error(`No user found for song with Id='${sunoSongId}'`);
    }

    sunoUser = sunoUsers[0];
    this.userCache.set(`song:${sunoSongId}`, sunoUser)

    return sunoUser;
  }

  public async getSunoUsers(fromCache: boolean = false): Promise<SunoUser[]>{
    if (fromCache) {
      const sunoUsers = this.userListCache.get('all');
      if (sunoUsers) {
        return sunoUsers;
      }
    }
    const sunoUsers = await this.dbContext.sunoUsersQuery.findMany();
    this.userListCache.set('all', sunoUsers);
        
    return sunoUsers;
  }

  public async getActiveSunoUsers(fromCache: boolean = false): Promise<SunoUser[]>{
    if (fromCache) {
      const sunoUsers = this.userListCache.get('active');
      if (sunoUsers) {
        return sunoUsers;
      }
    }

    const sunoUsers = await this.dbContext.sunoUsersQuery.findMany({
      where: ((users, { eq }) => eq(users.status, SunoUserStatus.Active)),
    });
    this.userListCache.set('active', sunoUsers);
        
    return sunoUsers;
  }

  private clearCache(sunoUserId?: string): void {
    this.userListCache.del('active');
    this.userListCache.del('all');

    if (sunoUserId) { 
      this.userCache.del(sunoUserId);
    }
  }
}

export const instance = SunoUserService.getInstance();