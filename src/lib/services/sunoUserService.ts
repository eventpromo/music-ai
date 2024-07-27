import { NextResponse, NextRequest } from "next/server";  
import SunoUser from "../models/SunoUser";


class SunoUserService {
  private static instance: SunoUserService;

  private constructor() {
  }

  public static getInstance(): SunoUserService {
    if (!SunoUserService.instance) {
      SunoUserService.instance = new SunoUserService();
    }

    return SunoUserService.instance;
  }

  public async getUser(): Promise<SunoUser> {
    return { id: "1", cookie: 'John Doe' };
  }
}

export default SunoUserService.getInstance();