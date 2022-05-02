import React, { useState } from 'react'
import { Button, Card, Modal } from 'antd'
import { css } from '@emotion/css'

import InviteNew from 'screens/PageInvites/InviteNew'
import MemberList from './MemberList'


export default () => {
  const [modalNewBoardConfig, setModalNewInviteConfig] = useState<null | Record<string, unknown>>(null)
  const onClose = () => {
    setModalNewInviteConfig(null)
  }
  return (
    <>
      {Boolean(modalNewBoardConfig) && (
        <Modal
          maskClosable={false}
          onCancel={onClose}
          visible
          width={400}
          footer={null}
        >
          <InviteNew onClose={onClose} />
        </Modal>
      )}
      <Card
        className={
          css`
          max-width: 800px;
        `
        }
        title={(
          <div className={css`display: flex;justify-content: space-between;`}>
            <h3>Board members</h3>
            <Button
              size="large"
              type="primary"
              ghost
              className={css`margin-left: auto;`}
              onClick={() => {
                setModalNewInviteConfig({})
              }}
            >
              Invite new member
            </Button>
          </div>
        )}
      >
        <MemberList />
      </Card>
    </>
  )
}
