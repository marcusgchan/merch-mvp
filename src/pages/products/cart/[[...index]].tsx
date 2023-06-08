import { useAtomValue, useSetAtom } from "jotai";
import {
  cartAtom,
  removeFromCartAtom,
  updateCartItemQuantityAtom,
} from "~/components/cartStore";
import Header from "~/components/products/Header";
import { Input } from "~/components/ui/Input";
import Layout from "~/components/ui/Layout";
import { Trash2 } from "lucide-react";

export default function Index() {
  const cart = useAtomValue(cartAtom);

  const setQuantity = useSetAtom(updateCartItemQuantityAtom);
  const handleQuantityChange = (id: string, quantity: number) =>
    setQuantity({ id, quantity });

  const removeFromCart = useSetAtom(removeFromCartAtom);
  const handleRemove = (id: string) => removeFromCart({ id });

  return (
    <Layout>
      <Header />
      <main>
        <h2>Cart</h2>
        <ul>
          {cart.map((item) => {
            return (
              <li key={item.id} className="flex items-center gap-4">
                <div className="h-20 w-20 bg-gray-200"></div>
                <ul>
                  <li>Name: {item.name}</li>
                  {!!item.size && <li>Size: {item.size}</li>}
                  <li className="flex items-center gap-2">
                    <label>Quantity:</label>
                    <Input
                      type="number"
                      className="w-16"
                      min={1}
                      onChange={(e) =>
                        handleQuantityChange(item.id, e.target.valueAsNumber)
                      }
                      value={item.quantity}
                    />
                  </li>
                </ul>
                <button className="h-min" onClick={() => handleRemove(item.id)}>
                  <Trash2 />
                </button>
              </li>
            );
          })}
        </ul>
      </main>
    </Layout>
  );
}
