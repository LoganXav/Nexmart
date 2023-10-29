// import { SiteFooter } from "@/components/layouts/site-footer"
import { SiteHeader } from "@/components/layouts/site-header";

export default async function LobbyLayout({
  children,
}: React.PropsWithChildren) {
  const user = {
    firstName: "Logan",
    lastName: "X",
    username: "lxgn",
    imageUrl: "Segun",
    email: "lxgn@example.com",
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader user={user} />
      <main className="flex-1">{children}</main>
      {/* <SiteFooter /> */}
    </div>
  );
}
