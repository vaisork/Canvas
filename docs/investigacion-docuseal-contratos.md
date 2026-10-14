# Investigación de conocimiento — DocuSeal y contratos electrónicos para Canvas 90

**Fecha:** 2026-10-13  
**Proyecto:** Canvas 90 (incluye el contexto de espacios Canvas 90, Pulso y Origen)  
**Naturaleza:** investigación funcional, comercial y operativa; insumo para decisiones y desarrollo futuro  
**Estado:** propuesta documentada, **NO implementada, NO contratada, NO desplegada**  
**Responsable de elaboración:** agente investigador / documentación  
**Desarrollo:** reservado para Codex o el agente técnico que se designe; ninguna tarea técnica queda autorizada por este documento.

## 1. Motivo y conocimiento que queremos preservar

Se evaluó DocuSeal como plataforma de firma electrónica de contratos de uso de espacios. La decisión del propietario en esta conversación es explícita: **deben firmar ambos, el cliente y un representante autorizado de Canvas 90**.

El objetivo NO es crear un contrato por cada reserva. El contrato será **general, sin horas específicas**. Las horas y el pago se gestionarán por el proceso de reservaciones.

**Nueva línea de exploración:** desarrollar la contratación con DocuSeal como **proceso paralelo y desacoplado** de Mercado Pago. Es deseable automatizar aquello que ahorre administración (generación, solicitud y seguimiento de firmas, expediente y notificaciones), pero **sin añadir barreras, cuentas ni complejidad al cliente**. No se ha aprobado una integración obligatoria entre ambos sistemas.

### Relación con decisiones vigentes del proyecto

- La investigación de Mercado Pago está en **PR #13**: https://github.com/vaisork/Canvas/pull/13 (archivo propuesto `docs/investigacion-reservas-mercado-pago.md`). Allí se definió contrato **fuera del sistema de reservas**, página de reservas sin enlace público, tres calendarios independientes y cobro total. **Se conserva ese alcance.**
- La investigación de DocuSeal **no reemplaza, fusiona ni modifica** la PR #13. Una hipotética conexión técnica entre contrato y reservas se considera fase posterior y requiere decisión nueva.
- El sitio es estático y se publica por GitHub Pages desde `main`; no debe suponerse que tiene backend o almacenamiento seguro de expedientes.
- El cliente **no necesita firmar un documento por cada renta** ni crear usuario o contraseña solo para reservar.

## 2. Separación de procesos y responsabilidades

| Proceso | Herramienta candidata | Responsabilidad | No debe asumir |
| --- | --- | --- | --- |
| Formalización de relación comercial | DocuSeal | Plantilla, identidad declarada, firma de cliente y Canvas 90, evidencia, contrato final | Inventario de horas, tarifas, pagos |
| Reservas por horas | Web / sistema de disponibilidad Canvas 90 | Espacio, fecha, horas consecutivas libres, reglas tarifarias, estado de reserva | Contrato electrónico o función de firma |
| Cobro de renta | Mercado Pago | Cobrar 100%, informar transacción y permitir verificación del pago por servidor | Determinar si existe contrato firmado o dar disponibilidad |
| Administración humana | Responsable Canvas 90 | Validar datos del cliente, aprobar/firma de Canvas 90, compartir URL de reservas al autorizado, resolver excepciones | Delegar su firma a un bot sin autorización |

**Punto de coordinación mínimo (operativo):** cuando exista contrato completo de ambas partes, el responsable comparte al cliente el enlace de reservas. En esta primera etapa no hace falta desarrollar una validación automática del contrato en el sitio de reservas. La URL privada **puede reenviarse** y NO es autenticación; riesgo conocido y aceptado por el alcance de la PR #13.

## 3. Flujo recomendado — Etapa 1 (sin integración y sin cuota mensual)

