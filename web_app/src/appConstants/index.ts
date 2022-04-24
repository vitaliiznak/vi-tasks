export const AUTH_TOKEN_LOCALSTORAGE_KEY = 'AUTH_KEY'
export const PRIORITY = {
  LOW: {
    color: 'green',
    title: 'Low',
  },
  MEDIUM: {
    color: 'blue',
    title: 'Medium',
  },
  HIGH: {
    color: 'orange',
    title: 'High',
  },
  CRITICAL: {
    color: 'red',
    title: 'Critical',
  },
} as any

export const DASHBOARD_TASK_COLUMNS = {
  get TODO() {
    return {
      id: 'TODO',
      title: 'BACKLOG',
      list: [],
    }
  },
  get IN_PROGRESS() {
    return {
      id: 'IN_PROGRESS',
      title: 'IN PROGRESS',
      list: [],
    }
  },
  get IN_REVIEW() {
    return {
      id: 'IN_REVIEW',
      title: 'IN REVIEW',
      list: [],
    }
  },
  get DONE() {
    return {
      id: 'DONE',
      title: 'DONE',
      list: [],
    }
  },
}
