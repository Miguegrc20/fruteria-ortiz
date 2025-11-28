# Frutería Ortiz

Sitio web estático para una frutería local con navegación multi‑página, catálogo y componentes interactivos.

## Estructura
```
index.html              (Inicio + resumen institucional)
quienes-somos.html      (Página completa ¿Quiénes somos?)
mision.html             (Misión)
vision.html             (Visión)
politicas.html          (Políticas de calidad)
faq.html                (Preguntas frecuentes - acordeón)
ubicacion.html          (Mapa de ubicación física)
contacto.html           (Formulario de contacto con validación)
productos.html          (Catálogo con sistema de calificación por estrellas)
styles/                 (Hojas de estilo)
img/                    (Imágenes de productos y logo)
script.js               (Interactividad común)
```

## Funcionalidades
- Menú responsive (hamburger en móviles).
- Chat flotante con persistencia local (`localStorage`).
- FAQ con botones accesibles (atributo `aria-expanded`).
- Formulario de contacto con validaciones básicas y mensaje de éxito simulado.
- Calificación por estrellas en cada producto (persistencia en `localStorage`).
- Enlaces a redes sociales en el footer.
- Mapa embebido de Google Maps para ubicación.

## Archivos clave
- `styles/styles.css`: estilos globales, componentes (chat, FAQ, rating, formulario).
- `script.js`: inicialización de menú, chat, FAQ, formulario y ratings.

## Cómo probar
1. Abrir `index.html` en un navegador.
2. Navegar a cada sección mediante el menú.
3. Probar:
	- Chat: abrir, enviar mensajes y recargar (deben persistir).
	- FAQ: expandir/colapsar preguntas.
	- Formulario: intentar enviar vacío (muestra errores) y luego válido.
	- Ratings en `productos.html`: elegir calificación y recargar.

## Personalización rápida
- Sustituir URLs de redes sociales por las reales del negocio.
- Ajustar el iframe de Google Maps con coordenadas exactas si cambia la ubicación.
- Cambiar colores principales en `styles.css` (`#2e8b57`, `#0077cc`, `#ffa500`).

## Próximas mejoras sugeridas
- Integración de envío real del formulario (EmailJS o backend ligero).
- Carrito de compras con almacenamiento local y resumen.
- Búsqueda o filtrado de productos.
- Optimización de imágenes (formato WebP/AVIF y tamaños). 

## Licencia
Proyecto interno/demostrativo. Ajustar según necesidades comerciales.
