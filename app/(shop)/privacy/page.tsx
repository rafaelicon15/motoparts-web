// app/(shop)/privacy/page.tsx
export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 md:px-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          Política de Privacidad
        </h1>
        <p className="text-gray-500 mb-8">
          Última actualización: {new Date().toLocaleDateString("es-VE")}
        </p>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              1. Introducción
            </h2>
            <p>
              En MotoParts, respetamos tu privacidad y nos comprometemos a
              proteger tus datos personales. Esta Política de Privacidad explica
              cómo recopilamos, utilizamos, compartimos y protegemos tu
              información.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              2. Información que Recopilamos
            </h2>
            <p>
              Recopilamos la siguiente información cuando utilizas nuestro sitio:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>
                <strong>Información de Contacto:</strong> Nombre, correo
                electrónico, teléfono, cédula/RIF
              </li>
              <li>
                <strong>Información de Envío:</strong> Dirección, estado, ciudad
              </li>
              <li>
                <strong>Información de Pago:</strong> Detalles de transacciones
                (sin guardar datos de tarjeta)
              </li>
              <li>
                <strong>Información de Navegación:</strong> Páginas visitadas,
                productos visualizados, tiempo de permanencia
              </li>
              <li>
                <strong>Información del Dispositivo:</strong> Tipo de navegador,
                dirección IP, sistema operativo
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              3. Cómo Utilizamos tu Información
            </h2>
            <p>
              Utilizamos tu información para:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Procesar y completar tus pedidos</li>
              <li>
                Enviarte confirmaciones de compra y actualizaciones de envío
              </li>
              <li>Responder a tus consultas y solicitudes de soporte</li>
              <li>
                Mejorar nuestro sitio web y experiencia de usuario mediante
                análisis
              </li>
              <li>Prevenir fraude y actividades ilícitas</li>
              <li>
                Cumplir con obligaciones legales y regulatorias
              </li>
              <li>Enviar promociones y ofertas (si lo autorizas)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              4. Herramientas de Análisis
            </h2>
            <p>
              Utilizamos <strong>Microsoft Clarity</strong> para analizar cómo
              interactúan los usuarios con nuestro sitio. Clarity registra:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Movimientos del ratón y clics</li>
              <li>Desplazamientos en la página</li>
              <li>Formularios completados</li>
              <li>Errores y excepciones</li>
            </ul>
            <p className="mt-3">
              Esta información nos ayuda a identificar problemas de usabilidad y
              mejorar tu experiencia. Clarity no recopila información de tarjetas
              de crédito ni datos sensibles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              5. Cookies y Tecnologías Similares
            </h2>
            <p>
              Utilizamos cookies para:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Recordar tus preferencias</li>
              <li>Mantener tu sesión activa</li>
              <li>Rastrear el comportamiento de navegación</li>
              <li>Personalizar contenido y anuncios</li>
            </ul>
            <p className="mt-3">
              Puedes controlar las cookies a través de la configuración de tu
              navegador. Sin embargo, deshabilitarlas puede afectar la
              funcionalidad del sitio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              6. Compartir Información
            </h2>
            <p>
              No vendemos ni compartimos tu información personal con terceros,
              excepto en los siguientes casos:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>
                <strong>Agencias de Transporte:</strong> Para procesar entregas
              </li>
              <li>
                <strong>Proveedores de Pago:</strong> Para procesar transacciones
              </li>
              <li>
                <strong>Cumplimiento Legal:</strong> Cuando sea requerido por ley
              </li>
              <li>
                <strong>Protección de Derechos:</strong> Para proteger nuestros
                derechos legales
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              7. Seguridad de Datos
            </h2>
            <p>
              Implementamos medidas de seguridad técnicas, administrativas y
              físicas para proteger tu información, incluyendo:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Encriptación SSL/TLS</li>
              <li>Autenticación segura</li>
              <li>Acceso restringido a datos personales</li>
              <li>Monitoreo de seguridad continuo</li>
            </ul>
            <p className="mt-3">
              Sin embargo, ningún sistema es 100% seguro. Utilizamos nuestros
              mejores esfuerzos para proteger tu información.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              8. Derechos del Usuario
            </h2>
            <p>
              Tienes derecho a:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Acceder a tus datos personales</li>
              <li>Solicitar la corrección de datos inexactos</li>
              <li>Solicitar la eliminación de tus datos</li>
              <li>Optar por no recibir comunicaciones de marketing</li>
              <li>Exportar tus datos en formato legible</li>
            </ul>
            <p className="mt-3">
              Para ejercer estos derechos, contáctanos en ventas@motoparts.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              9. Retención de Datos
            </h2>
            <p>
              Retenemos tu información personal durante el tiempo necesario para:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Completar transacciones y proporcionar servicios</li>
              <li>Cumplir con obligaciones legales</li>
              <li>Resolver disputas</li>
              <li>Hacer valer nuestros acuerdos</li>
            </ul>
            <p className="mt-3">
              Después de este período, eliminamos o anonimizamos tu información.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              10. Cambios en esta Política
            </h2>
            <p>
              Podemos actualizar esta Política de Privacidad en cualquier momento.
              Te notificaremos sobre cambios significativos publicando la política
              actualizada en nuestro sitio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              11. Contacto
            </h2>
            <p>
              Si tienes preguntas sobre esta Política de Privacidad o nuestras
              prácticas de privacidad, contáctanos:
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
