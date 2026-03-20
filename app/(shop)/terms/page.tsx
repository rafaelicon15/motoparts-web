// app/(shop)/terms/page.tsx
export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 md:px-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          Términos y Condiciones
        </h1>
        <p className="text-gray-500 mb-8">
          Última actualización: {new Date().toLocaleDateString("es-VE")}
        </p>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              1. Aceptación de Términos
            </h2>
            <p>
              Al acceder y utilizar el sitio web de MotoParts, aceptas estar
              vinculado por estos Términos y Condiciones. Si no estás de acuerdo
              con alguna parte de estos términos, no debes utilizar nuestro sitio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              2. Descripción del Servicio
            </h2>
            <p>
              MotoParts es una plataforma de comercio electrónico que ofrece la
              venta de repuestos para motocicletas. Nos esforzamos por proporcionar
              productos de calidad garantizada con envíos a nivel nacional.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              3. Uso Aceptable
            </h2>
            <p>
              Te comprometes a utilizar nuestro sitio de manera legal y responsable.
              No debes:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Utilizar el sitio para actividades ilegales o fraudulentas</li>
              <li>
                Interferir con la operación normal del sitio o sus servidores
              </li>
              <li>
                Intentar acceder a áreas restringidas sin autorización
              </li>
              <li>Transmitir virus, malware o código malicioso</li>
              <li>Acosar, amenazar o discriminar a otros usuarios</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              4. Proceso de Compra
            </h2>
            <p>
              Al realizar una compra en MotoParts, aceptas proporcionar información
              precisa y completa. Nos reservamos el derecho de rechazar cualquier
              pedido que consideremos sospechoso o que viole nuestras políticas.
            </p>
            <p className="mt-3">
              Los precios mostrados están en dólares estadounidenses (USD). El
              equivalente en bolívares se calcula utilizando la tasa BCV oficial
              y se actualiza diariamente.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              5. Métodos de Pago
            </h2>
            <p>
              Aceptamos múltiples métodos de pago incluyendo Pago Móvil, Zelle,
              PayPal y efectivo en tienda. Todos los pagos deben completarse antes
              de procesar tu pedido.
            </p>
            <p className="mt-3">
              Para pagos con PayPal, se aplicará una comisión del 2.9% más $0.30
              USD, que será agregada automáticamente al total de tu compra.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              6. Envíos y Entregas
            </h2>
            <p>
              Ofrecemos dos opciones de entrega:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>
                <strong>Retiro en Tienda:</strong> Recoger tu pedido en nuestras
                instalaciones
              </li>
              <li>
                <strong>Envío por Agencia:</strong> Entrega a través de agencias
                de transporte autorizadas (ZOOM, DOMESA, TEALCA, MRW)
              </li>
            </ul>
            <p className="mt-3">
              Los tiempos de entrega varían según la agencia y la ubicación. No
              somos responsables por retrasos causados por terceros.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              7. Devoluciones y Reembolsos
            </h2>
            <p>
              Los productos pueden ser devueltos dentro de 7 días de la compra si
              están en condiciones originales y sin usar. Los reembolsos se
              procesarán al método de pago original.
            </p>
            <p className="mt-3">
              Los gastos de envío no son reembolsables a menos que el error sea
              nuestro.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              8. Garantía de Productos
            </h2>
            <p>
              Todos nuestros productos incluyen garantía de calidad. Si recibas un
              producto defectuoso, contáctanos dentro de 48 horas para procesar un
              reemplazo.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              9. Limitación de Responsabilidad
            </h2>
            <p>
              MotoParts no será responsable por daños indirectos, incidentales,
              especiales o consecuentes derivados del uso de nuestro sitio o
              productos. Nuestra responsabilidad total está limitada al monto
              pagado por el cliente.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              10. Cambios en los Términos
            </h2>
            <p>
              Nos reservamos el derecho de modificar estos Términos y Condiciones
              en cualquier momento. Los cambios entrarán en vigor inmediatamente
              después de su publicación en el sitio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              11. Contacto
            </h2>
            <p>
              Si tienes preguntas sobre estos Términos y Condiciones, contáctanos
              en:
            </p>
            <ul className="list-none space-y-2 mt-2">
              <li>📧 Email: ventas@motoparts.com</li>
              <li>📱 WhatsApp: +58 412-0000000</li>
              <li>📍 Dirección: Caracas, Venezuela</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
