import { useState, useEffect } from 'react';

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    console.log('Install requested. deferredPrompt status:', !!deferredPrompt);
    
    if (!deferredPrompt) {
      // Fallback for browsers that don't support beforeinstallprompt or if already installed
      alert(
        "ResolveBridge Installation:\n\n" +
        "1. Click the browser's menu (three dots or share icon).\n" +
        "2. Select 'Install App' or 'Add to Home Screen'.\n\n" +
        "If you've already installed the app, you can open it from your device's home screen."
      );
      return;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('Installation outcome:', outcome);
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } catch (err) {
      console.error('PWA installation error:', err);
    }
  };

  return { deferredPrompt, handleInstall };
}
