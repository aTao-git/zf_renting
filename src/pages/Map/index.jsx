import React from 'react'
import styles from './index.module.scss'
import { NavBar, Icon } from 'antd-mobile'
import { axios } from '../../utils/request'
import store from '../../store'
const BMap = window.BMap
export default class MapPages extends React.Component {
    // 全局的地图对象
    Map = null
    // eslint-disable-next-line no-useless-constructor
    constructor() {
        super()
        store.subscribe(this.getCityInfo)
    }
    render() {
        return (
            <div className={styles.container}>
                <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={() => this.handleBack()}
                >地图找房</NavBar>
                <div className={styles.mapContainer}>
                    <div className={styles.mapmap} id="mapmap"></div>
                </div>
            </div>
        )
    }
    handleBack() {
        this.props.history.go(-1)
    }
    componentDidMount() {
        const cityName = store.getState().mapReducer.cityName
        if (cityName) {
            this.getCityInfo()
        }
    }
    getCityInfo = async () => {
        const cityName = store.getState().mapReducer.cityName
        // 创建地图实例  
        this.Map = new BMap.Map("mapmap")
        // 创建点坐标  
        // 初始化地图，设置中心点坐标和地图级别
        this.Map.centerAndZoom(cityName, 15)
        // 缩放组件
        this.Map.addControl(new BMap.NavigationControl())
        // 比例尺
        this.Map.addControl(new BMap.ScaleControl())
        const cityInfo = (await axios.get('/area/info?name=' + cityName)).body
        this.drawCityHouse(cityInfo)
    }
    async drawCityHouse (cityInfo) {
        const res = (await axios.get('/area/map?id=' + cityInfo.value)).body
        console.log(res)
        res.forEach(v => {
            const point = new BMap.Point(v.coord.longitude, v.coord.latitude)
            this.Map.centerAndZoom(point, 15)
            const opts = {
                position : point,    // 指定文本标注所在的地理位置
                offset   : new BMap.Size(30, -30)    //设置文本偏移量
              }
              var label = new BMap.Label("欢迎使用百度地图，这是一个简单的文本标注哦~", opts);  // 创建文本标注对象
                  label.setStyle({
                       color : "red",
                       fontSize : "12px",
                       height : "20px",
                       lineHeight : "20px",
                       fontFamily:"微软雅黑"
                   });
              this.Map.addOverlay(label)
        })
    }
}
