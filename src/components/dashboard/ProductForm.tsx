import { Minus } from "lucide-react";
import { Button } from "../ui/Button";
import { FieldValidation } from "../ui/FieldValidation";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/TextArea";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AddProductInput,
  EditProductInput,
  addProductSchema,
  editProductSchema,
} from "~/schemas/productManagement";
import { useFieldArray, useForm } from "react-hook-form";
import { RouterInputs, RouterOutputs } from "~/utils/api";
import { v4 as uuidv4 } from "uuid";

export type FormProps = {
  initialData: RouterOutputs["productManagement"]["get"];
  schema: typeof addProductSchema | typeof editProductSchema;
  submitCallback: (
    data:
      | RouterInputs["productManagement"]["edit"]
      | RouterInputs["productManagement"]["add"]
  ) => void;
};

export function Form({ initialData, schema, submitCallback }: FormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AddProductInput | EditProductInput>({
    defaultValues: initialData
      ? { ...initialData, about: initialData.aboutProducts }
      : undefined,
    values: initialData
      ? { ...initialData, about: initialData.aboutProducts }
      : undefined,
    resolver: zodResolver(schema),
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
      <h1 className="self-start">
        {initialData ? "Edit Product" : "Add Product"}
      </h1>
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
              <div key={field.id} className="flex items-center gap-2">
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
        <Button type="submit">
          {initialData ? "Edit Product" : "Add Product"}
        </Button>
      </div>
    </form>
  );
}
