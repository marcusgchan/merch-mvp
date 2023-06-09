import { type NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          SSSS Merch Store
        </h1>
        <div>
          <Link href="/products" className="text-white rounded bg-violet-400 py-2 px-3">Store</Link>
        </div>
      </div>
    </main>
  );
};

export default Home;
