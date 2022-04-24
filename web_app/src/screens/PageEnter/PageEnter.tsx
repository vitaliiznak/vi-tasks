import React from 'react'
import {
  Card,
} from 'antd'
import { css } from '@emotion/css'
import LoginForm from '../LoginForm'
import SignupForm from '../SignupForm'

export default () => (
  <div
    className={css`
      max-width: 1200px;
      width: 620px;
      margin: 0 auto;
      margin-top:5%;
      display:flex;
    `}
  >
    <Card
      title={<h2>Login</h2>}
      className={css`
                max-width:570px;
                width: 500px;
                margin: 0 auto;
                margin-top:5%; 
            `}
    >
      <LoginForm />
    </Card>
    <div className={css`width: 24px;`} />
    <Card
      title={<h2>Sign up</h2>}
      className={css`
                max-width: 570px;
                width: 500px;
                margin: 0 auto;
                margin-top:5%; 
            `}
    >
      <SignupForm />
    </Card>
  </div>
)
