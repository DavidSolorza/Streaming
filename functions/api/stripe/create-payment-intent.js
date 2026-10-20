/**
 * Cloudflare Pages Function: /api/stripe/create-payment-intent
 * Consume directamente la API REST v1 de Stripe (https://api.stripe.com/v1/payment_intents)
 * Cero SDKs comerciales de terceros (Regla 4.2).
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

    const amount = body.amount || 1700000; // En centavos de COP o USD (ej. $17.000 COP)
    const currency = (body.currency || 'cop').toLowerCase();
    const description = body.description || 'Suscripción Cuentas Stream JP';

    const secretKey = env?.STRIPE_SECRET_KEY || '';
    if (!secretKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'STRIPE_SECRET_KEY no configurada en las variables de entorno.' }),
        { status: 500, headers: corsHeaders() }
      );
    }

    // Construcción del payload x-www-form-urlencoded requerido por la API REST de Stripe
    const params = new URLSearchParams();
    params.append('amount', amount.toString());
    params.append('currency', currency);
    params.append('description', description);
    params.append('payment_method_types[]', 'card');

    if (body.customerEmail) {
      params.append('receipt_email', body.customerEmail);
    }

    // Petición HTTP nativa a la API de Stripe
    const stripeResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
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
          error: stripeData.error?.message || 'Error de la API de Stripe al crear la intención de pago.',
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
        error: err.message || 'Error interno del servidor al procesar Stripe.',
      }),
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}
