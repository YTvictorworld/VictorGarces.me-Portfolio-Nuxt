---
title: Media pipeline
headline: The pipeline behind the Filmmaker side of this site.
oneLiner: Serverless image and HLS pipeline on AWS that serves the Filmmaker side of this site.
role: Creator
cover:
  src: /media/media-pipeline.svg
  alt: "Diagram of the planned pipeline: an upload to S3 is routed by type, a photo to a Lambda that writes AVIF and WebP, a film to MediaConvert that writes HLS. CloudFront serves the result, and a manifest is what the site reads at build time"
  width: 1600
  height: 800
decisions:
  - title: A manifest is the contract
    why: The site reads one JSON file at build time, so the pipeline and the site ship independently.
  - title: AVIF first, WebP as fallback
    why: The smallest files for modern browsers, with a blurhash while each image loads.
  - title: My own HLS player
    why: It will offer adaptive quality from 360p to 1080p, with no third-party branding or tracking.
  - title: Infrastructure as code
    why: The whole stack will be defined in AWS CDK, in its own repository.
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

## Context

The Filmmaker side of this site shows photos and films. The site itself is static and hosted for free, so the heavy media needs its own home, served fast and without YouTube or Vimeo branding.

## What I'm building

Originals will go into S3. A Lambda function will write AVIF and WebP versions of every photo at 480, 960, 1440 and 2048 pixels, plus a blurhash. MediaConvert will encode each film as HLS in 1080, 720, 480 and 360, with a poster and a short muted preview. CloudFront will serve everything from media.victorgarces.net, and the pipeline will publish a manifest that this site reads when it builds.

Until then, a local script writes the AVIF and WebP versions, the blurhash and the manifest in the same format, so the site already works against the final contract.
