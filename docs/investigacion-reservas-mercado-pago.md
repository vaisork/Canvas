# Investigación preliminar — Reservaciones y cobro con Mercado Pago

Fecha: 2026-10-13  
Proyecto: Canvas 90 — Promoción / renta de espacios  
Estado: **Requisitos acordados; viabilidad técnica por verificar. No implementado.**  
Responsable de esta nota: agente investigador (solo investigación; sin responsabilidad de arquitectura o desarrollo).

## Objetivo

Automatizar el cobro y la confirmación de rentas por horas en Canvas 90, Pulso y Origen, sin administrar contratos dentro de la aplicación.

## Decisiones expresas del propietario

1. **Tres espacios independientes:** Canvas 90, Pulso y Origen pueden alquilarse al mismo tiempo por distintos clientes; cada uno tiene disponibilidad propia.
2. **Horas consecutivas:** el cliente elige inicio y duración, siempre que **todo el intervalo** esté libre.
3. **Pago completo:** se cobra el **100%** de las horas contratadas por Mercado Pago; no anticipos parciales.
4. **Confirmación tras pago:** una reserva definitiva solo se crea cuando el servidor comprueba el estado aprobado del pago.
5. **Tarifas distintas por espacio:** Canvas 90 cambia por día de la semana; el modelo debe admitir, más adelante, cambios según franja horaria. No se han proporcionado todas las tarifas.
6. **Contrato fuera del sistema:** el cliente firma previamente un **contrato de uso sin horas específicas**. No desarrollar cuentas, contraseñas, registro de clientes ni validación digital del contrato.
7. **Página de reservas no enlazada públicamente:** el enlace se comparte de manera directa con quienes ya firmaron. Se acepta expresamente que ocultar un enlace **no es un control de acceso**.
8. **Simplicidad:** investigación y requisitos, no arquitectura ni implementación por parte de este agente.

## Flujo funcional propuesto para evaluación

1. El cliente abre la URL de reservaciones compartida.
2. Elige uno de los tres espacios, fecha, hora de inicio y cantidad de horas consecutivas.
3. El sistema consulta disponibilidad del espacio elegido y calcula el total según reglas de tarifa vigentes.
4. El sistema mantiene provisionalmente el intervalo durante el intento de pago (duración y vencimiento **por definir**).
5. Se crea el pago por el total calculado en Mercado Pago.
6. Una notificación de pago (*webhook*) inicia la verificación **desde servidor**, consultando el estado real de la operación y vinculándola con la solicitud correcta.
7. Solo con pago aprobado y reglas de disponibilidad satisfechas se confirma y bloquea el intervalo del espacio.
8. El cliente recibe confirmación. Notificaciones y canales concretos aún **por definir**.

## Viabilidad investigada: Mercado Pago

**Candidato:** Checkout Pro, con integración del servidor para crear órdenes o solicitudes de pago y recibir notificaciones. La documentación oficial es la fuente de validación para el mecanismo vigente de Checkout Pro y webhooks:

- Portal de desarrolladores: https://www.mercadopago.com.mx/developers
- Documentación Checkout Pro: https://www.mercadopago.com.mx/developers/es/docs/checkout-pro/overview
- Documentación de notificaciones: https://www.mercadopago.com.mx/developers/es/docs/your-integrations/notifications/webhooks

**Separación de responsabilidades:** Mercado Pago procesa pagos; **no** resuelve el inventario de horas ni los conflictos entre reservaciones. Esa lógica pertenece al sistema de reservas y deberá definirla el responsable de arquitectura/desarrollo.

**Precaución:** no confirmar por el retorno del navegador; verificar el pago de forma segura desde el servidor. Evitar doble reserva mediante control transaccional de intervalos y vencimiento de reservas temporales. Prever pago aprobado tardíamente, reintentos de webhook, pagos pendientes, cancelaciones y devoluciones.

## Costos: estimación, no cotización validada

En la conversación se utilizaron como **supuestos**, sujetos a confirmación con la cuenta de Mercado Pago y condiciones vigentes, las tasas de 3.49%, 3.19% y 2.95% **más IVA sobre comisión**, según plazo de liberación del dinero. No están verificadas en esta nota y podrían variar por medio de pago, producto, promociones y condiciones de la cuenta.

Ejemplo **ilustrativo** para una renta de **$85 MXN** y tasa supuesta de **3.49% + IVA (16% sobre comisión)**:

- Comisión aproximada: 85 × 0.0349 × 1.16 = **$3.44 MXN**
- Neto aproximado: **$81.56 MXN**

El propietario indicó que **cada espacio tiene su propia tarifa**; $85 no debe codificarse como precio universal.

## Opciones y evaluación preliminar

- **Checkout Pro + sistema de reservas del sitio:** permite cobrar el importe dinámico por reserva y recibir confirmaciones; exige backend seguro y control de concurrencia. Candidato principal **para validar**, no decisión de implementación.
- **Enlaces de pago manuales:** sencillos para cobrar, pero no automatizan cálculo, disponibilidad y bloqueo. No satisfacen por sí solos el objetivo.
- **Calendly:** pensado principalmente para citas; no es la fuente de verdad del inventario de tres espacios con reglas de tarifas. No se propone como núcleo sin evaluación adicional.

## Riesgos y requisitos no funcionales

- Evitar doble asignación del mismo intervalo dentro de un espacio, incluso con dos pagos simultáneos.
- No bloquear Pulso u Origen al reservar Canvas 90, ni viceversa.
- Definir cómo se resuelven pagos acreditados después de vencer la retención temporal.
- Verificar firmas/autenticidad de notificaciones y mantener credenciales privadas fuera del navegador y repositorio.
- Permitir editar tarifas sin modificar código, sujeto a diseño del equipo técnico.
- Registrar zona horaria local, horarios de operación, cierres manuales y política de cancelación.
- La URL no enlazada puede compartirse; no afirmar que impide el acceso de terceros.

## Pendientes por confirmar con el propietario

- Tabla real de precios por espacio y día; horas de operación y días de cierre.
- Duración mínima/máxima y unidad de reserva (horas completas o fracciones).
- Tiempo de preparación/limpieza entre reservas, si aplica.
- Política de cancelación, reprogramación, reembolso y no presentación.
- Comisiones actuales y medios de pago habilitados en su cuenta Mercado Pago.
- Método de envío de confirmaciones y responsable de soporte.

## Pruebas propuestas para desarrollo (NO EJECUTADAS)

1. Dos clientes intentan el mismo horario del mismo espacio: solo uno debe confirmarlo.
2. Reservas simultáneas de espacios diferentes: ambas deben poder confirmarse.
3. Reserva que atraviesa un cambio de día o futura franja tarifaria: precio calculado correctamente.
4. Pago aprobado, pendiente, rechazado, webhook duplicado y notificación tardía.
5. Abandono del checkout: liberación de retención temporal según política definida.
6. Tarifa cambiada durante el pago: se respeta el importe acordado para la operación vigente.

## Límites de este documento

**Investigado / acordado:** requisitos funcionales y viabilidad conceptual de usar Mercado Pago como pasarela.  
**No probado:** integración con la web actual, compatibilidad de su infraestructura, webhooks reales, tarifas de cuenta, seguridad en producción y pruebas de concurrencia.  
**No autorizado:** cambios de código, despliegues, configuración de credenciales o cobros reales.

Esta investigación se entrega al agente responsable de arquitectura/desarrollo para evaluar e implementar **solo cuando Javier lo autorice**.
