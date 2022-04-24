import React from 'react'
import { css } from '@emotion/css'
import {
  Button, Divider, Tooltip, message,
} from 'antd'

const CONSOLE_COLORS = new Proxy({
  log: '#212121',
  warn: 'orange',
  error: 'red',
  debug: 'blue',
},
{
  get(target, property, receiver) {
    return (target as any)[property] || '#212121'
  },
}) as any

export default (error: any = {}, className = '') => (
  <div className={className}>
    <p>
      Please try to reload the page if issue continues please contact
      {' '}
      <a href="/#">our support team</a>
    </p>
    {/*  <p>
      Please attach copy of the below output to the support letter
    </p>
    <div className={css`position: relative;`}>
      <div
        className={css`
            background-color: rgba(200,200,200,0.5);
            max-height: 280px;
            overflow: auto;
            & > p {
                font-weight: 300;
            }`}
      >
        <Tooltip placement="topLeft" title="Copy error information">
          <Button
            onClick={() => {
              message.warning('Copy to clipboard not implemented yet')
            }}
            type="primary"
            className={css`
            position: absolute;
            right: 28px;
            top: 20px;
            `}
            icon={(
              <span className="material-icons">
                content_copy
              </span>
            )}
          />
        </Tooltip>
        <pre
          className={css`
            white-space: pre-wrap;
            word-wrap: break-word;
            overflow-x: hidden;`}
        >
          {JSON.stringify(error)}
        </pre>
        <Divider /> */}
    {/*  {consoleHistory.reverse().map(({ type, datetime, value: [tag, text] }) => (
          <p key={datetime} className={css`color: ${CONSOLE_COLORS[type]};`}>
            <strong>{tag}</strong>
            <span>{JSON.stringify(text)}</span>
          </p>
        ))}
      </div>
    </div> */}
  </div>
)
