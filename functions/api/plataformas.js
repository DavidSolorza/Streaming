/**
 * ⚡ Cloudflare Pages Function: /api/plataformas
 * Manejo de lectura y actualización de Plataformas de Streaming en Cloudflare D1 (SQLite)
 */

function corsHeaders() {
  return {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

// 1. HTTP GET: Obtener lista completa de plataformas activas desde D1
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
      'SELECT id, nombre, categoria, precio, entrega_inmediata, subtitulo, logo_url, activo FROM plataformas WHERE activo = 1 ORDER BY categoria ASC, nombre ASC'
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
        message: err.message || 'Error al consultar la base de datos D1',
      }),
      { status: 500, headers: corsHeaders() }
    );
  }
}

// 2. HTTP PUT / POST: Actualizar precio y entrega inmediata de una plataforma en D1
async function handleUpdate(context) {
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

    const { id, precio, entrega_inmediata } = body;

    if (!id || typeof id !== 'string' || id.trim() === '') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'MISSING_PLATFORM_ID',
          message: 'El campo "id" es obligatorio y debe ser una cadena de texto.',
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

    const stmt = env.DB.prepare(
      'UPDATE plataformas SET precio = ?, entrega_inmediata = ?, actualizado_en = CURRENT_TIMESTAMP WHERE id = ?'
    );
    const info = await stmt.bind(precio, entregaVal, id).run();

    if (info.meta && info.meta.changes === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'PLATFORM_NOT_FOUND',
          message: `No existe ninguna plataforma registrada con el id "${id}".`,
        }),
        { status: 404, headers: corsHeaders() }
      );
    }

    const updated = await env.DB.prepare(
      'SELECT id, nombre, categoria, precio, entrega_inmediata, subtitulo, logo_url, activo FROM plataformas WHERE id = ?'
    ).bind(id).first();

    return new Response(
      JSON.stringify({
        success: true,
        message: `Plataforma "${id}" actualizada exitosamente.`,
        data: updated,
      }),
      { status: 200, headers: corsHeaders() }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: err.message || 'Error ejecutando la actualización en Cloudflare D1',
      }),
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function onRequestPut(context) {
  return handleUpdate(context);
}

export async function onRequestPost(context) {
  return handleUpdate(context);
}

// 3. HTTP OPTIONS: Manejo de solicitudes pre-flight CORS
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
}
