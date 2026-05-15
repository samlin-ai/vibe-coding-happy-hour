# Taco Catching

A simple web game to get you started. Hope you catch enough tacos to feed the team!

## Prompt
> "You are an expert game developer. Please build a simple web game where a panda catches falling tacos. It should be colorful, fun, and work in a browser."

## Design & Architecture

A simple DOM-based arcade game where game objects are represented directly as HTML elements rather than being drawn on a canvas.

### Core Systems

1. **Game Loop**: Uses `requestAnimationFrame` to update positions and check collisions roughly 60 times per second.
2. **Object Management**: Tacos are dynamically created as `div` elements, stored in an array, and removed from the DOM when they are caught or fall off-screen.
3. **Collision Detection**: Uses `Element.getBoundingClientRect()` to detect overlaps between the panda emoji and the taco emojis.
4. **Input Handling**: Listens for `mousemove` and `touchmove` events to update the panda's horizontal (`left`) position, mapping user input directly to game coordinates.

### Visual Representation

```text
       [ SCORE BOARD ]
  _________________________
 | Score: 10   Lives: 3    |
 |_________________________|
            |
            v
      [ TACO SPAWN ]
       .-------.
       |   🌮  |  <-- Falling Tacos
       '-------'      (Random X, Speed)
            |
            |
            v
      [ COLLISION ]
   .-----------------.
   | 🐼 (Panda)      |  <-- Player Input
   '-----------------'      (Mouse/Touch X)
```
