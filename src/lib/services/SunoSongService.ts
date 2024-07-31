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

  public async getSunoSongs(): Promise<SunoSong[]> {
    const sunoSongs = await this.dbContext.sunoSongsQuery.findMany();

    return sunoSongs;
  }

  public async getSunoSongById(sunoSongId: string): Promise<SunoSong> {
    const sunoSong = await this.dbContext.sunoSongsQuery.findFirst({
      where: ((songs, { eq }) => eq(songs.id, sunoSongId)),
    });

    if (sunoSong) {
      return sunoSong;
    }

    throw new Error(`Suno song with Id='${sunoSongId}' not found`);
  }

  public async createSunoSong(sunoSong: SunoSong) {
    await this.dbContext.sunoSongsTable.insert([sunoSong]);
  } 

  public async createManySunoSongs(sunoSongs: SunoSong[]) {
    await this.dbContext.sunoSongsTable.insert(sunoSongs);
  }
}

export const instance = SunoSongService.getInstance();