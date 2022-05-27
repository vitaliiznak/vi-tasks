

import './index.less'
import React from 'react'
import ReactDOM from 'react-dom'
import { createRoot } from 'react-dom/client'

import App from './App/App'
// import serviceWorker from './serviceWorker'

const ToRenter = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  ToRenter
)

export default ToRenter
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA
// serviceWorker.unregister()
