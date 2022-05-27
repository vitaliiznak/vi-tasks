import React, { useState, ReactElement } from 'react'
import {
  Button, Divider, Layout, Modal, Select, Spin, Tooltip
} from 'antd'
import {
  Link,
  NavLink,
  useNavigate,
  useMatch,
} from 'react-router-dom'
import { css } from '@emotion/css'
import { PlusOutlined } from '@ant-design/icons'

import AvatarZ from '@src/screens/components/AvatarZ'
import BoardNew from '@src/screens/PageBoardList/BoardNew'
import { gBoards, gSelectedBoard, gUserMe } from '@src/appState/appState'
import { AUTH_TOKEN_LOCALSTORAGE_KEY } from '../appConstants'
import FakeErrorsMenu from './FakeErrorsMenu'
import { useReactiveVar } from '@apollo/client'

const { Option } = Select

const cssSider = css`
  position: fixed;
  left: 0;
  height: 100vh;
  max-width: 200px !important;
  min-width: 100px !important;
  & .ant-layout-sider-children {
    display: flex;
    flex-direction: column;
  }`

const cssStickyMenu = css`
  overflow-y: auto;
  position: absolute;
  top: 44px;
  width: 100%;
`

const cssLogo = css`
  overflow-y: auto;
  position: absolute;
  top: 0;
  right:0;
  width: 100%;
  display: flex;
  padding-right:10px;
  justify-content: center;
  align-items: center;
  font-size:18px;
`

const cssMenuItem = css`
  display: block;
  padding:  8px 8px 10px 18px;
`
const cssActiveClassName = css`
  border-right: 2px solid #1890ff;
`

const stylesBoardSelect = css`
width: 100% !important; 
margin-bottom: 10px;
height: 58px !important;

& .ant-select-selector {

};
& .anticon {
  font-weight: 900 !important;
};
& .ant-select-arrow {
  top: 42%;
}
& .ant-select-selector {
  height: 50px !important;
}
& .ant-select-selection-placeholder{
  line-height: 50px !important;
}
& .ant-select-selection-item, & .ant-select-selection-search {
  display: flex;
  align-items: center;
}
`
const stylesBoardOption = css`
  overflow-x:hidden;
  padding: 10px 0 10px 20px;
  display: flex; 
  flex-wrap: nowrap;
  & div {
    height: 100%;
  }
`

const onLogout = () => {
  localStorage.removeItem(AUTH_TOKEN_LOCALSTORAGE_KEY)
  window.location.reload()
}

