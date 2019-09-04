
import React from 'react'
import { NavBar, Icon } from 'antd-mobile'
import { axios } from '../../utils/request'
import store from '../../store'
import styles from './index.module.scss'
import { AutoSizer, List } from 'react-virtualized'
import { citySet } from '../../store/actionCreator'
export default class CityList extends React.Component {
  Unsubscribe = null
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super()
    this.state = {
      totalCity: [],
      arrKey: [],
      selectIndex: 0
    }
    this.Unsubscribe = store.subscribe(this.getLocalCity)
    this.MainList = React.createRef()
  }
  componentDidMount() {
    const { mapReducer } = store.getState()
    if (mapReducer.cityName) {
      this.getLocalCity()
    }
  }
  render() {
    return (
      <div>
        <NavBar
          mode='dark'
          icon={<Icon type='left' />}
          onLeftClick={() => this.props.history.go(-1)}
        >
          城市选择
        </NavBar>
        {/* 城市列表开始 */}
        <div className={styles.list_content}>
          <AutoSizer>
            {({ height, width }) => (
              <List
                ref={this.MainList}
                height={height}
                rowCount={this.state.totalCity.length}
                rowHeight={this.rowHeight}
                rowRenderer={this.rowRenderer}
                onRowsRendered={this.onRowsRendered}
                width={width}
                scrollToAlignment="start"
              />
            )}
          </AutoSizer>
        </div>
        {/* 城市列表结束 */}
        {/* 右侧索引栏部分开始 */}
        <div className={styles.right_tab}>
          {this.state.arrKey.map((v, i) =>
            <div onClick={this.changeCityList.bind(this, i)} key={i} className={styles.right_item + ' ' + (i === this.state.selectIndex ? styles.active : '')}>{v}</div>)}
        </div>
        {/* 右侧索引栏部分结束 */}
      </div>
    )
  }
  rowRenderer = ({ key, index, style }) => {
    const item = this.state.totalCity[index]
    const localCity = Object.keys(item)[0]
    return (
      <div
        key={key}
        style={style}
      >
        <div className={styles.city_list_title}>
          {localCity}
        </div>
        <div className={styles.city_list_content}>
          {item[localCity].map((v, i) => {
            return <div onClick={this.goToHome.bind(this, v)} key={i} className={styles.list_item}>{v}</div>
          })}
        </div>
      </div>
    )
  }
  rowHeight = ({ index }) => {
    const item = this.state.totalCity[index]
    return (Object.values(item)[0].length + 1) * 40
  }
  onRowsRendered = ({ startIndex }) => {
    if (startIndex === this.state.selectIndex) {
      return
    }
    this.setState({
      selectIndex: startIndex
    })
  }
  changeCityList(i) {
    this.MainList.current.scrollToRow(i)
  }
  goToHome(v) {
    store.dispatch(citySet(v))
    this.props.history.go(-1)
  }
  // async 不允许用来修饰一个变量，后面只能跟一个函数
  getLocalCity = async () => {
    // 获取当前城市
    const cityName = store.getState().mapReducer.cityName
    // 获取所有城市
    const allCity = (await axios('/area/city?level=1')).body
    // 获取热门城市
    const hotCity = (await axios('/area/hot')).body
    let totalCity = [
      { '当前城市': [cityName] },
      { '热门城市': hotCity.map(v => v.label) }
    ]
    // 对全部城市进行排序
    // 按照字母表进行排序
    allCity.sort((a, b) => {
      return a.short.localeCompare(b.short)
    })
    allCity.forEach(v => {
      const firstWord = v.short[0].toUpperCase()
      const index = totalCity.findIndex(item => {
        // 当数组中的元素在测试条件时返回 true 时, findIndex() 返回符合条件的元素的索引位置，之后的值不会再调用执行函数。
        if (item[firstWord]) {
          return true
        } else {
          return false
        }
      })
      if (index === -1) {
        totalCity.push({
          [firstWord]: [v.label]
        })
      } else {
        totalCity[index][firstWord].push(v.label)
      }
    })
    let arrKey = totalCity.map(v => {
      return Object.keys(v)[0]
    })
    arrKey[0] = '#'
    arrKey[1] = '热'
    this.setState({
      totalCity,
      arrKey
    })
    this.Unsubscribe()
  }
}
