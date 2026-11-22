---
title: Media pipeline
headline: El pipeline detrás del lado cineasta de este sitio.
oneLiner: Pipeline serverless de imágenes y HLS en AWS que sirve el lado cineasta de este sitio.
role: Creador
cover:
  src: /media/media-pipeline.svg
  alt: "Diagrama del pipeline previsto: lo que se sube a S3 se enruta según el tipo, una foto va a una Lambda que escribe AVIF y WebP, una película va a MediaConvert que escribe HLS. CloudFront sirve el resultado, y un manifiesto es lo que el sitio lee al construirse"
  width: 1600
  height: 800
decisions:
  - title: Un manifiesto como contrato
    why: El sitio lee un solo archivo JSON al compilar, así que el pipeline y el sitio se publican por separado.
  - title: AVIF primero, WebP como respaldo
    why: Los archivos más livianos para navegadores modernos, con un blurhash mientras carga cada imagen.
  - title: Un reproductor HLS propio
    why: Tendrá calidad adaptable de 360p a 1080p, sin marcas ni rastreo de terceros.
  - title: Infraestructura como código
    why: Todo el stack quedará definido en AWS CDK, en su propio repositorio.
year: "2026"
status: in-progress
kind: infra
stack:
  - AWS CDK
  - S3
  - Lambda
  - MediaConvert
  - CloudFront
tags:
  - s3
  - lambda
  - mediaconvert
  - cdk
featured: true
order: 3
next: ada-system
---

## Contexto

El lado cineasta de este sitio muestra fotos y películas. El sitio es estático y se aloja gratis, así que el material pesado necesita su propio espacio, servido rápido y sin la marca de YouTube o Vimeo.

## Qué estoy construyendo

Los originales irán a S3. Una función Lambda generará versiones AVIF y WebP de cada foto a 480, 960, 1440 y 2048 píxeles, además de un blurhash. MediaConvert codificará cada película en HLS a 1080, 720, 480 y 360, con un póster y una vista previa corta sin sonido. CloudFront servirá todo desde media.garceslab.me, y el pipeline publicará un manifiesto que este sitio lee al compilar.

Mientras tanto, un script local genera las versiones AVIF y WebP, el blurhash y el manifiesto en el mismo formato, así que el sitio ya funciona con el contrato final.
