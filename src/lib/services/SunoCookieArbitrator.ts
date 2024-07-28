import SunoUserService from "./SunoUserService";

export default class SunoCookieArbitrator {
  private static instance: SunoCookieArbitrator;
  private sunoUserService: SunoUserService;
  private sunoUserCookies: Map<string, string> | null = null;
  private cookiesLastUpdated: Date | null = null;
  private isLoading: boolean = false;
  
  private constructor() {
    this.sunoUserService = SunoUserService.getInstance();
  }
  
  public static getInstance() {
    if (!SunoCookieArbitrator.instance) {
        SunoCookieArbitrator.instance = new SunoCookieArbitrator();
    }
  
    return SunoCookieArbitrator.instance;
  }
  
  public async getCookie(sunoUserId?: string): Promise<string> {
    try {
      await this.loadCookies();

      if (!sunoUserId) {
        return this.getRandomCookie();
      } else {
        return this.getUserCookie(sunoUserId);
      }
    } catch (error) {
      throw new Error(`Failed to get cookie: ${JSON.stringify(error)}`);
    }
  }

  private getUserCookie(sunoUserId: string): string {
    if (!this.sunoUserCookies) {
      throw new Error('Cookies not loaded');
    }

    const cookie = this.sunoUserCookies.get(sunoUserId);

    if (cookie) {
      return cookie;
    }

    throw new Error(`No cookie found for user with Id='${sunoUserId}'`);;
  }

  private getRandomCookie(): string {
    if (!this.sunoUserCookies || this.sunoUserCookies.size === 0) {
      throw new Error('Cookies not loaded or empty');
    }
    
    const cookies = Array.from(this.sunoUserCookies.values());
    
    return cookies[Math.floor(Math.random() * cookies.length)];
  }

  private async loadCookies() {
    if (this.isLoading) {
      while (this.isLoading) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return;
    }

    const needToUpdate = this.cookiesLastUpdated
      && this.cookiesLastUpdated < new Date(Date.now() - 1000 * 60 * 30);

    if (!this.sunoUserCookies || needToUpdate) {
      this.isLoading = true; 

      try {
        const sunoUsers = await this.sunoUserService.getSunoUsers();
        this.sunoUserCookies = sunoUsers.reduce((acc, sunoUser) => {
          acc.set(sunoUser.id, sunoUser.cookie);
          return acc;
        }, new Map<string, string>());
        this.cookiesLastUpdated = new Date();
      } catch (error) {
        throw new Error(`Failed to load cookies: ${JSON.stringify(error)}`);
      } finally {
        this.isLoading = false; // Снимаем флаг загрузки
      }
    }
  }
}

export const instance = SunoCookieArbitrator.getInstance();