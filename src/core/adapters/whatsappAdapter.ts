import { ENV } from '../config/env';
import { formatCOP } from '../utils/currency';

export interface WhatsAppProductParams {
  productName: string;
  modeLabel: string;
  durationLabel: string;
  price: number;
  brand?: string;
}

/**
 * Adaptador de WhatsApp para la generación segura y codificada de enlaces de compra
 * Utiliza encodeURIComponent para estructurar un mensaje limpio y profesional.
 */
export class WhatsAppAdapter {
  /**
   * Genera la URL codificada directa de WhatsApp para consultar o solicitar un producto específico.
   */
  static generateProductUrl(params: WhatsAppProductParams, phoneNumber: string = ENV.WHATSAPP_NUMBER, customerName?: string): string {
    const { productName, modeLabel, durationLabel, price } = params;

    let mensaje = '';
    if (customerName && customerName.trim()) {
      mensaje += `¡Hola equipo JP! Mi nombre es *${customerName.trim()}*, un gusto saludarlos.\n\n`;
    }

    mensaje += 
      `*CONSULTA DE SERVICIO*\n` +
      `──────────────────────────\n` +
      `*Servicio:* ${productName}\n` +
      `   • Modalidad: ${modeLabel}\n` +
      `   • Duración: ${durationLabel}\n` +
      `   • Precio: *${formatCOP(price)} / mes*\n` +
      `──────────────────────────\n` +
      `¿Se encuentra disponible para entrega inmediata? Quedo atento, ¡muchas gracias!`;

    // Limpiar caracteres no numéricos del teléfono
    const cleanPhone = phoneNumber.replace(/\D/g, '');

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(mensaje)}`;
  }
}
