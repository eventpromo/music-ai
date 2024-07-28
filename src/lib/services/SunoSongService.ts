import { DbContext } from "@/db";
import SunoSong from "../models/SunoSong";

export default class SunoSongService {
  private static instance: SunoSongService;
  private dbContext: DbContext;
  
  private constructor() {
    this.dbContext = DbContext.getInstance();
  }

  public static getInstance(): SunoSongService {
    if (!SunoSongService.instance) {
      SunoSongService.instance = new SunoSongService();
    }

    return SunoSongService.instance;
  }

  async getSunoSongById(id: string): Promise<SunoSong> {
    const sunoSong = await this.dbContext.sunoSongsTable.findFirst({ with: { id } });

    if (sunoSong) {
      return sunoSong;
    }

    throw new Error(`Suno song with Id='${id}' not found`);
  }  
}

export const instance = SunoSongService.getInstance();