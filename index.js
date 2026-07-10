import { useState, useEffect } from 'react';

export default function Home() {
  const [status, setStatus] = useState('idle'); // idle, launching, processing, uploading, done
  const [progress, setProgress] = useState({ stage: '', detail: '', percent: 0 });
  const [driveLink, setDriveLink] = useState('');
  const [colabUrl, setColabUrl] = useState('');
  const [sessionId, setSessionId] = useState('');

  const stages = {
    launching: { icon: '🚀', text: 'Opening Google Colab...' },
    setup: { icon: '🔧', text: 'Installing dependencies...' },
    upload: { icon: '📤', text: 'Waiting for PDF upload...' },
    preview: { icon: '🔍', text: 'Analyzing PDF structure...' },
    splitting: { icon: '✂️', text: 'Splitting into chapters...' },
    saving: { icon: '💾', text: 'Saving to Google Drive...' },
    done: { icon: '✅', text: 'Chapters ready!' }
  };

  const startProcessing = async () => {
    setStatus('launching');
    setProgress({ stage: 'launching', detail: 'Preparing your session...', percent: 5 });
    
    try {
      const res = await fetch('/api/colab-url');
      const { url, sessionId: sid } = await res.json();
      
      setColabUrl(url);
      setSessionId(sid);
      
      // Open Colab
      setProgress({ stage: 'launching', detail: 'Colab opened in new tab', percent: 10 });
      window.open(url, '_blank');
      
      // Start polling with simulated realistic progress
      pollProgress(sid);
      
    } catch (error) {
      setStatus('idle');
      alert('Failed to start. Please try again.');
    }
  };

  const pollProgress = (sid) => {
    let pollCount = 0;
    const maxPolls = 150; // 5 minutes max
    
    const interval = setInterval(async () => {
      pollCount++;
      
      try {
        const res = await fetch(`/api/check-session/${sid}`);
        const data = await res.json();
        
        if (data.ready) {
          clearInterval(interval);
          setProgress({ stage: 'done', detail: 'All chapters processed!', percent: 100 });
          setDriveLink(data.driveFolderUrl);
          setStatus('done');
          return;
        }
        
        // Update progress based on poll count (simulated stages)
        if (data.currentStage) {
          // Real stage from Colab (if implemented)
          setProgress({
            stage: data.currentStage,
            detail: data.stageDetail || stages[data.currentStage]?.text,
            percent: data.percent || estimateProgress(pollCount)
          });
          setStatus('processing');
        } else {
          // Fallback: estimate based on time
          updateEstimatedProgress(pollCount);
          setStatus('processing');
        }
        
        if (pollCount >= maxPolls) {
          clearInterval(interval);
          setProgress({ 
            stage: 'error', 
            detail: 'Taking longer than expected. Check the Colab tab.', 
            percent: 50 
          });
        }
        
      } catch (error) {
        // Keep polling silently
      }
    }, 2000);
  };

  const estimateProgress = (pollCount) => {
    if (pollCount < 5) return 15;
    if (pollCount < 15) return 30;
    if (pollCount < 30) return 50;
    if (pollCount < 50) return 70;
    if (pollCount < 80) return 85;
    return 95;
  };

  const updateEstimatedProgress = (pollCount) => {
    if (pollCount < 3) {
      setProgress({ stage: 'setup', detail: 'Installing Python packages...', percent: 15 });
    } else if (pollCount < 8) {
      setProgress({ stage: 'upload', detail: 'Waiting for you to upload the PDF...', percent: 25 });
    } else if (pollCount < 20) {
      setProgress({ stage: 'preview', detail: 'Detecting chapters with AI...', percent: 40 });
    } else if (pollCount < 40) {
      setProgress({ stage: 'splitting', detail: 'Splitting PDF into chapters...', percent: 60 });
    } else if (pollCount < 60) {
      setProgress({ stage: 'saving', detail: 'Saving chapters to Google Drive...', percent: 80 });
    } else {
      setProgress({ stage: 'saving', detail: 'Almost done...', percent: 90 });
    }
  };

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '80px auto', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>📚 PDF Chapter Splitter</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Intelligently split PDFs into chapters using AI. Files stay in your Google Drive.
      </p>
      
      {status === 'idle' && (
        <div style={{ textAlign: 'center' }}>
          <button 
            onClick={startProcessing}
            style={{
              padding: '16px 32px',
              fontSize: '18px',
              background: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '500',
              boxShadow: '0 4px 14px rgba(0,118,255,0.3)',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.02)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          >
            Start Splitting PDF
          </button>
          <p style={{ color: '#888', fontSize: '14px', marginTop: '16px' }}>
            Free • No account needed • Files stay private
          </p>
        </div>
      )}

      {(status === 'launching' || status === 'processing') && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          {/* Stage Icon */}
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>
            {stages[progress.stage]?.icon || '⏳'}
          </div>
          
          {/* Stage Text */}
          <h2 style={{ margin: '0 0 8px 0', fontSize: '1.3rem' }}>
            {stages[progress.stage]?.text || progress.detail}
          </h2>
          
          {/* Detail */}
          <p style={{ color: '#666', marginBottom: '24px', fontSize: '14px' }}>
            {progress.detail}
          </p>
          
          {/* Progress Bar */}
          <div style={{ 
            width: '100%', 
            height: '6px', 
            background: '#e5e5e5', 
            borderRadius: '3px',
            overflow: 'hidden',
            marginBottom: '16px'
          }}>
            <div style={{
              width: `${progress.percent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #0070f3, #00c6ff)',
              borderRadius: '3px',
              transition: 'width 0.8s ease-in-out'
            }} />
          </div>
          
          {/* Percentage */}
          <p style={{ color: '#0070f3', fontWeight: '500', fontSize: '14px' }}>
            {progress.percent}%
          </p>
          
          {/* Timeline */}
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#aaa' }}>
            <span style={{ color: progress.percent >= 15 ? '#0070f3' : '#aaa' }}>Setup</span>
            <span style={{ color: progress.percent >= 35 ? '#0070f3' : '#aaa' }}>Analyze</span>
            <span style={{ color: progress.percent >= 55 ? '#0070f3' : '#aaa' }}>Split</span>
            <span style={{ color: progress.percent >= 80 ? '#0070f3' : '#aaa' }}>Save</span>
          </div>
          
          {/* Colab Link */}
          {colabUrl && (
            <div style={{ marginTop: '20px' }}>
              <a 
                href={colabUrl} 
                target="_blank" 
                style={{ 
                  color: '#0070f3', 
                  fontSize: '13px',
                  textDecoration: 'none' 
                }}
              >
                📋 Colab tab not open? Click here
              </a>
            </div>
          )}
        </div>
      )}

      {status === 'done' && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <div style={{ fontSize: '56px', marginBottom: '12px' }}>🎉</div>
          <h2 style={{ margin: '0 0 8px 0' }}>Chapters Ready!</h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            Your PDF has been split and saved to Google Drive
          </p>
          
          <a 
            href={driveLink} 
            target="_blank"
            style={{
              display: 'inline-block',
              padding: '14px 28px',
              background: '#34a853',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '10px',
              fontWeight: '500',
              fontSize: '16px',
              boxShadow: '0 4px 14px rgba(52,168,83,0.3)',
              marginBottom: '16px'
            }}
          >
            📁 Open in Google Drive
          </a>
          
          <br />
          
          <button 
            onClick={() => {
              setStatus('idle');
              setDriveLink('');
              setProgress({ stage: '', detail: '', percent: 0 });
            }}
            style={{
              padding: '10px 20px',
              background: '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              marginTop: '8px'
            }}
          >
            Split Another PDF
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        h2 {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
