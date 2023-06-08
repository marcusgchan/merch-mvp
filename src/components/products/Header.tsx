import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export default function Header() {
  return (
    <header className="flex justify-between">
      <h1>SSSS Merch Store</h1>
      <div className="flex gap-2">
        <nav>
          <ul className="flex gap-2">
            <li>
              <Link href="/products">Products</Link>
            </li>
            <li>
              <Link href="/products/cart">
                <ShoppingCart />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
