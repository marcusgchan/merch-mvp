import { GetServerSideProps } from "next";
import { useFieldArray, useForm } from "react-hook-form";
import { getServerAuthSession } from "~/server/auth";
import { api, type RouterOutputs } from "~/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { AddProductInput, addProductSchema } from "~/schemas/productManagement";
import { Input } from "~/components/ui/Input";
import { Textarea } from "~/components/ui/TextArea";
import { Button } from "~/components/ui/Button";
import { FieldValidation } from "~/components/ui/FieldValidation";
import { useRouter } from "next/router";
import { Minus } from "lucide-react";

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
  const addProduct = api.productManagement.add.useMutation();
  const router = useRouter();

  const submitCallback = (data: AddProductInput) => {
    addProduct.mutate(data);
    router.push("./");
  };

  return (
    <main className="flex h-full items-center justify-center">
      <Form initialData={null} submitCallback={submitCallback} />
    </main>
  );
}

type FormProps<TSubmitData> = {
  initialData: RouterOutputs["productManagement"]["get"];
  submitCallback: (data: TSubmitData) => void;
};

function Form({ initialData, submitCallback }: FormProps<AddProductInput>) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AddProductInput>({
    defaultValues: initialData ? initialData : undefined,
    resolver: zodResolver(addProductSchema),
  });

  const { fields, append, remove } = useFieldArray({ control, name: "about" });

  const addField = () => {
    append({ id: uuidv4(), description: "" });
  };

  const router = useRouter();

  return (
    <form
      className="flex w-full max-w-md flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(submitCallback)();
      }}
    >
      <h1 className="self-start">Add Product</h1>
      <div className="grid gap-2">
        <label htmlFor="name">Name</label>
        <FieldValidation error={errors.name}>
          <Input type="text" id="name" {...register("name")} />
        </FieldValidation>
      </div>
      <div className="grid gap-2">
        <label htmlFor="price">Price</label>
        <FieldValidation error={errors.price}>
          <Input id="price" type="text" {...register("price")} />
        </FieldValidation>
      </div>
      <div className="grid gap-2">
        <h2>About</h2>
        <div className="grid gap-4">
          {fields.map((field, index) => {
            return (
              <div key={field.id} className="flex gap-2 items-center">
                <FieldValidation error={errors.about?.[index]?.description}>
                  <Textarea
                    key={field.id}
                    className="max-h-[8rem] min-h-[4rem] resize-none"
                    {...register(`about.${index}.description`)}
                  />
                </FieldValidation>
                <Button variant="ghost" onClick={() => remove(index)}>
                  <Minus />
                </Button>
              </div>
            );
          })}
          <Button
            type="button"
            variant="outline"
            onClick={addField}
            className="w-full"
          >
            Add Bullet Point
          </Button>
        </div>
      </div>
      <div className="flex justify-end gap-5">
        <Button
          type="button"
          variant="destructive"
          onClick={() => router.push("./")}
        >
          Back
        </Button>
        <Button type="submit">Add Product</Button>
      </div>
    </form>
  );
}
