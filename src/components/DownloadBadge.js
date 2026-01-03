import React, {useEffect, useState} from 'react';
import styles from './DownloadBadge.module.css';

export default function DownloadBadge() {
  const [downloadsText, setDownloadsText] = useState('Loading...');

  useEffect(() => {
    // Fetch from Docker Hub API
    fetch('https://hub.docker.com/v2/repositories/sparkison/m3u-editor/')
      .then((r) => { 
        if (!r.ok) throw new Error('Failed to fetch'); 
        return r.json(); 
      })
      .then((data) => {
        if (data && typeof data.pull_count === 'number') {
          // Format the number with commas
          const formatted = data.pull_count.toLocaleString('en-US');
          setDownloadsText(`${formatted}+`);
        }
      })
      .catch(() => {
        // Fallback to hardcoded value
        setDownloadsText('120,000+');
      });
  }, []);

  return (
    <a 
      href="https://hub.docker.com/r/sparkison/m3u-editor" 
      target="_blank" 
      rel="noopener noreferrer"
      className={styles.downloadBadge} 
      role="status" 
      aria-live="polite"
    >
      <span className={styles.emoji} aria-hidden="true">🚀</span>
      {downloadsText} Downloads
    </a>
  );
}
