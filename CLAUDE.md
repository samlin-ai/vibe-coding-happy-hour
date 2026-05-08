# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a **content/documentation repository** — there is no application code, build system, or test suite. It contains curriculum materials for coaches running a "Vibe Coding Happy Hour" for K12 students (ages 9–12).

## Repository Structure

- `README.md` — Course overview: a 2-hour event with an intro session on Google Meet, a 60-minute small-group breakout, a Show & Tell, and a closing.
- `coach-guide-gemini-cli.md` — The primary artifact: a detailed 60-minute coach playbook for guiding 3–5 kids through building their first browser game using Gemini CLI.

## Content Design Principles

The coach guide is written for **coaches, not kids** — it assumes the coach reads it and translates it for a 9–12 age group. Key design decisions:

- Games must be single-file HTML/CSS/JS (`index.html`) so they open instantly in a browser with no install.
- Prompts in the guide are meant to be spoken aloud by the coach and typed by the "Prompt Writer" role kid — keep them in plain English, not technical.
- The guide assigns team roles (Prompt Writer, Game Designer, Tester, Note Taker, Art Director) to keep all kids engaged.
- Segment timing is strict (10/5/20/15/10 min) — edits that expand a segment should compress another or call out the trade-off.

## When Editing

Maintain the tone: encouraging, matter-of-fact about bugs, empowering kids as designers rather than passive users. The phrase "Shipped beats perfect" is intentional and captures the philosophy of the whole course.

## Token Efficiency

Use caveman prompts when communicating with Claude: drop filler words, articles, and pleasantries. Say "add timer segment 3" not "Could you please add a countdown timer to segment 3?". This keeps context lean and responses faster.
