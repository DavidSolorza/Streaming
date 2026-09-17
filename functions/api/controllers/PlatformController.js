/**
 * 🌐 Capa de Presentación (Controlador) - HTTP Endpoints Plataformas
 */
export class PlatformController {
  constructor(platformService) {
    this.service = platformService;
  }

  static corsHeaders() {
    return {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
  }

  async getPlatforms() {
    try {
      const data = await this.service.getActivePlatforms();
      return new Response(JSON.stringify({ success: true, count: data.length, data }), {
        status: 200,
        headers: PlatformController.corsHeaders(),
      });
    } catch (err) {
      return this.handleError(err);
    }
  }

  async updatePlatform(request) {
    try {
      let body;
      try {
        body = await request.json();
      } catch (e) {
        throw { status: 400, code: 'INVALID_JSON_PAYLOAD', message: 'El cuerpo debe ser un JSON válido.' };
      }

      const updated = await this.service.updatePlatform(body.id, body.precio, body.entrega_inmediata);
      return new Response(
        JSON.stringify({ success: true, message: `Plataforma "${body.id}" actualizada exitosamente.`, data: updated }),
        { status: 200, headers: PlatformController.corsHeaders() }
      );
    } catch (err) {
      return this.handleError(err);
    }
  }

  handleError(err) {
    const status = err.status || 500;
    const error = err.code || 'INTERNAL_SERVER_ERROR';
    const message = err.message || 'Error interno del servidor';
    return new Response(JSON.stringify({ success: false, error, message }), {
      status,
      headers: PlatformController.corsHeaders(),
    });
  }
}
