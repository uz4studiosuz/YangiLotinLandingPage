import { NextResponse } from "next/server";

const DEMO_DOWNLOAD_URL =
  "https://github.com/uz4studiosuz/YangiLotinLandingPage/releases/download/Ilova/YangiLotinIlovasi.apk";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.redirect(DEMO_DOWNLOAD_URL, { status: 302 });
}
