import Link from "next/link";
import Layout from "~/components/ui/Layout";
import { RouterOutputs, api } from "~/utils/api";

export default function Products() {
  const { data: products, isLoading } = api.product.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!products) {
    return <h1>Something went wrong</h1>;
  }

  return (
    <Layout>
      <main>
        <h1>Products</h1>
        <section className="grid grid-cols-4 gap-3">
          {products.map((product) => (
            <Product key={product.id} {...product} />
          ))}
        </section>
      </main>
    </Layout>
  );
}

function Product({
  id,
  name,
  price,
}: RouterOutputs["product"]["getAll"][number]) {
  return (
    <Link
      href={`./${id}`}
      key={id}
      className="grid h-80 w-full items-center justify-stretch gap-2 rounded border-2 border-accent p-4"
    >
      <img
        className="h-full w-full object-cover"
        src="https://picsum.photos/200"
        alt="Product Image"
      />
      <h3>{name}</h3>
      <span>$ {price}</span>
    </Link>
  );
}
