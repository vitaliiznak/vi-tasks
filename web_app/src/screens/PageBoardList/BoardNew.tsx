import React, { FunctionComponent } from 'react'
import {
  Form, Input, Button, message,
} from 'antd'
import { css } from '@emotion/css'
import { useMutation } from '@apollo/client'
import { FormInstance } from 'antd/lib/form/hooks/useForm'
import { CREATE_BOARD } from 'queries'
import { CreateBoardMutation } from 'queries/types'

const cssFormItem = css`
  display: block;
`
type FormProperties = React.ComponentProps<typeof Form>
export default ({
  className = '',
  onDone = (_newCreatedBoard: {
    id: string
  }) => { },
  form: formArgument,
  footer: Footer = ((properties?: any) => (
    <div
      className={
        css`
      display: flex;
      justify-content: flex-end;
    `
      }
    >
      <Button type="primary" htmlType="submit" ghost loading={properties.saving}>
        Create
      </Button>
    </div>
  )),
}: {
  className?: string,
  form?: FormInstance<any>,
  footer?: FunctionComponent<any> | null,
  onDone?: (createdBoard: any) => void
}) => {
  const [localForm] = Form.useForm()
  const form = formArgument || localForm
  const [createBoard, {
    loading: loadingCreateBoard,
  }] = useMutation<CreateBoardMutation>(CREATE_BOARD)

  const onFinish: FormProperties['onFinish'] = (values) => {
    createBoard({
      variables: {
        input: values,
      },
      refetchQueries: ['GetBoards', 'GetBoard'],
    }).then((res) => {
      onDone(res.data!.board)
      message.success('Board has been created!')
      form.resetFields()
    }).catch((error) => {
      console.error(error)
    })
  }

  return (
    <Form
      name="boardNew"
      className={className}
      scrollToFirstError
      form={form}
      onFinish={onFinish}
      initialValues={{
        description: '',
        attachments: [],
        assigners: [],
      }}
    >
      <Form.Item
        name={['title']}
        label="Title"
        rules={[{ required: true, min: 3 }]}
        className={cssFormItem}
      >
        <Input />
      </Form.Item>
      {Footer && <Footer saving={loadingCreateBoard} />}
    </Form>
  )
}
