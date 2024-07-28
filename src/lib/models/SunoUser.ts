export enum SunoUserStatus {
  Active = 'active',
  Limited = 'limited',
  Blocked = 'blocked'
}

export default interface SunoUser {
  id: string;
  cookie: string;
  status: SunoUserStatus;
}
