import crypto from 'crypto';

export default function handler(req, res) {
  const sessionId = crypto.randomUUID();
  
  const notebookUrl = 'https://raw.githubusercontent.com/Danielzapirtan/isplit/main/colab_notebook.ipynb';
  const colabUrl = `https://colab.research.google.com/github/Danielzapirtan/isplit/blob/main/colab_notebook.ipynb#sessionId=${sessionId}`;
  
  res.json({ url: colabUrl, sessionId });
}
