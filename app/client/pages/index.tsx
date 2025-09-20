import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/cart',
      permanent: false,
    },
  };
};

export default function Index() {
  return null;
}