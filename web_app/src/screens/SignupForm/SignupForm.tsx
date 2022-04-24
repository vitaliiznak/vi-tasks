/* eslint-disable semi */
import React, { useEffect, useState } from 'react'
import { Form, Input, Button } from 'antd'
import { css } from '@emotion/css'
import { useMutation } from '@apollo/client'
import { SIGN_UP } from 'queries'
import { AUTH_TOKEN_LOCALSTORAGE_KEY } from '../../appConstants'

const cssFormItem = css`
  display: block;
`

type FormProperties = React.ComponentProps<typeof Form>
export default (
  { footerButtons }: { footerButtons?: React.ReactElement },
): React.ReactElement => {
  const [error, setError] = useState<any>(null)
  const [signup, { loading, data }] = useMutation(SIGN_UP)
  // eslint-disable-next-line no-unused-vars
  const onFinish: FormProperties['onFinish'] = ({ confirmPassword, ...input }: any) => {
    signup({
      variables: {
        input,
      },
    }).catch((error_: any) => {
      setError(error_)
    })
  }

  useEffect(() => {
    if (data?.accountSignup?.token?.length) {
      localStorage.setItem(
        AUTH_TOKEN_LOCALSTORAGE_KEY,
        data.accountSignup.token,
      )
      window.location.reload()
    }
  }, [data])

  return (
    <Form
      name="signUp"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      className={css`
        width: 100%;
      `}
    >
      <Form.Item
        className={cssFormItem}
        label="Full name"
        name="fullName"
        rules={[
          { required: true, message: 'Please input your name!' },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        className={cssFormItem}
        label="Emal"
        name="email"
        rules={[
          { required: true, message: 'Please input your email!' },
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
        rules={[{ required: true, message: 'Please input password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        className={cssFormItem}
        label="Confirm password"
        name="confirmPassword"
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve()
              }
              // eslint-disable-next-line prefer-promise-reject-errors
              return Promise.reject('The two passwords that you entered do not match!')
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      {error?.graphQLErrors?.some(
        ({ extensions, message }: any) => message.includes('duplicate'),
      ) &&
        (
          <div
            className={css`
            color: red;
          `}
          >
            User with this email already exists
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
          Sign up
        </Button>
      </div>
    </Form>
  )
}
