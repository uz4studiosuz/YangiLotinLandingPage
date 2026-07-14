const DEMO_DOWNLOAD_URL =
  "https://odam.uz/upload/media/posts/2019-11/30/miyamizni-aldab-qo-yishi-mumkin-bo-lgan-8-ta-rasm-sinchkovroq-bo-ling_1575125501-b.jpg";

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
