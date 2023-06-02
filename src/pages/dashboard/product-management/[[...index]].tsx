import Link from "next/link";

export default function Orders() {
  return (
    <div className="flex flex-col gap-3">
      <nav className="flex justify-between">
        <h1>Dashboard</h1>
        <ul className="flex gap-2">
          <li>
            <Link href="/dashboard">Orders</Link>
          </li>
          <li>
            <Link href=".">Product Management</Link>
          </li>
        </ul>
      </nav>
      <main>
        <div className="flex justify-between">
          <h2>Product Management</h2>
          <div>
            <Link href="add" className="bg-violet-400 py-2 px-3 rounded">Add Product</Link>
          </div>
        </div>
        <section></section>
      </main>
    </div>
  );
}
