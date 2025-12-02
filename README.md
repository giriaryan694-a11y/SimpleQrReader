# SimpleQrReader

SafeQR Reader

A lightweight, privacy‑friendly, and security‑focused QR code reader built using **jsQR**. It never auto‑redirects — instead, it displays the decoded content safely and leaves every action to the user.

## 🔒 Key Features

* **Uses jsQR only** for clean, fast QR decoding.
* **Never auto‑opens links**, blocking malicious redirects.
* **Decoded content appears in an output box**, fully visible to the user.
* **Copy output** with one click.
* **Download output as a `.txt` file`** for safe offline review.
* **Smart URL handling:**

  * URLs become clickable.
  * Clicking triggers a confirmation popup:
    **"Are you sure you want to open this link?"**
  * Opens in a new tab only after user approval.

## 📁 Use Cases

* Safely scan QR codes from unknown sources.
* Inspect suspicious QR stickers in public places.
* Teach security‑aware design.
* Perfect for cybersecurity learners and researchers.

## 🚀 How It Works

1. Upload a QR code image.
2. jsQR reads and decodes the image locally.
3. The decoded text is shown safely in the output area.
4. If it’s plain text → copy or download.
5. If it’s a URL → clicking asks for confirmation.

## 📦 Project Structure

This tool keeps things simple and minimal:

```
SimpleQrReader/
├── index.html
├── style.css
└── script.js
```

Everything runs entirely in the browser — **no backend required**.

## ▶️ How to Run

Download or clone the repo and open:

```
index.html
```

That’s it — the whole tool works offline.

### 🌐 Live Demo

**[https://giriaryan694-a11y.github.io/SimpleQrReader/](https://giriaryan694-a11y.github.io/SimpleQrReader/)**

## 🛠 Tech Stack

* **HTML**
* **CSS**
* **JavaScript**
* **jsQR (QR decoder)**

## 🔧 Possible Future Upgrades

* URL reputation checking (Safe Browsing / PhishTank)
* Detect risky patterns (punycode, encoded URLs, strange ports)
* Sandbox preview mode
* Strip tracking parameters from URLs

## 🤝 Contributions

Suggestions, issues, and improvements are always welcome.

## 📜 License

Open‑source — free to use, modify, and build upon.
