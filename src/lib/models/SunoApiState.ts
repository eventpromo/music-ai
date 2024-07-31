import SunoUser from "./SunoUser";

export default interface SunoApiState {
  sid?: string;
  currentToken?: string;
  sunoUser: SunoUser;
}