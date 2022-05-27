/* eslint-disable sonarjs/no-duplicate-string */
import React, { ReactElement, useEffect } from 'react'
import {
  Layout, Spin, Tooltip,
} from 'antd'
import {
  Routes as RouterRoutes,
  Route,
  useMatch,
  useLocation,
  Navigate,
  Outlet,
} from 'react-router-dom'
import { css } from '@emotion/css'
import { useLazyQuery, useReactiveVar } from '@apollo/client'

import PageLogin from '@src/screens/PageEnter'
import PageUsers from '@src/screens/PageUserList'
import PageArchiveTasks from '@src/screens/PageTaskList'
import PageTask from '@src/screens/PageTask'
import PageUser from '@src/screens/PageUser'
import PageDashboard from '@src/screens/PageDashboard'
import PageSelectBoard from '@src/screens/PageSelectBoard'
import PageBoardList from '@src/screens/PageBoardList'
import PageInvites from '@src/screens/PageInvites'
import AccountSettings from '@src/screens/PageAccountSettings'
import { useAuthToken } from '@src/hooks/useAuth'
import { GET_BOARD, GET_BOARDS, GET_ME } from '@src/queries'
import { gBoards, gSelectedBoard, gUserMe } from '@src/appState/appState'
import PageInviteAuthenteticated from '@src/screens/PageInvite'
import PageInvitePublic from '@src/screensPublic/PageInvite'
import Calendar from '@src/screens/Calendar'
import SideMenu from './SideMenu'
import { GetBoardQuery, GetBoardsQuery, AccountMeQuery } from '@src/queries/types'
import InviteList from '@src/screens/PageInvites/InviteList'

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const [token] = useAuthToken()
  if (!token) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate replace to="/login" />
  }
  return children
}

const RequireNoAuth = ({ children }: { children: JSX.Element }) => {
  const [token] = useAuthToken()
  if (token) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate replace to="/" />
  }
  return children
}

const RequestGlobalData = ({ children }: { children: JSX.Element }) => {
  const [token] = useAuthToken()
  const match = useMatch('/b/:boardId/*')
  const board = useReactiveVar(gSelectedBoard)
  const [getMe] = useLazyQuery<AccountMeQuery>(GET_ME)
  const [getDataBoards] = useLazyQuery<GetBoardsQuery>(GET_BOARDS)
  const [getBoard] = useLazyQuery<GetBoardQuery>(GET_BOARD)

  useEffect(() => {
    if (!Boolean(match?.params.boardId)) {
      gSelectedBoard(null)
    } else {
      getBoard({
        variables:
        {
          id: match?.params.boardId,
        },
      }).then(res => gSelectedBoard(res.data?.board))
    }
  }, [match])
  useEffect(() => {
    if (token) {
      getMe().then(res => {
        gUserMe(res.data?.accountMe)
      })
      getDataBoards(
        {
          variables: {},
        }
      ).then(res => {
        gBoards(res.data!.boards)
      })
    }
  }, [token])

  if (match?.params.boardId && !board) {
    return <Spin />
  }

  return children
}

const PageInvite = () => {
  const [token] = useAuthToken()
  if (!token) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return (
      <Layout className={css`height:100vh;`}>
        <PageInvitePublic />
      </Layout>
    )
  }
  return (
    <RequireAuth>
      <RequestGlobalData>

        <Layout className={css`height:100vh;`}>
          <SideMenu />
          <Layout.Content
            className={css`margin-left: 238px;`}
          >
            <div
              className={
                css`
                max-width: 800px;
                margin-left: 5vw;
                margin-right: 18px;
              `}>
              <PageInviteAuthenteticated />
            </div>
          </Layout.Content>
        </Layout>
      </RequestGlobalData>
    </RequireAuth >
  )
}


