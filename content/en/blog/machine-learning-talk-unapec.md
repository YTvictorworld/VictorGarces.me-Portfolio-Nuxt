---
title: "Can a Machine Predict Who Will Quit? Notes from a Machine Learning Talk at UNAPEC"
description: I attended a machine learning talk by Ing. Ariel González Batista at UNAPEC. From the Titanic dataset to survival analysis, here are the ideas that stuck with me, and the questions I left asking.
date: 2026-07-15
image: /images/blog/machine-learning-talk-unapec.jpg
minRead: 6
author:
  name: Víctor Garcés
  description: Full-stack developer & content creator
  username: YTvictorworld
  twitter: https://twitter.com/YTvictorworld
  avatar:
    src: https://mir-s3-cdn-cf.behance.net/project_modules/disp/49f056206375265.68b77ee9dd6a7.jpg
    alt: Víctor Garcés
---

On July 15 I attended a machine learning talk at **UNAPEC** (Universidad Acción Pro Educación y Cultura, in Santo Domingo) given by [**Ing. Ariel González Batista**](https://www.linkedin.com/in/ariel-gonzalez-batista-b619a9231/). The room was full of people asking the same two questions I hear everywhere lately: who actually works in this field, and how do I get into it?

Instead of answering in the abstract, Ariel built the whole session around one concrete, very human problem: **can a machine predict who is going to leave a company?** Employee retention is expensive to get wrong, so if a model can flag attrition risk early, HR can act before the resignation letter lands. That single question carried us through sixty years of AI history and a full modeling workflow.

## A sixty-second history of AI

The field of artificial intelligence was born as a discipline around **1956**, standing on foundations laid by **Alan Turing**. Between the 50s and 60s came the **perceptron** and, later, the idea of stacking them into the **multi-layer perceptron**: the ancestor of today's neural networks.

Fast forward to now and the dominant topic is the **LLM**. Ariel's reading homework for the room was the paper that made them possible: *Attention Is All You Need*. It's on my list.

One distinction from that history stuck with me because it explains so much of how these systems feel to use: **deterministic vs. probabilistic**. Classical software returns the same answer every time. Machine learning returns a probability, and everything about how you evaluate and deploy it follows from that difference.

## The Titanic, hypotheses and smoke tests

To make the workflow tangible, Ariel used the classic **Kaggle Titanic dataset**: predict who survives the sinking. Everyone knows the historical answer, women and children first, so the interesting lesson is what that knowledge becomes in a model: **feature selection**. If survival depended on being a woman or a child, then age and sex are the columns that matter. Look at the data you have and find what is actually important in it.

I also liked that he took a second to break down the word *hypothesis*: from *hypo* (under) and *thesis* (to place). A hypothesis is literally "what you put underneath" the work that follows. Everything in the process rests on it.

Then came the part that felt closest to my day job as a developer: before celebrating any model, you need a **benchmark** and a **smoke test**.

- **Method 1: the dumb baseline.** About 62% of the passengers died, so a "model" that always predicts death is right 62% of the time. Any real model has to beat that number to justify its existence.
- **Method 2: a real model.** A **random forest**, trained on the features that matter.
- **Method 3: interpretation.** What is the model actually looking at? If you can't answer that, you don't know what you built.

That baseline idea translates directly to engineering: measure the trivial solution first, or you will never know if the sophisticated one is worth anything. As the saying Ariel quoted goes: *"when all you have is a hammer, everything looks like a nail."* The baseline is how you check whether you even needed the hammer.

All of this, from regression to random forests, lives in **scikit-learn**, the Python library that has become the standard entry point to the field.

## Survival analysis, or predicting the "when"

Back to the employee problem. Predicting *whether* someone leaves is a classification question. Predicting *when* is harder, and that's where the talk introduced **survival analysis** and the **Random Survival Forest**: time-to-event models that follow each step of a process and assign it a probability.

This is where I raised my hand. I asked how these prediction models interpret **censored data**: the employees who haven't left yet, whose story the dataset only knows halfway. The answer connected it back to time-to-event modeling, where those incomplete observations aren't discarded but incorporated, since "hasn't happened yet" is itself information.

My second question was about dimensionality: whether you can generate any amount of data based on the probabilities you want to measure. For scale, the Titanic exercise we discussed worked with a dimensionality of 63 columns. Real problems get wide fast, and knowing which of those columns carry signal is most of the job.

## What I'm taking home

- **Baselines before brilliance.** Always measure the trivial predictor first.
- **Features are the product of domain knowledge.** "Women and children first" is history; age and sex as inputs is engineering.
- **Probabilistic thinking is a different discipline.** Evaluating a model is nothing like testing a function.
- **Reading list:** *Attention Is All You Need*, and the scikit-learn docs.

Thanks to Ing. Ariel González Batista and UNAPEC for the session. If you work in ML and think I got something wrong here, or you want to point me to what I should study next, [write me](mailto:victorericksongv@gmail.com). I'm clearly not done asking questions.
