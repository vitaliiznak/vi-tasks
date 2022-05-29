
import {
  Button, Form, Result, Select, Spin,
} from 'antd'
import { css } from '@emotion/css'
import { useMutation, useQuery } from '@apollo/client'
import { GET_TASK, GET_USERS, UPDATE_TASK } from '@src/queries'
import { GetTaskQuery, GetUsersQuery, UpdateTaskMutation } from '@src/queries/types'

const cssFormItem = css`
  display: block;
`

export default ({ id, onFinish }: { id: string, onFinish: () => void }) => {
  const { loading: loadingTask, error: errorTask, data: dataTask } = useQuery<GetTaskQuery>(GET_TASK, { variables: { id } })
  const { loading: loadingUsers, error: errorUsers, data: dataUsers } = useQuery<GetUsersQuery>(GET_USERS)
  const [updateTask] = useMutation<UpdateTaskMutation>(UPDATE_TASK)
  const [form] = Form.useForm()


  const onFinishAssigment = ({ assigners }: { assigners: string[] }) => {
    const initialAssigners = (dataTask?.taskGetById?.assigners || []).map(({ id: idArgument }: any) => idArgument)
    const assignersRemove = initialAssigners.filter((removeCadidate: string) => !assigners.includes(removeCadidate))
    const assignersAdd = assigners.filter((addCadidate: string) => !initialAssigners.includes(addCadidate))
    updateTask({
      variables: {
        id,
        input: {
          assignersAdd,
          assignersRemove,
        },
      },
      refetchQueries: ['GetTasks', 'GetTask'],
    }).then((_res) => {
      onFinish()
      form.resetFields()
    })
  }

  if (loadingTask || loadingUsers) return <Spin size="large" />
  if (errorTask || errorUsers) {
    return (
      <Result
        status="warning"
        title="There are some problems with your operation."
        extra={(
          <a href="/">
            go to main page
          </a>
        )}
      />
    )
  }
  const initialValues = {
    assigners: (dataTask?.taskGetById?.assigners || []).map(({ id: idArgument }: any) => idArgument),
  }
  return (
    <Form
      name="addAssigners"
      initialValues={initialValues}
      onFinish={onFinishAssigment}
    >
      <Form.Item
        name={['assigners']}
        label="Add/remove assigners:"
        className={cssFormItem}
      >
        <Select
          mode="multiple"
          showSearch
          placeholder="Select a person"
          optionFilterProp="label"
          filterOption={
            (input, option) => (option!.label as string)
              .toLowerCase().includes(input.toLowerCase())
          }
        >
          {(dataUsers?.userGetList || [])
            .map(({ id: idArgument, fullName, email }: any) => (
              <Select.Option
                key={idArgument}
                value={idArgument}
                label={email}
              >
                <div
                  className={css`
                          display: flex;
                        `}
                >
                  <div className="demo-option-label-item">
                    <span role="img" aria-label="USA">
                      {email}
                    </span>
                    <br />
                    {fullName}
                  </div>
                </div>
              </Select.Option>
            ))}
        </Select>
      </Form.Item>
      <div
        className={css`
              display: flex;
              justify-content: flex-end;
            `}
      >
        <Button ghost htmlType="submit" type="primary">Save</Button>
      </div>
    </Form>
  )
}
