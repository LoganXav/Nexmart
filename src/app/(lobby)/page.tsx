import { Shell } from "@/components/shells/shell";
import { Balancer } from "react-wrap-balancer";

export default function IndexPage() {
  return (
    <Shell className="max-w-6xl pt-0 md:pt-0">
      <section
        id="hero"
        aria-labelledby="hero-heading"
        className="mx-auto flex w-full max-w-[64rem] flex-col items-center justify-center gap-4 py-12 text-center md:pt-32"
      >
        <Balancer
          as="h1"
          className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Nexmart Lobby
        </Balancer>
        <Balancer className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Built with Nextjs, Typescript, Zod, Radix UI 
        </Balancer>
      </section>
    </Shell>
  );
}
