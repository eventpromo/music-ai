export enum SunoUserStatus {
  Active = 'active',
  Blocked = 'blocked'
}

export default interface SunoUser {
  id: string;
  cookie: string;
  status: SunoUserStatus;
  creditsLeft?: number | null;
}

export interface SunoUserCredits {
  creditsLeft: number,
  period: string,
  monthlyLimit: number,
  monthlyLsage: number,
};