# Portfolio Nuxt 4 – Victor Garcés

Bienvenido a mi portfolio personal construido con Nuxt 4, Tailwind CSS y Nuxt UI. Este proyecto presenta mi trabajo como desarrollador front-end y diseñador, con un enfoque en interfaces limpias, responsivas y modernas.  

***

## 🚀 Características principales

- **Basado en Nuxt 4**: arquitectura moderna, rendimiento optimizado y soporte completo para Vue 3.  
- **Tailwind CSS**: utilidades CSS para un diseño rápido, responsivo y con modo claro/oscuro.  
- **Nuxt UI**: componentes accesibles y estilizados para acelerar la construcción.  
- **Secciones Complejas**: hero, sobre mí, experiencia laboral, blog, testimonios y FAQ, cada una con componentes dedicados.  
- **Soporte Modo Claro/Oscuro**: adaptación automática según preferencia del usuario.  
- **Animaciones con Motion**: transiciones y efectos suaves para una experiencia atractiva.  
- **Contenido gestionado con `@nuxt/content`**: fácil mantenimiento y escalabilidad mediante archivos Markdown/YAML.  

***

## 📂 Estructura del proyecto

```
components/
  landing/
    LandingHero.vue       # Hero con avatar, título, descripción y CTA
    LandingAbout.vue      # Sección "Sobre mí"
    LandingWorkExperience.vue # Experiencia laboral con timeline
    LandingBlog.vue       # Vista resumen para blog
    LandingTestimonials.vue # Carousel de testimonios
    LandingFAQ.vue        # Preguntas frecuentes con acordeones
  AppFooter.vue           # Footer personalizado usando Nuxt UI gratuito

content/
  index.yml               # Contenido principal con SEO, hero, about, experiencia...
  blog/                   # Posts de blog (Markdown)
  projects/               # Datos de proyectos (YAML)

pages/
  index.vue               # Página principal que carga y renderiza componentes landing

app.config.ts            # Configuración global para footer, datos y más

nuxt.config.ts           # configuración de Nuxt y módulos (Tailwind, Nuxt UI)

assets/css/main.css      # Tailwind base, utilities y estilo global
```

***

## 🛠️ Instalación y desarrollo

1. **Clona el repositorio**

```bash
git clone https://github.com/tuusuario/tuportfolio.git
cd tuportfolio
```

2. **Instala dependencias**

```bash
pnpm install
```

3. **Inicia el servidor de desarrollo**

```bash
pnpm dev
```

4. **Accede a** http://localhost:3000 para ver el sitio en tu navegador.

***

## 🎨 Diseño y contenido

- **Configuración de Tailwind CSS**: usando módulo oficial `@nuxtjs/tailwindcss` para estilizado rápido.  
- **Modo oscuro/claro** con soporte en CSS y lógica en componentes.  
- **Contenido dinámico** definido en `content/index.yml` y consumido con `@nuxt/content`.  
- **Componentes modulares** para una estructura clara y escalable.

***

## 📄 Uso del contenido YAML (`index.yml`)

Ejemplo de estructura para el hero:

```yaml
hero:
  title: "Hola, soy Víctor"
  description: "Desarrollador Front-End y Filmmaker"
  links:
    - label: "Ver Proyectos"
      to: "/projects"
      color: "primary"
  images:
    - src: "/avatar.jpg"
      alt: "Avatar Víctor"
```

Secciones adicionales como `about`, `experience`, `testimonials`, `blog`, y `faq` siguen un esquema definido para facilitar el mantenimiento.

***

## 💡 Buenas prácticas

- Mantén actualizado el contenido en `content/index.yml` para editar en un solo lugar.  
- Usa componentes en `components/landing/` para secciones específicas, manteniendo el código limpio.  
- Personaliza colores y temas en `tailwind.config.js` y CSS global en `assets/css/main.css`.  
- Gestiona rutas y SEO mediante composables Nuxt (`useSeoMeta`).

***

## 🙋‍♂️ Soporte y contribución

Si encuentras bugs o tienes sugerencias, abre un issue o Pull Request en el repositorio GitHub.

***

## 🔗 Enlaces útiles

- [Documentación Nuxt 4](https://v4.nuxtjs.org)  
- [Tailwind CSS](https://tailwindcss.com)  
- [Nuxt UI](https://ui.nuxtjs.org)  
- [Nuxt Content](https://content.nuxtjs.org)

***

¡Gracias por visitar mi portfolio! Siempre abierto a nuevos proyectos y colaboraciones.

***

*Victor Garcés*  
Front-End Developer & Filmmaker

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.
