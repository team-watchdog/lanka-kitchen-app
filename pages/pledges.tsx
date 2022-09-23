import type { NextPage } from 'next'

// styles
import styles from '../styles/Home.module.css'

// containers
import LayoutWithAuth from '../containers/LayoutWithAuth';
import Pledges from '../containers/Pledges';

const PledgesPage: NextPage = () => {
    return (
      <LayoutWithAuth>
        <div className={styles.container} style={{ width: "100%", height: 600 }}>
          <Pledges />
        </div>
      </LayoutWithAuth>
    )
  }
  
  export default PledgesPage;
  