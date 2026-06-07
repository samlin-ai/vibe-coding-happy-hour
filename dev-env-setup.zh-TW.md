# 開發環境設定

[English](./dev-env-setup.md) | 繁體中文

<img src="./res/ai-SandboxIt.png" width="640">

身為教練，你應該在課前先設定好開發環境。Cloud Sandbox 是最佳選擇，因為它跑在 VM 上，所以你可以讓 Gemini CLI 自動執行操作（「Allow for this session」），不必手動核准每個動作。

---

## Cloud Sandbox：在任何裝置上透過 Chrome 瀏覽器使用 Google Cloud Shell 編輯器

- [ ] 在 Chrome 瀏覽器登入 builder[n]@csequityai.org
- [ ] 放大畫面：[⌘] + [+]（Mac）到 150% 以上
- [ ] 打開 Google [Cloud Shell Editor](https://shell.cloud.google.com/?show=ide)，內含 Gemini CLI
- [ ] 開啟新終端機（New Terminal）
- [ ] Clone git 專案：`git clone https://github.com/samlin-ai/vibe-coding-happy-hour.git`
- [ ] 用 dev-env-setup.sh 設定工作區：`~/vibe-coding-happy-hour/dev-env-setup.sh`
- [ ] 用 [Web Preview 按鈕](https://docs.cloud.google.com/shell/docs/using-web-preview)在另一個分頁測試網頁應用程式
- [ ] 預先測試一次現場示範的提示詞，確認在你的機器上可以正常運作，例如：`不使用任何框架，做一個簡單的俄羅斯方塊網頁遊戲。`記得在課前把生成的程式碼刪掉。

### 手動設定

以下是 dev-env-setup.sh 包含的步驟：

- [ ] 把 Cloud Platform 專案設為 VibeCodingHappyHour：`gcloud config set project $(gcloud projects list --filter="name:'VibeCodingHappyHour'" --format="value(projectId)")`
- [ ] 為你的團隊建立空白資料夾：`cd ~/vibe-coding-happy-hour/examples && mkdir $(whoami) && cd $(whoami) && gemini`
- [ ] 開另一個終端機啟動 HTTP 伺服器：`cd ~/vibe-coding-happy-hour/examples/$(whoami) && python3 -m http.server 8080`

---

## 替代方案：MacBook 設定

- [ ] 安裝 [Gemini CLI](https://github.com/google-gemini/gemini-cli)，執行一次 `gemini` 確認驗證成功
- [ ] 開一個**大字體（18pt 以上）**的終端機，與瀏覽器並排顯示；分享那個畫面
- [ ] 為你的團隊建立空白資料夾：`mkdir ~/$(whoami) && cd ~/$(whoami) && gemini`
- [ ] 預先測試一次現場示範的提示詞，確認在你的機器上可以正常運作
- [ ] 在 Chrome 瀏覽器打開 `index.html`，在本機玩遊戲

---
