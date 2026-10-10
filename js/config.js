/*
 * Configuración de la landing. Completar con los datos que confirme la escuela.
 *
 * formEndpoint: URL que recibe las solicitudes por POST (JSON). Puede ser un
 *   servicio de formularios que reenvíe al correo comercial, un webhook del CRM
 *   u otra integración confirmada. Debe responder con un estado 2xx solo cuando
 *   la solicitud se haya guardado o enviado correctamente.
 *   Mientras esté vacío, el formulario mostrará el mensaje de error de envío.
 *
 * privacyUrl: URL de la política de privacidad de la escuela.
 */
window.LANDING_CONFIG = {
  formEndpoint: '',
  privacyUrl: ''
};
