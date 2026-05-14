# Development Enviornment Setup

You as a coach should set up the development environment before the session. A Cloud Sandbox is the best choice. Because it runs on a VM as the sandbox, you can allow Gemini CLI to do thing automatically (Allow for this session) without manually approving every action.

---

## Cloud Sandbox: Google Cloud Shell Editor via Chrome browser on any device

- [ ] Login builder[n]@csequityai.org on a Chrome browser
- [ ] Zoom In: [⌘] + [+] (Mac) to 150% or larger
- [ ] Open Google [Cloud Shell Editor](https://shell.cloud.google.com/?show=ide), which includes Gemini CLI
- [ ] Open a New Terminal
- [ ] Clone the git project: `git clone https://github.com/samlin-ai/vibe-coding-happy-hour.git`
- [ ] Setup the worksapce by dev-env-setup.sh: `~/vibe-coding-happy-hour/dev-env-setup.sh`
- [ ] Use the [Web Preview Button](https://docs.cloud.google.com/shell/docs/using-web-preview) to test the web app in another tab
- [ ] Pre-test the live demo prompt once so you know it works on your machine, e.g. `Build a simple Tetris web game without frameworks.`. Remember to remove the code before the section.

### Manual Setup

These are the steps in dev-env-setup.sh:

- [ ] Set a Cloud Platform project to: VibeCodingHappyHour as: `gcloud config set project $(gcloud projects list --filter="name:'VibeCodingHappyHour'" --format="value(projectId)")`
- [ ] Create a blank folder for your team: `cd ~/vibe-coding-happy-hour/examples && mkdir $(whoami) && cd $(whoami)$ && gemini`
- [ ] Open another terminal to start an HTTP server: `cd ~/vibe-coding-happy-hour/examples/$(whoami) && python3 -m http.server 8080`

---

## Alternative: Macbook Setup

- [ ] Install [Gemini CLI](https://github.com/google-gemini/gemini-cli) and run `gemini` once to confirm auth
- [ ] Open a terminal **large font (18pt+)** and a browser side-by-side; share that screen
- [ ] Create a blank folder for your team: `mkdir ~/$(whoami) && cd ~/$(whoami) && gemini`
- [ ] Pre-test the live demo prompt once so you know it works on your machine
- [ ] Open index.html in Chrome browser to play the game locally

---