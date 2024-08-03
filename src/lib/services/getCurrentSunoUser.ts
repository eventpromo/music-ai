import { sunoUserService } from ".";
import SunoUser from "../models/SunoUser";

export type CurrentSunoUserRequest = {
  sunoUserId: string;
  sunoSongId?: never
} | {
  sunoUserId?: never;
  sunoSongId: string
};

async function getUser(request: CurrentSunoUserRequest): Promise<SunoUser> {
  let sunoUser;
  
  if (request.sunoUserId) {
    sunoUser = await sunoUserService.getSunoUserById(request.sunoUserId);
  } else if (request.sunoSongId) {
    sunoUser = await sunoUserService.getSunoUserBySongId(request.sunoSongId);
  }

  if (!sunoUser) {
    throw new Error(`Cant get SunoUser with context: ${JSON.stringify(request)}`);
  }

  return sunoUser;
}

async function getRandomUser(): Promise<SunoUser> {
  const sunoUsers = await sunoUserService.getActiveSunoUsers(true);
  if (!sunoUsers) {
    throw new Error('Users not loaded or empty');
  }
  
  const randomIndex = Math.floor(Math.random() * sunoUsers.length);
  
  return sunoUsers[randomIndex];
}

export default async function getCurrentSunoUser(request?: CurrentSunoUserRequest): Promise<SunoUser> {
  const isRandomUser = !request;
    
  return isRandomUser ? await getRandomUser() : await getUser(request);
}
