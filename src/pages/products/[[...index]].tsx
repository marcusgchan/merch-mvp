import Link from "next/link";
import Header from "~/components/products/Header";
import FetchResolver from "~/components/ui/FetchResolver";
import Layout from "~/components/ui/Layout";
import { type RouterOutputs, api } from "~/utils/api";

type Products = RouterOutputs["product"]["getAll"];

export default function Products() {
  const productsQuery = api.product.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  return (
    <Layout>
      <Header />
      <main>
        <h1>Products</h1>
        <section className="grid grid-cols-4 gap-3">
          <FetchResolver<Products> {...productsQuery}>
            {(products) =>
              products.map((product) => (
                <Product key={product.id} {...product} />
              ))
            }
          </FetchResolver>
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
      className="grid h-full w-full items-center justify-stretch gap-2 rounded border-2 border-accent p-4"
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
