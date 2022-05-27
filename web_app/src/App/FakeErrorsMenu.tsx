import React, { useMemo, useState } from 'react'
import { Button, Tooltip } from 'antd'
import { css } from '@emotion/css'
import { gql, useReactiveVar } from '@apollo/client'
import Faker from '@src/scripts/Faker'
import { apolloReactClient } from './App'
import { gSelectedBoard } from '@src/appState/appState'

const NOT_EXISTING_QUERY = gql`
  query notExistingQuery {
      getIng {
          id
      }
  }
`
export default () => {

  const faker = useMemo(() => new Faker(apolloReactClient), [])
  const board = useReactiveVar(gSelectedBoard)
  const [isBoardPopulating, setIsBoardPopulating] = useState(false)

  const onFillWithFakeData = () => {
    setIsBoardPopulating(true)
    faker.populateForBoard(board!.id, { num: 8 }).then(() => {
      window.location.reload()
    }).finally(() => {
      setIsBoardPopulating(false)
    })
    // window.location.reload()
  }
  return (
    <div className={css`
        margin-top: auto;
        & button {
          margin: 8px 0;
        }
        `}
    >
      {Boolean(board) && <Button
        className={css`white-space: normal;
         height: auto;
          margin-bottom: 10px;
          margin-left: 8px; 
          margin-top: 10px;
          width: 100%;`}
        danger
        size='small'
        onClick={onFillWithFakeData}
        loading={isBoardPopulating}>Populate board<br /> with fake data</Button>
      }
      {/* {errorTreeNode}
      <Tooltip title="For testing purposes" color="orange">
        <Button
          block
          ghost
          danger
          onClick={() => {
            notExistingQuery()
          }}
        >
          Rise Graphql Error
        </Button>
      </Tooltip>
      <Tooltip title="For testing purposes" color="orange">
        <Button
          block
          ghost
          danger
          onClick={() => {
            makeError({ error: 'error here' })
          }}
        >
          Rise Tree Render Error
        </Button>
      </Tooltip> */}
    </div>
  )
}
