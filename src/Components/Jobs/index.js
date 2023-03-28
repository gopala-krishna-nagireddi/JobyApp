import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import UserProfile from '../UserProfile'
import JobCard from '../JobCard'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN-PROGRESS',
}

class Jobs extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    searchValue: '',
    employmentTypeOptions: [],
    salaryRange: '',
  }

  componentDidMount = () => {
    this.getJobsList()
  }

  getJobsList = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {searchValue, employmentTypeOptions, salaryRange} = this.state

    const employmentType = employmentTypeOptions.join()

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${salaryRange}&search=${searchValue}`
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
      this.setState({
        apiStatus: apiStatusConstants.success,
        jobsList: data.jobs,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderTypeOfEmploymentFilters = () => {
    const {employmentTypesList} = this.props
    return (
      <div className="filters-container">
        <h1 className="filters-heading">Type of Employment</h1>
        <ul className="filters-list">
          {employmentTypesList.map(eachType => {
            const {label, employmentTypeId} = eachType
            return (
              <li className="filter-item" key={employmentTypeId}>
                <input
                  className="filter-input"
                  value={employmentTypeId}
                  type="checkbox"
                  id={employmentTypeId}
                  onChange={this.onCheckEmploymentType}
                />
                <label className="filter-label" htmlFor={employmentTypeId}>
                  {label}
                </label>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  renderSalaryRangeFilters = () => {
    const {salaryRangesList} = this.props
    return (
      <div className="filters-container">
        <h1 className="filters-heading">Salary Range</h1>
        <ul className="filters-list">
          {salaryRangesList.map(eachType => {
            const {label, salaryRangeId} = eachType
            return (
              <li className="filter-item" key={salaryRangeId}>
                <input
                  className="filter-input"
                  value={salaryRangeId}
                  type="radio"
                  id={salaryRangeId}
                  onChange={this.onSelectPackage}
                />
                <label className="filter-label" htmlFor={salaryRangeId}>
                  {label}
                </label>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  renderJobsSuccessView = () => {
    const {jobsList} = this.state

    if (jobsList.length !== 0)
      return (
        <ul className="jobs-list">
          {jobsList.map(eachJob => (
            <JobCard key={eachJob.id} jobDetails={eachJob} />
          ))}
        </ul>
      )
    return (
      <div className="no-jobs-container">
        <img
          className="no-jobs-img"
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1 className="no-jobs-heading">No Jobs Found</h1>
        <p className="no-jobs-note">
          We could not find any jobs. Try other filters.
        </p>
      </div>
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
        onClick={this.getJobsList}
      >
        Retry
      </button>
    </div>
  )

  renderJobsListView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onInputSearchValue = event => {
    const searchInput = event.target.value
    this.setState({searchValue: searchInput})
  }

  onClickSearchBtn = () => {
    this.getJobsList()
  }

  onCheckEmploymentType = event => {
    const {employmentTypeOptions} = this.state
    const employmentTypeInput = event.target.value

    if (employmentTypeOptions.includes(employmentTypeInput)) {
      const filteredOptions = employmentTypeOptions.filter(
        eachOption => eachOption !== employmentTypeInput,
      )
      this.setState({employmentTypeOptions: filteredOptions}, this.getJobsList)
    } else {
      this.setState(
        prevState => ({
          employmentTypeOptions: [
            ...prevState.employmentTypeOptions,
            employmentTypeInput,
          ],
        }),
        this.getJobsList,
      )
    }
  }

  onSelectPackage = event => {
    const salaryPackage = event.target.value

    this.setState({salaryRange: salaryPackage}, this.getJobsList)
  }

  render() {
    return (
      <div className="jobs-page">
        <Header />
        <div className="jobs-container">
          <div className="profile-filters-container">
            <div className="search-container search-sm">
              <input
                className="search-input"
                type="search"
                placeholder="Search"
                onChange={this.onInputSearchValue}
              />
              <button
                className="search-btn"
                type="button"
                data-testid="searchButton"
                onClick={this.onClickSearchBtn}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            <UserProfile />
            <hr className="hr-line" />
            {this.renderTypeOfEmploymentFilters()}
            <hr className="hr-line" />
            {this.renderSalaryRangeFilters()}
          </div>
          <div className="jobs-list-container">
            <div className="search-container search-lg">
              <input
                className="search-input"
                type="search"
                placeholder="Search"
                onChange={this.onInputSearchValue}
              />
              <button
                className="search-btn"
                type="button"
                data-testid="searchButton"
                onClick={this.onClickSearchBtn}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobsListView()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
