import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';
import { useRouter } from 'next/router';

interface IProduct {
  id: string;
  title: string;
}

interface CategoryProps {
  products: IProduct[];
}


const category = () => {

  const router = useRouter();

  if (router.isFallback) {
    return (
      <span>Loading...</span>
    )
  }

  return (
    <div>
      {router.query.slug}
    </div>
  );
}

export default category;

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch(`http://localhost:3333/categories`);
  const categories = await response.json();

  const paths = categories.map(category => ({
    params: { slug: category.id }
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<CategoryProps> = async (context) => {

  const { slug } = context.params;

  const response = await fetch(`http://localhost:3333/products?category_id=${slug}`);
  const products = await response.json();
 

  return {
    props: {
      products,
    },
    revalidate: 60
  }
};
