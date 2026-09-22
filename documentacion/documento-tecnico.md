# Documento técnico — Cazador de Asteroides: Telemetría de FPS

**Proyecto:** Mini proyecto RA1 — Aplicaciones Web con JavaScript
**Autores:** *Elian* [por completar], *[segundo integrante]* [por completar]
**Fecha:** Septiembre 2026

---

## 1. Descripción general

**Cazador de Asteroides** es un videojuego de naves tipo *Asteroids* que combina tres resultados en una sola aplicación web:

1. Un **videojuego con física vectorial** (inercia, rotación, aceleración, envoltura de bordes y fragmentación de asteroides).
2. Un **contador de fotogramas (FPS) propio**: la aplicación mide su propia tasa de fotogramas a partir de `requestAnimationFrame`, sin depender de herramientas externas, y la muestra en tiempo real junto con telemetría de colisiones.
3. Una **API REST** con **base de datos SQLite** que guarda las puntuaciones y expone una tabla de mejores pilotos (*leaderboard*).

El frontend se abre por simple **doble clic en `frontend/index.html`** (funciona sin servidor gracias a un *bundle* clásico) o a través del servidor en `http://localhost:3000`, que además entrega la API.

## 2. Objetivos y alcance

- Implementar un bucle de juego robusto basado en `requestAnimationFrame`.
- Medir FPS propios y clasificarlos (FLUIDO / REGULAR / DEFICIENTE).
- Vincular el rendimiento con la carga de trabajo real del juego (colisiones evaluadas y entidades activas por fotograma).
- Ofrecer tres **modalidades de juego** seleccionables desde el menú.
- Guardar puntuaciones mediante una API REST con validación, respuestas uniformes y consultas SQL seguras (parámetros enlazados).

## 3. Arquitectura del sistema

### 3.1 Vista general

```
┌─────────────────────────────┐      HTTP /static (index, css, js, png)
│         NAVEGADOR           │◄───────────────────────────────┐
│  frontend/index.html        │                                │
│  ├─ css/  (5 hojas)         │─────────────────────────────────┤
│  ├─ src/js/app.js (bundle)  │   POST /api/scores (JSON)       │
│  └─ src/js/* (módulos ES)   ├─────────────────────────────►   │
└─────────────────────────────┘                                │
                                                      ┌────────┴─────────┐
                                                      │  BACKEND (Node)  │
                                                      │  backend/server.js│
                                                      │  ├─ routes        │
                                                      │  ├─ controllers   │
                                                      │  ├─ services      │
                                                      │  ├─ repositories  │
                                                      │  └─ middlewares   │
                                                      └────────┬─────────┘
                                                               │ node:sqlite
                                                      ┌────────┴─────────┐
                                                      │  SQLite          │
                                                      │  backend/data/   │
                                                      │  scores.db       │
                                                      └──────────────────┘
```

### 3.2 Arquitectura del frontend (módulos ES)

```
main.js  (orquesta el arranque, bootstrap)
  ├─ engine/    game-loop (bucle rAF), time-manager, renderer, collisions
  ├─ entities/  player, bullet, asteroid, particle
  ├─ input/     key-input (teclado), touch-input (táctil), shooter-input (abstracción)
  ├─ scenes/    menu, play, pause, game-over + scene-runner (máquina de escenas)
  ├─ fps/       fps-monitor, fps-classifier, telemetry-panel
  ├─ modules/   game-context, wave-spawner
  ├─ services/  leaderboard-service, api-client, api-state
  └─ utils/     vector2, math-utils, dom-utils
```

**Bundle clásico.** Los módulos ES se combinan con `frontend/scripts/bundle.js` generando `frontend/src/js/app.js`, un único script clásico **sin `import`/`export` a nivel superior**. Esto permite que `index.html` funcione por `file://` (los navegadores bloquean ES modules locales por CORS). `app.js` no se edita a mano.

