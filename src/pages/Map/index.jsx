import React from 'react'
import styles from './index.module.scss'
import { NavBar, Icon } from 'antd-mobile'
import { axios } from '../../utils/request'
import store from '../../store'
import { REACT_APP_API_URL } from '../../utils/urls'
const BMap = window.BMap
export default class MapPages extends React.Component {
    // 全局的地图对象
    Map = null
    Unsubscribe = null
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
        this.Unsubscribe = store.subscribe(this.getCityInfo)
        this.state = {
            isShow: false,
            houseList: []
        }
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
                    {this.renderHouseList()}
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

    componentWillUnmount() {
        this.Unsubscribe()
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
        this.Map.addEventListener("dragstart", () => {
            this.setState({ isShow: false })
        })
    }
    getHouseInfo = async (id) => {
        const res = (await axios.get('/houses?cityId=' + id))
        this.setState({
            houseList: res.body.list
        })
    }
    // 显示房屋列表
    renderHouseList = () => {
        return (
            <div className={[styles.house_detail_list, this.state.isShow ? styles.h40 : ''].join(' ')} >
                <div className={styles.house_detail_list_title}>
                    <span>房屋列表</span>
                    <span>更多</span>
                </div>
                <div className={styles.house_detail_list_content}>
                    {this.state.houseList.map((v, i) =>
                        <div onClick={() => this.props.history.push("/detail/" + v.houseCode)} key={i} className={styles.house_item}>
                            <div className={styles.house_item_img_wrap}>
                                <img src={REACT_APP_API_URL + v.houseImg} alt="" />
                            </div>
                            <div className={styles.house_item_info_wrap}>
                                <div className={styles.house_info1}>{v.title}</div>
                                <div className={styles.house_info2}>{v.desc}</div>
                                <div className={styles.house_info3}>{v.tags.map(vv => <span key={vv} > {vv}</span>)}</div>
                                <div className={styles.house_info4}><span>{v.price}</span>元/月  </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }
    async drawCityHouse(cityInfo) {
        const res = (await axios.get('/area/map?id=' + cityInfo.value)).body
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
                    this.getHouseInfo(v.value)
                    this.setState({
                        isShow: true
                    })
                    setTimeout(() => {
                        this.Map.panTo(point)
                    }, 500)
                } else {
                    this.drawCityHouse(v)
                }
            })
            this.Map.addOverlay(label)
        })
        this.SitesIndex++
    }
}
