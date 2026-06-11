---
name: pah
description: Peanut and Hay creates and maintain DESIGN.md files to be the source of truth for a repo.
---

# Peanut and Hay (pah)

Recursively summarize DESIGN.md files across a project's source tree to make it up to date as the source of truth of the repo. They make AI coding and human comprehension easier. Use when the user asks to generate, refresh, or roll up design docs / DESIGN.md files. It works **bottom-up**: leaf directories first ("Peanuts"), then roll summaries up level by level ("Hay") until the root when there is no design doces. Or, optionally pass a starting directory as an argument (defaults to the project root). 

## Scope

- Start directory: the argument passed to the skill, or the project root if none given.
- Skip non-source directories: `.git`, `node_modules`, `dist`, `build`, `target`, `.venv`, `__pycache__`, caches, and other generated/vendored content.
- Skip directories that contain no files (only pass-through subdirectories) unless rolling up their children is useful.

## Process

### 1. Map the tree

List the directory tree under the start directory and order directories by depth, **deepest first**. This is the processing order.

### 2. Generate the Peanuts (leaf directories)

For each leaf directory:

> Read the files in this directory and produce a new file named DESIGN.md. It MUST a) explain the purpose of this directory and the files inside and b) enumerate each file and a short description of its function.

### 3. Human verification

After generating each level's DESIGN.md files (or each file, for small projects), pause and ask the user to review and correct before moving up. Apply any corrections they give.

### 4. Roll up the Hay (parent directories)

Once all child directories at a level are done, move up one level. For each parent directory:

> Read all the DESIGN.md files in all subdirectories below, then read the code in just this directory, and then create a file named DESIGN.md. Using that information, this file MUST a) explain the purpose of this directory and the files inside, and b) enumerate each file in the directory and a short description of its function.

### 5. Continue upward

Repeat level by level until the root of the project has a DESIGN.md.

## Updating existing DESIGN.md files

If a directory already has a DESIGN.md, do **not** create a new one from scratch. Read the existing DESIGN.md first, then follow the same process to **update** it — preserving any human-authored corrections and notes while refreshing stale or missing entries.

## Notes

- Each DESIGN.md must cover: (a) the purpose of the directory and its files, and (b) an enumeration of every file with a short description of its function.
- Parallelize: sibling directories at the same depth can be summarized concurrently (e.g., via subagents) since they have no dependencies on each other.
- A parent's DESIGN.md depends on its children's DESIGN.md files — never roll up before the children are done.
