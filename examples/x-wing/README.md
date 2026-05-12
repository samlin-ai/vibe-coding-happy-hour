# Star Wars: X-Wing 

# Prompt
> "Build a Star Wars: X-Wing game using Three.js in a single HTML file."

## Design & Architecture

The game implements a classic "trench run" mechanic using a perspective camera as the player's cockpit.

### Core Systems
1.  **Infinite Scroller**: The environment (trench segments) and obstacles move toward the player along the Z-axis. When a segment passes the camera, it is recycled to the far end.
2.  **Movement System**:
    - **Environment**: Moves at a constant `SPEED`.
    - **Player**: The camera moves along the X (horizontal) and Y (vertical) axes based on keyboard input, clamped within the trench dimensions.
3.  **Collision System**:
    - **Player vs Obstacle**: Uses `THREE.Box3` bounding boxes. If the camera's position is within an obstacle's bounds, damage is taken.
    - **Laser vs Obstacle**: Checks distance and bounding box containment for each laser projectile.
4.  **Visuals**:
    - **Greebles**: Randomly placed boxes on walls to add technical detail.
    - **Fog**: Used to hide the spawning of new segments and obstacles in the distance.

### Visual Representation

```text
       _________________________________
      |             HUD                 |
      |  Score: 500     Shields: 100%   |
      |_________________________________|
      |                                 |
      |         ^                       |
      |        / \      <-- Crosshair   |
      |         v                       |
      |                                 |
      |      /-------\                  |
      |      | cockpit |  <-- Camera     |
     /|______\_______/__________________|\
    / |                 |                | \
   /  |      [WALL]     |     [WALL]     |  \
  /   |      (Greebles) |     (Greebles) |   \
 /    |        |        |        |       |    \
/_____|________|________|________|_______|_____\
      |      TRENCH (Infinite Scroll)   |
      |  [FLR] [FLR] [FLR] [FLR] [FLR]  |
```

 