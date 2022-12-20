import type { AppProps } from 'next/app'
import { useState } from 'react';

// styles
import '../styles/globals.css';

import { Header } from '../containers/Header';
import HeadMeta from '../partials/HeadMeta';

// context
import { LanguageContext, CookieHelpers, Language } from '../localize';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  const [language, setLanguage] = useState<Language>(CookieHelpers.getLocaleCookie() as Language ?? "en");
  const metaDescription = `Lanka Kitchen is an effort to help community kitchens, ration support groups, and other mutual aid organizations run their operations more smoothly and garner support from their communities during this time of crisis.`;

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
  }

  useEffect(() => {
    CookieHelpers.setLocaleCookie(language);
  }, [ language ])

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      <div>
        <Header />
        <HeadMeta 
            title={"Lanka Kitchen"}
            description={metaDescription}
        />
        <div>
          <Component {...pageProps} />
        </div>
      </div>
    </LanguageContext.Provider>
  )
}

export default MyApp
