export class SunoApiError extends Error {
  public sunoUserId: string;
  public response?: any;

  constructor(sunoUserId: string, message?: string, response?: any) {
    super(message);

    this.sunoUserId = sunoUserId;
    this.response = response;
  }
}