import { useRouter } from "next/router";
import DashboardHeader from "~/components/dashboard/DashboardHeader";
import DashboardLayout from "~/components/dashboard/DashboardLayout";
import { api } from "~/utils/api";

export default function Product() {
  const router = useRouter();

  const productId = router.query.productId as string | undefined;

  const { data: product, isLoading } = api.productManagement.get.useQuery(
    productId as string,
    { enabled: !!productId }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Something went wrong</div>;
  }

  return (
    <DashboardLayout>
      <DashboardHeader />
      <main></main>
    </DashboardLayout>
  );
}
