import './index.css'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App/App'
// import serviceWorker from './serviceWorker'


const ToRenter = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
ReactDOM.render(
  ToRenter,
  document.querySelector('#root'),
)
export default ToRenter
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA
// serviceWorker.unregister()
