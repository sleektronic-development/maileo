import Loader from "@/components/partials/loader";

export default function Loading() {
  return (
    <main className="w-full h-[100svh] flex-center bg-[#212121]">
      <Loader />;
    </main>
  );
}
