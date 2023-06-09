import { ColumnDef } from "@tanstack/react-table";
import DashboardHeader from "~/components/dashboard/DashboardHeader";
import Layout from "~/components/ui/Layout";
import { RouterOutputs, api } from "~/utils/api";
import {
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

export { getServerSideProps } from "~/utils/serverSideAuth";

export default function Orders() {
  const { data: orders, isLoading } = api.order.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!orders) {
    return <div>Something went wrong</div>;
  }

  return (
    <Layout>
      <DashboardHeader />
      <main>
        <h2>Orders</h2>
        <section>
          <div className="container mx-auto py-10">
            <DataTable columns={columns} data={orders} />
          </div>
        </section>
      </main>
    </Layout>
  );
}

type Order = Pick<
  RouterOutputs["order"]["getAll"][number],
  "id" | "name" | "email" | "count" | "createdAt"
>;

const columns: ColumnDef<Order>[] = [
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Count",
    accessorKey: "count",
  },
  {
    header: "Created At",
    accessorKey: "createdAt",
  },
];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
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
