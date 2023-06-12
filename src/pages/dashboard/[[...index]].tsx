import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import DashboardHeader from "~/components/dashboard/DashboardHeader";
import Layout from "~/components/ui/Layout";
import { type RouterOutputs, api } from "~/utils/api";
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
import { useState } from "react";
import { Button } from "~/components/ui/Button";
import FetchResolver from "~/components/ui/FetchResolver";

export { getServerSideProps } from "~/utils/serverSideAuth";

type ProcessState = "processing" | "processed";
type Orders = RouterOutputs["order"]["getAll"];

export default function Orders() {
  const [processingState, setProcessState] =
    useState<ProcessState>("processing");
  const handleProcessState = () =>
    setProcessState((prev) => {
      if (prev === "processing") {
        return "processed";
      }

      return "processing";
    });
  const orderResponse = api.order.getAll.useQuery(
    { processingState: processingState },
    {
      refetchOnWindowFocus: false,
    }
  );

  return (
    <Layout>
      <DashboardHeader />
      <main>
        <div className="flex justify-between">
          <h2>Orders</h2>
          <Button
            onClick={handleProcessState}
            variant="outline"
            className="capitalize"
          >
            {processingState.toLowerCase()}
          </Button>
        </div>
        <section>
          <div className="py-10">
            <FetchResolver<Orders> {...orderResponse}>
              {(data) => {
                return <DataTable columns={columns} data={data} />;
              }}
            </FetchResolver>
          </div>
        </section>
      </main>
    </Layout>
  );
}

type Order = Pick<
  RouterOutputs["order"]["getAll"][number],
  "id" | "name" | "email" | "count" | "processingState" | "createdAt"
>;

const columnHelper = createColumnHelper<Order>();

const columns = [
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Number of Items",
    accessorKey: "count",
  },
  {
    header: "Processing State",
    accessorKey: "processingState",
  },
  columnHelper.accessor("createdAt", {
    id: "createdAt",
    cell: (row) => row.getValue().toLocaleDateString(),
    header: "Created At",
  }),
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
