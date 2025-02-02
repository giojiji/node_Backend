import Stripe from "stripe";
import dotenv from 'dotenv';

dotenv.config();


const stripe = new Stripe(process.env.STRIPE_TOKE! as string);

export const makePayment = async (userId: string, product_id: number, product_name: string, quantity: number, amount: number) => {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        client_reference_id: userId,
        line_items: [
          {
            price_data: {
              currency: 'gel',
              unit_amount: amount,
              product_data: {
                name: product_name,
              },
            },
            quantity: quantity,
            
          },
        ],
        metadata: {
          productId: product_id,
        },
        mode: 'payment', 
        expand: ['line_items'],
        success_url: process.env.STRIPE_SUCCESS_URL || 'http://localhost:3000/myorders',
        cancel_url: process.env.STRIPE_CANCEL_URL || 'http://localhost:3000/shop',
      });
  
      return session
  
    } catch (error) {
      throw error;
    }
  };


export const orderById = async (session_id: string) => {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items']
    });
    // const customer = await stripe.customers.retrieve(session.customer);
    return session
  };  