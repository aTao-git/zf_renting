import React from 'react'
import styles from './index.module.scss'
import { NavBar, Icon } from 'antd-mobile'
import { axios } from '../../utils/request'
import store from '../../store'
const BMap = window.BMap
export default class MapPages extends React.Component {
    // 全局的地图对象
    Map = null
    // 设置不同级别地图应该显示的信息
    Sites = [
        { zoom: 11, level: 1, shape: 'circle', name: '区域' },
        { zoom: 14, level: 2, shape: 'circle', name: '村子' },
        { zoom: 16, level: 3, shape: 'rect', name: '街道' }
    ]
    // 设置索引，根据索引显示不同的级别
    SitesIndex = 0
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
        this.Map.centerAndZoom(cityName, this.Sites[this.SitesIndex].zoom)
        // 缩放组件
        this.Map.addControl(new BMap.NavigationControl())
        // 比例尺
        this.Map.addControl(new BMap.ScaleControl())
        const cityInfo = (await axios.get('/area/info?name=' + cityName)).body
        this.drawCityHouse(cityInfo)
    }
    async drawCityHouse(cityInfo) {
        const res = (await axios.get('/area/map?id=' + cityInfo.value)).body
        console.log(res)
        this.Map.clearOverlays()
        if (this.Sites[this.SitesIndex].zoom !== this.Sites[0].zoom) {
            const point = new BMap.Point(cityInfo.coord.longitude, cityInfo.coord.latitude)
            this.Map.centerAndZoom(point, this.Sites[this.SitesIndex].zoom)
        }
        res.forEach(v => {
            const point = new BMap.Point(v.coord.longitude, v.coord.latitude)
            const opts = {
                position: point,    // 指定文本标注所在的地理位置
                offset: new BMap.Size(30, -30)    //设置文本偏移量
            }
            let label = ''
            if (this.Sites[this.SitesIndex].shape === 'circle') {
                label = new BMap.Label(`<div class=${styles.circle}>${v.label}<hr>${v.count}套</div>`, opts);  // 创建文本标注对象
            } else if (this.Sites[this.SitesIndex].shape === 'rect') {
                label = new BMap.Label(`<div class=${styles.rect} > ${v.label} ${v.count}套 </div>`, opts);
            }
            label.setStyle({
                border: 'none',
                backgroundColor: 'transparent'
            });
            label.addEventListener('click', () => {
                if (this.SitesIndex === this.Sites.length) {
                    this.Map.panTo(point)
                } else {
                    this.drawCityHouse(v)
                }   
            })
            this.Map.addOverlay(label)
        })
        this.SitesIndex++
    }
}
