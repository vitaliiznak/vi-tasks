import React from 'react'
import {
  Card,
} from 'antd'
import { css } from '@emotion/css'
import LoginForm from 'screens/LoginForm'

export default () => (
  <Card
    title={<h2>Login</h2>}
    className={css`
        max-width: 800px;
        width: 400px;
        margin: 0 auto;
        margin-top:5%; 
      `}
  >
    <LoginForm />
  </Card>

)
