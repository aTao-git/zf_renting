import React from 'react'

import { TabBar } from 'antd-mobile'
// 定义接受路由对象的方法
import { withRouter } from "react-router-dom"
class Layout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: 'redTab'
    }
  }

  render() {
    return (
      <div
        style={{ position: 'fixed', height: '100%', width: '100%', top: 0 }}
      >
        <TabBar
          unselectedTintColor='#949494'
          tintColor='#33A3F4'
          barTintColor='white'
        >
          <TabBar.Item
            title='首页'
            key='Home'
            icon={<i className="iconfont icon-ind"></i>}
            selectedIcon={<i className="iconfont icon-ind"></i>}
            selected={this.props.match.url === '/'}
            onPress={() => {
              this.props.history.push('/')
            }}
            data-seed='logId'
          >
            {this.props.match.url === '/' && this.props.children}
          </TabBar.Item>
          <TabBar.Item
            icon={<i className="iconfont icon-findHouse"></i>}
            selectedIcon={<i className="iconfont icon-findHouse"></i>}
            title='找房'
            key='List'
            selected={this.props.match.url === '/list'}
            onPress={() => {
              this.props.history.push('/list')
            }}
            data-seed='logId1'
          >
            {this.props.match.url === '/list' && this.props.children}

          </TabBar.Item>
          <TabBar.Item
            icon={<i className="iconfont icon-infom"></i>}
            selectedIcon={<i className="iconfont icon-infom"></i>}
            title='资讯'
            key='News'
            dot
            selected={this.props.match.url === '/news'}
            onPress={() => {
              this.props.history.push('/news')
            }}
          >
            {this.props.match.url === '/news' && this.props.children}

          </TabBar.Item>
          <TabBar.Item
            icon={<i className="iconfont icon-my"></i>}
            selectedIcon={<i className="iconfont icon-my"></i>}
            title='我的'
            key='My'
            selected={this.props.match.url === '/my'}
            onPress={() => {
              this.props.history.push('/my')
            }}
          >
            {this.props.match.url === '/my' && this.props.children}

          </TabBar.Item>
        </TabBar>
      </div>
    )
  }
}

export default withRouter(Layout)