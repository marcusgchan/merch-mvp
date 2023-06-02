import { GetServerSideProps } from "next";
import { useFieldArray, useForm } from "react-hook-form";
import { getServerAuthSession } from "~/server/auth";
import { type RouterOutputs } from "~/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { AddProductInput, addProductSchema } from "~/schemas/productManagement";
import { Input } from "~/components/ui/Input";
import { Textarea } from "~/components/ui/TextArea";
import { Button } from "~/components/ui/Button";

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
  return (
    <main className="flex h-full items-center justify-center">
      <Form initialData={null} />
    </main>
  );
}

type FormProps = {
  initialData: RouterOutputs["productManagement"]["get"];
  submitCallback: () => void;
};

function Form({ initialData, submitCallback }: FormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AddProductInput>({
    defaultValues: initialData
      ? { ...initialData, about: [{ id: uuidv4(), description: "" }] }
      : undefined,
    resolver: zodResolver(addProductSchema),
  });

  const { fields, append, remove } = useFieldArray({ control, name: "about" });

  const addField = () => {
    append({ id: uuidv4(), description: "klsda;f" });
  };

  return (
    <form
      className="flex w-full max-w-md flex-col gap-3"
      onSubmit={() => handleSubmit(submitCallback)}
    >
      <h1 className="self-start">Add Product</h1>
      <div>
        <label htmlFor="name">Name</label>
        <Input type="text" id="name" {...register("name")} />
      </div>
      <div>
        <label htmlFor="name">Price</label>
        <Input type="text" id="price" {...register("price")} />
      </div>
      <div className="flex flex-col gap-3">
        <h2>About</h2>
        {fields.map((field, index) => {
          return (
            <Textarea
              key={field.id}
              {...register(`about.${index}.description`)}
            />
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
        <div className="flex">
          <Button type="button" variant="ghost">
            Back
          </Button>
          <Button type="submit">
            Add Product
          </Button>
        </div>
      </div>
    </form>
  );
}
