import { formatMoney } from '../../utils/money';
import dayjs from 'dayjs';
import { DeliveryOptions } from './DeliveryOptions';
import { useState } from 'react';
import axios from 'axios';

export function CartItemDetails({ cartItem, selectedDeliveryOption, deliveryOptions, loadCart, deleteCartItem }) {
      const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);
      const [quantity ,setQuantity] = useState(cartItem.quantity)
  const handleQuantityKeyDown = (event) => {
    const keyPressed = event.key;

    if (keyPressed === 'Enter') {
      updateQuantity();

    } else if (keyPressed === 'Escape') {
      setQuantity(cartItem.quantity);
      setIsUpdatingQuantity(false);
    }
  };
  const updateQuantity = async () => {
    // Switch between true and false for isUpdatingQuantity.
    if (isUpdatingQuantity) {
       await axios.put(`/api/cart-items/${cartItem.productId}`, {
        quantity: Number(quantity),
      });
      await loadCart();
      setIsUpdatingQuantity(false);
    } else {
      setIsUpdatingQuantity(true);
    }
  };

  return (
    <div key={cartItem.productId} className="cart-item-container">
                <div className="delivery-date">
                  Delivery date: {dayjs(selectedDeliveryOption.estimatedDeliveryTimeMs).format('dddd, MMMM D')}
                </div>
    
                <div className="cart-item-details-grid">
                  <img className="product-image"
                    src={cartItem.product.image} />
    
                  <div className="cart-item-details">
                    <div className="product-name">
                      {cartItem.product.name}
                    </div>
                    <div className="product-price">
                      {formatMoney(cartItem.product.priceCents)}
                    </div>
                    <div className="product-quantity">
                      <input type="text" className='input-product-quantity'
                      onKeyDown={handleQuantityKeyDown}
                      value={quantity}
                      onChange={(event)=>{
                         setQuantity(event.target.value) 
                      }}/>
                      <span>
                    Quantity: {isUpdatingQuantity
                     ? <input type="text" className="quantity-textbox" />
                     : <span className="quantity-label">{cartItem.quantity}</span>
                      }
                    </span>
                      <span className="update-quantity-link link-primary"
                      onClick={updateQuantity}>
                        Update
                      </span>
                      <span className="delete-quantity-link link-primary"
                        onClick={deleteCartItem}>
                        Delete
                      </span>
                    </div>
                  </div>
    
                  <DeliveryOptions cartItem={cartItem} deliveryOptions={deliveryOptions} loadCart={loadCart} />
                </div>
              </div>
  )
}

