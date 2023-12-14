"use client";

import * as React from "react";
import { type Order } from "@/db/schema";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../data-table/data-table";
import {
  getStripePaymentStatusColor,
  stripePaymentStatuses,
} from "@/lib/checkout";
import { DataTableColumnHeader } from "../data-table/data-table-column-header";
import { cn, formatId, formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { StripePaymentStatus } from "@/types";
import { checkoutItemSchema } from "@/lib/validations/cart";
import { z } from "zod";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Button } from "../ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

export type CuratedOrder = Pick<
  Order,
  "id" | "email" | "items" | "amount" | "createdAt"
> & {
  status: string;
};

interface OrdersTableShellProps {
  data: CuratedOrder[];
  pageCount: number;
}

export function OrdersTableShell({ data, pageCount }: OrdersTableShellProps) {
  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo<ColumnDef<CuratedOrder, unknown>[]>(
    () => [
      {
        accessorKey: "id",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Order ID" />
        ),
        cell: ({ cell }) => {
          return <span>{formatId(Number(cell.getValue()))}</span>;
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Payment Status" />
        ),
        cell: ({ cell }) => {
          return (
            <Badge
              variant="outline"
              className={cn(
                "pointer-events-none text-sm capitalize text-white font-normal",
                getStripePaymentStatusColor({
                  status: cell.getValue() as StripePaymentStatus,
                  shade: 600,
                })
              )}
            >
              {String(cell.getValue())}
            </Badge>
          );
        },
      },
      {
        accessorKey: "items",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Quantity" />
        ),
        cell: ({ cell }) => {
          const safeParsedItems = z
            .array(checkoutItemSchema)
            .safeParse(JSON.parse(cell.getValue() as string));

          return (
            <span>
              {safeParsedItems.success
                ? safeParsedItems.data.reduce(
                    (acc, item) => acc + item.quantity,
                    0
                  )
                : 0}
            </span>
          );
        },
      },
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Amount" />
        ),
        cell: ({ cell }) => formatPrice(cell.getValue() as number),
      },

      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Created At" />
        ),
        cell: ({ cell }) => formatDate(cell.getValue() as Date),
        enableColumnFilter: false,
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
              >
                <DotsHorizontalIcon className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/orders/${row.original.id}`}>
                  Order details
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    []
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      pageCount={pageCount}
      filterableColumns={[
        {
          id: "status",
          title: "Status",
          options: stripePaymentStatuses,
        },
      ]}
    />
  );
}
