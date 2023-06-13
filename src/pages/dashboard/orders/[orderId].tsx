import { createColumnHelper } from "@tanstack/react-table";
import { useRouter } from "next/router";
import FetchResolver from "~/components/ui/FetchResolver";
import Layout from "~/components/ui/Layout";
import { type RouterOutputs, api } from "~/utils/api";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/Table";
import DashboardHeader from "~/components/dashboard/DashboardHeader";

type Order = RouterOutputs["order"]["get"];

export { getServerSideProps } from "~/utils/serverSideAuth";

export default function OrderId() {
  const router = useRouter();
  const orderQuery = api.order.get.useQuery(router.query.orderId as string, {
    enabled: !!router.query.orderId,
    refetchOnWindowFocus: false,
  });

  return (
    <Layout>
      <DashboardHeader />
      <main>
        <article>
          <h2>Order Information</h2>
          <FetchResolver<Order> {...orderQuery}>
            {(order) => {
              return order ? (
                <div>
                  <div>
                    <p>Order ID: {order.id}</p>
                    <p>Status: {order.processingState}</p>
                    <p>Name: {order.name}</p>
                    <p>Email: {order.email}</p>
                    <p>Ordered At: {order.createdAt.toLocaleDateString()}</p>
                  </div>
                  <div>
                   {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <DataTable<OrderedItem, any>
                      columns={columns}
                      data={order.orderedItems}
                    />
                  </div>
                </div>
              ) : (
                <div>Order not found</div>
              );
            }}
          </FetchResolver>
        </article>
      </main>
    </Layout>
  );
}

type OrderedItem = NonNullable<
  RouterOutputs["order"]["get"]
>["orderedItems"][number];

const columnHelper = createColumnHelper<OrderedItem>();

const columns = [
  columnHelper.accessor("product.name", {
    header: "Product Name",
  }),
  columnHelper.accessor("size", {
    header: "Size",
  }),
  columnHelper.accessor("quantity", {
    header: "Quantity",
  }),
  columnHelper.accessor("price", {
    header: "Price",
    cell: (cell) => `$${cell.getValue() * cell.row.original.quantity}`,
  }),
];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
