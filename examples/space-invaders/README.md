# Emoji Space Invaders

Defend the galaxy from waves of invading emojis! A classic arcade experience rebuilt with pure JavaScript and a neon space aesthetic. Part of the Vibe Coding Happy Hour curriculum.

## Prompt
> "Build a Space Invaders web game without frameworks."

## How to Play

- **Move**: Left/Right arrow keys or `A`/`D` keys.
- **Shoot**: Spacebar.
- **Mobile**: Tap and drag to move and shoot automatically.

## Features

- Framework-less implementation.
- Retro emoji-based graphics.
- Increasing difficulty as you destroy aliens.
- Explosion effects and responsive design.

## Design & Architecture

The game follows a simple component-based design managed by a central game loop.

### Core Systems

1. **Game Loop**: Uses `requestAnimationFrame` to run at a consistent 60 FPS.
2. **State Management**: Tracks positions of the ship, aliens, and all active bullets in real time.
3. **Collision Engine**: Simple bounding-box detection between bullets and entities.
4. **Difficulty Scaling**: Alien movement speed and shooting frequency increase as the grid is cleared.

### File Structure

- `index.html`: UI structure.
- `style.css`: Neon space theme and animations.
- `game.js`: Game loop, collision detection, and state management.

### Visual Representation

```text
+-----------------------------------------------------------+
|                      Score: 120                           |
|                                                           |
|    👾  👾  👾  👾  👾  👾  👾  👾     <-- Alien Grid       |
|    👾  👾  👾  👾  👾  👾  👾  👾                          |
|    👾  👾  👾  👾  👾  👾  👾  👾                          |
|                                                           |
|             |                         <-- Alien Bullet    |
|             v                                             |
|                                                           |
|                    ^                  <-- Player Bullet   |
|                    |                                      |
|                                                           |
|                  [ 🚀 ]               <-- Player Ship     |
+-----------------------------------------------------------+
          ^                   ^
      [A] | [D] / [<-] | [->] | [Space]
          Move Left/Right      Shoot
```
