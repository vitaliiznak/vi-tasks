import React, { FunctionComponent, ReactElement } from 'react'
import {
  Form, Input, Button, Card, Select, message,
} from 'antd'
import { css } from '@emotion/css'
import TextArea from 'antd/lib/input/TextArea'
import Dragger from 'antd/lib/upload/Dragger'
import { InboxOutlined } from '@ant-design/icons'
import { useMutation } from '@apollo/client'
import { FormInstance } from 'antd/lib/form/hooks/useForm'
import { CREATE_TASK } from 'queries'
import { CreateTaskMutation } from 'queries/types'

const cssFormItem = css`
  display: block;
`
type FormItemProperties = React.ComponentProps<typeof Form.Item>
const normFile: FormItemProperties['getValueFromEvent'] = (e) => (Array.isArray(e) ? e : e && e.fileList)

type FormProperties = React.ComponentProps<typeof Form>
export default ({
  boardId,
  title: titleCard,
  className = '',
  form: formArgument,
  footer: Footer = ((properties: {
    saving: boolean
  }) => (
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
  onCreated
}: {
  boardId: string,
  title?: ReactElement,
  className?: string,
  form?: FormInstance<any>,
  footer?: FunctionComponent<any> | null,
  onCreated: () => void
}) => {
  const [localForm] = Form.useForm()
  const form = formArgument || localForm
  const [createTask, {
    loading: loadingCreateTask,
  }] = useMutation<CreateTaskMutation>(CREATE_TASK)

  const onFinish: FormProperties['onFinish'] = (values) => {
    const {
      title,
      description,
      attachments,
      priority,
      assigners,
    } = values as any
    const attachmentsFormatted = attachments
      .map(({
        uid,
        name,
        type,
        originFileObj,
      }: any) => ({
        uid,
        name,
        type,
        originFileObj,
      }))

    const input = {
      title,
      description,
      assigners,
      attachments: attachmentsFormatted,
      priority,
      board: boardId,
    }
    createTask({
      variables: {
        input,
      },
      refetchQueries: ['GetTasks'],
    }).then(() => {
      message.success('Task has been created!')
      form.resetFields()
      onCreated()
    })
  }

  return (
    <Card
      title={titleCard}
      className={`
        ${className}
    }`}
    >
      <Form
        name="taskNew"
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
        <Form.Item
          name={['description']}
          label="Description"
          rules={[{ required: true, min: 8 }]}
          className={cssFormItem}

        >
          <TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
        </Form.Item>
        <Form.Item
          name="attachments"
          valuePropName="fileList"
          getValueFromEvent={normFile}>
          <Dragger
            accept="image/*,.pdf"
            beforeUpload={() => false}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload

            </p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibit from uploading
              company data or other
              band files
            </p>
          </Dragger>
        </Form.Item>
        <Form.Item
          name={['priority']}
          label="Priority"
          className={cssFormItem}
          rules={[{ required: true }]}
        >
          <Select
            className={css`
             width: 100%;`}
          >
            <Select.Option value="LOW">Low</Select.Option>
            <Select.Option value="MEDIUM">Medium</Select.Option>
            <Select.Option value="HIGH">High</Select.Option>
            <Select.Option value="CRITICAL">Critical</Select.Option>
          </Select>
        </Form.Item>
        {Footer && <Footer saving={loadingCreateTask} />}
      </Form>

    </Card>
  )
}