**Arranque (`main.js`).** `bootstrap()` crea el renderer, el monitor de FPS, el panel de telemetría, las entradas y las escenas; las registra en `SceneRunner`, cambia al menú e inicia `GameLoop`.

## 4. El juego

### 4.1 Física vectorial (`utils/vector2.js`, `entities/player.js`)

- `Player.applyThrust` acelera añadiendo al vector de velocidad una componente en el ángulo de la nave.
- Fricción `PLAYER_FRICTION = 0.992` por fotograma y tope `PLAYER_MAX_SPEED = 260`.
- Rotación controlada por `PLAYER_TURN_RATE = 3.4`.
- `wrapPosition` implementa la **envoltura de bordes**: la nave y los asteroides reaparecen del lado opuesto del lienzo (620×460).

### 4.2 Asteroides y colisiones (`modules/wave-spawner.js`, `engine/collisions.js`)

- Los asteroides nacen en el borde del lienzo; la oleada crece con el nivel (`BASE_WAVE_SIZE = 3` + número de oleada) y su velocidad aumenta (`WAVE_SPEED_PER_LEVEL = 4`).
- Tres tamaños (grande 32px, mediano 19px, pequeño 10px) con puntuación 20/50/100.
- Al impactar se **fragmentan en dos** del siguiente tamaño.
- Colisiones: bala–asteroide (puntos + fragmentos) y nave–asteroide (pérdida de vida con respawn e invencibilidad temporal).

### 4.3 Modalidades de juego (`constants.js`)

| Modalidad   | Naves  | Tiempo | Bonificación de velocidad | Característica                          |
| ----------- | ------ | ------ | ------------------------- | --------------------------------------- |
| Clásico     | 3      | —      | 0                         | Oleadas progresivas                     |
| Velocidad   | ∞      | 45 s   | 0                         | Temporizador en HUD; máximo puntaje     |
| Supervivencia | 1    | —      | 25                        | Oleadas más rápidas e infinitas         |

El menú muestra tarjetas seleccionables; la escena `PlayScene` lee la configuración del `GameContext` y ajusta vidas, temporizador (`checkTimeLimit`) y velocidad de oleadas (`speedBonus`).

### 4.4 Escenas (`scenes/`)

`SceneRunner.changeScene` ejecuta `exit()` de la escena saliente y `enter()` de la entrante, con salvaguardas por si la escena no define alguno de los métodos (evita romper el bucle). Escenas: **Menú** (nombre + modalidad + leaderboard), **Juego**, **Pausa** (tecla P) y **Fin de partida** (resumen con modalidad; reintentar o volver al menú).

## 5. Bucle de juego resiliente (`engine/game-loop.js`)

El bucle es la pieza crítica; por eso se protege:

- `frame()` procesa cada cuadro dentro de un `try/catch` que **nunca detiene el juego**: los errores puntuales de un fotograma se registran una sola vez (deduplicados por mensaje) y el siguiente `requestAnimationFrame` se encola en un bloque `finally`.
- `TimeManager.calculateDelta` limita el delta a `MAX_DELTA_SECONDS = 0.05` para evitar saltos por inactividad de pestaña.
- Este diseño se sometió a una prueba de estrés de **8000 fotogramas** con pausas y saltos de reloj: 0 errores.

## 6. Telemetría de FPS propia (`fps/`)

- `FpsMonitor` mide el intervalo real entre `requestAnimationFrame`, actualiza promedio/mín/máximo, total de cuadros, tiempo de cuadro y mantiene un historial para la gráfica.
- `FpsClassifier` clasifica según umbrales: ≥ 50 **FLUIDO** (verde), ≥ 30 **REGULAR** (ámbar), < 30 **DEFICIENTE** (rojo).
- `TelemetryPanel` enlaza los valores con el DOM y dibuja la **gráfica en vivo** en el lienzo `fps-graph`.
- **Vínculo con la carga**: `PlayScene.reportTelemetry` registra cada fotograma las *evaluaciones de colisión* (`asteroides × balas + asteroides`) y las *entidades activas*. Así, una caída de FPS puede correlacionarse con la carga real del juego.

