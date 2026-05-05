// hooks/useEnhancer.js
// Custom React hook to handle image enhancement API calls

import { useState, useCallback } from 'react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export function useEnhancer() {
  const [status, setStatus] = useState('idle'); // idle | uploading | enhancing | done | error
  const [enhancedUrl, setEnhancedUrl] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const [isMock, setIsMock] = useState(false);

  const enhance = useCallback(async (file, removeBackground = false) => {
    setStatus('uploading');
    setEnhancedUrl(null);
    setError(null);
    setIsMock(false);
    setProgress(10);

    try {
      // Build multipart form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('remove_background', removeBackground.toString());

      setStatus('enhancing');
      setProgress(30);

      // Simulate progress ticks while waiting
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 92) {
            clearInterval(progressInterval);
            return 92;
          }
          return prev + Math.random() * 5;
        });
      }, 1000);

      const response = await fetch(`${API_BASE}/enhance`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Server error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.enhanced_url) {
        throw new Error('No enhanced image URL returned from server');
      }

      setProgress(100);
      setEnhancedUrl(data.enhanced_url);
      setIsMock(data.is_mock || data.mock_mode);
      setStatus('done');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setStatus('error');
      setProgress(0);
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setEnhancedUrl(null);
    setError(null);
    setProgress(0);
    setIsMock(false);
  }, []);

  return { status, enhancedUrl, error, progress, enhance, reset, isMock };
}
