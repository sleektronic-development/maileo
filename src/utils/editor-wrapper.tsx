"use client";

import dynamic from "next/dynamic";

import Loader from "@/components/partials/loader";

const EmailComposer = dynamic(
  () => import("../components/partials/email-composer"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[calc(100svh-90px)] flex-center">
        <Loader />
      </div>
    ),
  }
);

export default function EditorWrapper() {
  return <EmailComposer />;
}
