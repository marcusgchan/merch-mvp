import Link from "next/link";

export default function Orders() {
  return (
    <div>
      <nav className="flex justify-between">
        <h1>Dashboard</h1>
        <ul className="flex gap-2">
          <li>
            <Link href="/dashboard">Orders</Link>
          </li>
          <li>
            <Link href="product-management">Product Management</Link>
          </li>
        </ul>
      </nav>
      <main>
        <h2>Orders</h2>
        <section></section>
      </main>
    </div>
  );
}
