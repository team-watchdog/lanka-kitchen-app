import type { AppProps } from 'next/app'

// styles
import '../styles/globals.css';

import { Header } from '../containers/Header';
import HeadMeta from '../partials/HeadMeta';

function MyApp({ Component, pageProps }: AppProps) {
  const metaDescription = `Lanka Kitchen is an effort to help community kitchens, ration support groups, and other mutual aid organizations run their operations more smoothly and garner support from their communities during this time of crisis.`;

  return (
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
  )
}

export default MyApp
