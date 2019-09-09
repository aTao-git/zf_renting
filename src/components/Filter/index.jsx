import React from 'react'
import { axios } from '../../utils/request'
import store from '../../store'
import styles from './index.module.scss'
import { PickerView } from 'antd-mobile'
export default class Filter extends React.Component {
    Unsubscribe = null
    // eslint-disable-next-line no-useless-constructor
    constructor() {
        super()
        this.Unsubscribe = store.subscribe(this.getFilter)
        this.state = {
            filterTitle: [
                { name: "区域", level: 3 },
                { name: "方式", level: 1 },
                { name: "租金", level: 1 },
                { name: "筛选", level: 0 }
            ],
            selectIndex: -1,
            filterList: [],
            filterValues: [[], [], [], []],
            pickerValue: [],
            otherValue: []
        }
    }
    componentDidMount() {
        const cityName = store.getState().mapReducer.cityName
        if (cityName) {
            this.getFilter()
        }
    }
    componentWillUnmount () {
        this.Unsubscribe()
    }
    renderFilterContent = () => {
        const { selectIndex, otherValue } = this.state
        if (selectIndex === this.state.filterTitle.length - 1) {
            return (
                <div className={styles.filter_other}>
                    {/* 遮罩层 */}
                    <div className={styles.filter_other_mask} onClick={() => this.setState({ selectIndex: -1 })}></div>
                    <div className={styles.filter_other_main}>
                        <div className={styles.filter_other_main_list}>
                            {this.state.filterList[selectIndex].map((v, i) =>
                                <div key={i} className={styles.filter_other_group}>
                                    <div className={styles.filter_other_group_title}>{v.name}</div>
                                    <div className={styles.filter_other_group_content}>
                                        {v.list.map((vv, ii) =>
                                            <div
                                                onClick={this.filterOtherItemClick.bind(this, vv.value)}
                                                key={ii}
                                                className={[styles.filter_other_item, otherValue.includes(vv.value) ? styles.filter_other_item_active : ''].join(' ')}
                                            >{vv.label}</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className={styles.filter_other_main_btn}>
                            <span onClick={this.filterOtherClear} >清除</span>
                            <span onClick={this.handleFilterOk} >确定</span>
                        </div>
                    </div>
                </div>
            )
        } else if (this.state.selectIndex <= 2 && this.state.selectIndex >= 0) {
            return (
                <div className={styles.filter_normal}>
                    <PickerView
                        data={this.state.filterList[this.state.selectIndex]}
                        value={this.state.pickerValue}
                        cols={this.getChildrenLevel(this.state.filterList[this.state.selectIndex])}
                        onChange={this.pickChange}
                    />
                    <div className={styles.filter_normal_btn}>
                        <span onClick={() => this.setState({ selectIndex: -1 })}>取消</span>
                        <span onClick={this.handleFilterOk} >确定</span>
                    </div>
                </div>
            )
        }
        return (
            <></>
        )
    }
    render() {
        if (!this.state.filterList.length) {
            return <></>
        }
        return (
            <React.Fragment>
                <div className={styles.zf_filter}>
                    <div className={styles.filter_title}>
                        {this.state.filterTitle.map((v, i) => {
                            return (
                                <div onClick={this.handleSelect.bind(this, i)} key={i} className={styles.title_item}>
                                    {v.name}
                                </div>
                            )
                        })}
                    </div>
                    {this.renderFilterContent()}

                </div>
            </React.Fragment>
        )
    }
    getFilter = async () => {
        let cityName = store.getState().mapReducer.cityName
        // 测试原因，把定位固定在广州
        cityName = '广州'
        const id = (await axios.get("/area/info?name=" + cityName)).body.value
        const res = await axios.get("/houses/condition?id=" + id)
        const { area, subway, rentType, price, roomType, oriented, floor, characteristic } = res.body
        let filterList = [
            [area, subway],
            rentType,
            price,
            [{ name: "户型", list: roomType }, { name: "朝向", list: oriented }, { name: "楼层", list: floor }, { name: "亮点", list: characteristic }]
        ]
        this.setState({
            filterList
        })
    }
    handleSelect(i) {
        this.setState({
            selectIndex: i
        })
    }
    getChildrenLevel(arr) {
        let set = new Set()
        let index = 0
        const getChildren = (arr) => {
            if (arr.length) {
                arr.forEach(v => {
                    if (v.children) {
                        index++
                        getChildren(v.children)
                        index--
                    } else {
                        set.add(index)
                    }
                })
            } else {
                set.add(index)
            }
        }
        getChildren(arr)
        return Math.max.apply(null, [...set]) || 1
    }
    pickChange = (value) => {
        const { selectIndex, filterValues } = this.state
        filterValues[selectIndex] = value
        this.setState({
            filterValues,
            pickerValue: value
        })
    }
    filterOtherItemClick = (value) => {
        let { otherValue, filterValues, selectIndex } = this.state
        const index = otherValue.findIndex(v => v === value)
        if (index === -1) {
            otherValue.push(value)
        } else {
            otherValue.splice(index, 1)
        }
        filterValues[selectIndex] = otherValue
        this.setState({ otherValue, filterValues })
    }
    handleFilterOk = () => {
        const { filterValues } = this.state
        this.props.getFilterValues(filterValues)
        this.setState({
            selectIndex: -1
        })
    }
    filterOtherClear = () => {
        let { filterValues, selectIndex } = this.state
        const otherValue = []
        filterValues[selectIndex] = otherValue
        this.setState({
          otherValue,
          filterValues
        })
      }
}
