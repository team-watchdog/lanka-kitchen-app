import type { AppProps } from 'next/app'

// styles
import '../styles/globals.css';
import variables from '../styles/variables.module.scss';

import { Header } from '../containers/Header';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Header />
      <div>
        <Component {...pageProps} />
      </div>
    </div>
  )
}

export default MyApp
