import type { NextPage } from 'next'
import { gql, useQuery } from "@apollo/client";

// styles
import styles from '../styles/Home.module.css'

// containers
import LayoutWithAuth from '../containers/LayoutWithAuth';
import Requests from '../containers/Requests';
import { Loading } from '../components/Loading';
import { FunctionComponent } from 'react';

const Queries = {
  GET_ORGANIZATION_DETAILS: gql`
      query Organization{
          me{
              organization{
                  id
              }
          }
      }
  `,
}

const RequestWrapperContainer: FunctionComponent = () => {
  const { data, loading } = useQuery(Queries.GET_ORGANIZATION_DETAILS);

  return (
    <div>
      {loading ? <Loading /> : (
        <Requests
          organizationId={parseInt((data?.me?.organization?.id as unknown) as string)}
          editAccess={true}
        />
      )}
    </div>
  )
}

const RequestsPage: NextPage = () => {
    return (
      <LayoutWithAuth>
        <div className={styles.container} style={{ paddingTop: "2rem" }}>
          <RequestWrapperContainer />
        </div>
      </LayoutWithAuth>
    )
  }
  
  export default RequestsPage;
  