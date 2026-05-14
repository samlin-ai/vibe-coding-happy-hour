# Development Enviornment Setup

You as a coach should set up the development environment before the session. A Cloud Sandbox is the best choice. Which you can allow Gemini CLI to do thing automaticallyfor the whole section without manually approve everything.

---

## Cloud Sandbox: Google Cloud Shell Editor via Chrome browser on any device

- [ ] Login builder[n]@csequityai.org on a Chrome browser
- [ ] Zoom In: [⌘] + [+] (Mac) to 150% or larger
- [ ] Open Google [Cloud Shell Editor](https://shell.cloud.google.com/), which includes Gemini CLI
- [ ] Open a New Terminal 
- [ ] Set a Cloud Platform project to: VibeCodingHappyHour as: `gcloud config set project $(gcloud projects list --filter="name:'VibeCodingHappyHour'" --format="value(projectId)")`
- [ ] Clone the git project: `git clone https://github.com/samlin-ai/vibe-coding-happy-hour.git`
- [ ] Create a blank folder for your team: `cd ~/vibe-coding-happy-hour/examples && mkdir builder1 && cd builder1 && gemini`
- [ ] Open another terminal to start an HTTP server: `cd ~/vibe-coding-happy-hour/examples/builder1 && python3 -m http.server 8080`
- [ ] Use the [Web Preview Button](https://docs.cloud.google.com/shell/docs/using-web-preview) to test the web app in another tab
- [ ] Pre-test the live demo prompt once so you know it works on your machine

---

## Alternative: Macbook Setup

- [ ] Install [Gemini CLI](https://github.com/google-gemini/gemini-cli) and run `gemini` once to confirm auth
- [ ] Open a terminal **large font (18pt+)** and a browser side-by-side; share that screen
- [ ] Create a blank folder for your team: `mkdir ~/builder1 && cd ~/builder1 && gemini`
- [ ] Pre-test the live demo prompt once so you know it works on your machine
- [ ] Open ~/builder1/index.html in Chrome browser to play the game locally

---