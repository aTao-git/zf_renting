import React from 'react'
import { NavBar, Icon } from 'antd-mobile'
import SearchInput from '../Home/SearchInput'
import styles from "./index.module.scss"
import { withRouter } from "react-router-dom"
import Filter from "../../components/Filter"
import store from '../../store'
import { axios } from '../../utils/request'
import { List, AutoSizer } from "react-virtualized"
import { REACT_APP_API_URL } from '../../utils/urls'
class HouseList extends React.Component {
  Unsubscribe = null
  QueryParams = {
    start: 1,
    end: 10
  }
  pageSize = 10
  count = 10
  isLoadding = false
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super()
    this.state = {
      hkList: []
    }
    this.Unsubscribe = store.subscribe(this.getList)
  }
  componentDidMount() {
    const cityName = store.getState().mapReducer.cityName
    if (cityName) {
      this.getList()
    }
  }
  componentWillUnmount() {
    this.Unsubscribe()
  }
  render() {
    return (
      <React.Fragment>
        <div className="hk_list">
          <NavBar
            mode="light"
            icon={<Icon type="left" />}
            onLeftClick={() => this.props.history.go(-1)}
            style={{
              backgroundColor: "#cccccc"
            }}
          >
            <div className={styles.hk_list_header}>
              <SearchInput />
            </div>
          </NavBar>
          {/* 过滤 开始 */}
          <div className="list_fitler">
            <Filter getFilterValues={this.getFilterValues} />
          </div>
          {/* 过滤 结束 */}
          {/* 列表 开始 */}
          <div className={styles.hk_list_content}>
            <AutoSizer>
              {({ height, width }) => (
                <List
                  height={height}
                  width={width}
                  rowCount={this.state.hkList.length}
                  rowHeight={160}
                  rowRenderer={this.rowRenderer}
                  onScroll={this.handleScroll}
                />
              )}
            </AutoSizer>
          </div>
          {/* 列表 结束 */}
        </div>
      </React.Fragment>
    )
  }
  getFilterValues = async (value) => {
    const params = {
      [value[0][0]]: value[0][2] !== "null" ? value[0][2] : value[0][1],
      rentType: value[1][0],
      price: value[2][0],
      more: value[3].join(',')
    };

    // 拼接成完整的参数
    this.QueryParams = Object.assign(this.QueryParams, params);
    for (const key in this.QueryParams) {
      if (this.QueryParams[key] === undefined || this.QueryParams[key] === "") {
        delete this.QueryParams[key]
      }
    }

    this.setState({ hkList: [] })
    console.log(this.QueryParams)
    this.getList()
  }
  getList = async () => {
    this.isLoadding = true;
    const cityName = store.getState().mapReducer.cityName

    if (!this.QueryParams.cityId) {
      const id = (await axios.get("/area/info?name=" + cityName)).body.value
      this.QueryParams.cityId = id
    }

    const res = await axios.get("/houses", { params: this.QueryParams })
    console.log(res)
    this.count = res.body.count
    const { hkList } = this.state
    this.setState({ hkList: [...hkList, ...res.body.list] })
    // 表示 数据已经请求回来了 isLoadding false
    this.isLoadding = false
  }
  rowRenderer = ({ key, index, style }) => {
    const { hkList } = this.state;
    return (
      <div
        key={key}
        style={style}
      >
        <div onClick={() => this.props.history.push("/Detail/" + hkList[index].houseCode)} className={styles.house_item}>
          <div className={styles.house_item_img_wrap}>
            <img src={REACT_APP_API_URL + hkList[index].houseImg} alt="" />
          </div>
          <div className={styles.house_item_info_wrap}>
            <div className={styles.house_info1}>{hkList[index].title}</div>
            <div className={styles.house_info2}>{hkList[index].desc}</div>
            <div className={styles.house_info3}>{hkList[index].tags.map(vv => <span key={vv} > {vv}</span>)}</div>
            <div className={styles.house_info4}><span>{hkList[index].price}</span>元/月  </div>
          </div>
        </div>
      </div>
    )
  }
  handleScroll = ({ clientHeight, scrollHeight, scrollTop }) => {
    if (scrollHeight - clientHeight - scrollTop <= 20) {
      // 判断 还有没有下一页的数据
      if (this.QueryParams.end < this.count) {
        if (!this.isLoadding) {
          // 还有数据
          this.QueryParams.start += this.pageSize
          this.QueryParams.end += this.pageSize
          this.getList()
        }
      } else {
        console.log("没有数据了")
      }
    }

  }
}
export default withRouter(HouseList)