import { NextResponse } from "next/server";

import { adminSupabase } from "@/supabase/supabaseAdmin";
import { TABLE_COOKIE, createTableSession } from "@/lib/table/table-session";
import { APP_ROUTES } from "@/config/app-routes";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  const { data: table } = await adminSupabase
    .from("tables")
    .select("id,is_active")
    .eq("qr_token", token)
    .single();

  if (!table || !table.is_active) {
    return NextResponse.json(
      {
        error: "QR không hợp lệ",
      },
      {
        status: 404,
      },
    );
  }

  const session = await createTableSession(table.id);
  const origin = new URL(req.url).origin;
  const response = NextResponse.redirect(
    new URL(origin + APP_ROUTES.GUEST.ROOT),
  );

  response.cookies.set(TABLE_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",

    sameSite: "strict",

    maxAge: 60 * 60 * 12,

    path: "/",
  });

  return response;
}
