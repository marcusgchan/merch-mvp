import { GetServerSideProps } from "next";
import { getServerAuthSession } from "~/server/auth";
import { RouterInputs, api } from "~/utils/api";
import {
  addProductSchema,
} from "~/schemas/productManagement";
import { useRouter } from "next/router";
import { Form } from "~/components/dashboard/ProductForm";

export const getServerSideProps: GetServerSideProps<{}> = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  if (!session) {
    return {
      redirect: {
        destination:
          "/api/auth/signin?callbackUrl=/dashboard/product-management/add",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

export default function Add() {
  const addProduct = api.productManagement.add.useMutation({
    onSuccess() {
      router.push("./");
    },
  });

  const router = useRouter();

  const submitCallback = (
    data:
      | RouterInputs["productManagement"]["add"]
      | RouterInputs["productManagement"]["edit"]
  ) => {
    addProduct.mutate(data);
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
