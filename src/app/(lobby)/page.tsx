import { Shell } from "@/components/shells/shell";

export default function IndexPage() {
  return (
    <Shell className="max-w-6xl pt-0 md:pt-0">
      <section
        id="hero"
        aria-labelledby="hero-heading"
        className="mx-auto flex w-full max-w-[64rem] flex-col items-center justify-center gap-4 py-12 text-center md:pt-32"
      >
        Lobby
      </section>
    </Shell>
  );
}
