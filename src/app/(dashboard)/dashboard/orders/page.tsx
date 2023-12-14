import { env } from "@/env.mjs";
import { Metadata } from "next";
import { ordersSearchParamsSchema } from "@/lib/validations/params";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getUserEmail } from "@/lib/utils";
import { orders, type Order } from "@/db/schema";
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { Shell } from "@/components/shells/shell";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { OrdersTableShell } from "@/components/shells/orders-table-shell";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Orders",
  description: "Manage your purchases",
};

interface OrdersPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const { page, per_page, sort, status } =
    ordersSearchParamsSchema.parse(searchParams);

  const user = await currentUser();

  if (!user) {
    redirect("/signin");
  }

  const email = getUserEmail(user);

  // CHECK -- for invalid page numbers
  const pageAsNumber = Number(page);
  const fallbackPage =
    isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber;

  // Number of items per page
  const perPageAsNumber = Number(per_page);
  const limit = isNaN(perPageAsNumber) ? 10 : perPageAsNumber;

  // Number of items to skip
  const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0;

  // Column and order to sort by
  const [column, order] = (sort?.split(".") as [
    keyof Order | undefined,
    "asc" | "desc" | undefined
  ]) ?? ["createdAt", "desc"];

  const statuses = typeof status === "string" ? status.split(".") : [];

  // Transaction so both queries are executed in a single transaction
  const { items, count } = await db.transaction(async (tx) => {
    const items = await tx
      .select({
        id: orders.id,
        email: orders.email,
        items: orders.items,
        amount: orders.amount,
        status: orders.stripePaymentIntentStatus,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .limit(limit)
      .offset(offset)
      .where(
        and(
          eq(orders.email, email),
          // Filter by status
          statuses.length > 0
            ? inArray(orders.stripePaymentIntentStatus, statuses)
            : undefined
        )
      )
      .orderBy(
        column && column in orders
          ? order === "asc"
            ? asc(orders[column])
            : desc(orders[column])
          : desc(orders.createdAt)
      );

    const count = await tx
      .select({
        count: sql<number>`count(*)`,
      })
      .from(orders)
      .where(
        and(
          eq(orders.email, email),

          // Filter by status
          statuses.length > 0
            ? inArray(orders.stripePaymentIntentStatus, statuses)
            : undefined
        )
      )
      .then((res) => res[0]?.count ?? 0);

    return {
      items,
      count,
    };
  });

  const pageCount = Math.ceil(count / limit);

  return (
    <Shell variant="sidebar">
      <PageHeader
        id="dashboard-orders-header"
        aria-labelledby="dashboard-orders-header-heading"
        separated
      >
        <PageHeaderHeading size="sm">Orders</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Manage your purchases
        </PageHeaderDescription>
      </PageHeader>
      <OrdersTableShell data={items} pageCount={pageCount} />
    </Shell>
  );
}
