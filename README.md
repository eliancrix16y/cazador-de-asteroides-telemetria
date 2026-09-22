# Cazador de Asteroides — Telemetría de FPS

Mini proyecto de **Resultado de Aprendizaje 1 (RA1)** — Aplicaciones Web con JavaScript.
Combinación de un **videojuego de naves (Asteroids)** con un **contador de fotogramas (FPS) propio** y telemetría de colisiones en tiempo real.

## Integrantes del equipo

| Nombre | Matrícula / Grupo |
| ------ | ----------------- |
| *Elian* | *[por completar]* |
| *[Ingresar segundo integrante]* | *[por completar]* |

## Descripción funcional

- **Videojuego** tipo *Asteroids* con física vectorial: inercia, rotación, aceleración, envoltura de bordes y fragmentación de asteroides en cada impacto.
- **Contador de FPS propio**: el juego mide su propia tasa de fotogramas a partir de `requestAnimationFrame` (independiente de herramientas externas) y muestra *FPS actual, promedio, mínimo, máximo, tiempo de cuadro y total de cuadros*.
- **Telemetría de colisiones**: se reportan por fotograma las *evaluaciones de colisión* realizadas y el *número de entidades activas*, conectando el rendimiento (FPS) con la carga de trabajo real del juego.
- **Gráfica en vivo** del historial de FPS dentro de la sesión.
- **Modalidades de juego**: el menú permite elegir entre **Clásico** (3 naves, oleadas progresivas), **Velocidad** (45 s para el máximo puntaje, sin perder naves, con temporizador en pantalla) y **Supervivencia** (oleadas más rápidas e infinitas, 1 sola nave).
- **Escenas**: menú (con nombre del piloto y selección de modalidad), juego, pausa y **fin de partida** (resumen con modalidad; permite reintentar o volver al menú).
- **Apartado visual**: fondo con campo de estrellas, nave con cabina y llama de propulsión animada, asteroides con relieve interior y balas con brillo.
- **Controles**: teclado (W/A/S/D, flechas, espacio, P) y **controles táctiles** en pantalla para móviles.
- **Backend de apoyo obligatorio**: API REST que guarda las puntuaciones en una **base de datos SQLite** y expone una **tabla de mejores pilotos (leaderboard)**.

## Requisitos previos

- **Node.js 22.13 o superior** (incluye el módulo integrado `node:sqlite`). No se requieren dependencias externas ni npm install.
- Un navegador moderno (Chrome, Edge, Firefox).

## Cómo jugar en un solo clic (recomendado)

No hace falta escribir comandos:

1. **Doble clic en `ComenzarPartida.cmd`** (raíz del proyecto). El iniciador:
   - Busca Node.js automáticamente (instalado en el sistema, o en rutas comunes).
   - Levanta el servidor en segundo plano (`node server.js`).
   - Espera a que esté listo y abre el navegador en **http://localhost:3000**.
2. Juega. Cuando termines, **doble clic en `DetenerPartida.cmd`** para apagar el servidor.

