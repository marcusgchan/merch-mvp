import { Minus } from "lucide-react";
import { Button } from "../ui/Button";
import { FieldValidation } from "../ui/FieldValidation";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/TextArea";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type AddProduct,
  type EditProduct,
  type addProductSchema,
  type editProductSchema,
} from "~/schemas/productManagement";
import { useFieldArray, useForm } from "react-hook-form";
import { type RouterInputs, type RouterOutputs, api } from "~/utils/api";
import { v4 as uuidv4 } from "uuid";
import { Checkbox } from "../ui/Checkbox";
import { type CheckedState } from "@radix-ui/react-checkbox";

export type FormProps = {
  initialData: RouterOutputs["productManagement"]["get"];
  schema: typeof addProductSchema | typeof editProductSchema;
  submitCallback: (
    data: AddProduct | EditProduct,
    sizes: RouterInputs["productManagement"]["add"]["sizes"]
  ) => void;
};

export function Form({ initialData, schema, submitCallback }: FormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AddProduct | EditProduct>({
    defaultValues: initialData
      ? {
          ...initialData,
          about: initialData.aboutProducts,
          sizes: initialData.availableSizes,
        }
      : undefined,
    resolver: zodResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "about",
    keyName: "key",
  });

  const addField = () => {
    append({ id: uuidv4(), description: "" });
  };

  const archiveProduct = api.productManagement.archive.useMutation({
    async onSuccess() {
      await router.push("./");
    },
  });

  const handleArchiveProduct = () => {
    if (!initialData) return;
    archiveProduct.mutate(initialData.id);
  };

  const unarchiveProduct = api.productManagement.unarchive.useMutation({
    async onSuccess() {
      await router.push("./");
    },
  });

  const handleUnarchiveProduct = () => {
    if (!initialData) return;
    unarchiveProduct.mutate(initialData.id);
  };

  const router = useRouter();

  const { data: allSizes, isLoading: allSizesIsLoading } =
    api.productManagement.getAllSizes.useQuery(undefined, {
      refetchOnWindowFocus: false,
    });

  const {
    fields: sizes,
    append: appendSizes,
    remove: removeSizes,
  } = useFieldArray({
    control,
    name: "sizes",
    keyName: "key",
  });

  const handleChecked = (
    checkedState: CheckedState,
    id: string,
    size: string,
    index: number
  ) => {
    if (checkedState === "indeterminate" || index === -1) return;

    if (checkedState) {
      appendSizes({ id, size: size });
    } else {
      removeSizes(index);
    }
  };

  if (allSizesIsLoading) {
    return <div>Loading...</div>;
  }

  if (!allSizes) {
    return <div>Something went wrong</div>;
  }

  return (
    <form
      className="flex w-full max-w-md flex-col gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        await handleSubmit((data) => submitCallback(data, sizes))();
      }}
    >
      <div className="flex items-center justify-between">
        <h2 className="self-start">
          {initialData ? "Edit Product" : "Add Product"}
        </h2>
        {initialData && !initialData.archived && (
          <Button
            onClick={handleArchiveProduct}
            type="button"
            variant="destructive"
          >
            Archive
          </Button>
        )}
        {initialData && initialData.archived && (
          <Button
            onClick={handleUnarchiveProduct}
            type="button"
            variant="destructive"
          >
            Unarchive
          </Button>
        )}
      </div>
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
      <h3>Sizes</h3>
      <div className="grid grid-cols-3 gap-2">
        {allSizes.map(({ id, size }) => {
          return (
            <div key={id} className="flex items-center gap-1">
              <label htmlFor={id}>{size}</label>
              <Checkbox
                checked={sizes.some((size) => size.id === id)}
                onCheckedChange={(e) =>
                  handleChecked(
                    e,
                    id,
                    size,
                    allSizes.findIndex((size) => size.id === id)
                  )
                }
              />
            </div>
          );
        })}
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