const { Sider } = Layout
const SideMenu = (): ReactElement => {
  const accountMe = useReactiveVar(gUserMe)
  const navigate = useNavigate()
  const isProfileRoute = useMatch('/members')
  const [isProfileExpanded, setProfileExpanded] = useState(Boolean(isProfileRoute))
  const [modalNewBoardConfig, setModalNewBoardConfig] = useState<null | Record<string, never>>(null)
  const selectedBoard = useReactiveVar(gSelectedBoard)
  const boards = useReactiveVar(gBoards)

  const cssAccountMenuContainer = css`
    display: block;
    width: 100%;
    border-right: 2px solid ${isProfileRoute ? '#1890ff' : 'transparent'} !important;
    padding-right: 8px;
    padding-left: 8px;
    display: flex;
    height:40px;
    justify-content: space-between;
    cursor: pointer;
    &:hover,
    &:focus,
    &:active {
      border-right: 2px solid ${isProfileRoute ? '#1890ff' : 'transparent'} !important;
    } 

    & span.material-icons
    {
      padding-left: 8px;
      vertical-align: bottom;
    }`


  const selectDropdownRender = (menu: ReactElement) => (
    <div>
      {menu}
      <Divider style={{ margin: '4px 0' }} />
      <div
        className={
          css`
            padding: 10px 8px 14px 8px;
            display: flex; 
            flex-direction:column;
            align-items:center;
            flex-wrap: nowrap;
        `
        }
      >
        <Button
          onClick={() => {
            setModalNewBoardConfig({})
          }}
          icon={<PlusOutlined />}
          type="primary"
          ghost
          size="middle"
        >
          Create new board
        </Button>
      </div>
    </div>
  )

  return (
    <Sider className={cssSider} theme="dark">
      {Boolean(modalNewBoardConfig) && (
        <Modal
          maskClosable={false}
          onCancel={() => {
            setModalNewBoardConfig(null)
          }}
          title="Create board"
          visible
          width={350}
          footer={null}
        >
          <BoardNew
            onDone={({ id }: { id: string }) => {
              navigate(`/b/${id}`)
              setModalNewBoardConfig(null)
            }}
            footer={() => (
              <div className={css`
                display: flex; 
                justify-content: space-between;
                `}
              >
                <Button
                  type="primary"
                  ghost
                  onClick={() => {
                    setModalNewBoardConfig(null)
                  }}
                  htmlType="reset"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  ghost
                  htmlType="submit"
                >
                  Create
                </Button>
              </div>
            )}
          />
        </Modal>
      )}
      <h1 className={cssLogo}>
        <Link to="/">
          Vi-TASKS
        </Link>
      </h1>
      <div className={cssStickyMenu}>

        <div>
          <Button
            type="text"
            onClick={() => {
              setProfileExpanded(!isProfileExpanded)
            }}
            className={cssAccountMenuContainer}
          >
            <div>
              <div className={css`text-align: left;`}>
                <AvatarZ
                  size="default"
                  fullName={accountMe?.fullName}
                  avatarSrc={accountMe?.avatar?.file?.uri}
                  className={css`margin-right: 10px !important;`}
                />
                <strong>{accountMe?.fullName || <Spin />}</strong>
              </div>
              <small>{accountMe?.email}</small>
            </div>

            {isProfileExpanded
              ? (
                <span className="material-icons">
                  keyboard_arrow_up
                </span>
              )
              : (
                <span className="material-icons">
                  keyboard_arrow_down
                </span>
              )}
          </Button>
        </div>

        {isProfileExpanded
          && (
            <div className={css`padding-left: 10px;`}>
              <NavLink
                className={({ isActive }) => isActive ? cssActiveClassName : `
                  ant-menu-item
                  ${css`
                    margin-top: 4px;
                    margin-bottom: 20px;
                  `}
                  ${cssMenuItem}
                `}
                to="/account-settings"
              >
                Account Settings
              </NavLink>
              <div
                className={
                  css`padding-right: 10px;display: block;`
                }
              >
                <Button
                  ghost
                  type="primary"
                  className={css` width: 100%;`}
                  onClick={onLogout}
                >
                  Logout
                </Button>
              </div>
            </div>
          )}


        <Divider />
        <div className={css`
          margin-top: 20px;
          `}
        >
          <Tooltip title="Select board" placement="rightTop">
            <Select
              showSearch
              placeholder="Select board"
              value={selectedBoard?.id}
              defaultValue={selectedBoard?.id}
              onChange={(value: string) => navigate(`/b/${value}`)}
              onSearch={(value) => { /* blank override */ }}
              className={stylesBoardSelect
                + ' '
                + css`
                  & .ant-select-selector {
                    border-color: #165997 !important;
                    border-width: 2px !important;
                    font-size: 14px !important;
                  }
                  & .ant-select-lg {
                    font-size: 14px !important; 
                  }
                `}
              size="large"
              dropdownRender={selectDropdownRender}
            >
              {(boards || []).map(
                (board) => (
                  <Option
                    key={board!.id}
                    value={board!.id}
                    className={stylesBoardOption}
                  >
                    <div
                      className={css`
                        overflow: hidden;
                        text-overflow: ellipsis;`}
                    >
                      {board!.title}

                    </div>
                  </Option>
                ),
              )}
            </Select>
          </Tooltip>
          {Boolean(selectedBoard?.id) && (
            <div className={css`padding-left:12px;`}>
              <NavLink
                className={({ isActive }) => `${cssMenuItem} ant-menu-item ${isActive ? cssActiveClassName : ''}`}
                to={`/b/${selectedBoard?.id}`}
                end
              >
                Board view
              </NavLink>


              <NavLink
                className={({ isActive }) => `${cssMenuItem} ant-menu-item ${isActive ? cssActiveClassName : ''}`}
                to={`/b/${selectedBoard?.id}/tasks/archive`}
                end
              >
                <Tooltip placement="rightTop" title="Archived tasks of the current board">
                  Archived tasks
                </Tooltip>
              </NavLink>

              <Divider className={css`margin-bottom: 0 !important;`} />

              <NavLink
                className={({ isActive }) => `${cssMenuItem} ant-menu-item ${isActive ? cssActiveClassName : ''}`}
                to={`/b/${selectedBoard?.id}/members/${accountMe?.id}/created-by`}
              >
                <Tooltip placement="rightTop" title="Assigned to me on active board">
                  Owned by me
                </Tooltip>
              </NavLink>

              <NavLink
                className={({ isActive }) => `${cssMenuItem} ant-menu-item ${isActive ? cssActiveClassName : ''}`}
                to={`/b/${selectedBoard?.id}/members/${accountMe?.id}/assigned`}
                end
              >
                <Tooltip placement="rightTop" title="Assigned to me on active board">
                  Assigned to me
                </Tooltip>
              </NavLink>

              <Divider className={css`margin-bottom: 0 !important;`} />
              <NavLink
                className={({ isActive }) => `${cssMenuItem} ant-menu-item ${isActive ? cssActiveClassName : ''}`}
                to={`/b/${selectedBoard?.id}/members`}
                end
              >
                Board members
              </NavLink>
              <NavLink
                className={({ isActive }) => `${cssMenuItem} ant-menu-item ${isActive ? cssActiveClassName : ''}`}
                to={`/b/${selectedBoard?.id}/invites`}
              >
                Invites to board
              </NavLink>
            </div>
          )}
        </div>

        <Divider />

        <NavLink
          className={({ isActive }) => `${cssMenuItem} ant-menu-item ${isActive ? cssActiveClassName : ''}`}
          to="/boards"
        >
          Manage boards
        </NavLink>
        <NavLink
          className={({ isActive }) => `${cssMenuItem} ant-menu-item ${isActive ? cssActiveClassName : ''}`}
          to="/calendar"
        >
          <Tooltip title="Development in progress" color={'red'}>
            Calendar
          </Tooltip>
        </NavLink>
      </div>
      <FakeErrorsMenu />
    </Sider >
  )
}


export default SideMenu