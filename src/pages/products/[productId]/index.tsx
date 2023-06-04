import { useRouter } from "next/router";
import Layout from "~/components/ui/Layout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/Select";
import { api } from "~/utils/api";

export default function Product() {
  const router = useRouter();
  const { data: product, isLoading } = api.product.get.useQuery(
    router.query.productId as string,
    {
      enabled: !!router.query.productId,
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Something went wrong</div>;
  }

  return (
    <Layout>
      <main className="flex justify-center">
        <div className="w-full">
          <img
            className="h-full w-full object-cover"
            src="https://picsum.photos/200"
            alt="Product Image"
          />
        </div>
        <div className="w-full">
          <h1>{product.name}</h1>
          <span>$ {product.price}</span>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              {product.availableSizes.map(({ productSize }) => (
                <SelectItem key={productSize.id} value={productSize.id}>
                  {productSize.size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </main>
    </Layout>
  );
}
