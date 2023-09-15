function getTokenPayload(token: string): { [key: string]: any } | undefined {
  if (!token) return {};

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(base64));

    return decoded;
  } catch {
    console.log();
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = getTokenPayload(token);
  const currentTime = Date.now() / 1000;

  if (typeof payload === "undefined" || !Object.keys(payload).length) {
    return true;
  }

  return payload.exp && payload.exp < Math.floor(currentTime);
}
