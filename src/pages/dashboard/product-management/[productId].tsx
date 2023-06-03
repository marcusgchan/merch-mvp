import { useRouter } from "next/router";
import DashboardHeader from "~/components/dashboard/DashboardHeader";
import DashboardLayout from "~/components/dashboard/DashboardLayout";
import { Form } from "~/components/dashboard/ProductForm";
import { editProductSchema } from "~/schemas/productManagement";
import { RouterInputs, api } from "~/utils/api";

export default function Product() {
  const router = useRouter();

  const productId = router.query.productId as string | undefined;

  const { data: product, isLoading } = api.productManagement.get.useQuery(
    productId as string,
    { enabled: !!productId, refetchOnWindowFocus: false }
  );

  const editProduct = api.productManagement.edit.useMutation({
    onSuccess() {
      router.push("./");
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Something went wrong</div>;
  }

  const submitCallback = (
    data:
      | RouterInputs["productManagement"]["add"]
      | RouterInputs["productManagement"]["edit"]
  ) => {
    editProduct.mutate({
      ...data,
      id: product.id,
      updatedAt: product.updatedAt,
    });
  };

  return (
    <DashboardLayout>
      <DashboardHeader />
      <main className="flex justify-center">
        <Form
          initialData={product}
          schema={editProductSchema}
          submitCallback={submitCallback}
        />
      </main>
    </DashboardLayout>
  );
}
