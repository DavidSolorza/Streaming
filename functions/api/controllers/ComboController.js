/**
 * 🌐 Capa de Presentación (Controlador) - HTTP Endpoints Combos
 */
export class ComboController {
  constructor(comboService) {
    this.service = comboService;
  }

  static corsHeaders() {
    return {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
  }

  async getCombos() {
    try {
      const data = await this.service.getAllCombos();
      return new Response(JSON.stringify({ success: true, count: data.length, data }), {
        status: 200,
        headers: ComboController.corsHeaders(),
      });
    } catch (err) {
      return this.handleError(err);
    }
  }

  async updateCombo(request) {
    try {
      let body;
      try {
        body = await request.json();
      } catch (e) {
        throw { status: 400, code: 'INVALID_JSON_PAYLOAD', message: 'El cuerpo debe ser un JSON válido.' };
      }

      const updated = await this.service.updateCombo(body.id, body.precio, body.ahorro, body.entrega_inmediata);
      return new Response(
        JSON.stringify({ success: true, message: `Combo #${body.id} actualizado exitosamente.`, data: updated }),
        { status: 200, headers: ComboController.corsHeaders() }
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
      headers: ComboController.corsHeaders(),
    });
  }
}
