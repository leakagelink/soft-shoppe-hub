import { useEffect, useState } from 'react';
import logo from '@/assets/nanhaa-logo.png';

const SEEN_KEY = 'nanhaa-splash-seen';

export function SplashScreen() {
  const [phase, setPhase] = useState<'show' | 'fade' | 'gone'>('show');

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) {
      setPhase('gone');
      return;
    }
    sessionStorage.setItem(SEEN_KEY, '1');
    const fade = setTimeout(() => setPhase('fade'), 1600);
    const gone = setTimeout(() => setPhase('gone'), 2200);
    return () => {
      clearTimeout(fade);
      clearTimeout(gone);
    };
  }, []);

  if (phase === 'gone') return null;

  return (
    <div className={`splash-screen ${phase === 'fade' ? 'splash-fade' : ''}`} aria-hidden="true">
      <span className="splash-blob splash-blob-mint" />
      <span className="splash-blob splash-blob-blush" />
      <span className="splash-blob splash-blob-lavender" />
      <div className="splash-card">
        <img src={logo} alt="Nanhaa" width={1024} height={1024} className="splash-logo" />
        <p className="splash-tagline">chhoti cheezein, badi khushiyaan</p>
        <span className="splash-bar"><span className="splash-bar-fill" /></span>
      </div>
    </div>
  );
}
