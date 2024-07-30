export class InvalidCookieError extends Error {
  public sunoUserId: string;

  constructor(sunoUserId: string, message?: string) {
    super(message);

    this.sunoUserId = sunoUserId;
  }
}