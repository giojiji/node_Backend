import { Request, Response  } from 'express';
import { makePayment, orderById } from '../util/paymentHelper';
import { insertCustomerOrderData, insertOrderData, selectOrderData, updateOrderData } from '../models/payment';

interface RequestType extends Request {
  userId?: string;
  email?: string
}

export const buyProduct = async (req: RequestType, res: Response) => {
  const userId = req.userId
  const email = req.email
  const { amount, quantity, product_id, product_name} = req.body
  if( !amount || !quantity  || !userId || !email || !product_id || !product_name) {
    res.status(400).send({message: "invalid data"})
    return
  }
  try {
    const session = await makePayment(userId, product_id, product_name, quantity, amount);
    const {id, status, payment_status, payment_method_types, mode, amount_total, line_items, customer_details, url, currency} = session
    const unit_amount = line_items?.data[0].price?.unit_amount
    res.status(200).json({ id: id, url: url, session: session});
    await insertOrderData( id, userId, status, payment_status, payment_method_types[0], mode, amount_total ? amount_total / 100 : null, unit_amount ? unit_amount / 100 : null, currency ?? null, quantity, line_items?.data[0].description ?? "Unknown Product", customer_details?.email ?? null, customer_details?.name ?? null, customer_details?.phone ?? 'null' );    return
  } catch (error) {
    res.status(400).json({ error: error });
    return
  }

}

export const getOrder = async (req: RequestType, res: Response) => {
  const userId = req.userId
  const session_id = req.params.session_id
  if(!session_id || !userId) {
    res.status(404).send({data: "invalid order"})
    return
  }
  try {
    const session = await orderById(session_id)
    const {id, status, payment_status, customer_details, metadata, client_reference_id} = session
    if(userId != client_reference_id) {
      res.status(400).json({ message: "this is not your order" });
      return
    }
    await updateOrderData(status, payment_status, customer_details?.email ?? null, customer_details?.name ?? null, id, userId)
    if(status === 'complete' && payment_status === 'paid')
    {
      const orderDataById = await selectOrderData(id, userId)
      await insertCustomerOrderData(userId, metadata?.productId!, orderDataById.id)
    }
    res.send({message: session})
  } catch (error) { 
    res.status(400).json({ error: error });
    return
  }
 
  return
}
