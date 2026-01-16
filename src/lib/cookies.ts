// Cookie utility functions for auth token management

const COOKIE_KEYS = {
  accessToken: "accessToken",
  refreshToken: "refreshToken",
} as const;

const TOKEN_EXPIRY = {
  accessMinutes: 15,
  refreshDays: 15,
} as const;

type SameSite = "Strict" | "Lax" | "None";

interface CookieOptions {
  expires?: Date;
  path?: string;
  secure?: boolean;
  sameSite?: SameSite;
}

const DEFAULT_COOKIE_OPTIONS: Required<
  Pick<CookieOptions, "path" | "sameSite">
> = {
  path: "/",
  sameSite: "Strict",
};

const isBrowser = typeof window !== "undefined";

function isHttps(): boolean {
  if (!isBrowser) return false;
  return window.location.protocol === "https:";
}

function buildCookieString(
  name: string,
  value: string,
  options: CookieOptions = {}
): string {
  const {
    expires,
    path = DEFAULT_COOKIE_OPTIONS.path,
    secure = true,
    sameSite = DEFAULT_COOKIE_OPTIONS.sameSite,
  } = options;

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (expires) cookieString += `; expires=${expires.toUTCString()}`;
  cookieString += `; path=${path}`;
  cookieString += `; SameSite=${sameSite}`;

  // Add Secure only when HTTPS (avoids issues on localhost)
  if (secure && isHttps()) cookieString += "; Secure";

  return cookieString;
}

function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): void {
  if (!isBrowser) return;
  document.cookie = buildCookieString(name, value, options);
}

function getCookie(name: string): string | null {
  if (!isBrowser) return null;

  // Safer + faster lookup using regex (handles cookie values containing "=" too)
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${encodeURIComponent(name)}=([^;]*)`)
  );

  return match ? decodeURIComponent(match[1]) : null;
}

function deleteCookie(
  name: string,
  options: Pick<CookieOptions, "path"> = {}
): void {
  if (!isBrowser) return;

  const { path = DEFAULT_COOKIE_OPTIONS.path } = options;

  // Delete by setting expiry in past
  document.cookie = buildCookieString(name, "", {
    path,
    expires: new Date(0),
  });
}

// -------------------- Helpers --------------------

function minutesFromNow(minutes: number): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

// -------------------- Auth-specific --------------------

export function setAuthCookies(
  accessToken: string,
  refreshToken: string
): void {
  setCookie(COOKIE_KEYS.accessToken, accessToken, {
    expires: minutesFromNow(TOKEN_EXPIRY.accessMinutes),
  });

  setCookie(COOKIE_KEYS.refreshToken, refreshToken, {
    expires: daysFromNow(TOKEN_EXPIRY.refreshDays),
  });
}

export function updateAccessToken(accessToken: string): void {
  setCookie(COOKIE_KEYS.accessToken, accessToken, {
    expires: minutesFromNow(TOKEN_EXPIRY.accessMinutes),
  });
}

export function getAccessToken(): string | null {
  return getCookie(COOKIE_KEYS.accessToken);
}

export function getRefreshToken(): string | null {
  return getCookie(COOKIE_KEYS.refreshToken);
}

export function clearAuthCookies(): void {
  deleteCookie(COOKIE_KEYS.accessToken);
  deleteCookie(COOKIE_KEYS.refreshToken);
}

export function hasValidTokens(): boolean {
  // Better: return true if ANY token exists
  return Boolean(getAccessToken() || getRefreshToken());
}
