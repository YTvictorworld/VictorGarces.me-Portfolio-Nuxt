---
title: "¿Puede una máquina predecir quién va a renunciar? Notas de una charla de machine learning en UNAPEC"
description: Asistí a una charla de machine learning del Ing. Ariel González Batista en UNAPEC. Del dataset del Titanic al análisis de supervivencia, estas son las ideas que me llevé y las preguntas con las que salí.
date: 2026-07-15
image: /images/blog/machine-learning-talk-unapec.jpg
minRead: 6
author:
  name: Víctor Garcés
  description: Desarrollador full-stack y creador de contenido
  username: YTvictorworld
  twitter: https://twitter.com/YTvictorworld
  avatar:
    src: https://mir-s3-cdn-cf.behance.net/project_modules/disp/49f056206375265.68b77ee9dd6a7.jpg
    alt: Víctor Garcés
---

El 15 de julio asistí a una charla de machine learning en **UNAPEC** (Universidad Acción Pro Educación y Cultura, en Santo Domingo) impartida por el [**Ing. Ariel González Batista**](https://www.linkedin.com/in/ariel-gonzalez-batista-b619a9231/). La sala estaba llena de gente haciéndose las mismas dos preguntas que escucho por todas partes últimamente: ¿quién trabaja realmente en este campo, y cómo entro yo?

En vez de responder en abstracto, Ariel construyó toda la sesión alrededor de un problema concreto y muy humano: **¿puede una máquina predecir quién va a irse de una empresa?** Equivocarse en retención de empleados sale caro, así que si un modelo puede señalar el riesgo de salida a tiempo, Recursos Humanos puede actuar antes de que llegue la carta de renuncia. Esa sola pregunta nos llevó por sesenta años de historia de la IA y un flujo completo de modelado.

## Sesenta segundos de historia de la IA

La inteligencia artificial nació como disciplina alrededor de **1956**, sobre los cimientos que puso **Alan Turing**. Entre los años 50 y 60 llegó el **perceptrón** y, después, la idea de apilarlos en el **perceptrón multicapa**: el ancestro de las redes neuronales de hoy.

Un salto rápido al presente y el tema dominante es el **LLM**. La tarea de lectura que Ariel dejó a la sala fue el paper que los hizo posibles: *Attention Is All You Need*. Está en mi lista.

Una distinción de esa historia se me quedó grabada porque explica mucho de cómo se sienten estos sistemas al usarlos: **determinístico vs. probabilístico**. El software clásico devuelve la misma respuesta siempre. El machine learning devuelve una probabilidad, y todo lo relativo a cómo se evalúa y despliega se deriva de esa diferencia.

## El Titanic, las hipótesis y los smoke tests

Para aterrizar el flujo de trabajo, Ariel usó el clásico **dataset del Titanic de Kaggle**: predecir quién sobrevive al hundimiento. Todo el mundo conoce la respuesta histórica, mujeres y niños primero, así que la lección interesante es en qué se convierte ese conocimiento dentro de un modelo: **selección de features**. Si la supervivencia dependía de ser mujer o niño, entonces la edad y el sexo son las columnas que importan. Mira los datos que tienes y encuentra lo que de verdad es importante en ellos.

También me gustó que se detuviera a descomponer la palabra *hipótesis*: de *hypo* (debajo) y *thesis* (poner). Una hipótesis es literalmente "lo que se pone debajo" del trabajo que viene después. Todo el proceso descansa sobre ella.

Luego vino la parte que más conectó con mi día a día como desarrollador: antes de celebrar cualquier modelo, necesitas un **benchmark** y un **smoke test**.

- **Método 1: el baseline tonto.** Alrededor del 62% de los pasajeros falleció, así que un "modelo" que siempre predice fallecimiento acierta el 62% de las veces. Cualquier modelo real tiene que superar ese número para justificar su existencia.
- **Método 2: un modelo de verdad.** Un **bosque aleatorio** (random forest), entrenado con las features que importan.
- **Método 3: interpretación.** ¿Qué está mirando el modelo realmente? Si no puedes responder eso, no sabes qué construiste.

Esa idea del baseline se traduce directo a la ingeniería: mide primero la solución trivial, o nunca sabrás si la sofisticada vale la pena. Como dice el refrán que citó Ariel: *"cuando solo tienes un martillo, todo parece un clavo"*. El baseline es cómo compruebas si siquiera necesitabas el martillo.

Todo esto, de la regresión a los bosques aleatorios, vive en **scikit-learn**, la librería de Python que se ha convertido en la puerta de entrada estándar al campo.

## Análisis de supervivencia, o predecir el "cuándo"

Volvamos al problema de los empleados. Predecir *si* alguien se va es una pregunta de clasificación. Predecir *cuándo* es más difícil, y ahí la charla introdujo el **análisis de supervivencia** y el **Random Survival Forest**: modelos de tiempo-a-evento que siguen cada paso de un proceso y le asignan una probabilidad.

Aquí levanté la mano. Pregunté cómo interpretan estos modelos la **data censurada**: los empleados que todavía no se han ido, cuya historia el dataset solo conoce a medias. La respuesta lo conectó de vuelta con el modelado de tiempo-a-evento, donde esas observaciones incompletas no se descartan sino que se incorporan, porque "todavía no ha pasado" también es información.

Mi segunda pregunta fue sobre dimensionalidad: si se puede generar cualquier cantidad de datos en base a las probabilidades que se quieran medir. Como referencia, el ejercicio del Titanic que discutimos trabajaba con una dimensionalidad de 63 columnas. Los problemas reales se ensanchan rápido, y saber cuáles de esas columnas llevan señal es la mayor parte del trabajo.

## Lo que me llevo

- **Baselines antes que brillantez.** Mide siempre primero el predictor trivial.
- **Las features son producto del conocimiento del dominio.** "Mujeres y niños primero" es historia; edad y sexo como inputs es ingeniería.
- **Pensar en probabilidades es otra disciplina.** Evaluar un modelo no se parece en nada a testear una función.
- **Lista de lectura:** *Attention Is All You Need*, y la documentación de scikit-learn.

Gracias al Ing. Ariel González Batista y a UNAPEC por la sesión. Si trabajas en ML y crees que algo de esto está mal, o quieres decirme qué debería estudiar después, [escríbeme](mailto:victorericksongv@gmail.com). Claramente no he terminado de hacer preguntas.
