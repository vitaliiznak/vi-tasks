import React, { useState } from 'react'
import {
  Form, Input, Button, message,
} from 'antd'
import { css } from '@emotion/css'
import { useMutation, useReactiveVar } from '@apollo/client'
import { CREATE_INVITE } from '@src/queries'
import { gSelectedBoard } from '@src/appState/appState'
import { Link } from 'react-router-dom'

const { TextArea } = Input

const cssFormItem = css`
  display: block;
`

const InviteNew = ({
  className = '',
  onClose = () => { }
}: {
  className?: string,
  onClose?: () => void
}) => {
  const [form] = Form.useForm()
  const [invite, setInvite] = useState<any>()
  const [createInvite] = useMutation(CREATE_INVITE)
  const board = useReactiveVar(gSelectedBoard)
  const onFinish = (values: object) => {
    createInvite({
      variables: {
        input: { boardId: board!.id, ...values },
      },
      refetchQueries: ['GetInvites'],
    }).then((res) => {
      message.success('Board has been created!')
      const inviteCreated = res.data.inviteCreate
      setInvite(inviteCreated)
      // form.resetFields()
      // onDone(res.data.board)
    })
  }

  const isLinkCreated = invite && invite.state === 'NEW'

  return isLinkCreated ? (
    <div className={className}>
      <div className={css`height: 20px;`} />
      <Form.Item
        className={cssFormItem}
      >
        <TextArea
          disabled
          value={invite.description}
          autoSize={{ minRows: 2, maxRows: 7 }}
        />

      </Form.Item>
      <p className={css`padding-bottom: 12px;`}>
        Send the link and the code to the person you would like to invite
        <br />
        <br />
        <p>
          Invitation link:
          <br />
          <strong className={css`font-size:11px;`}>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              to={`/p/invites/${invite.id}`}
            >
              {`${window.location.protocol}//${window.location.host}/p/invites/${invite.id}`}
            </Link>
          </strong>
          <br />
          Invitation Code:
          <br />
          <strong className={css`font-size:11px;`}>
            {invite.token}
          </strong>
        </p>
      </p>
      <div className={css`display: flex; justify-content: space-between;`}>
        <Button size="middle" ghost type="primary" htmlType="submit" onClick={onClose}>Close</Button>
      </div>
    </div>

  ) : (

    <Form
      name="inviteNew"
      className={className}
      scrollToFirstError
      form={form}
      onFinish={onFinish}
      initialValues={{
        description: '',
      }}
    >
      <h4>
        Generate invitation link to this board.
        <br />
        Add an invitation text for receiver
        <br />
        ( Hi, welcome to our board ... )
      </h4>
      <Form.Item
        name={['description']}
        label=""
        rules={[{ required: true, min: 3, message: 'Invitation text is required' }]}
        className={cssFormItem}
      >
        <TextArea
          autoSize={{ minRows: 2, maxRows: 7 }}
        />
      </Form.Item>
      <div className={css`display: flex; justify-content: flex-end;`}>
        <Button size="middle" ghost type="primary" htmlType="submit">Generate invitation link</Button>
      </div>
    </Form>
  )
}

export default InviteNew
