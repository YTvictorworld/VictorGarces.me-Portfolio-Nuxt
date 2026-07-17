---
title: "AI and My Two Crafts: What It Changes for Developers and Filmmakers"
description: I write software and I make films. Artificial intelligence is reshaping both at once. Here's what I've learned about where it helps, where it quietly hurts, and what stays stubbornly human.
date: 2026-07-04
image: https://mir-s3-cdn-cf.behance.net/project_modules/fs_webp/06895b212781749.673b4e14df4a8.jpg
minRead: 8
author:
  name: Víctor Garcés
  description: Full-stack developer & content creator
  username: YTvictorworld
  twitter: https://twitter.com/YTvictorworld
  avatar:
    src: https://mir-s3-cdn-cf.behance.net/project_modules/disp/49f056206375265.68b77ee9dd6a7.jpg
    alt: Víctor Garcés
---

## Two crafts, one shift

I spend my days in two very different rooms. One has a code editor open: Vue and Nuxt on the front, C# and SQL on the back. The other has an edit timeline, footage, and a color wheel. For years these felt like separate lives with nothing to say to each other.

Artificial intelligence collapsed the distance between them almost overnight. The same tool that drafts a component for me can now draft a rough cut, transcribe an interview, or grade a scene. So instead of writing yet another "AI will change everything" post, I want to be specific about what it actually changed in the two things I do and, more importantly, what it didn't.

## What changed in the code editor

The honest version: AI didn't replace the work, it moved it.

I still ship features, but I spend far less time _typing_ code and far more time _deciding_ about it. The model scaffolds the boring parts (a form, a set of tests, a migration, the third near-identical CRUD endpoint) and my job shifts to review: is this correct, is it safe, does it fit the architecture, will the person who reads it in six months understand why it exists?

A few things I've noticed that don't make the hype reels:

- **The floor rose, the ceiling didn't.** A junior can now produce code that _looks_ senior. Whether it _is_ senior (handles the edge case, fails safely, doesn't leak a query into a loop) still depends entirely on the human reviewing it.
- **Taste became the bottleneck.** When generating a solution costs almost nothing, the scarce skill is knowing which solution is right, and being able to say why.
- **Fundamentals matter _more_, not less.** You can't review what you don't understand. The moment I let the model make a decision I couldn't have made myself, I stopped being an engineer and started being a gambler.

> AI is a fast, confident, occasionally wrong pair programmer. The value isn't that it writes; it's that it lets me spend my attention on the parts that were always the actual job.

This very site is a small example. Every animation here is hand-rolled instead of pulled from a library, because I wanted to own the decision and understand the trade-off. AI helped me move faster through the plumbing; the choices are still mine.

## What changed on the timeline

Filmmaking got hit by the same wave, and the creative community's reaction has been louder, for good reason.

Transcription, rough assembly, noise reduction, upscaling old footage, generating a placeholder score, even drafting a color grade: tasks that used to eat entire evenings now take minutes. As a solo creator, that's genuinely liberating. It means I can spend the saved hours on the part that matters: the story.

But here's the tension, and I don't think it's small. A tool that can generate _anything_ tends to make everything look the same. Feed the internet's aesthetic back into a model and it gives you the average of it. The films that move people were never the average of anything.

So on the creative side I've landed somewhere careful:

- Let AI handle the **mechanical** work: cleanup, transcripts, logging footage, first passes.
- Guard the **intentional** work: what to shoot, what to cut, when to hold a shot two seconds too long because it _feels_ right. That instinct isn't in the training data. It's in the person.

## The thread between them: taste is the moat

Standing in both rooms, the same lesson stares back at me from each.

In code and in film, AI is extraordinary at **execution** and useless at **intent**. It can write the function and cut the sequence, but it can't tell you _which_ function is worth writing or _why_ the sequence should land on that face at that moment. It raises the floor for everyone and, in doing so, makes judgment, point of view, and taste the things that actually separate work that matters from work that merely exists.

That's oddly reassuring. The parts of both crafts I care about most (architecture, story, restraint, the reason behind a decision) are exactly the parts the machine can't do for me.

## Where I stay cautious

I'm optimistic, not naïve. A few things keep me honest:

- **Confident wrongness.** Both a hallucinated API and a plausible-but-hollow edit are dangerous precisely because they look right. I verify everything I ship, in code and in the cut.
- **Skill atrophy.** It's easy to stop practicing the thing the tool now does for you. I deliberately keep doing hard parts by hand so I don't forget how.
- **Homogenization.** If everyone leans on the same models, everyone's output drifts toward the same mean. Staying a little inefficient, a little human, is starting to look like a competitive advantage.
- **Authorship and ethics.** Whose work trained this? Who gets credit, who gets displaced? These aren't settled questions, and pretending they are is its own kind of dishonesty.

## What I'm actually doing about it

No grand manifesto, just a working rule I apply in both rooms: **let AI carry the boring weight, and personally own every decision that a human would be proud (or ashamed) to have made.**

In practice that means using it to move faster through boilerplate, tests, transcripts, and first drafts, while refusing to hand off the choices that define the quality of the result. The technology is going to keep getting better at execution. My plan is to keep getting better at judgment.

Because at the end of the day, the interesting question was never "can the machine do it?" It increasingly can. The question is "what's worth doing, and why?" Answering that has always been the human part of both my crafts.

Thanks for reading. If you want to talk about AI, code, film, or all three at once, [get in touch](mailto:victorericksongv@gmail.com).
