import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const fromName = String(formData.get("fromName") || "");
    const fromEmail = String(formData.get("fromEmail") || "");
    const to = String(formData.get("to") || "");
    const subject = String(formData.get("subject") || "");
    const html = String(formData.get("html") || "");
    const forwardTo = String(formData.get("forwardTo") || "");
    const replyTo = String(formData.get("replyTo") || "");

    const cc = formData.getAll("cc[]").map(String);
    const bcc = formData.getAll("bcc[]").map(String);
    const attachments = [
      ...formData.getAll("attachments"),
      ...formData.getAll("attachments[]"),
    ].filter((attachment): attachment is File => attachment instanceof File);

    if (!fromEmail || !to || !subject || !html) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const MAIL_API_URL = process.env.MAIL_API_URL;

    if (!MAIL_API_URL) {
      return NextResponse.json(
        { error: "MAIL_API_URL not configured" },
        { status: 500 },
      );
    }

    // Forward all fields to mailer API
    const payload = new FormData();

    payload.append("fromName", fromName);
    payload.append("fromEmail", fromEmail);
    payload.append("to", to);
    payload.append("subject", subject);
    payload.append("html", html);

    if (forwardTo) {
      payload.append("forwardTo", forwardTo);
    }

    if (replyTo) {
      payload.append("replyTo", replyTo);
    }

    cc.forEach((email) => payload.append("cc[]", email));
    bcc.forEach((email) => payload.append("bcc[]", email));
    attachments.forEach((attachment) => {
      payload.append("attachments", attachment, attachment.name);
    });

    console.log("SEND ROUTE ATTACHMENTS:", {
      count: attachments.length,
      files: attachments.map((attachment) => ({
        name: attachment.name,
        size: attachment.size,
        type: attachment.type,
      })),
    });

    const res = await fetch(`${MAIL_API_URL}/api/send-email`, {
      method: "POST",
      body: payload,
    });

    const text = await res.text();

    if (!res.ok) {
      console.error("MAIL API ERROR:", text);

      return NextResponse.json(
        { error: "Mail delivery failed", details: text },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const details = err instanceof Error ? err.message : String(err);

    console.error("SEND ERROR:", err);

    return NextResponse.json(
      { error: "Internal server error", details },
      { status: 500 },
    );
  }
}
