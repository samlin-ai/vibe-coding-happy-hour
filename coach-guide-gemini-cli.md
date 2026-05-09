# Coach Guide: Kids' First Vibe Coding Game with Gemini CLI
**Ages:** 8–14 | **Team size:** 3–5 kids | **Duration:** 60 minutes

---

## Key Results
The coach not only guide the team working together to deliver these key results, but also challenges them to go abvoe and beyond.

- [ ] Name of the team
- [ ] Brainstorm the idea of the game & prompts
- [ ] Brainstorm the improvements & prompts
- [ ] Undstand how the game works & the design
- [ ] Rehearse the show & tell

---

## Before the Session (Coach Prep)

- [ ] Install [Gemini CLI](https://github.com/google-gemini/gemini-cli) on the computer
- [ ] Run `gemini` once to confirm it works and is authenticated
- [ ] Open a terminal and a browser side-by-side
- [ ] Have a blank folder ready: `mkdir my-first-game && cd my-first-game`
- [ ] Keep this guide open for reference

**Good game types for beginners (pick one if the team is stuck):**
- Catch the falling stars ⭐
- Click the mole 🐹
- Dodge the obstacles 🚧
- Guess the number 🔢

---

## Session Timeline

### Segment 1 — Assemble the Team  (0:00–0:05)

**Goal:** Get the kids to know each other and name the team together.


### Segment 1 — Ignite the Idea (0:05–0:15)

**Goal:** Get the kids excited and pick a name and a game concept together.

**Say to the team:**
> "You are all game designers today. In one hour, you will build a real game that anyone can play. The AI will write the code — your job is to tell it WHAT to build."

**Activity — 3-minute brainstorm:**
1. Ask each kid to think and write down on sticky note by themself for a minute: *"What is your favorite game?"*
2. Each tell the answer, and then group them on a whiteboard as a team.
3. Vote by show of hands to pick top two.
4. Combe the top two into a new game as a group.
5. Ask: *"What happens when you win? What happens when you lose?"*

**Coach tip:** Steer toward web-based games (HTML + JavaScript) — they run instantly in a browser, no install needed.

---

### Segment 3 — Build the First Version (0:15–0:35)

**Goal:** Get a working game on screen in 20 minutes.

**Assign roles to kids:**

| Role | What They Do |
|------|--------------|
| **Prompt Writer** | Types the prompts into Gemini CLI |
| **Game Designer** | Decides features and rules |
| **Tester** | Refreshes the browser and reports bugs |
| **Note Taker** | Writes down what works and what to add next |
| *(5th kid)* **Art Director** | Picks colors, emojis, sounds |

**Step 1 — Generate the game (coach reads this prompt aloud, Prompt Writer types it):**

```
We are kids aged 8-14 making our very first game. 
Please create a simple [GAME NAME] game using only HTML, CSS, and JavaScript 
in a single file called index.html. 
Rules:
- [RULE 1 the kids decided]
- [RULE 2 the kids decided]
- Show the score on screen
- Show a "Game Over" message when the player loses
- Make it colorful and fun
- Add simple instructions at the top so anyone knows how to play
```

**Step 2 — Save the file:**
Gemini will output code. Coach helps copy it into `index.html`:
```
gemini "Save the code above into a file called index.html"
```
Or paste manually into a text editor and save as `index.html`.

**Step 3 — Open in browser:**
```
# On Mac/Linux
open index.html

# On Windows
start index.html
```

**Coach tip:** If the game doesn't work, don't panic! Say: *"Even professional developers get bugs. Let's ask Gemini to fix it — that's the vibe coding superpower."*

**Quick fix prompt template:**
```
The game has a bug: [describe what's wrong in plain English]. 
Please fix it and show me the updated index.html.
```

---

### Segment 4 — Make It Yours (0:35–0:45)

**Goal:** Each kid adds one personal touch. This is where creativity explodes.

**Go around the team. Each kid picks ONE upgrade:**

Prompt templates the kids can mix and match:
```
Add a countdown timer that starts at 30 seconds.
```
```
Make the player character an emoji like 🐸 instead of a square.
```
```
Add a high score that saves between games.
```
```
Make the game faster every 10 points.
```
```
Add a fun sound effect when the player scores a point.
```
```
Change the background color to [COLOR] and the font to something fun.
```
```
Add a "Play Again" button on the Game Over screen.
```

**Coach tip:** Let the Prompt Writer read each upgrade request to the group before typing it. This keeps everyone involved and lets kids catch misunderstandings before they happen.

---

### Segment 5 — Make It Yours (0:45–0:53)

**Goal:** Undersatnd how the game works and is built.

1. Ask the team think and guess how the game works.
2. Guide the team to ask Gemini CLI to explain how the game works to [x] years old.
3. Guide the team to ask Gemini CLI to create a system design diagram, and for them to ask follow up questions.

---

### Segment 6 — Rehearse Show & Tell (0:53–1:00)

**Goal:** Celebrate what they built and reflect.

**Demo the game:**
- Let each kid play for 30 seconds
- The Note Taker reads out all the features they added
- Take a group photo or screenshot

**Debrief questions (pick 2–3):**
1. *"What was the hardest part? How did you solve it?"*
2. *"What would you add if you had one more hour?"*
3. *"Who wrote the code — you or the AI? Who was in charge?"* (They were!)
4. *"Where else could you use an AI assistant like this?"*

**Give out the win:**
> "You just shipped a real game. You are officially game developers."

---

## Handling Common Situations

### "Gemini gave us weird code / it didn't work"
Be matter-of-fact: bugs are normal. Use this prompt:
```
That didn't work as expected. [Describe the problem]. 
Can you try a simpler approach?
```

### "The kids are arguing about what feature to add"
Use the voting rule: each kid gets one vote, majority wins. Ties go to the Game Designer role.

### "One kid is dominating the keyboard"
Rotate the Prompt Writer role every 5 minutes. Set a phone timer.

### "A kid says 'I can't do this, I don't know how to code'"
Reply: *"That's the whole point — you don't need to! You just tell the AI what you want in plain English. You already did it."*

### "We're running out of time"
Skip Segment 4 upgrades. Go straight to Show & Tell at 0:45. A working game beats an unfinished fancy one.

### "We have extra time"
Ask: *"Should we add a two-player mode? Let's ask Gemini!"*

---

## Key Phrases to Use Throughout

| Moment | What to Say |
|--------|-------------|
| Starting a new prompt | *"How do we tell Gemini what we want?"* |
| After a success | *"You designed that. The AI just followed your instructions."* |
| After a bug | *"Bugs happen to every developer. Let's debug together."* |
| When stuck | *"Let's ask Gemini for ideas. Type: 'What should we add next?'"* |
| At the end | *"You built this. You are the game designers."* |

---

## Quick Reference: Useful Gemini CLI Prompts

```
# Start a new game from scratch
We are kids making a [TYPE] game. Create index.html with HTML/CSS/JS only.

# Fix a bug
There is a bug: [describe it]. Fix index.html and show the full updated file.

# Add a feature
Add [FEATURE] to our game. Show the updated index.html.

# Explain something
Explain in simple words for a 10-year-old: what does [CODE PART] do?

# Ask for ideas
What are 3 fun things we could add to our [TYPE] game? Keep it simple.

# Make it look better
Make the game look more colorful and exciting. Use bright colors and emojis.
```

---

## What Success Looks Like

By the end of the hour, the team should have:
- A playable game open in the browser
- At least one feature each kid contributed
- An experience of iterating with AI (prompt → test → improve)
- Confidence that they can build things with code

The game doesn't have to be perfect. **Shipped beats perfect.**