1. Preparar una **plantilla única y versionada** de contrato general de uso, revisada jurídicamente, con campos de cliente y representante autorizado de Canvas 90.
2. Definir roles de firma **Cliente** y **Representante Canvas 90**. Mantener firma de ambos; proponer **cliente primero y Canvas 90 después de revisar información** (orden sujeto a decisión operativa).
3. Habilitar enlace compartido para plantilla con múltiples partes. **Configurar el correo fijo del representante de Canvas 90**, dejando el del cliente para que lo introduzca, conforme a la guía oficial.
4. Enviar el enlace al cliente mediante WhatsApp o correo propio; no depender del envío de invitaciones desde DocuSeal.
5. Activar **OTP de verificación por correo** del cliente en enlaces compartidos si la prueba confirma buen funcionamiento y costos. Registrar correctamente el contacto y el consentimiento.
6. El cliente firma. El representante revisa los datos y firma. **No clasificar como «firmado/completo» hasta que estén ambas firmas**.
7. Descargar y almacenar el **PDF final y la evidencia/registro de auditoría** en un repositorio privado adecuado, con acceso restringido. Registrar fecha, versión, identificador del documento y estatus; jamás subir contratos reales, identificaciones o datos de contacto a este repositorio público.
8. Compartir el enlace de reservas solo después de verificar manualmente la formalización; a partir de ahí, reservas y pagos siguen independientes.

**Ventaja:** etapa operable por el equipo sin backend, sin modificar GitHub Pages ni el alcance del sistema de pagos. DocuSeal documenta la firma con múltiples partes, orden de firmas y enlaces compartidos.  
**Advertencia:** enlace compartido de plantilla **no equivale a enlace privado único por persona**; cualquiera que lo reciba puede iniciar firma. Separar claramente los documentos creados y verificar identidad/contacto y estado de cada envío.

## 4. ¿Qué conviene automatizar primero?

### Priorización de retorno vs. complejidad

| Prioridad | Automatización candidata | Beneficio | Método inicial | Condición |
| --- | --- | --- | --- | --- |
| P0 | Plantilla estándar con dos roles y campos obligatorios | Evita rehacer contratos y omisiones | Configuración DocuSeal | Revisar redacción legal |
| P0 | Compartir enlace de firma por WhatsApp + validación de contacto | Disminuye coordinación | Copiar enlace / mensaje tipo; OTP por correo si viable | Pruebas reales de 2 firmas |
| P0 | Estado claro **pendiente cliente → pendiente Canvas 90 → completado** | No autorizar reservas prematuramente | Panel DocuSeal + registro manual simple | Dos firmas comprobadas |
| P0 | Archivo privado por cliente de PDF final + auditoría | Recuperación y evidencia | Descarga + archivo controlado, p. ej. Drive privado | Política de datos y permisos |
| P1 | Alertas para contrato pendiente y recordatorio | Reduce seguimiento manual | Funciones disponibles del plan, o procedimiento manual | Comprobar plan; no asumir gratis |
| P1 | Registro semiautomático de contrato completado | Menos capturas manuales | Evaluar exportación / n8n / webhook | Confirmar Pro/API y costos |
| P2 | Envío personalizado único y sincronización automática de expediente | Escalabilidad | API de DocuSeal desde backend seguro | Volumen justifica Pro |
| P2 | Validación digital de contrato antes de reservar | Evitar accesos indebidos | Integración backend de estados | **Cambio de alcance**; no hacer por defecto |

### Recomendación expresa

**Arrancar por plantilla + dos firmas + seguimiento + archivo.** La automatización de reservas y Mercado Pago debe avanzar en otro frente. Evitar invertir ahora en un portal de usuarios, una base de datos de clientes o un microservicio propio solo para pasar de «contrato firmado» a «puede reservar».

**Nunca automatizar la aplicación de la firma de Canvas 90 sin una autorización y control de representación explícitos**. Automatizar la solicitud y las notificaciones no es lo mismo que firmar automáticamente en nombre de la empresa.

## 5. Viabilidad y modalidades de DocuSeal verificadas

### Hechos publicados por el proveedor (consultados 2026-10-13)

- **DocuSeal Cloud Basic:** USD 0/usuario/mes; **10 correos de solicitud de firma por mes**, no «10 contratos mensuales». Incluye varios firmantes.
- La documentación de **enlace compartido** permite solicitar firmas sin consumir el mecanismo de invitaciones enviadas por correo de DocuSeal, usando correo propio o mensajería para compartir. Incluye configuración de múltiples partes y opción de OTP por correo.
- **DocuSeal Cloud Pro:** precio publicado USD 20 por usuario al mes (comprobar moneda, impuestos y factura). Contempla solicitudes por correo ilimitadas, automatizaciones/webhooks e integración API.
- **API/embedding en producción:** tarifa publicada de USD 0.20 por documento completado, conforme a condiciones del proveedor. No suponer que sustituye la cuota Pro ni calcular costos sin validar el contrato comercial vigente.
- **Self-hosted open source:** software sin cuota de licencia de la edición abierta; requiere servidor, dominio/HTTPS, configuración SMTP, seguridad, actualizaciones, respaldos y mantenimiento. No significa operación con costo total cero.
- API pública y webhooks permiten en fase posterior reaccionar a `submission.completed` (se produce cuando **todas** las partes completaron la firma), distinto de `form.completed` (una parte completa su formulario).

