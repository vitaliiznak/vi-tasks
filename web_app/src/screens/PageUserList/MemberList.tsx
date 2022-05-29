import { List } from 'antd'

import { useQuery, useReactiveVar } from '@apollo/client'
import { GET_USERS } from '@src/queries'
import { Link } from 'react-router-dom'
import AvatarZ from '@src/screens/components/AvatarZ'
import { gSelectedBoard } from '@src/appState/appState'
import { GetUsersQuery } from '@src/queries/types'


const MemberList = () => {
  const board = useReactiveVar(gSelectedBoard)
  const { loading, data } = useQuery<GetUsersQuery>(GET_USERS,
    {
      variables:
      {
        filter:
        {
          boardId: board?.id
        },
      },
    })
  return (

    <List
      loading={loading}
      dataSource={data?.userGetList || []}
      pagination={{
        hideOnSinglePage: true,
        showTotal: (total) => `Total ${total} items`,
      }}
      renderItem={({
        id,
        email,
        fullName,
        avatar,
      }: any) => (
        <List.Item key={id}>
          <List.Item.Meta
            avatar={(
              <AvatarZ
                avatarSrc={avatar?.file?.uri}
                fullName={fullName}
              />
            )}
            title={<Link to={`/b/${board!.id}/members/${id}`}>{fullName}</Link>}
            description={email}
          />
        </List.Item>
      )}
    />
  )
}

export default MemberList
