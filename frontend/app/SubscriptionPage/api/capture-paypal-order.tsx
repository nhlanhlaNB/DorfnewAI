import { NextApiRequest, NextApiResponse } from 'next';
import { captureOrder } from 'lib/paypal';

interface CaptureRequest {
  orderId: string;
}

interface CaptureResponse {
  id?: string;
  status?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CaptureResponse>
): Promise<void> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderId } = req.body as CaptureRequest;
    
    if (!orderId) {
      return res.status(400).json({ error: 'Missing orderId in request body' });
    }

    const captureData = await captureOrder(orderId);
    return res.status(200).json(captureData);
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ error: err.message });
  }
}