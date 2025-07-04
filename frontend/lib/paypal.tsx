interface PayPalAuth {
  user: string | undefined;
  pass: string | undefined;
}

interface PurchaseUnit {
  amount: {
    currency_code: string;
    value: string;
  };
}

interface CreateOrderPayload {
  intent: string;
  purchase_units: PurchaseUnit[];
}

interface PayPalOrderResponse {
  id: string;
  status: string;
  links: {
    href: string;
    rel: string;
    method: string;
  }[];
}

interface PayPalError {
  error: string;
  message?: string;
}

const PAYPAL_API_URL: string = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';
const PAYPAL_CLIENT_ID: string | undefined = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET: string | undefined = process.env.PAYPAL_SECRET;

const auth: PayPalAuth = {
  user: PAYPAL_CLIENT_ID,
  pass: PAYPAL_SECRET
};

export async function createOrder(planId: string): Promise<PayPalOrderResponse | PayPalError> {
  if (!auth.user || !auth.pass) {
    throw new Error('PayPal credentials not configured');
  }

  try {
    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${auth.user}:${auth.pass}`).toString('base64')}`
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: getPriceFromPlanId(planId)
          }
        }]
      } as CreateOrderPayload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create PayPal order');
    }

    return await response.json() as PayPalOrderResponse;
  } catch (error) {
    console.error('PayPal createOrder error:', error);
    return {
      error: 'Failed to create order',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function captureOrder(orderID: string): Promise<PayPalOrderResponse | PayPalError> {
  if (!auth.user || !auth.pass) {
    throw new Error('PayPal credentials not configured');
  }

  try {
    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${auth.user}:${auth.pass}`).toString('base64')}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to capture PayPal order');
    }

    return await response.json() as PayPalOrderResponse;
  } catch (error) {
    console.error('PayPal captureOrder error:', error);
    return {
      error: 'Failed to capture order',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

function getPriceFromPlanId(planId: string): string {
  const prices: Record<string, string> = {
    'price_1YourIndividualPriceID': '10.00',
    'price_1YourBusinessPriceID': '25.00',
    'price_1YourFamilyPriceID': '15.00'
  };
  return prices[planId] || '0.00';
}