**Precisión importante:** no se ha ejecutado una prueba con la cuenta real de Canvas 90. Antes de prometer uso gratuito de 20, 50 o más contratos, probar si los enlaces compartidos con dos firmantes, correos OTP, notificaciones y envío de copias consumen cuotas o tienen alguna restricción del plan en la cuenta que se abra. Las condiciones de precios pueden cambiar.

### Opciones

**A — Nube Basic con enlaces compartidos (recomendada para piloto):** bajo costo de arranque y poco trabajo; manejo y archivo manual. Riesgo de enlace compartido e identidad, mitigable parcialmente con OTP y verificación operativa.

**B — Nube Pro + integración posterior:** más automatización, eventos y API; solo cuando el volumen y los requisitos comerciales la justifiquen. Requiere servicio seguro para recibir webhooks, credenciales fuera del sitio estático y mecanismo de reintentos/idempotencia.

**C — Instalación propia:** control sobre dónde operan los datos, pero costos y responsabilidad de infraestructura. No elegir solo porque el proyecto usa Linux/Raspberry; analizar continuidad, soporte, respaldos y seguridad antes de desplegar datos contractuales.

## 6. Contrato base y controles de negocio (por definir con responsable legal)

**Contrato general** de uso de espacio, no ligado a una fecha/hora específica. Temas sugeridos para revisión: identidad y facultades de ambas partes; espacio(s) autorizado(s); modalidades de uso; reglas operativas; responsabilidad por daños; obligaciones, restricciones y aforo; cancelación y terminación; vigencia y eventual renovación; tratamiento de datos; aceptación de reglas comerciales de cada reservación y medios electrónicos; jurisdicción y métodos de notificación. **No redactar aquí cláusulas que se consideren ya aprobadas.**

Registro mínimo propuesto para el responsable:
- Identificador interno del contrato; cliente/persona o empresa; correo de contacto.
- Versión de plantilla, fecha de emisión, fecha de cada firma y fecha de finalización.
- Rol y representante firmante de Canvas 90.
- Referencia al PDF final y al registro de auditoría, guardados **fuera** del repo público.
- Estado: borrador, enviado, firmado por cliente, pendiente de Canvas 90, completo, rechazado, cancelado, vencido.
- Vigencia y observaciones **solo si** se definen en el contrato; no inventar un vencimiento.

**No agregar a GitHub:** contrato firmado, CURP, identificación oficial, domicilio, teléfonos, emails de clientes, claves API, tokens de firma, plantillas con datos privados.

## 7. Validación legal pendiente (México)

Existen disposiciones del **Código de Comercio** sobre uso de mensajes de datos y firmas electrónicas (véanse arts. 89 y siguientes). La **NOM-151-SCFI-2016** trata la conservación de mensajes de datos y digitalización. Esto **no prueba por sí solo** que un flujo específico de DocuSeal satisfaga todos los requisitos de un contrato mexicano ni que una firma simple equivalga a una firma electrónica avanzada.

Antes de contratación formal: abogado revisa texto, consentimiento, identificación del firmante, representación de Canvas 90, pruebas de integridad/atribución, auditoría, política de conservación y qué mecanismos de NOM-151 podrían aplicar. La activación de OTP **no sustituye** una verificación robusta de identidad si legalmente se requiere.

## 8. Prueba de aceptación para la siguiente sesión (sin iniciar integración)

