import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

/** localStorage seguro (não quebra no servidor / SSR). */
@Injectable({ providedIn: 'root' })
export class Storage {
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

  read<T>(key: string, fallback: T): T {
    if (!this.browser) return fallback;
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  }

  write(key: string, value: unknown): void {
    if (!this.browser) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* cota cheia ou bloqueado: ignora */
    }
  }
}
