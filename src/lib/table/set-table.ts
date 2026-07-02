// actions/set-table.ts

"use server";

import { cookies } from "next/headers";

export async function setTableSession(token: string) {
  const cookieStore = await cookies();

  cookieStore.set("table_session", token);
}