1. Crear cuenta y plantilla de prueba con las dos partes y datos ficticios.
2. Verificar que DocuSeal **nunca trate como completo** un contrato con una sola firma.
3. Comprobar si el cliente puede firmar desde Android/iPhone con enlace enviado por WhatsApp.
4. Verificar el flujo de correo fijo de Canvas 90 y correo variable del cliente, con OTP.
5. Comprobar secuencia **cliente → representante**, incluyendo que el representante revisa antes de firmar; comparar con secuencia simultánea solo si es necesario.
6. Descargar PDF y registro de auditoría y confirmar que cada parte recibe/cuenta con la copia correspondiente.
7. Repetir con clientes ficticios distintos para verificar que no se crucen documentos ni destinatarios.
8. Observar contador de correos y límites reales de Basic; distinguir correo de solicitud, OTP, aviso y copia final.
9. Probar correcciones: email incorrecto, cliente abandona, rechaza contrato, firma solo una parte, expiración/enlace reenvíado.
10. Documentar evidencia de costo, restricciones y pasos operativos en esta nota antes de elegir automatización.

**Criterio de salida del piloto:** dos firmas por cliente, documento final inequívoco y recuperable, pasos entendibles desde móvil, costos y cuotas comprobados. Hasta entonces, **factibilidad probable pero no probada en Canvas 90**.

## 9. Propuesta de fases para desarrollo (trabajos separados)

### Fase D0 — Investigación y piloto manual [AHORA: SOLO DOCUMENTADA]
Configuración en la nube Basic, plantilla, dos firmantes, enlace y OTP, revisión y expediente. No tocar repositorio web ni Mercado Pago.

### Fase D1 — Operación administrativa optimizada [PROPUESTA]
Definir un procedimiento de alta de clientes y registro de contratos (podría ser una hoja privada y archivos privados); facilitar rastreo y recordatorios. Mantener autorización manual de acceso a reservas.

### Fase D2 — Automatización técnica opcional [PENDIENTE]
Evaluar Pro, evento seguro `submission.completed`, vinculación con expediente/Drive u otra base, verificación de autenticidad e idempotencia, recuperación ante errores, privacidad. **No añadir dependencia en las reservas salvo nueva autorización.**

### Frente R — Reservas y Mercado Pago [INDEPENDIENTE]
Continuar con la investigación de PR #13: calendarios independientes para Canvas 90, Pulso y Origen; horas consecutivas; tarifas por espacio/día; cobro del 100%; confirmar solo tras verificación de pago desde servidor. DocuSeal no participa en cobro, inventario ni bloqueo.

## 10. Decisiones, hipótesis y preguntas separadas

**Confirmado por el propietario (2026-10-13):** DocuSeal para Canvas 90; firman ambas partes; contrato general sin horas específicas (decisión previa); interés en mantenerlo separado de Mercado Pago, como proceso paralelo; automatizar lo conveniente sin complicar el lanzamiento.

**Recomendación de esta investigación, NO decisión del propietario:** piloto gratis por enlace compartido, orden cliente luego Canvas 90, OTP por correo, seguimiento y archivo manual primero.

**Requiere decisión/prueba posterior:** redacción exacta del contrato, persona con facultades para firmar por Canvas 90, cómo validar identidad y vigencia, dónde custodiar PDFs, si hace falta Pro, orden definitivo de firma, y si en algún futuro se conecta el estado contractual con la página de reservas.

## 11. Fuentes primarias consultadas (2026-10-13)

- Precios oficiales y características: https://www.docuseal.com/es/pricing
- Cómo recolectar firmas con enlace compartido, varios firmantes y OTP: https://www.docuseal.com/resources/collect-signature-via-shared-link
- Cómo agregar varios firmantes: https://www.docuseal.com/resources/add-multiple-signing-parties
- Configurar orden de firmas: https://www.docuseal.com/resources/set-signing-order
- API, estados y webhooks: https://www.docuseal.com/docs/api
- Uso de firma integrada (fase futura): https://www.docuseal.com/es/embedding
- Flujo con n8n: https://www.docuseal.com/resources/automate-with-n8n
- Código de Comercio: https://www.diputados.gob.mx/LeyesBiblio/pdf/CCom.pdf
- Registro oficial de NOM-151-SCFI-2016: https://platiica.economia.gob.mx/normalizacion/nom-151-scfi-2016/
- Investigación separada de pagos y reservas: https://github.com/vaisork/Canvas/pull/13

---

**Límite de autorización:** investigación para el desarrollo posterior; **no** ejecutar automatizaciones, emitir contratos reales, integrar APIs, alterar Mercado Pago, cambiar código del sitio, fusionar PR o desplegar servicios sin nueva instrucción.
