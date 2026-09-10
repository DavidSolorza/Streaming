import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "¿Cómo recibo los datos de mi cuenta tras realizar el pago?",
    answer: "Una vez realizada la transferencia por Nequi, Daviplata o Bancolombia, haces clic en el botón 'Enviar Comprobante por WhatsApp'. Nuestro bot y equipo de soporte verificarán el comprobante y te entregarán el correo y contraseña en menos de 5 minutos."
  },
  {
    question: "¿Las cuentas tienen garantía durante todo el periodo contratado?",
    answer: "¡Sí, 100% garantizadas! Si llegas a presentar algún problema de acceso o PIN, nuestro equipo te lo soluciona o te reemplaza la cuenta inmediatamente por WhatsApp sin costo adicional."
  },
  {
    question: "¿Qué diferencia hay entre 'Pantalla Individual' y 'Cuenta Completa'?",
    answer: "La 'Pantalla Individual' te asigna un perfil exclusivo con PIN propio dentro de una cuenta compartida familiar. La 'Cuenta Completa' te da el control total de la suscripción con la cantidad total de perfiles para tu hogar."
  },
  {
    question: "¿Cuáles son los métodos de pago disponibles?",
    answer: "Aceptamos pagos directos por Nequi, Daviplata, Bancolombia A la Mano, PSE y corresponsales bancarios en Colombia sin comisiones extra."
  }
];

export const FaqAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-black uppercase text-blue-700 tracking-wider flex items-center justify-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-blue-700" />
            Resolvemos tus dudas
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Preguntas Frecuentes</h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white border border-slate-900/[0.08] rounded-2xl overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-5 font-bold text-slate-900 text-sm flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-700' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 font-medium leading-relaxed border-t border-slate-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
