import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import './index.css'

const Header = props => {
  const onClickLogoutBtn = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  const onClickLogoutIcon = () => {
    Cookies.remove('jwt_token')
  }

  return (
    <div className="page-header">
      <Link to="/" className="header-link">
        <img
          className="header-website-logo"
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />
      </Link>
      <ul className="tabs-list">
        <Link to="/" className="header-link">
          <li className="tab">Home</li>
        </Link>

        <Link to="/jobs" className="header-link">
          <li className="tab">Jobs</li>
        </Link>
      </ul>
      <ul className="header-icons-list">
        <Link to="/" className="header-link">
          <li>
            <AiFillHome className="header-icon" />
          </li>
        </Link>

        <Link to="/jobs" className="header-link">
          <li>
            <BsBriefcaseFill className="header-icon" />
          </li>
        </Link>

        <Link to="/login" className="header-link" onClick={onClickLogoutIcon}>
          <li>
            <FiLogOut className="header-icon" />
          </li>
        </Link>
      </ul>
      <button className="logout-btn" type="button" onClick={onClickLogoutBtn}>
        Logout
      </button>
    </div>
  )
}

export default withRouter(Header)
