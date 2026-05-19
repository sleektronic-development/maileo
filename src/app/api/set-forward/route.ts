import { NextResponse } from "next/server";
import axios from "axios";

const IMPROVMX_BASE = "https://api.improvmx.com/v3";

export async function POST(req: Request) {
  try {
    const { forwardTo } = await req.json();

    if (!forwardTo || typeof forwardTo !== "string") {
      return NextResponse.json(
        { success: false, message: "forwardTo is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.IMPROVMX_API_KEY;
    const domain = process.env.IMPROVMX_DOMAIN;
    const aliasLocalpart = process.env.GOV_ALIAS_LOCALPART || "support";

    if (!apiKey || !domain) {
      return NextResponse.json(
        {
          success: false,
          message: "IMPROVMX_API_KEY / IMPROVMX_DOMAIN missing in .env",
        },
        { status: 500 }
      );
    }

    const auth = { username: "api", password: apiKey };

    const updateUrl = `${IMPROVMX_BASE}/domains/${domain}/aliases/${encodeURIComponent(
      aliasLocalpart
    )}`;

    try {
      const updated = await axios.put(
        updateUrl,
        { forward: forwardTo },
        { auth, timeout: 15000 }
      );

      return NextResponse.json({
        success: true,
        mode: "updated",
        alias: aliasLocalpart,
        domain,
        forwardTo,
        data: updated.data,
      });
    } catch {
      const createUrl = `${IMPROVMX_BASE}/domains/${domain}/aliases`;
      const created = await axios.post(
        createUrl,
        { alias: aliasLocalpart, forward: forwardTo },
        { auth, timeout: 15000 }
      );

      return NextResponse.json({
        success: true,
        mode: "created",
        alias: aliasLocalpart,
        domain,
        forwardTo,
        data: created.data,
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const msg = error?.response?.data || error?.message || "Unknown error";
    console.error("IMPROVMX SET-FORWARD ERROR:", msg);

    return NextResponse.json(
      { success: false, message: "ImprovMX error", error: msg },
      { status: 500 }
    );
  }
}
