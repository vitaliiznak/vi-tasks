import React from 'react'
import {
  Select, Form, Spin, Input, Checkbox,
} from 'antd'
import { css } from '@emotion/css'
import { useQuery } from '@apollo/client'
import { PRIORITY } from 'appConstants'
import { GET_USERS } from 'queries'
import { GetUsersQuery } from 'queries/types'

const { Option } = Select

const cssFormItem = css`
  display: block;
  width: 250px;
`
export type TypeTaskFilter = {
  assignersAnyOf?: string[],
  createdByAnyOf?: string[],
  prioritiesAnyOf?: string[],
  searchTitle?: string
  searchDescription?: string
  isArchived?: boolean
}
type TypeProperties = {
  // eslint-disable-next-line no-unused-vars
  onFilter?: (_filter: TypeTaskFilter) => void
}

export default ({ onFilter = () => {/* blank ovveride */ } }: TypeProperties) => {
  const { loading, error, data } = useQuery<GetUsersQuery>(GET_USERS)

  const onValuesChange = (_changedValues: any, allValues: any) => {
    const {
      assignersAnyOf, prioritiesAnyOf, createdByAnyOf, searchTerm, includeDescription
    } = allValues

    const filter: TypeTaskFilter = { assignersAnyOf, prioritiesAnyOf, createdByAnyOf }
    if (searchTerm && searchTerm.length > 0) {
      filter.searchTitle = searchTerm
    }
    if (searchTerm && searchTerm.length > 0 && includeDescription) {
      filter.searchDescription = searchTerm
    }

    onFilter(filter)
  }

  if (loading) return <Spin />
  if (error) {
    return (
      <span>
        Error! $
        {error.message}
      </span>
    )
  }

  const users = data!.userGetList! as Array<{
    id: string;
    email: string;
    fullName: string;
  }>

  return (
    <Form
      name="filter"
      onValuesChange={onValuesChange}
    >
      <div className={css`display: flex;`}>
        <Form.Item
          label="Report to:"
          name="createdByAnyOf"
          className={cssFormItem}
        >
          <Select
            showSearch
            mode="multiple"
            placeholder="select authors"
            optionLabelProp="label"
          >
            {users.map(({ id, fullName, email }) => (
              <Option
                key={id}
                value={id}
                label={email}
              >
                <div className="demo-option-label-item">
                  <span role="img" aria-label="USA">
                    {email}
                  </span>
                  <br />
                  {fullName}
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>

        <div className={css`width: 20px;`} />

        <Form.Item
          label="Assigners"
          name="assignersAnyOf"
          className={cssFormItem}
        >
          <Select
            showSearch
            mode="multiple"
            placeholder="filter by assigners"
            optionLabelProp="label"
          >
            {users.map(({ id, fullName, email }) => (
              <Option
                key={id}
                value={id}
                label={email}
              >
                <div className="demo-option-label-item">
                  <span aria-label={email}>
                    {email}
                  </span>
                  <br />
                  {fullName}
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>

        <div className={css`width: 20px;`} />

        <Form.Item
          label="Priorities"
          name="prioritiesAnyOf"
          className={cssFormItem}
        >
          <Select
            mode="multiple"
            showSearch
            placeholder="filter by priorities"
            optionLabelProp="label"
          >
            {Object.entries(PRIORITY)
              .map(([key, { title }]: [string, any]) => (
                <Option key={key} value={key} label={title}>
                  <div>
                    {title}
                  </div>
                </Option>
              ))}
          </Select>
        </Form.Item>
      </div>

      <div className={css`display: flex;`}>
        <Form.Item
          label="Text search"
          name="searchTerm"
          className={cssFormItem}
        >
          <Input placeholder="Search by title (description optionaly)" />
        </Form.Item>
        <div className={css`width: 10px;`} />
        <Form.Item
          name="includeDescription"
          className={css`display: flex; padding-top: 22px;`}
          valuePropName="checked"
        >
          <Checkbox>
            search within description
          </Checkbox>
        </Form.Item>
      </div>
    </Form>
  )
}
