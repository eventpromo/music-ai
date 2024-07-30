export enum SunoUserStatus {
  Active = 'active',
  Blocked = 'blocked'
}

export default interface SunoUser {
  id: string;
  cookie: string;
  status: SunoUserStatus;
}


export interface SunoUserCredits {
  credits_left: number,
  period: string,
  monthly_limit: number,
  monthly_usage: number,
};