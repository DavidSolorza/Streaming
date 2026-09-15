/**
 * ⚡ Cloudflare Pages Function: /api/combos
 * Manejo de lectura y actualización de Combos y Paquetes de Streaming en Cloudflare D1 (SQLite)
 */

function corsHeaders() {
  return {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

// 1. HTTP GET: Obtener todos los combos disponibles desde Cloudflare D1
export async function onRequestGet(context) {
  const { env } = context;

  try {
    if (!env.DB) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Binding D1_NOT_CONFIGURED',
          message: 'Base de datos Cloudflare D1 (env.DB) no vinculada.',
        }),
        { status: 500, headers: corsHeaders() }
      );
    }

    const { results } = await env.DB.prepare(
      'SELECT id, nombre, plataformas_nombres, precio, ahorro, destacado, entrega_inmediata FROM combos ORDER BY destacado DESC, id ASC'
    ).all();

    return new Response(
      JSON.stringify({
        success: true,
        count: results ? results.length : 0,
        data: results || [],
      }),
      { status: 200, headers: corsHeaders() }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: err.message || 'Error al obtener los combos desde Cloudflare D1',
      }),
      { status: 500, headers: corsHeaders() }
    );
  }
}

// 2. HTTP PUT / POST: Actualizar precio, ahorro y disponibilidad de un combo en D1
async function handleUpdateCombo(context) {
  const { env, request } = context;

  try {
    if (!env.DB) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Binding D1_NOT_CONFIGURED',
          message: 'Base de datos Cloudflare D1 (env.DB) no vinculada.',
        }),
        { status: 500, headers: corsHeaders() }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'INVALID_JSON_PAYLOAD',
          message: 'El cuerpo de la petición debe ser un JSON válido.',
        }),
        { status: 400, headers: corsHeaders() }
      );
    }

    const { id, precio, ahorro, entrega_inmediata, destacado } = body;

    if (!id || typeof id !== 'number' || id <= 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'MISSING_COMBO_ID',
          message: 'El campo "id" es obligatorio y debe ser un número entero positivo.',
        }),
        { status: 400, headers: corsHeaders() }
      );
    }

    if (precio === undefined || typeof precio !== 'number' || precio <= 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'INVALID_PRICE',
          message: 'El campo "precio" es obligatorio y debe ser un número mayor a cero (COP).',
        }),
        { status: 422, headers: corsHeaders() }
      );
    }

    const entregaVal = entrega_inmediata ? 1 : 0;
    const ahorroVal = typeof ahorro === 'number' && ahorro >= 0 ? ahorro : 0;
    const destacadoVal = destacado ? 1 : 0;

    const stmt = env.DB.prepare(
      'UPDATE combos SET precio = ?, ahorro = ?, entrega_inmediata = ?, destacado = ?, actualizado_en = CURRENT_TIMESTAMP WHERE id = ?'
    );
    const info = await stmt.bind(precio, ahorroVal, entregaVal, destacadoVal, id).run();

    if (info.meta && info.meta.changes === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'COMBO_NOT_FOUND',
          message: `No existe ningún combo registrado con el id ${id}.`,
        }),
        { status: 404, headers: corsHeaders() }
      );
    }

    const updated = await env.DB.prepare(
      'SELECT id, nombre, plataformas_nombres, precio, ahorro, destacado, entrega_inmediata FROM combos WHERE id = ?'
    ).bind(id).first();

    return new Response(
      JSON.stringify({
        success: true,
        message: `Combo #${id} actualizado exitosamente.`,
        data: updated,
      }),
      { status: 200, headers: corsHeaders() }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: err.message || 'Error al actualizar el combo en Cloudflare D1',
      }),
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function onRequestPut(context) {
  return handleUpdateCombo(context);
}

export async function onRequestPost(context) {
  return handleUpdateCombo(context);
}

// 3. HTTP OPTIONS: Pre-flight CORS
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
}
