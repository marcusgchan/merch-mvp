import { type RouterInputs, api } from "~/utils/api";
import {
  type AddProduct,
  type EditProduct,
  addProductSchema,
} from "~/schemas/productManagement";
import { useRouter } from "next/router";
import { Form } from "~/components/dashboard/ProductForm";

export { getServerSideProps } from "~/utils/serverSideAuth";

export default function Add() {
const addProduct = api.productManagement.add.useMutation({
    async onSuccess() {
      await router.push("./");
    },
  });

  const router = useRouter();

  const submitCallback = (
    data: AddProduct | EditProduct,
    sizes: RouterInputs["productManagement"]["add"]["sizes"]
  ) => {
    addProduct.mutate({ ...data, sizes });
  };

  return (
    <main className="flex h-full items-center justify-center">
      <Form
        initialData={null}
        submitCallback={submitCallback}
        schema={addProductSchema}
        isSubmitting={addProduct.isLoading}
      />
    </main>
  );
}
