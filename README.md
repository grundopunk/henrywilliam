# Grundo Record – Sitio estático

Sitio multipágina en HTML/CSS/JS (blanco/gris, botones negros, galería tipo portafolio).

## Estructura
- `index.html` (Inicio con Hero, Servicios, Proyectos, Precios, Contacto)
- `servicios.html`, `proyectos.html`, `precios.html`, `contacto.html`, `inspiracion.html`
- `css/`, `js/`

## Publicar en GitHub Pages (rama `main`)
1. Crea un repositorio en GitHub (p. ej. `grundo-record`).
2. Sube todos los archivos de este proyecto a la **raíz** del repo (no dentro de una carpeta).
3. En GitHub: **Settings → Pages → Branch**: elige `main` y carpeta `/ (root)`, guarda.
4. Espera 1–2 minutos y abre la URL pública que te muestra (algo como `https://<tu-usuario>.github.io/grundo-record/`).

### Con Git (opcional)
```bash
git init
git add .
git commit -m "Deploy sitio Grundo Record"
git branch -M main
git remote add origin https://github.com/<tu-usuario>/grundo-record.git
git push -u origin main
```