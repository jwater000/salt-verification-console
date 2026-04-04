export type SessionContext = {
  userId: string | null;
  role: "member" | "moderator" | "admin" | null;
  status: "active" | "restricted" | "suspended" | "deleted" | null;
};

function quoteLiteral(value: string | null): string {
  if (value === null) return "''";
  return `'${value.replace(/'/g, "''")}'`;
}

export function buildRlsSessionStatements(session: SessionContext): string[] {
  return [
    `set local app.current_user_id = ${quoteLiteral(session.userId)};`,
    `set local app.current_user_role = ${quoteLiteral(session.role)};`,
    `set local app.current_user_status = ${quoteLiteral(session.status)};`,
  ];
}

export function assertActiveWriter(session: SessionContext): void {
  if (!session.userId || !session.role || session.status !== "active") {
    throw new Error("Authenticated active member session required.");
  }
}