Si no hay Node.js en el equipo, el iniciador lo avisa y muestra cómo instalarlo (https://nodejs.org).

También puedes abrir `frontend/index.html` directamente (doble clic, sin servidor): el juego corre igual y solo el guardado de puntuaciones / leaderboard requiere el servidor activo. `frontend/src/js/app.js` es un *bundle* clásico generado desde los ES modules de `src/js` (`node scripts/bundle.js`); no se edita a mano.

## Instalación y ejecución

1. Descargar y descomprimir el proyecto (o clonar el repositorio).
2. Abrir una terminal en la raíz del proyecto.
3. Ir a la carpeta del backend:

   ```bash
   cd backend
   npm start
   ```

   (equivale a `node server.js`; también disponible `npm run dev` con recarga automática)

4. Abrir el navegador en **http://localhost:3000**

El servidor entrega el **frontend** y la **API** juntos. La base de datos SQLite se crea automáticamente en `backend/data/scores.db` (ignorada por Git).

> Si tu equipo descargó Node como ZIP, extrae el contenido **fuera de OneDrive** (por ejemplo `C:\node`) y agrégalo al PATH: el iniciador lo encontrará automáticamente.

## Configuración (variables de entorno)

Ver `.env.example`. Copiar como `.env` si se desea personalizar:

| Variable       | Descripción                                | Valor por defecto     |
| -------------- | ------------------------------------------ | --------------------- |
| `PORT`         | Puerto del servidor                        | `3000`                |
| `DB_PATH`      | Ruta del archivo SQLite (relativo a backend) | `./data/scores.db`  |
| `CORS_ORIGIN`  | Orígenes permitidos, separados por coma    | `*`                   |

`.env` está excluido de Git (`.gitignore`) y no contiene credenciales sensibles.

## Controles del juego

| Acción     | Teclado                    | Táctil |
| ---------- | -------------------------- | ------ |
| Acelerar   | `↑` / `W`                  | Botón ▲ |
| Rotar      | `←` / `→` / `A` / `D`      | Botones ◄ ► |
| Disparar   | `Espacio`                  | Botón ● |
| Pausa      | `P`                        | —      |

## Estructura del proyecto

```
proyecto combinado/
├── .env.example
├── .gitignore
├── backend/
│   ├── package.json
│   ├── server.js               # Levanta el servidor (solo orquesta)
│   └── src/
│       ├── config/             # Entorno (.env) y conexión a SQLite
│       ├── routes/             # Definición de rutas /api/scores
│       ├── controllers/        # Recibe la petición y delega
│       ├── services/           # Reglas de negocio
│       ├── repositories/       # Acceso a datos (consultas parametrizadas)
│       ├── middlewares/        # Validación, 404 y manejo de errores
│       ├── http/               # Enrutador, cuerpo JSON y estáticos (Node puro)
│       └── utils/              # Respuestas JSON uniformes
├── frontend/
│   ├── index.html
│   ├── scripts/                # Generador del bundle (node scripts/bundle.js)
│   └── src/
│       ├── css/                # Estilos separados, responsivos
│       ├── js/
│       │   ├── main.js         # Punto de entrada: solo orquesta
│       │   ├── app.js          # Bundle clásico generado desde los ES modules
│       │   ├── engine/         # Bucle, tiempo, render, colisiones
│       │   ├── entities/       # Player, Bullet, Asteroid, Particle
│       │   ├── input/          # Teclado y táctil aislados
│       │   ├── scenes/         # Menú, juego, pausa, fin
│       │   ├── fps/            # Monitor de FPS, clasificación y panel
│       │   ├── modules/        # Contexto y generador de oleadas
│       │   ├── services/       # Cliente de API y leaderboard
│       │   └── utils/          # Vec2, matemáticas, DOM
│       └── assets/             # Imágenes, sonidos y fuentes
├── documentacion/
│   ├── capturas/               # Capturas de la aplicación
│   ├── documento-tecnico.md
│   └── guion-video.md
└── Requerimientos_Mini_Proyecto_RA1.pdf
```

## API REST

Base: `/api/scores`

| Método | Ruta        | Descripción                                     | Códigos |
| ------ | ----------- | ----------------------------------------------- | ------- |
| GET    | /api/scores | Devuelve el top 10 de puntuaciones              | 200     |
| POST   | /api/scores | Registra una puntuación nueva                   | 201, 400, 500 |

Respuesta uniforme: `{ "success": boolean, "data": [...]|null, "message": string }`

Cuerpo de `POST /api/scores`:

```json
{
  "playerName": "Elian",
  "score": 340,
  "waveReached": 6,
  "averageFps": 58
}
```

La validación de entrada exige nombre de 1 a 16 caracteres, `score`/`waveReached` enteros en rango y `averageFps` numérico; se responde `400` con detalle si algo falla. Las consultas SQL usan **parámetros enlazados (?)**, preveniendo inyección SQL.

## Capturas de pantalla

- Menú principal con selección de modalidades: `documentacion/capturas/menu.png`
- *(Pendiente: capturas de la partida en acción y del panel de telemetría.)*

## Documentación y defensa

- Documento técnico (3–5 pág.): `documentacion/documento-tecnico.md` — descripción, diagrama de arquitectura, diagrama de la BD y puntos de acceso de la API.
- Guion del video: `documentacion/guion-video.md`.
- Video de 5–8 minutos explicando funcionamiento y estructura.
- Defensa oral: cada integrante debe explicar cualquier parte del código.
```