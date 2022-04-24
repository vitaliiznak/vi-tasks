import React, { ReactElement } from 'react'
import {
  ApolloProvider,
} from '@apollo/client'
import {
  ConfigProvider,
} from 'antd'
import {
  ApolloClient,
  InMemoryCache,
  DefaultOptions,
  NormalizedCacheObject,
} from '@apollo/client'
import {
  BrowserRouter as Router,
} from 'react-router-dom'
import MainRoutes from './Routes'
import ErrorBoundary from './ErrorBoundary'
import createLink from '../apolloClient/createLink'

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  }
}

const link = createLink()
const cache = new InMemoryCache()
export const apolloReactClient = new ApolloClient<NormalizedCacheObject>({
  //uri: process.env.REACT_APP_GRAPHQL_URI,
  link,
  defaultOptions,
  cache,
  name: 'ViTasks',
  version: '0.1'
  // typeDefs
})

export default (): ReactElement => (
  <ErrorBoundary>
    <ApolloProvider client={apolloReactClient}>
      <Router>
        <ConfigProvider componentSize="small">
          <MainRoutes />
        </ConfigProvider>
      </Router>
    </ApolloProvider>
  </ErrorBoundary>
)
