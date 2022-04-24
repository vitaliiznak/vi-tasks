import React, { useState } from 'react'
import {
  Card, Button, Modal, Space
} from 'antd'
import { css } from '@emotion/css'
import {
  Navigate,
  NavLink, Outlet, Route, Routes, useLocation
} from 'react-router-dom'

import InviteNew from './InviteNew'
import InviteList from './InviteList'

const auxStylesContainer = css`
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
`
const stylesTabLink = css`
  padding-bottom: 10px;
  border-bottom: 2px solid transparent;
  font-weight: 700;
  color: #1990ff;
  &:active, &:hover {
    color: #2090ff;
  }
`
const stylesActiveTabLink = css`
  border-bottom: 3px solid #1990ff;
`

export default ({
  className = '',
}: {
  className?: string
}) => {
  const [modalNewBoardConfig, setModalNewInviteConfig] = useState<any>(null)
  const location = useLocation()

  const stylesContainer = `${auxStylesContainer} ${className}`
  return (
    <>
      {Boolean(modalNewBoardConfig) && (
        <Modal
          maskClosable={false}
          onCancel={() => {
            setModalNewInviteConfig(null)
          }}
          visible
          width={400}
          footer={null}
        >
          <InviteNew />
        </Modal>
      )}
      <Card
        title={(
          <div
            className={css`
              margin-bottom: 10px;
            `}
          >
            <div
              className={css`
                display: flex; 
                padding-bottom: 18px;
                justify-content:space-between;
              `}
            >
              <h3>Invites</h3>
              <Button
                size="large"
                type="primary"
                ghost
                onClick={() => {
                  setModalNewInviteConfig({})
                }}
                className={css`margin-left: auto;`}
              >
                Create invitation
              </Button>
            </div>
            <Space>
              <NavLink
                className={({ isActive }) => isActive ? stylesActiveTabLink : stylesTabLink}
                to={'active'}
              >
                Active
              </NavLink>
              <NavLink
                className={({ isActive }) => isActive ? stylesActiveTabLink : stylesTabLink}
                to={'used-and-expired'}
              >
                Used & expired
              </NavLink>
            </Space>
          </div>
        )}
        className={stylesContainer}
      >

        <Outlet />


      </Card>
    </>
  )
}
