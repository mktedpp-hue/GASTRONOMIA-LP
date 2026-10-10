# Landing · Gastronomía en Brasas

Landing estática (HTML, CSS y JS sin dependencias) del curso presencial de 3 meses de la Escuela Peruana de Parrilleros. Para verla, abre `index.html` o publica la carpeta en cualquier hosting estático.

```
index.html        Contenido de los 9 bloques (todo el texto es editable aquí)
css/styles.css    Estilos y adaptación responsiva (1024px, 860px, 640px y 380px)
js/config.js      Destino del formulario y URL de la política de privacidad
js/main.js        Menú móvil, temario desplegable, validación y envío del formulario
assets/img/       Fotografías y logotipo autorizados
```

## Pendiente antes de publicar

1. **Destino del formulario**: completar `formEndpoint` en `js/config.js` (servicio de formularios que reenvíe al correo comercial, webhook del CRM, etc.). Se envía un POST JSON con `nombre`, `whatsapp`, `correo`, `objetivo`, `consentimiento`, `curso`, `origen` y `fecha`. El mensaje de éxito solo aparece si el destino responde con un estado 2xx; mientras esté vacío, el formulario muestra el error de envío.
2. **Política de privacidad**: completar `privacyUrl` en `js/config.js` (enlace del formulario y del pie).
3. **Imágenes** (si falta un archivo, la página muestra un fondo o ilustración de respaldo):
   - Portada: `assets/img/hero-horizontal.webp` (escritorio y tableta) y `hero-vertical.webp` (móvil), con versiones reducidas; ya incluidas.
   - `assets/img/oportunidades.jpg`: foto horizontal de preparación o corte de carne.
   - Equipos: `assets/img/equipo-*.png` (ya incluidos, recortes con fondo transparente).
   - Logotipo oficial: reemplazar el texto de la marca en el encabezado (ver comentario en `index.html`).
4. **Licencia de la tipografía de títulos**: Handelson Four (`assets/fonts/`) se descargó con licencia *solo para uso personal*. Antes de publicar, comprar una licencia comercial con el autor o cambiar `--font-display` en `css/styles.css` por una fuente con licencia libre.
5. **Validar con la escuela**: condiciones de certificación, prácticas, bolsa de trabajo y comunidad; requisitos de admisión. No se publicaron inversión, horarios, fechas ni contacto adicional.

## Comprobación

- Menú y CTA: desplazamiento a `#curso`, `#temario`, `#para-quien` y `#formulario`.
- Temario: cada módulo abre y cierra con "Ver temario / Ocultar temario".
- Formulario: nombre y WhatsApp obligatorios (con +51 se exige un celular de 9 dígitos que empieza en 9), correo opcional validado, consentimiento desmarcado y obligatorio, bloqueo de envíos duplicados.
- Enviar una solicitud de prueba real una vez configurado el destino.
