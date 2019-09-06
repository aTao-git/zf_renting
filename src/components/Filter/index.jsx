import React from 'react'
import { axios } from '../../utils/request'
import store from '../../store'
import styles from './index.module.scss'
import { PickerView } from 'antd-mobile'
export default class Filter extends React.Component {
    // eslint-disable-next-line no-useless-constructor
    constructor() {
        super()
        store.subscribe(this.getFilter)
        this.state = {
            filterTitle: [
                { name: "区域", level: 3 },
                { name: "方式", level: 1 },
                { name: "租金", level: 1 },
                { name: "筛选", level: 0 }
            ],
            selectIndex: 0,
            filterList: []
        }
    }
    componentDidMount() {
        const cityName = store.getState().mapReducer.cityName
        if (cityName) {
            this.getFilter()
        }
    }
    render() {
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
                    <PickerView
          data={this.state.filterList[this.state.selectIndex]}
          value={this.state.filterList[this.state.selectIndex]}
          cols={this.state.filterTitle[this.state.selectIndex].level}
        />
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
        const { area, subway, rentType, price } = res.body
        let filterList = [
            [area, subway],
            rentType,
            price,
            []
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
}
