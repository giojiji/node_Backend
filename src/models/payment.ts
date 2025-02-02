import { runQuery, selectFromDatabase } from "../util/db";



export const selectOrderData = async (session_id: string, client_reference_id: string) => {
   const orderData = await selectFromDatabase("select * from orders where session_id = ? and client_reference_id = ?",
        [session_id,client_reference_id]);
    return orderData[0]    
};


export const insertOrderData = async (session_id: string, client_reference_id: string, status: string | null, payment_status: string, payment_method: string, mode: string, amount_total: number | null, unit_amount: number | null, currency: string | null, quantity: number, product_name: string | null, customer_email: string | null, customer_name: string | null, customer_phone: string | null) => {
    await runQuery("insert into orders (session_id, client_reference_id, status, payment_status, payment_method, mode, amount_total, unit_amount, currency, quantity, product_name, customer_email, customer_name, customer_phone) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [session_id,client_reference_id,status,payment_status,payment_method,mode,amount_total,unit_amount,currency,quantity,product_name,customer_email,customer_name,customer_phone]);
};


export const updateOrderData = async (status: string | null, payment_status: string, customer_email: string | null, customer_name: string | null, session_id: string, client_reference_id: string) => {
    await runQuery("update orders set status = ?,  payment_status = ?, customer_email = ?, customer_name = ? WHERE client_reference_id = ? and session_id = ?",
        [status, payment_status, customer_email, customer_name, client_reference_id, session_id]);
};



export const insertCustomerOrderData = async (customerId: string, productId: string, orderId: string) => {
    await runQuery("insert into customerorders (customerId, productId, orderId) values (?, ?, ?)",
        [customerId, productId, orderId]);
};
