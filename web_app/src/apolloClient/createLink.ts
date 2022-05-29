import {
  onError,
} from '@apollo/client/link/error'
import { BatchHttpLink, } from '@apollo/client/link/batch-http'
import {
  ApolloLink
} from '@apollo/client'
import { createUploadLink } from 'apollo-upload-client'
import { AUTH_TOKEN_LOCALSTORAGE_KEY } from '../appConstants'
import openModalRelogin from '../globalNotifications/openModalRelogin'

/* const resetToken = onError(({ networkError }) => {
  if (networkError && networkError.name === 'ServerError') {
    // remove cached token on 401 from the server
    token = null
  }
}) */

export default function createLink(options?: {
  tokenStorage?: Storage
}) {
  const tokenStorage = options?.tokenStorage || window.localStorage
  const uri = import.meta.env.VITE_APP_GRAPHQL_URI

  const batchLink = new BatchHttpLink({
    uri,
    batchInterval: 150,
    headers: {
      Authorization: `Bearer ${tokenStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_KEY)}`,
    }
  })
  // const httpLink = new HttpLink({
  //   uri: 'http://localhost:4000/graphql',
  //   headers: {
  //     Authorization: `Bearer ${tokenStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_KEY)}`,
  //   }
  //   // Additional options
  // })

  const uploadLink = createUploadLink({
    uri,
    headers: {
      Authorization: `Bearer ${tokenStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_KEY)}`,
    }
  })

  const linkErrorGeneral = onError(({ graphQLErrors, networkError }) => {
    let isPotentialExpiredToken = false
    const token = tokenStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_KEY)
    if (graphQLErrors) {
      for (const {
        message, locations, extensions, path,
      } of graphQLErrors) {
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${JSON.stringify(path)}`,
        )
        if (token
          && extensions?.code === 'UNAUTHENTICATED'
          && !path?.includes('authLogin')) {
          isPotentialExpiredToken = true
        }
      }
    }
    if (networkError) {
      console.error(`[Network error]: ${networkError}`)
    }

    if (isPotentialExpiredToken && token && token.length > 0) {
      openModalRelogin()
    }

    /*
      const grapQLUntreatedErrors = graphQLErrors?.filter(({ extensions }) => extensions?.code !== 'UNAUTHENTICATED')
      if (grapQLUntreatedErrors?.length || networkError) {
        openModalContactSupport({
          grapQLUntreatedErrors,
          networkError
        })
      }
      */
  })

  /* const linkErrorUnauthorized = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        openAuthModal()
      })
    }
  })
   */

  function isWithMutation(operation: any, ...rest: any) {
    // A single GraphQL operation can comprise of a combination of multiple queries and mutation
    return !operation.query.definitions.some((it: any) => it.operation === 'mutation')
  }


  const BatchUploadLinkSplit = ApolloLink.split(
    isWithMutation,
    batchLink,
    uploadLink
  )

  return linkErrorGeneral.concat(BatchUploadLinkSplit)
}