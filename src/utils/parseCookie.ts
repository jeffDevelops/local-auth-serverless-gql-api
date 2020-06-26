export const parseCookie = (desiredCookieName: string, cookies: string) => {
  return cookies
    .split('; ')
    .find((cookie: string) => cookie.startsWith(`${desiredCookieName}=`))
    ?.replace(`${desiredCookieName}="`, '')
}
