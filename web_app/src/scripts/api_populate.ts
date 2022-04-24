
import { ApolloClient, DefaultOptions, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import nodeFetch from 'node-fetch'
import { LocalStorage } from 'node-localstorage'
import path, { dirname } from 'path'
import createLink from '../apolloClient/createLink'

import Faker from './Faker'

const localStorageNode = new LocalStorage(path.join(dirname(require!.main!.filename!), './localStorage'))
global.localStorage = global.localStorage || localStorageNode
global.fetch = global.fetch || nodeFetch

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

const cache = new InMemoryCache()
const client = new ApolloClient<NormalizedCacheObject>({
  uri: process.env.REACT_APP_GRAPHQL_URI,
  link: createLink({
    tokenStorage: localStorageNode
  }),
  defaultOptions,
  cache,
  name: 'Vi-Tasks',
  version: '0.1'
  // typeDefs
})


const faker = new Faker(client)
faker.populate({ doLogin: true })


export default {}