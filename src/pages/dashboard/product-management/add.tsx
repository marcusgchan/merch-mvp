import { RouterInputs, api } from "~/utils/api";
import {
  AddProduct,
  EditProduct,
  addProductSchema,
} from "~/schemas/productManagement";
import { useRouter } from "next/router";
import { Form } from "~/components/dashboard/ProductForm";

export { getServerSideProps } from "~/utils/serverSideAuth";

export default function Add() {
  const addProduct = api.productManagement.add.useMutation({
    onSuccess() {
      router.push("./");
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
      />
    </main>
  );
}
