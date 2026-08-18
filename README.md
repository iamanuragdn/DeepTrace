# DeepTrace

An AI-powered platform designed to detect deepfakes, analyze manipulated media, and trace digital origins across social networks.

## Overview

With the rapid rise of AI-generated content, discerning what is real has never been more difficult. **DeepTrace** provides clarity and confidence in an era of synthetic media by combining advanced image analysis with real-time web scraping to trace the origin of images and videos.

## Features

- **AI Detection**: Upload images or videos to be analyzed by underlying PyTorch-based detection models. It looks for pixel-level inconsistencies, noise patterns, and face manipulation markers.
- **Origin Tracing**: Cross-references media footprints across major social networks (Reddit, X, Instagram, Facebook) to pinpoint the earliest upload source.
- **Privacy First**: Files are analyzed in-memory or securely held temporarily. We don't store your uploaded data permanently.
- **Scan History**: Keep track of your recent scans using local session storage.
- **Responsive Design**: A clean, minimalist UI built with Vanilla HTML/CSS/JS that works seamlessly across desktop, tablet, and mobile.

## Project Structure

This is a lightweight frontend SPA (Single Page Application) with the following structure:

```
DeepTrace/
├── index.html       # Main application layout and screens
├── styles/
│   └── main.css     # Global variables and component styling
├── scripts/
│   └── app.js       # SPA navigation, state management, and mock logic
└── assets/          # Images, logos, and sample thumbnails
```

## Running Locally

Because this project uses vanilla web technologies without a build step, running it locally is incredibly easy.

1. Clone the repository to your local machine.
2. Open a terminal in the root directory (`DeepTrace/`).
3. Start a local web server to prevent CORS issues with local assets. If you have Python installed, you can run:

```bash
python3 -m http.server 8080
```

4. Open your browser and navigate to `http://localhost:8080`.

## License

This project is licensed under the MIT License.
