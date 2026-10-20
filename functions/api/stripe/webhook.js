/**
 * Cloudflare Pages Function: /api/stripe/webhook
 * Receptor de eventos asíncronos de Stripe (Webhook) para actualizar órdenes o pagos.
 */

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };
}

export async function onRequestPost(context) {
  try {
    const { request } = context;
    const event = await request.json().catch(() => null);

    if (!event || !event.type) {
      return new Response(
        JSON.stringify({ success: false, error: 'Payload de webhook inválido.' }),
        { status: 400, headers: corsHeaders() }
      );
    }

    console.log(`[Stripe Webhook Recibido] Evento: ${event.type}, ID: ${event.id}`);

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        console.log(`✅ Pago Exitoso procesado para PaymentIntent: ${paymentIntent.id}, Monto: ${paymentIntent.amount}`);
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        console.warn(`❌ Pago Fallido para PaymentIntent: ${paymentIntent.id}`);
        break;
      }
      default:
        console.log(`ℹ️ Evento no gestionado: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true, eventType: event.type }),
      { status: 200, headers: corsHeaders() }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Error procesando webhook.' }),
      { status: 500, headers: corsHeaders() }
    );
  }
}
