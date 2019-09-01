import React from 'react'
import { NavBar, Icon } from 'antd-mobile'
import { axios } from '../../utils/request'
export default class CityList extends React.Component {
  componentDidMount () {
    axios.get('/area/city?level=1').then(res => {
      console.log(res)
    })
    axios.get('/area/hot').then(res => {
      console.log(res)
    })
  }
  render() {
    return (
      <div>
        <NavBar
          mode='light'
          icon={<Icon type='left' />}
          onLeftClick={() => this.props.history.go(-1)}
        >
          城市选择
        </NavBar>
      </div>
    )
  }
}
