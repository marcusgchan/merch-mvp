import { GetServerSideProps } from "next";
import { getServerAuthSession } from "~/server/auth";

export const getServerSideProps: GetServerSideProps<{}> = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  if (!session) {
    return {
      redirect: {
        destination: `/api/auth/signin/?callback=${
          ctx.req.url ?? "/dashboard"
        }`,
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};
