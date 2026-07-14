import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.TABLE_SESSION_SECRET);

export const TABLE_COOKIE = "table_session";

export async function createTableSession(tableId: number) {
  return new SignJWT({
    tableId,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("5h")
    .sign(secret);
}

export async function verifyTableSession(token: string) {
  const { payload } = await jwtVerify(token, secret);

  return {
    tableId: Number(payload.tableId),
  };
}
