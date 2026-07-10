# PDF Chapter Splitter

Intelligently split PDFs into chapters using `lazy-splitter`. 
Files stay in your Google Drive. Works entirely with GitHub Pages + Google Colab.

## Live Demo
https://YOUR_USERNAME.github.io/YOUR_REPO

## Setup
1. Replace `YOUR_USERNAME` and `YOUR_REPO` in:
   - `index.html` (line ~240)
   - `colab_notebook.ipynb` (cell 1, `GITHUB_PAGES_URL`)
2. Enable GitHub Pages in repo settings (main branch, root folder)
3. Push to GitHub

## How it works
- **index.html**: Web UI with progress tracking
- **404.html**: Receives progress/completion callbacks from Colab
- **colab_notebook.ipynb**: Processes PDFs in Google Colab
- Session tracking via localStorage

## Commands used
pdf-splitter preview textbook.pdf --strategy heuristic --sensitivity high
pdf-splitter split textbook.pdf -o chapters --strategy heuristic --sensitivity high
