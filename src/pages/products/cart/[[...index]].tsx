import { useAtomValue, useSetAtom } from "jotai";
import {
  CartItem,
  cartAtom,
  clearCartAtom,
  removeFromCartAtom,
  updateCartItemQuantityAtom,
} from "~/components/cartStore";
import Header from "~/components/products/Header";
import { Input } from "~/components/ui/Input";
import Layout from "~/components/ui/Layout";
import { Trash2 } from "lucide-react";
import { Button } from "~/components/ui/Button";
import {
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/Dialog";
import dynamic from "next/dynamic";
import { api } from "~/utils/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type AddFormOrder, addFormOrderSchema } from "~/schemas/order";
import { FieldValidation } from "~/components/ui/FieldValidation";
import { useToast } from "~/components/ui/useToast";
import { useState } from "react";
import Image from "next/image";

// Prevent Nextjs hydration warning
const ClientSideDialog = dynamic(
  () => import("~/components/ui/Dialog").then((mod) => mod.Dialog),
  {
    ssr: false,
  }
);

export default function Index() {
  const cart = useAtomValue(cartAtom);
  const clearCart = useSetAtom(clearCartAtom);

  const setQuantity = useSetAtom(updateCartItemQuantityAtom);
  const handleQuantityChange = (id: string, quantity: number) =>
    setQuantity({ id, quantity });

  const removeFromCart = useSetAtom(removeFromCartAtom);
  const handleRemove = (id: string) => removeFromCart({ id });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: products, isLoading } = api.product.getAll.useQuery(undefined);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddFormOrder>({
    resolver: zodResolver(addFormOrderSchema),
    defaultValues: { name: "", email: "" },
  });

  const { toast } = useToast();
  const placeOrderMutation = api.order.add.useMutation({
    onSuccess() {
      toast({ title: "Order placed" });
      clearCart();
      reset();
      setIsModalOpen(false);
    },
    onError(error) {
      if (error.data?.code && error.data.code === "CONFLICT") {
        toast({
          title: "Failed to place order",
          description: "This product no longer exist",
        });
      } else {
        toast({ title: "Failed to place order" });
      }
    },
  });
  const placeOrder = handleSubmit((data) =>
    placeOrderMutation.mutate({ ...data, products: cart })
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!products) {
    return <p>Failed to load products</p>;
  }

  const productPriceMap = new Map(products.map((p) => [p.id, p.price]));

  return (
    <Layout>
      <Header />
      <main>
        <h2>Cart</h2>
        <section className="grid grid-cols-2 gap-4">
          {cart.length ? (
            <ul>
              {cart.map((item) => {
                const productId = item.size ? item.id.split("-")[0] : item.id;
                return (
                  <CartItem
                    key={item.id}
                    price={productPriceMap.get(productId as string)}
                    {...item}
                    handleRemove={handleRemove}
                    handleQuantityChange={handleQuantityChange}
                  />
                );
              })}
            </ul>
          ) : (
            <p>Cart is empty</p>
          )}
          <div>
            <h2>Checkout</h2>
            <ClientSideDialog
              open={isModalOpen}
              onOpenChange={(e) => setIsModalOpen(e)}
            >
              <DialogTrigger asChild>
                <Button variant="outline" disabled={cart.length === 0}>
                  Place Order
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Place Order</DialogTitle>
                <form className="grid gap-4" onSubmit={placeOrder}>
                  <div className="grid gap-2">
                    <label htmlFor="name">Name</label>
                    <FieldValidation error={errors.name}>
                      <Input id="name" {...register("name")} />
                    </FieldValidation>
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="email">Email</label>
                    <FieldValidation error={errors.email}>
                      <Input id="email" {...register("email")} />
                    </FieldValidation>
                  </div>
                  <Button type="submit" disabled={placeOrderMutation.isLoading}>
                    Place Order
                  </Button>
                </form>
              </DialogContent>
            </ClientSideDialog>
          </div>
        </section>
      </main>
    </Layout>
  );
}

type CartItemProps = CartItem & {
  price: number | undefined;
  handleQuantityChange: (id: string, quantity: number) => void;
  handleRemove: (id: string) => void;
};

function CartItem({
  id,
  name,
  size,
  price,
  quantity,
  imageLink,
  handleQuantityChange,
  handleRemove,
}: CartItemProps) {
  return (
    <li className="flex items-center gap-4">
      <div className="h-20 w-20 bg-gray-200">
        <Image
          priority={true}
          width={500}
          height={500}
          className="h-full w-full object-cover"
          src={imageLink}
          alt={name}
        />
      </div>
      <ul>
        <li>Name: {name}</li>
        {!!size && <li>Size: {size}</li>}
        <li className="flex items-center gap-2">
          <label>Quantity:</label>
          <Input
            type="number"
            className="w-16"
            min={1}
            onChange={(e) => handleQuantityChange(id, e.target.valueAsNumber)}
            value={quantity}
          />
        </li>
      </ul>
      {price ? (
        <span>$ {price * quantity}</span>
      ) : (
        <span>This product is no longer sold</span>
      )}
      <button className="h-min" onClick={() => handleRemove(id)}>
        <Trash2 />
      </button>
    </li>
  );
}
