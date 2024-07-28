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

  async getSunoUserById(id: string): Promise<SunoUser>{
    const sunoUser = await this.dbContext.sunoUsersTable.findFirst({ with: { id } });
    
    if (sunoUser) {
      return sunoUser;
    }
    
    throw new Error(`Suno user with Id='${id}' not found`);
  }

  async getSunoUsers(): Promise<SunoUser[]>{
    const sunoUsers = await this.dbContext.sunoUsersTable.findMany();
        
    return sunoUsers;
  }
}