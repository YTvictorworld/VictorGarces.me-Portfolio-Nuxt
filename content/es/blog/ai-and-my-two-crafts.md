---
title: "La IA y mis dos oficios: qué cambia para desarrolladores y filmmakers"
description: Escribo software y hago cine. La inteligencia artificial está transformando ambos a la vez. Esto es lo que he aprendido sobre dónde ayuda, dónde hace daño en silencio, y qué se mantiene tercamente humano.
date: 2026-07-04
image: https://mir-s3-cdn-cf.behance.net/project_modules/fs_webp/06895b212781749.673b4e14df4a8.jpg
minRead: 8
author:
  name: Víctor Garcés
  description: Desarrollador full-stack y creador de contenido
  username: YTvictorworld
  twitter: https://twitter.com/YTvictorworld
  avatar:
    src: https://mir-s3-cdn-cf.behance.net/project_modules/disp/49f056206375265.68b77ee9dd6a7.jpg
    alt: Víctor Garcés
---

## Dos oficios, un mismo cambio

Paso mis días en dos habitaciones muy distintas. Una tiene un editor de código abierto: Vue y Nuxt en el front, C# y SQL en el back. La otra tiene una línea de tiempo de edición, material grabado y una rueda de color. Durante años se sintieron como vidas separadas que no tenían nada que decirse.

La inteligencia artificial colapsó la distancia entre ellas casi de la noche a la mañana. La misma herramienta que redacta un componente por mí ahora puede armar un primer corte, transcribir una entrevista o etalonar una escena. Así que en vez de escribir otro post más de "la IA lo va a cambiar todo", quiero ser específico sobre lo que de verdad cambió en las dos cosas que hago y, más importante, lo que no.

## Qué cambió en el editor de código

La versión honesta: la IA no reemplazó el trabajo, lo movió de sitio.

Sigo entregando features, pero paso mucho menos tiempo _escribiendo_ código y mucho más tiempo _decidiendo_ sobre él. El modelo arma las partes aburridas (un formulario, un set de tests, una migración, el tercer endpoint CRUD casi idéntico) y mi trabajo se convierte en revisar: ¿es correcto, es seguro, encaja en la arquitectura, entenderá la persona que lo lea en seis meses por qué existe?

Algunas cosas que he notado y que no salen en los reels del hype:

- **El piso subió, el techo no.** Un junior ahora puede producir código que _parece_ senior. Que _sea_ senior (que maneje el caso borde, que falle con seguridad, que no meta una query en un loop) sigue dependiendo por completo del humano que lo revisa.
- **El criterio se volvió el cuello de botella.** Cuando generar una solución no cuesta casi nada, la habilidad escasa es saber cuál solución es la correcta, y poder explicar por qué.
- **Los fundamentos importan _más_, no menos.** No puedes revisar lo que no entiendes. En el momento en que dejo que el modelo tome una decisión que yo no podría haber tomado, dejo de ser ingeniero y empiezo a ser apostador.

> La IA es un pair programmer rápido, seguro de sí mismo y ocasionalmente equivocado. El valor no es que escriba; es que me deja gastar mi atención en las partes que siempre fueron el verdadero trabajo.

Este mismo sitio es un pequeño ejemplo. Cada animación aquí está hecha a mano en vez de sacada de una librería, porque quería ser dueño de la decisión y entender el trade-off. La IA me ayudó a avanzar más rápido por la fontanería; las decisiones siguen siendo mías.

## Qué cambió en la línea de tiempo

Al cine le pegó la misma ola, y la reacción de la comunidad creativa ha sido más ruidosa, con razón.

Transcripción, ensamblaje inicial, reducción de ruido, reescalar material viejo, generar una banda sonora provisional, hasta un primer pase de color: tareas que se comían tardes enteras ahora toman minutos. Como creador que trabaja solo, eso es genuinamente liberador. Significa que puedo gastar las horas ahorradas en la parte que importa: la historia.

Pero aquí está la tensión, y no creo que sea pequeña. Una herramienta que puede generar _cualquier cosa_ tiende a hacer que todo se parezca. Aliméntale a un modelo la estética de internet y te devuelve su promedio. Las películas que conmueven a la gente nunca fueron el promedio de nada.

Así que en el lado creativo he aterrizado en un lugar cuidadoso:

- Dejar que la IA haga el trabajo **mecánico**: limpieza, transcripciones, registrar material, primeros pases.
- Proteger el trabajo **intencional**: qué grabar, qué cortar, cuándo sostener un plano dos segundos de más porque se _siente_ correcto. Ese instinto no está en los datos de entrenamiento. Está en la persona.

## El hilo entre ambos: el criterio es el foso

Parado en las dos habitaciones, la misma lección me devuelve la mirada desde cada una.

En el código y en el cine, la IA es extraordinaria en la **ejecución** e inútil en la **intención**. Puede escribir la función y cortar la secuencia, pero no puede decirte _cuál_ función vale la pena escribir ni _por qué_ la secuencia debe aterrizar en esa cara en ese momento. Sube el piso para todos y, al hacerlo, convierte el juicio, el punto de vista y el gusto en lo que de verdad separa el trabajo que importa del trabajo que simplemente existe.

Y eso, curiosamente, tranquiliza. Las partes de ambos oficios que más me importan (la arquitectura, la historia, la contención, la razón detrás de una decisión) son exactamente las partes que la máquina no puede hacer por mí.

## Dónde me mantengo cauto

Soy optimista, no ingenuo. Algunas cosas me mantienen honesto:

- **El error con confianza.** Tanto una API alucinada como una edición plausible pero hueca son peligrosas precisamente porque parecen correctas. Verifico todo lo que entrego, en el código y en el corte.
- **La atrofia de habilidades.** Es fácil dejar de practicar lo que la herramienta ahora hace por ti. Deliberadamente sigo haciendo las partes difíciles a mano para no olvidar cómo.
- **La homogeneización.** Si todos nos apoyamos en los mismos modelos, la producción de todos deriva hacia la misma media. Mantenerse un poco ineficiente, un poco humano, empieza a parecer una ventaja competitiva.
- **La autoría y la ética.** ¿El trabajo de quién entrenó esto? ¿Quién recibe el crédito, quién queda desplazado? No son preguntas resueltas, y fingir que lo están es otra forma de deshonestidad.

## Qué estoy haciendo al respecto

Ningún gran manifiesto, solo una regla de trabajo que aplico en ambas habitaciones: **dejar que la IA cargue el peso aburrido, y ser dueño personalmente de cada decisión de la que un humano estaría orgulloso (o avergonzado) de haber tomado.**

En la práctica eso significa usarla para avanzar más rápido por el boilerplate, los tests, las transcripciones y los primeros borradores, mientras me niego a delegar las decisiones que definen la calidad del resultado. La tecnología va a seguir mejorando en ejecución. Mi plan es seguir mejorando en juicio.

Porque al final del día, la pregunta interesante nunca fue "¿puede la máquina hacerlo?". Cada vez puede más. La pregunta es "¿qué vale la pena hacer, y por qué?". Responder eso siempre ha sido la parte humana de mis dos oficios.

Gracias por leer. Si quieres hablar de IA, código, cine, o de las tres cosas a la vez, [escríbeme](mailto:victorericksongv@gmail.com).
