import { cookies } from "next/headers";

import { TABLE_COOKIE, verifyTableSession } from "./table-session";

export async function getCurrentTable() {
  const cookieStore = await cookies();

  const token = cookieStore.get(TABLE_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    return await verifyTableSession(token);
  } catch {
    return null;
  }
}
