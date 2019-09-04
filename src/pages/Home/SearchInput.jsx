import React from 'react'
import styles from './search.module.scss'
import store from '../../store'
import { withRouter } from 'react-router-dom'
class SearchInput extends React.Component {
  Unsubscribe = null
  constructor() {
    super()
    this.state = {
      cityName: store.getState().mapReducer.cityName
    }
    this.Unsubscribe = store.subscribe(() => {
      this.setState({
        cityName: store.getState().mapReducer.cityName
      })
    })
  }
  render() {
    return (
      <div className={styles.search_input}>
        <div className={styles.search_input_left}>
          <div
            onClick={this.handleSearchCity.bind(this)}
            className={styles.search_location}
          >
            <span>{this.state.cityName}</span>
            <i className='iconfont icon-arrow'></i>
          </div>
          <div className={styles.search_search}>
            <i className='iconfont icon-seach'></i>
            <span>请输入小区或地址</span>
          </div>
        </div>
        <div className={styles.search_input_icon}>
          <i onClick={this.handleToMap.bind(this)} className={'iconfont icon-map ' + styles['icon-map']}></i>
        </div>
      </div>
    )
  }
  componentWillUnmount () {
    this.Unsubscribe()
  }
  handleSearchCity() {
    this.props.history.push('/citylist')
  }
  handleToMap () {
    this.props.history.push('./MapPages')
  }
}
export default withRouter(SearchInput)