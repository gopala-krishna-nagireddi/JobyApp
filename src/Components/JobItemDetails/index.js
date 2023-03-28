import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN-PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobDetails: '',
    similarJobs: [],
  }

  componentDidMount = () => {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {id} = match.params
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`

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
      const jobDetails = data.job_details
      const similarJobs = data.similar_jobs

      this.setState({
        apiStatus: apiStatusConstants.success,
        jobDetails,
        similarJobs,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {jobDetails, similarJobs} = this.state

    const modifiedJobDetails = {
      id: jobDetails.id,
      companyLogoUrl: jobDetails.company_logo_url,
      employmentType: jobDetails.employment_type,
      jobDescription: jobDetails.job_description,
      location: jobDetails.location,
      packagePerAnnum: jobDetails.package_per_annum,
      rating: jobDetails.rating,
      title: jobDetails.title,
      lifeAtCompany: jobDetails.life_at_company,
      companyWebsiteUrl: jobDetails.company_website_url,
    }

    const {
      companyLogoUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
      lifeAtCompany,
      companyWebsiteUrl,
    } = modifiedJobDetails

    return (
      <>
        <div className="job-card-container">
          <div className="logo-title-container">
            <img
              className="company-logo"
              src={companyLogoUrl}
              alt="job details company logo"
            />
            <div>
              <h1 className="job-title">{title}</h1>
              <div className="rating-container">
                <AiFillStar className="rating-icon" />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-employment-salary-container">
            <div className="location-employment-container">
              <div className="location-container">
                <MdLocationOn className="location-icon" />
                <p className="location">{location}</p>
              </div>
              <div className="employment-container">
                <BsBriefcaseFill className="employment-icon" />
                <p className="employment">{employmentType}</p>
              </div>
            </div>
            <p>{packagePerAnnum}</p>
          </div>
          <hr className="hr-line" />
          <div>
            <div className="description-website-url">
              <h1 className="description-heading">Description</h1>
              <a href={companyWebsiteUrl}>
                <p>Visit</p>
              </a>
            </div>
            <p className="description">{jobDescription}</p>
          </div>
          <div>
            <h1 className="skills-heading">Skills</h1>
            <ul className="skills-list">
              {jobDetails.skills.map(eachSkill => (
                <li className="skill-list-item" key={eachSkill.name}>
                  <img
                    className="skill-img"
                    src={eachSkill.image_url}
                    alt={eachSkill.name}
                  />
                  <p className="skill-name">{eachSkill.name}</p>
                </li>
              ))}
            </ul>
          </div>
          <h1 className="life-at-company-heading">Life at Company</h1>
          <div className="life-at-company-container">
            <p className="life-at-company-description">
              {lifeAtCompany.description}
            </p>
            <img
              className="life-at-company-img"
              src={lifeAtCompany.image_url}
              alt="life at company"
            />
          </div>
        </div>
        <h1 className="similar-jobs-heading">Similar Jobs</h1>
        <ul className="similar-jobs-list">
          {similarJobs.map(eachSimilarJob => (
            <li
              className="job-card-item similar-job-item"
              key={eachSimilarJob.id}
            >
              <div className="logo-title-container">
                <img
                  className="company-logo"
                  src={eachSimilarJob.company_logo_url}
                  alt="similar job company logo"
                />
                <div>
                  <h1 className="job-title">{eachSimilarJob.title}</h1>
                  <div className="rating-container">
                    <AiFillStar className="rating-icon" />
                    <p className="rating">{eachSimilarJob.rating}</p>
                  </div>
                </div>
              </div>

              <div>
                <h1 className="description-heading">Description</h1>
                <p className="description">{eachSimilarJob.job_description}</p>
              </div>
              <div className="location-employment-salary-container">
                <div className="location-employment-container">
                  <div className="location-container">
                    <MdLocationOn className="location-icon" />
                    <p className="location">{eachSimilarJob.location}</p>
                  </div>
                  <div className="employment-container">
                    <BsBriefcaseFill className="employment-icon" />
                    <p className="employment">
                      {eachSimilarJob.employment_type}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </>
    )
  }

  renderLoadingView = () => (
    <div className="jobs-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="jobs-failure-container">
      <img
        className="job-failure-img"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="jobs-failure-heading">Oops! Something Went Wrong</h1>
      <p className="jobs-failure-note">
        We cannot seem to find the page you are looking for
      </p>
      <button
        className="jobs-retry-btn"
        type="button"
        onClick={this.getJobDetails}
      >
        Retry
      </button>
    </div>
  )

  renderJobItemDetails = () => {
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

  render() {
    return (
      <div className="job-item-details-page">
        <Header />
        <div className="job-item-details-container">
          {this.renderJobItemDetails()}
        </div>
      </div>
    )
  }
}

export default JobItemDetails
