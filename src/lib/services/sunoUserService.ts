import SunoUser from "../models/SunoUser";
import { DbContext } from "@/db";

export default class SunoUserService {
  private static instance: SunoUserService;
  private dbContext: DbContext;

  private constructor() {
    this.dbContext = DbContext.getInstance();
  }

  public static getInstance(): SunoUserService {
    if (!SunoUserService.instance) {
      SunoUserService.instance = new SunoUserService();
    }

    return SunoUserService.instance;
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

  public async getSunoUsers(): Promise<SunoUser[]>{
    const sunoUsers = await this.dbContext.sunoUsersQuery.findMany();
        
    return sunoUsers;
  }
}

export const instance = SunoUserService.getInstance();