/* eslint-disable semi */
import React, { useCallback, useState } from 'react'
import {
  Form, Input, Button, Card, Skeleton, Typography, message
} from 'antd'
import { css } from '@emotion/css'
import { useMutation, useQuery } from '@apollo/client'
import { GET_INVITE_PUBLIC_BY_ID, JOIN_BOARD } from '@src/queries'
import { useNavigate, useParams } from 'react-router-dom'

const { Text } = Typography

const cssFormItem = css`
  display: block;
`

type FormProperties = React.ComponentProps<typeof Form>
export default (
  { footerButtons }: { footerButtons?: React.ReactElement },
): React.ReactElement => {
  const navigate = useNavigate()
  const { inviteId } = useParams<{ inviteId: string }>()
  const [errorToShow, setErrorMessage] = useState<any>('')
  const { loading, data, error } = useQuery(GET_INVITE_PUBLIC_BY_ID, { variables: { id: inviteId } })

  const [joinBoard, { loading: loadingJoinBoard, data: joinBoardResult, error: joinBoardError }] = useMutation(JOIN_BOARD)

  const onFinish: FormProperties['onFinish'] = (variables: any) => {
    joinBoard({
      variables: {
        input: { id: inviteId, ...variables },
      },
    })
      .then((res) => {
        if (!res?.data?.inviteJoinBoard) {
          setErrorMessage('The token is invalid or link has expired')
          // throw new Error('The token is invalid or link has expired')
        } else {
          message.success(`Now yoa are a member of a board ${data?.invitePublicGetById?.board?.title}`)
          navigate(`/b/${data.invitePublicGetById.board.id}`)
        }
        return res
      })
      .catch((error_: any) => {
        if (error_?.graphQLErrors?.some(
          ({ message: errorMessage }: any) => errorMessage.includes('duplicate'),
        )) {
          setErrorMessage(<span>You already a member of <b>{data?.invitePublicGetById?.board?.title}</b> board</span>)
        } else {
          setErrorMessage('Some error occurred please try again')
        }
      })
  }

  const onValuesChange = useCallback(() => {
    if (errorToShow?.length) {
      setErrorMessage('')
    }
  }, [errorToShow])

  if (data?.invitePublicGetById?.state !== 'NEW') {
    return (
      <Skeleton
        className={css`
          max-width: 520px;
          width: 470px;
          margin: 0 auto;
          margin-top:5%;
          &  .ant-card-body {
            display:flex;
            justify-content:space-between;
            flex-direction: row;
            color: red;
          }
        `}
        loading={loading || loadingJoinBoard}
      >
        <Card
          title={(
            <p>
              <span className={css`
                  color: red;
                  font-size: 20px;
                `}
              >
                Invitation link has expired, invalid or already used
              </span>
              <br />
              please request a new one
            </p>
          )}
        />
      </Skeleton>
    )
  }


  return (
    <Card
      className={css`
          max-width: 520px;
          width: 470px;
          margin: 0 auto;
          margin-top:5%;
          & > .ant-card-body {
            display:flex;
            justify-content:space-between;
            flex-direction: row;
          }
        `}
      title={(
        <div>
          <h2>
            Hi, you have been invited to join
            {' '}
            <b>{data?.invitePublicGetById?.board?.title}</b>
            {' '}
            board
            {' '}
          </h2>
          Invitation message
          {' '}
          <br />
          <Text type="secondary">{data?.invitePublicGetById?.description}</Text>
        </div>)
      }
    >
      <Form
        name="pageInvite"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onValuesChange={onValuesChange}
        className={css`
        width: 100%;
      `}
      >
        <Form.Item
          className={cssFormItem}
          label="Please paste your access token to join the board"
          name="token"
          rules={[
            { required: true, message: 'Please input your access token!' },
          ]}
        >
          <Input />
        </Form.Item>
        <div
          className={css`
          display: flex;
          width: 100%;
        `}
        >
          <div
            className={css`
            color: red;
            `}
          >
            {errorToShow}
          </div>
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
            Join the board
          </Button>
        </div>
      </Form>
    </Card >
  )
}
