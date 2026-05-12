# Tetris
Do you know Tetris is the best-selling video games, [seales: 520m](https://en.wikipedia.org/wiki/List_of_best-selling_video_games)? Let's try to build one with Gemini CLI.

## Prompt
> "Build a simple Tetris web game without frameworks."

## Design & Architecture

The game is built using the HTML5 Canvas API and uses a matrix-based representation for both the game board and the falling pieces (tetrominoes).

### Core Systems
1.  **Matrix Engine**: Both the 10x20 board and the 3x3 or 4x4 pieces are 2D arrays (matrices). Logic like rotation is handled via matrix transposition and reversal.
2.  **Collision Detection**: Before any move (left, right, down, or rotate), the game checks if the piece's matrix overlaps with any non-zero values in the board matrix or goes out of bounds.
3.  **The Game Loop**: Uses `requestAnimationFrame` to handle timing. A `dropCounter` tracks time to move the piece down automatically, while user inputs trigger immediate updates.
4.  **Row Clearing (Arena Sweep)**: After a piece is "merged" into the board, the engine scans for full rows (no zeros), removes them, and shifts the board down.

### Visual Representation

```text
       [ GAME CONTAINER ]
 _____________________________
|  [ CANVAS ]      [ SIDE ]   |
|  .--------.      .------.   |
|  | BOARD  |      | SCORE|   |
|  | Matrix |      '------'   |
|  | (10x20)|      .------.   |
|  |        |      | NEXT |   |
|  | Piece  |      | Piece|   |
|  |        |      '------'   |
|  |        |      .------.   |
|  |        |      | CTRL |   |
|  '--------'      '------'   |
|_____________________________|

   [ CORE LOGIC (Matrix Ops) ]
   - Merge: Piece -> Board
   - Collide: Bounds/Blocks
   - Sweep: Row Clearing
   - Rotate: Transpose/Reverse
```

### Follow up questions

1. Why does this simple prompt work better?
2. Which is the magic keyword & why?
