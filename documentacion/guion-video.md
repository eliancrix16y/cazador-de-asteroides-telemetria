# Guion de video — "Cazador de Asteroides: Telemetría de FPS" (RA1)

**Duración objetivo:** 5–6 minutos
**Formato:** presentación en pantalla con el juego en vivo y el código en paralelo.
**Dupla/equipo:** *Elian* [por completar], *[segundo integrante]* [por completar]

---

## Bloque 1 — Intro (0:00–0:40)

**Pantalla: menú principal del juego** (`documentacion/capturas/menu.png` o el juego en vivo).

> "Hola, soy [nombre]. Hoy presentamos el mini proyecto del Resultado de Aprendizaje 1 de Aplicaciones Web con JavaScript: **Cazador de Asteroides**. Es un videojuego tipo Asteroids con tres entregables combinados: el juego con **física vectorial**, un **contador de FPS propio** —no una herramienta externa— y una **API REST** con leaderboard y base de datos SQLite. Lo vemos de afuera hacia adentro: primero cómo se juega, luego cómo está construido."

**Tip**: nombra a los integrantes aquí o en el cierre.

## Bloque 2 — Ejecución y el menú con modalidades (0:40–1:30)

**Pantalla: doble clic en `ComenzarPartida.cmd` y el navegador en localhost:3000.**

> "Se juega con un clic: `ComenzarPartida.cmd` levanta el servidor en segundo plano y abre el navegador. El menú pide el **nombre del piloto** y deja elegir entre **tres modalidades**: *Clásico* con 3 naves y oleadas progresivas; *Velocidad*, 45 segundos para el máximo puntaje con ∞ naves y un **temporizador en el HUD**; y *Supervivencia*, oleadas más rápidas e infinitas con una sola nave."

**Muestra**: cambia entre las tarjetas de modalidad; elige *Velocidad* para enseñar el `TEMPO` y el "∞" en vidas. Juega unos segundos: dispara, fragmenta un asteroide y deja que algo pase de borde (envoltura).

## Bloque 3 — El juego: física vectorial (1:30–2:30)

**Pantalla: gameplay + abrir `frontend/src/js/entities/player.js` y `utils/vector2.js`.**

> "La nave tiene **inercia real**: no se detiene sola. En `Player.applyThrust` la aceleración se aplica al vector de velocidad, luego una **fricción** de `0.992` por fotograma y un tope de velocidad `PLAYER_MAX_SPEED`. Todo gira alrededor de la clase `Vector2` propia: suma, magnitud y `normalized()`."

> "Los asteroides salen por los **bordes** en cada oleada (`modules/wave-spawner.js`, `base+wave` asteroides) con velocidad creciente por nivel. Al impactar se **fragmentan en dos** y cada tamaño da puntos distintos: 100 el pequeño, 50 el mediano, 20 el grande. La colisión se resuelve en `engine/collisions.js`."

**Tip**: no te detengas en fórmulas; muestra que existe y que está separado por responsabilidad.

## Bloque 4 — Telemetría de FPS propia (2:30–3:30)

**Pantalla: panel derecho en vivo mientras juegas (estado, promedio, cuadros, gráfica).**

> "Aquí está el corazón del RA1: el juego **mide sus propios FPS** desde `requestAnimationFrame` en `engine/game-loop.js`, los acumula en `fps/fps-monitor.js` y los clasifica en `fps/fps-classifier.js`: desde 50 FPS es **FLUIDO**, hasta 30 **REGULAR**, y por debajo **DEFICIENTE** — el indicador cambia de color."

> "Además conectamos el rendimiento con la carga de trabajo: cada fotograma se reportan las **colisiones evaluadas** y las **entidades activas** (`PlayScene.reportTelemetry`). Si la gráfica cae, sabes si fue por trabajo de juego."

## Bloque 5 — Arquitectura del frontend (3:30–4:20)

**Pantalla: estructura de `frontend/src/js/` + `index.html` + `app.js`.**

> "El frontend se escribió como **módulos ES** separados por responsabilidad: `engine` (bucle, tiempo, render, colisiones), `entities` (nave, bala, asteroide, partícula), `input` (teclado y táctil), `scenes` (menú, juego, pausa, fin), `fps`, `services` (API/leaderboard) y `utils`."

> "Un punto clave: para que el juego funcione **abriendo `index.html` sin servidor**, estos módulos se combinan con `scripts/bundle.js` en un único **bundle clásico `app.js`** —sin `import`/`export` a nivel superior—, que es el que carga el HTML."

## Bloque 6 — Backend, API y base de datos (4:20–5:10)

**Pantalla: `backend/` + resultado en vivo (termina una partida corta y muestra el leaderboard).**

> "El backend está en Node puro, sin dependencias: `server.js` solo orquesta (config, rutas, controllers, services, repositories). La API expone `GET /api/scores` (top 10) y `POST /api/scores` para registrar. Tiene **validación de entrada** con respuesta 400 si no se cumple, y las consultas usan **parámetros enlazados (`?`)**, que previene la inyección SQL. La base es **SQLite** integrada en Node (`node:sqlite`), en `backend/data/scores.db`."

**En vivo**: termina la partida; muestra que al volver al menú aparece el puntaje en *Mejores pilotos* y que el estado de la API cambia a "guardado".

## Bloque 7 — Pruebas y cierre (5:10–5:40)

**Pantalla: resultados de pruebas en una terminal corriendo los tests.**

> "Para asegurar que no se rompe, se verificó: pruebas del bundle (18/18), **11/11 pruebas de la API**, una prueba de estrés de **8000 fotogramas sin errores** gracias al bucle resiliente, y una verificación en Chromium real donde el juego se dibuja sin excepciones. La historia en git tiene 6 commits que muestran la evolución: raíz y backend → frontend → iniciador de doble clic → bundle → modalidades y modelos → documentación."

> "Con eso entregamos: videojuego con física vectorial + telemetría de FPS propia + API REST con SQLite. Gracias."

---

## Consejos de grabación

- Graba la pantalla real mientras juegas; no uses solo escenas estáticas.
- En los bloques 3 y 4 puedes alternar el juego en vivo con el panel de telemetría corriendo.
- No leas código línea por línea: señala el archivo y di "aquí está la física / el conteo / la validación".
- Mantén un ritmo de ~45 segundos por bloque; te quedará ~5:40 con margen.