## 7. Backend y API REST (`backend/`)

`server.js` solo **orquesta**; cada responsabilidad vive en su capa: `routes` → `controllers` → `services` → `repositories` → SQLite, más `middlewares` (validación, 404, errores) y `http` (enrutador, cuerpo JSON, estáticos). Sin dependencias externas.

### 7.1 Puntos de acceso

Base: `/api/scores`

| Método | Ruta         | Descripción                       | Códigos      |
| ------ | ------------ | --------------------------------- | ------------ |
| GET    | /api/scores  | Top 10 de puntuaciones            | 200          |
| POST   | /api/scores  | Registra una puntuación           | 201, 400, 500 |

Respuesta uniforme: `{ "success": boolean, "data": []|null, "message": string }`

```json
{
  "playerName": "Elian",
  "score": 340,
  "waveReached": 6,
  "averageFps": 58
}
```

### 7.2 Validación y seguridad

- El middleware valida: nombre de 1–16 caracteres, `score`/`waveReached` enteros en rango y `averageFps` numérico; respuesta `400` con detalle si algo falla.
- Consultas SQL con **parámetros enlazados (`?`)** — previene inyección SQL.
- JSON corrupto → `400`. Rutas inexistentes → `404`. CORS configurable (`CORS_ORIGIN`, por defecto `*`).

## 8. Base de datos

Diagrama de la tabla `scores`:

```
scores
┌───────────────┬────────────┬──────────┐
│ columna       │ tipo       │ nota     │
├───────────────┼────────────┼──────────┤
│ id            │ INTEGER    │ PK, auto │
│ playerName    │ TEXT       │ not null │
│ score         │ INTEGER    │ not null │
│ waveReached   │ INTEGER    │ not null │
│ averageFps    │ REAL       │ not null │
│ createdAt     │ TEXT       │ ISO 8601 │
└───────────────┴────────────┴──────────┘
```

Se usa el módulo integrado **`node:sqlite`** (Node ≥ 22.13). El archivo `backend/data/scores.db` se crea automáticamente y está excluido de Git (`.gitignore`). No se requieren dependencias externas ni `npm install`.

## 9. Verificación y pruebas

| Prueba                        | Resultado                                                    |
| ----------------------------- | ------------------------------------------------------------ |
| Bundle clásico                | 18/18 comprobaciones (sin imports top-level, clases presentes, bootstrap) |
| API REST                      | 11/11 (GET/POST, validación, 400/404, servicio de estáticos)   |
| DOM shim (sin navegador)      | Carga → menú → *Velocidad* → game over por tiempo → retry     |
| Estrés del bucle              | 8000 fotogramas, 0 errores capturados                         |
| Chromium real (headless)      | Partida dibujada: 3107 píxeles de entidades, 0 excepciones    |
| Estilo/consistencia           | 50 archivos sin violaciones; HTML/JS/CSS consistentes         |
| Repositorio `.git`            | `fsck` manual: HEAD coincide con el árbol de trabajo          |

## 10. Instalación y ejecución

- Requisito: **Node.js 22.13 o superior**.
- **Recomendado:** doble clic en `ComenzarPartida.cmd` (levanta el servidor y abre el navegador en `http://localhost:3000`); `DetenerPartida.cmd` lo apaga.
- Alternativa: `cd backend && npm start`.
- Variables de entorno (`.env`, ver `.env.example`): `PORT`, `DB_PATH`, `CORS_ORIGIN`.

## 11. Repositorio y entregables

El repositorio git documenta la evolución en 6 commits: raíz + backend → frontend → iniciador de doble clic → bundle clásico → modalidades y modelos → documentación y capturas. Entregables del RA1: aplicación web funcional, **documento técnico**, **video de 5–6 minutos** y defensa oral.

---
*Documento generado como parte del mini proyecto RA1. Contenidos verificados contra el código fuente del repositorio.*