function hasValue(name) {
  return Boolean(process.env[name] && process.env[name].trim());
}

const authSecretConfigured = hasValue("AUTH_SECRET");
const googleConfigured = hasValue("AUTH_GOOGLE_ID") && hasValue("AUTH_GOOGLE_SECRET");
const githubConfigured = hasValue("AUTH_GITHUB_ID") && hasValue("AUTH_GITHUB_SECRET");
const authConfigured = authSecretConfigured && (googleConfigured || githubConfigured);
const databaseConfigured = hasValue("DATABASE_URL");

const status = {
  date: new Date().toISOString(),
  database: {
    configured: databaseConfigured,
    mode: databaseConfigured ? "postgres" : "file_fallback",
  },
  auth: {
    configured: authConfigured,
    secret: authSecretConfigured,
    providers: {
      google: googleConfigured,
      github: githubConfigured,
    },
  },
  discussion: {
    readMode: databaseConfigured ? "database" : "file_fallback",
    writeMode: authConfigured ? (databaseConfigured ? "database" : "file_fallback") : "disabled",
  },
};

console.log(JSON.stringify(status, null, 2));
