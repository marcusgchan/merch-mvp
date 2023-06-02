import Link from "next/link";
import DashboardHeader from "~/components/dashboard/DashboardHeader";
import DashboardLayout from "~/components/dashboard/DashboardLayout";
import { api } from "~/utils/api";

export default function Orders() {
  const { data: products, isLoading } = api.productManagement.getAll.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!products) {
    return <div>Something went wrong</div>;
  }

  return (
    <DashboardLayout>
      <DashboardHeader />
      <main>
        <div className="flex justify-between">
          <h2>Product Management</h2>
          <div>
            <Link href="add" className="rounded bg-violet-400 px-3 py-2">
              Add Product
            </Link>
          </div>
        </div>
        <section className="grid grid-cols-4 gap-3">
          {products.map((product) => (
            <Link
              href={`./${product.id}`}
              key={product.id}
              className="grid h-80 w-full items-center justify-stretch gap-2 rounded border-2 border-accent p-4"
            >
              <img
                className="h-full w-full object-cover"
                src="https://picsum.photos/200"
                alt="Product Image"
              />
              <h3>{product.name}</h3>
              <span>$ {product.price}</span>
            </Link>
          ))}
        </section>
      </main>
    </DashboardLayout>
  );
}
