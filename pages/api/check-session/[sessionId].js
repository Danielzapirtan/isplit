const sessions = new Map();

export default function handler(req, res) {
  const { sessionId } = req.query;
  
  if (sessions.has(sessionId)) {
    const data = sessions.get(sessionId);
    
    if (data.ready) {
      const response = { 
        ready: true, 
        driveFolderUrl: data.driveFolderUrl,
        currentStage: 'done',
        percent: 100
      };
      sessions.delete(sessionId);
      res.json(response);
    } else {
      res.json({
        ready: false,
        currentStage: data.currentStage || 'splitting',
        stageDetail: data.stageDetail || 'Processing...',
        percent: data.percent || 50
      });
    }
  } else {
    res.json({ 
      ready: false,
      currentStage: 'setup',
      percent: 10
    });
  }
}

export function updateSessionProgress(sessionId, stage, detail, percent) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, { ready: false });
  }
  const session = sessions.get(sessionId);
  session.currentStage = stage;
  session.stageDetail = detail;
  session.percent = percent;
}

export function notifySessionComplete(sessionId, driveFolderUrl) {
  sessions.set(sessionId, { 
    ready: true, 
    driveFolderUrl,
    currentStage: 'done',
    percent: 100
  });
}
