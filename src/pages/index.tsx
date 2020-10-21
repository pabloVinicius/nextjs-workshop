import SEO from '@/components/SEO';
import { GetServerSideProps } from 'next';
import { Title } from '../styles/pages/Home';

interface IProduct {
  id: string;
  title: string;
}

interface HomeProps {
  recommendedProducts: IProduct[];
}

export default function Home({ recommendedProducts }: HomeProps ) {
  const handleSum = async () => {
    const math = (await import('../lib/math')).default;

    console.log(math.sum(2,5));
  }

  return (
   <div>
     <SEO title="teste" />
     <section>
       <Title>Products</Title>
       <ul>
         {recommendedProducts.map(product => (
           <li key={product.id}>
             {product.title}
           </li>
         ))}
       </ul>

       <button onClick={handleSum}>SUM</button>
     </section>
   </div>
  )
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {

  const response = await fetch('http://localhost:3333/recommended');
  const recommendedProducts = await response.json();
 

  return {
    props: {
      recommendedProducts,
    },
  }
}
