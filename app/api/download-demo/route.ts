const DEMO_DOWNLOAD_URL =
  "https://github.com/uz4studiosuz/YangiLotinLandingPage/releases/download/Ilova/YangiLotinIlovasi.apk";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await fetch(DEMO_DOWNLOAD_URL, { cache: "no-store" });

    if (!response.ok) {
      return new Response("Download file is unavailable.", { status: 502 });
    }

    const body = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") ?? "image/jpeg";

    return new Response(body, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Disposition": 'attachment; filename="yangi-lotin-demo.jpg"',
        "Content-Type": contentType,
      },
    });
  } catch {
    return new Response("Download file is unavailable.", { status: 502 });
  }
}
