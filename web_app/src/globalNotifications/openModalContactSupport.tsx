import React from 'react'
import {
  Modal,
} from 'antd'
import { css } from '@emotion/css'

import ContactSupport from './ContactSupport'

export default (error: any = {}) => {
  Modal.confirm({
    cancelText: 'Close',
    cancelButtonProps: {
      ghost: true,
      type: 'primary',
    },
    okButtonProps: {
      ghost: true,
      danger: true,
    },
    onOk: () => {
      window.location.reload()
    },
    okText: 'Reload page',
    className: css`
      width: 70% !important; 
      max-width: 700px; 
      min-width: 350px;`,
    title: (
      <>
        <h4>An error occurred</h4>
      </>),
    content: (<ContactSupport error={error} />),
  })
}
