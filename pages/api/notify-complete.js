import { notifySessionComplete, updateSessionProgress } from './check-session/[sessionId]';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { sessionId, driveFolderUrl, stage, detail, percent } = req.body;
  
  if (!sessionId) {
    return res.status(400).json({ error: 'Missing sessionId' });
  }
  
  if (driveFolderUrl) {
    notifySessionComplete(sessionId, driveFolderUrl);
  } else if (stage) {
    updateSessionProgress(sessionId, stage, detail, percent);
  }
  
  res.json({ success: true });
}
