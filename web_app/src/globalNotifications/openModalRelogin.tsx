import React, { useCallback } from 'react'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
} from '@apollo/client'
import {
  Modal, Button,
} from 'antd'
import LoginForm from '@src/screens/LoginForm'
import { css } from '@emotion/css'
import { AUTH_TOKEN_LOCALSTORAGE_KEY } from '../appConstants'

const onLogout = () => {
  localStorage.removeItem(AUTH_TOKEN_LOCALSTORAGE_KEY)
  window.location.reload()
}

export default () => {
  const apolloLoginClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: import.meta.env.VITE_APP_GRAPHQL_URI,
    }),
  })
  let secondsToGo = 100

  const title = (sec: number) => (
    <div>
      <h3>Re-Login</h3>
      <span>Session expired</span>
      <br />
      <small>
        This page will be reloaded
        <br />
        in
        {' '}
        {sec}
        {' '}
        second
      </small>
    </div>
  )

  const modal = Modal.confirm({
    okButtonProps: {
      disabled: true,
      style: { display: 'none' },
    },
    cancelButtonProps: {
      disabled: true,
      style: { display: 'none' },
    },
    title: title(secondsToGo),
    className: css`
        & form {
          padding-top: 30px;
      }`,
    content: (
      <ApolloProvider client={apolloLoginClient}>
        <LoginForm footerButtons={<Button danger onClick={onLogout}>Logot</Button>} />
      </ApolloProvider>),
  })
  const timer = setInterval(() => {
    secondsToGo -= 1
    modal.update({
      title: title(secondsToGo),
    })
    if (secondsToGo <= 0) {
      clearInterval(timer)
      onLogout()
    }
  }, 1000)
}
