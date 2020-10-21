import React, { useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
const CartModal = dynamic(
  () => import('@/components/CartModal'),
  { loading: () => <p>Loading...</p> }
)

const product = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const handleAddToCart = () => {
    setModalVisible(true);
  };

  return (
    <div>
      <h1>{router.query.slug}</h1>
      
      <button onClick={handleAddToCart}>Add to card</button>

      {modalVisible && <CartModal />}
    </div>
  );
}

export default product;
