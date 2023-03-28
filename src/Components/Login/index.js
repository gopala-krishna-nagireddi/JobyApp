import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {username: '', password: '', loginError: ''}

  onInputUsername = event => {
    const username = event.target.value
    this.setState({username})
  }

  onInputPassword = event => {
    const password = event.target.value
    this.setState({password})
  }

  onUserLogin = async event => {
    event.preventDefault()

    const {username, password} = this.state
    const userDetails = {username, password}

    const apiUrl = 'https://apis.ccbp.in/login'

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()

    if (response.ok) {
      const {history} = this.props
      Cookies.set('jwt_token', data.jwt_token, {expires: 30})
      history.replace('/')
    } else {
      this.setState({loginError: data.error_msg})
    }
  }

  render() {
    const {loginError} = this.state
    const accessToken = Cookies.get('jwt_token')

    if (accessToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-page">
        <div className="login-container">
          <img
            className="login-page-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
          <form className="login-form">
            <div className="label-input-container">
              <label className="label" htmlFor="username">
                USERNAME
              </label>
              <input
                className="input"
                id="username"
                type="text"
                placeholder="Username"
                onChange={this.onInputUsername}
              />
            </div>
            <div className="label-input-container">
              <label className="label" htmlFor="password">
                PASSWORD
              </label>
              <input
                className="input"
                id="password"
                type="password"
                placeholder="Password"
                onChange={this.onInputPassword}
              />
            </div>
            <button
              className="login-btn"
              type="submit"
              onClick={this.onUserLogin}
            >
              Login
            </button>
          </form>
          <div className="login-err-container">
            {loginError !== '' && <p className="login-err">*{loginError}</p>}
          </div>
        </div>
      </div>
    )
  }
}

export default Login
