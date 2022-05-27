/* eslint-disable semi */
import React, { useCallback, useEffect, useState } from 'react'
import { Form, Input, Button } from 'antd'
import { css } from '@emotion/css'
import { useMutation } from '@apollo/client'
import { LOGIN } from '@src/queries'
import { AUTH_TOKEN_LOCALSTORAGE_KEY } from '../../appConstants'

const cssFormItem = css`
  display: block;
`

type FormProperties = React.ComponentProps<typeof Form>
export default (
  { footerButtons }: { footerButtons?: React.ReactElement },
): React.ReactElement => {
  const [error, setError] = useState<any | null>(null)
  const [login, { loading, data }] = useMutation(LOGIN)

  useEffect(() => {
    if (data?.accountLogin?.token?.length) {
      localStorage.setItem(
        AUTH_TOKEN_LOCALSTORAGE_KEY,
        data.accountLogin.token,
      )
      window.location.reload()
    }
  }, [data])

  const onFinish: FormProperties['onFinish'] = useCallback((variables: any) => {
    login({
      variables: {
        ...variables,
      },
    }).catch((error_: any) => {
      setError(error_)
    })
  }, [])

  return (
    <Form
      name="login"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      className={css`
        width: 100%;
      `}
    >
      <Form.Item
        className={cssFormItem}
        label="Emal"
        name="email"
        rules={[
          {
            required: true,
            message: 'Please input your email!'
          },
          {
            type: 'email',
            message: 'not an email',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        className={cssFormItem}
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>
      {error?.graphQLErrors?.some(
        ({ extensions }: any) => extensions?.code === 'UNAUTHENTICATED',
      ) &&
        (<div
          className={css`
            color: red;
          `}
        >
          Invalid credentials
        </div>
        )}
      <div
        className={css`
          display: flex;
          width: 100%;
        `}
      >
        {footerButtons}
        <Button
          loading={loading}
          className={css`
            margin-left: auto;
          `}
          ghost
          type="primary"
          htmlType="submit"
        >
          Enter
        </Button>
      </div>
    </Form>
  )
}
