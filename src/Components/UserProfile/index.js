import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN-PROGRESS',
}

class UserProfile extends Component {
  state = {profileDetails: '', apiStatus: apiStatusConstants.initial}

  componentDidMount = () => {
    this.getUserProfile()
  }

  getUserProfile = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const apiUrl = 'https://apis.ccbp.in/profile'
    const accessToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok) {
      const updatedProfileDetails = {
        name: data.profile_details.name,
        profileImgUrl: data.profile_details.profile_image_url,
        profileBio: data.profile_details.short_bio,
      }

      this.setState({
        profileDetails: updatedProfileDetails,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {profileDetails} = this.state
    const {name, profileImgUrl, profileBio} = profileDetails
    return (
      <div className="user-profile-container">
        <img className="profile-img" src={profileImgUrl} alt="profile" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{profileBio}</p>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="profile-failure-container">
      <button
        className="profile-retry-btn"
        type="button"
        onClick={this.getUserProfile}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  render() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default UserProfile
