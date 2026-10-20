/**
 * Cloudflare Pages Function: /api/stripe/confirm-payment-intent
 * Confirma un PaymentIntent directamente mediante la API REST v1 de Stripe.
 */

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };
}

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json().catch(() => ({}));

    const { paymentIntentId, paymentMethod = 'pm_card_visa' } = body;

    if (!paymentIntentId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Falta el identificador paymentIntentId.' }),
        { status: 400, headers: corsHeaders() }
      );
    }

    const secretKey = env?.STRIPE_SECRET_KEY || '';
    if (!secretKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'STRIPE_SECRET_KEY no configurada en las variables de entorno.' }),
        { status: 500, headers: corsHeaders() }
      );
    }

    const params = new URLSearchParams();
    params.append('payment_method', paymentMethod);

    const stripeResponse = await fetch(`https://api.stripe.com/v1/payment_intents/${paymentIntentId}/confirm`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const stripeData = await stripeResponse.json();

    if (!stripeResponse.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          error: stripeData.error?.message || 'Fallo al confirmar el pago en la API de Stripe.',
        }),
        { status: stripeResponse.status, headers: corsHeaders() }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: stripeData,
      }),
      { status: 200, headers: corsHeaders() }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message || 'Error interno al confirmar transacción Stripe.',
      }),
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}