const Routes = (): ReactElement => {
  return (
    <RouterRoutes>
      <Route element={(
        <RequireAuth>
          <RequestGlobalData>
            <Outlet />
          </RequestGlobalData>
        </RequireAuth>
      )}>
        <Route element={(
          <Layout className={css`height:100vh;`}>
            <SideMenu />
            <Layout.Content
              className={css`margin-left: 238px;`}
            >
              <Outlet />
            </Layout.Content>
          </Layout>
        )}>
          {/* Border routes */}
          <Route path="/b" >
            <Route index element={<PageSelectBoard />} />
            <Route path={':boardId'} >
              <Route index element={(
                <PageDashboard />
              )} />

              <Route path="invites"
                element={(
                  <Layout.Content
                    className={css`
                margin-right: 18px;
                max-width: 800px;
                margin-top: 8vh;`}
                  >
                    <PageInvites />
                  </Layout.Content>
                )} >
                <Route
                  path={'active'}
                  element={
                    <InviteList
                      filter={{
                        stateAnyOf: ['NEW']
                      }}
                    />
                  }
                />
                <Route
                  path={'used-and-expired'}
                  element={
                    <InviteList
                      filter={{
                        state_NOTAnyOf: ['NEW']
                      }}
                    />
                  }
                />
                <Route
                  index
                  element={
                    < Navigate replace to='active' />
                  }
                />

              </Route>
              <Route path="members" >

                <Route index element={
                  <Layout.Content
                    className={css`
                      margin-right: 18px;
                      max-width: 800px;
                      margin-top: 8vh;`}
                  >
                    <PageUsers />
                  </Layout.Content>
                } />

                <Route path=":id">
                  <Route
                    index
                    element={
                      < Navigate replace to='created-by' />
                    }
                  />

                  <Route
                    path="created-by"
                    element={
                      <Layout.Content
                        className={
                          css` margin-right: 18px;
                            max-width: 800px;
                            margin-top: 8vh;`
                        }
                      >
                        <PageUser />
                      </Layout.Content>
                    }
                  />

                  <Route
                    path="assigned"
                    element={
                      <Layout.Content
                        className={
                          css` margin-right: 18px;
                            max-width: 800px;
                            margin-top: 8vh;`
                        }
                      >
                        <PageUser />
                      </Layout.Content>
                    }
                  />
                </Route>

              </Route>

              <Route path='tasks'>
                <Route path='archive' element={
                  <Layout.Content
                    className={css`
                margin-right: 18px;
                max-width: 800px;
                margin-top: 8vh;`}
                  >
                    <PageArchiveTasks />
                  </Layout.Content>
                } />
                <Route path=':id' element={
                  <Layout.Content
                    className={css`
                margin-right: 18px;
                margin-top: 8vh;`}
                  >
                    <PageTask />
                  </Layout.Content>
                } />
              </Route>
            </Route>
          </Route>

          <Route path="/account-settings" element={
            <div className={
              css`
            max-width: 800px;
            margin-left: 5vw;
            margin-right: 18px;
          `}
            >
              <AccountSettings />
            </div>
          }>
          </Route>

          <Route path="/boards" element={
            <div className={
              css`
            max-width: 800px;
            margin-left: 5vw;
            margin-right: 18px;
          `}
            >
              <PageBoardList title={<h3>Your boards</h3>} />
            </div>
          } />

          <Route path="/calendar" element={(
            <div className={
              css`
                padding-right: 10px;
              `}
            >
              <h1 className={css`color: red;`}>Development in progress, comming soon</h1>
              <Tooltip title="Development in progress" color={'red'}>
                <Calendar />
              </Tooltip>
            </div>
          )} />
          <Route path="*" element={
            <Navigate replace to="/b" />
          } />
        </Route >


        {/* Other Auth routes */}
      </Route >
      {/* NOT AUTH ROUTES */}

      <Route element={(
        <RequireNoAuth>
          <Outlet />
        </RequireNoAuth>
      )}>
        <Route path="/login" element={
          <Layout className={css`height:100vh;`}>
            <PageLogin />
          </Layout>
        } />
        <Route path="*" element={<Navigate replace to="/login" />} />
      </Route>
      <Route path="/p/invites/:inviteId"
        element={
          <PageInvite />
        } />
      {/* NOT AUTH ROUTES */}

      {/* */}
    </RouterRoutes>
  )
}

export default Routes
