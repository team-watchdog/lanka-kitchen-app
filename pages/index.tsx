import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'

import LayoutWithAuth from '../containers/LayoutWithAuth'

const Home: NextPage = () => {
  return (
    <LayoutWithAuth>
      <div className={styles.container} style={{ width: "100%", height: 600 }}>
        
      </div>
    </LayoutWithAuth>
  )
}

export default Home
