import NodeCache from 'node-cache';
import SunoUser from '../models/SunoUser';

const cache = new NodeCache({ checkperiod: 120 });

export default interface ICache<TValue> {
  prefixKey: string;

  get(key: string): TValue | undefined;

  set(key: string, value: TValue, ttl: number): void;

  del(key: string): void;
}

class Cache<TValue> implements ICache<TValue> {
  private prefix: string;
  private cache: NodeCache;  
  
  constructor(prefixKey: string, cache: NodeCache) {
    this.prefix = prefixKey;
    this.cache = cache;
  }

  public get prefixKey() { return this.prefix; }

  get(key: string) {
    return this.cache.get<TValue>(`${this.prefixKey}:${key}`);
  }

  set(key: string, value: TValue, ttl: number): void {
    this.cache.set(`${this.prefixKey}:${key}`, value, ttl);
  }

  del(key: string): void {
    this.cache.del(`${this.prefixKey}:${key}`);
  }
}

export const sunoUsersCache = new Cache<SunoUser[]>('suno_users', cache);