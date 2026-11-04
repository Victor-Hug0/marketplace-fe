const SESSION_LEAK =
  /emall_access|emall_refresh|access_token|refresh_token|Authorization/;

export function clientSourceLeaksSession(source: string): boolean {
  const isClient = /['"]use client['"]/.test(source);
  if (!isClient) return false;
  return SESSION_LEAK.test(source);
}
