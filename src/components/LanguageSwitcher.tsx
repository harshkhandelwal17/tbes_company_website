'use client';

import { useRouter, usePathname } from 'next/navigation';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const changeLanguage = (lang: string) => {
    // remove any existing locale prefix before adding the new one
    const segments = pathname.split('/').filter(Boolean);
    if (['en', 'fr', 'it'].includes(segments[0])) {
      segments.shift(); // remove old lang prefix
    }
    const newPath = `/${lang}/${segments.join('/')}`;
    router.push(newPath);
  };

  return (
    <div>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('fr')}>Français</button>
      <button onClick={() => changeLanguage('it')}>Italiano</button>
    </div>
  );
}
