import { NextApiRequest, NextApiResponse } from 'next';
import { createOrder } from 'lib/paypal';

interface CreateOrderRequest {
  priceId: string;
}

interface CreateOrderResponse {
  id?: string;
  status?: string;
  links?: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateOrderResponse>
): Promise<void> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId } = req.body as CreateOrderRequest;
    
    if (!priceId) {
      return res.status(400).json({ error: 'Missing priceId in request body' });
    }

    const order = await createOrder(priceId);
    return res.status(200).json(order);
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ 
      error: err.message || 'Failed to create PayPal order' 
    });
  }
}