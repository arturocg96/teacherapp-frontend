# TeacherApp Frontend

**TeacherApp Frontend** es la interfaz de usuario del proyecto final elaborado para el Máster FullStack Developer de la Universidad Internacional de la Rioja (UNIR).

Esta aplicación web proporciona una interfaz intuitiva para:

- Registro y gestión de perfiles de profesores y alumnos
- Panel de administración para validación de profesores
- Sistema de mensajería entre usuarios
- Búsqueda y filtrado de profesores
- Gestión de clases y materias

## Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Instalación y Configuración](#instalación-y-configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Licencia](#licencia)

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (v18.2.0 o superior)
- [Angular CLI](https://angular.io/cli) (v18.2.8)
- [Git](https://git-scm.com/)

Y que tienes tokens válidos para usar la api de maps y de geocode de google. [https://cloud.google.com/apis](https://cloud.google.com/apis)

## Instalación y Configuración

1. **Clonar el repositorio**

```bash
git clone https://github.com/arturocg96/teacherapp-frontend.git
cd teacherapp-front
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Creación de las variables environments**

Debes crear una carpeta `enviroments` dentro de `src` y dentro de esta carpeta crear un archivo .ts llamado `environments.ts`

Por terminal, estando en la carpeta raíz `teacherapp-front`, podemos crearlo así:

```bash
cd src
mkdir environments
touch environments.ts
```

El contenido del archivo enviroments.ts debe tener este formato:

```bash
export const environment = {
  token: 'tu_token_googlemaps',
  mytoken: 'tu_token_api_mapbox',
  API_URL: 'http://localhost:3000',
};
```

`API_URL` es la ruta local a tu backend

4. **Iniciar el servidor de desarrollo**

```bash
ng serve
```

La aplicación estará disponible en `http://localhost:4200/`

## Estructura del Proyecto

El proyecto sigue una estructura modular de Angular:

```plaintext
src/
├── app/
│   ├── components/        # Componentes reutilizables
│   ├── pages/            # Páginas principales
│   ├── services/         # Servicios
│   └──  interfaces/       # Interfaces TypeScript
├── assets/              # Recursos estáticos
└── environments/        # Configuración de entornos
```

## Tecnologías Utilizadas

### Framework y Core

- Angular v18.2.0
- TypeScript v5.5.2
- RxJS v7.8.0

### UI/UX

- Bootstrap v5.3.3
- Font Awesome v6.6.0
- SweetAlert2 v11.14.4

### Mapas y Geolocalización

- Angular Google Maps v18.2.10

### Autenticación

- JWT Decode v4.0.0

## Licencia

Este proyecto está bajo la Licencia MIT. Para más detalles, consulta el archivo [LICENSE](LICENSE).

```1:21:LICENSE
MIT License

Copyright (c) 2024 Grupo 1 Master Unir Desarrollo Web Full Stack 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
