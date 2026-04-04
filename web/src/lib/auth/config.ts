export function isAuthConfigured(): boolean {
  return Boolean(
    process.env.AUTH_SECRET &&
      ((process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) ||
        (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET)),
  );
}
