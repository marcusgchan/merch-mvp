import Link from "next/link";

export default function DashboardHeader() {
  return (
    <header className="flex justify-between">
      <h1>Dashboard</h1>
      <nav>
        <ul className="flex gap-2">
          <li>
            <Link href="/dashboard">Orders</Link>
          </li>
          <li>
            <Link href=".">Product Management</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
