import React, { useState } from 'react';
import { HelpCircle, ShieldCheck, Clock, CreditCard, RefreshCw } from 'lucide-react';
import { RecursiveFaqNode, FaqNodeItem } from './RecursiveFaqNode';

const FAQS: FaqNodeItem[] = [
  { id: 'faq-1', category: 'Entrega & Activación', question: '¿Cómo recibo los datos de mi cuenta tras realizar el pago?', answer: 'Una vez realizada la transferencia por Nequi, Daviplata, Bancolombia o PSE, haz clic en el botón "Enviar Comprobante por WhatsApp". Nuestro sistema y equipo de soporte verificarán el pago y te entregarán las credenciales (correo, clave y perfil asignado) en menos de 5 minutos.', icon: <Clock className="w-4 h-4 text-blue-600" /> },
  { id: 'faq-2', category: 'Garantía & Soporte', question: '¿Las cuentas tienen garantía durante todo el periodo contratado?', answer: '¡Sí, 100% garantizadas durante los 30 días o periodo seleccionado! Si presentas cualquier inconveniente de acceso, PIN o caída de señal, nuestro canal de soporte por WhatsApp soluciona el reporte o te realiza un reemplazo de cuenta inmediato sin costo adicional.', icon: <ShieldCheck className="w-4 h-4 text-emerald-600" /> },
  { id: 'faq-3', category: 'Modalidades', question: '¿Qué diferencia hay entre "1 Pantalla (PIN)" y "Cuenta Completa"?', answer: 'La "1 Pantalla (PIN)" te asigna un perfil privado con código PIN exclusivo dentro de una cuenta compartida familiar. La "Cuenta Completa" te otorga la suscripción entera (4 a 5 pantallas) para que la disfrutes con tu familia o amigos en el hogar.', icon: <HelpCircle className="w-4 h-4 text-purple-600" /> },
  { id: 'faq-4', category: 'Pagos en Colombia', question: '¿Cuáles son los métodos de pago aceptados?', answer: 'Aceptamos pagos instantáneos por Nequi, Daviplata, Bancolombia A la Mano, PSE y corresponsales bancarios autorizados en todo Colombia sin cobro de comisiones adicionales.', icon: <CreditCard className="w-4 h-4 text-amber-600" /> },
  { id: 'faq-5', category: 'Renovaciones', question: '¿Puedo renovar la misma cuenta sin perder mis listas y favoritos?', answer: '¡Por supuesto! Notifícanos antes de la fecha de corte y mantendremos la misma cuenta y perfil para que no pierdas tu historial de reproducción ni tus configuraciones personalizadas.', icon: <RefreshCw className="w-4 h-4 text-indigo-600" /> }
];

export const FaqAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-14 bg-slate-50 border-t border-slate-900/[0.05]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-black uppercase text-blue-700 tracking-wider flex items-center justify-center gap-1.5 bg-blue-50 px-3 py-1 rounded-full w-fit mx-auto border border-blue-100">
            <HelpCircle className="w-4 h-4 text-blue-700" /> Resolvemos tus dudas al instante
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Preguntas Frecuentes (FAQ)</h2>
          <p className="text-slate-500 text-xs font-medium max-w-lg mx-auto">Conoce todo sobre nuestra garantía de 30 días, tiempos de entrega inmediata y métodos de pago verificados.</p>
        </div>
        <div className="space-y-3.5">
          {FAQS.map((faq, index) => (
            <RecursiveFaqNode key={faq.id} item={faq} isOpen={openIndex === index} onToggle={() => setOpenIndex(openIndex === index ? null : index)} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
