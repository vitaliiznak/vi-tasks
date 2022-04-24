import React from 'react'
import {
  Comment, Form, Button, Input, message, Tooltip,
} from 'antd'
import { css } from '@emotion/css'
import { useMutation, useReactiveVar } from '@apollo/client'
import { CREATE_COMMENT, CREATE_REPLY_COMMENT } from 'queries'
import AvatarZ from 'screens/components/AvatarZ'
import { gUserMe } from 'appState/appState'

const { TextArea } = Input
const AddComment = ({
  task,
  previous,
  isArchived,
  onFinish: onFinishArgument = () => {/* blank ovveride */ },
}: {
  task?: string,
  isArchived?: boolean,
  previous?: string,
  onFinish?: () => void
}) => {
  const [form] = Form.useForm()
  const accountMe = useReactiveVar(gUserMe)

  const [createComment, {
    loading: mutationCreateLoading
  }] = useMutation(CREATE_COMMENT)
  const [createReplyComment, {
    loading: mutationReplyLoading
  }] = useMutation(CREATE_REPLY_COMMENT)


  const successMessageFunction = () => {
    message.success('Comment added')
    form.resetFields()
    onFinishArgument()
  }

  const onFinish = (values: { comment: string }) => {
    if (previous) {
      createReplyComment({
        variables: {
          input: {
            content: values.comment,
            task,
            previous,
          },
        },
        refetchQueries: ['GetComments'],
      }).then(successMessageFunction)
    } else if (task) {
      createComment({
        variables: {
          input: {
            content: values.comment,
            task,
          },
        },
        refetchQueries: ['GetComments'],
      }).then(successMessageFunction)
    }
  }

  return (
    <Comment
      avatar={(
        <AvatarZ
          avatarSrc={accountMe?.avatar?.file?.uri}
          fullName={accountMe?.fullName}
        />
      )}
      content={(
        <Form name="addComment" form={form} onFinish={onFinish}>

          {isArchived
            ? (
              <Tooltip title="You can not comment on archived task">
                <Form.Item>
                  <TextArea disabled autoSize={{ minRows: 3, maxRows: 5 }} />
                </Form.Item>
              </Tooltip>
            )
            : (
              <Form.Item name="comment" rules={[{ required: true }]}>
                <TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
              </Form.Item>
            )}

          <Form.Item
            className={
              css`
            & .ant-form-item-control-input-content { 
              display: flex; justify-content: flex-end;
            }
          `
            }
          >
            {isArchived
              ? (
                <Tooltip title="You can not comment on archived task">
                  <Button
                    disabled
                    ghost
                    type="primary"
                  >
                    Send
                  </Button>
                </Tooltip>
              )
              : (
                <Button
                  htmlType="submit"
                  loading={mutationCreateLoading || mutationReplyLoading}
                  ghost
                  type="primary"
                >
                  Send
                </Button>
              )}

          </Form.Item>
        </Form>
      )}
    />
  )
}

export default AddComment
