import React from 'react'
import { NavBar, Icon, Carousel } from 'antd-mobile'
import { REACT_APP_API_URL } from "../../utils/urls"
import { axios } from "../../utils/request"
import styles from "./index.module.scss"
const BMap = window.BMap
class Details extends React.Component {

    state = {
        detail: {},
        imgHeight: 176
    }
    componentDidMount() {
        this.getDetail()
    }

    initAddress() {
        const { detail } = this.state
        const map = new BMap.Map("allmap")
        // 创建地图实例
        const point = new BMap.Point(detail.coord.longitude, detail.coord.latitude)
        // // 创建点坐标
        map.centerAndZoom(point, 18)
        // 复杂的自定义覆盖物
        function ComplexCustomOverlay(point, text) {
            this._point = point
            this._text = text
        }
        ComplexCustomOverlay.prototype = new BMap.Overlay()
        ComplexCustomOverlay.prototype.initialize = function (map) {
            this._map = map
            var div = this._div = document.createElement("div")
            div.style.position = "absolute"
            div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat)
            div.style.backgroundColor = "#EE5D5B"
            div.style.border = "1px solid #BC3B3A"
            div.style.color = "white"
            div.style.height = "24px"
            div.style.padding = "2px"
            div.style.lineHeight = "18px"
            div.style.whiteSpace = "nowrap"
            div.style.MozUserSelect = "none"
            div.style.fontSize = "12px"
            var span = this._span = document.createElement("span")
            div.appendChild(span)
            span.appendChild(document.createTextNode(this._text))

            var arrow = this._arrow = document.createElement("div")
            arrow.style.background = "url(//map.baidu.com/fwmap/upload/r/map/fwmap/static/house/images/label.png) no-repeat"
            arrow.style.position = "absolute"
            arrow.style.width = "11px"
            arrow.style.height = "10px"
            arrow.style.top = "22px"
            arrow.style.left = "10px"
            arrow.style.overflow = "hidden"
            div.appendChild(arrow)

            map.getPanes().labelPane.appendChild(div)
            return div
        }
        ComplexCustomOverlay.prototype.draw = function () {
            var map = this._map
            var pixel = map.pointToOverlayPixel(this._point)
            this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px"
            this._div.style.top = pixel.y - 30 + "px"
        }
        // 创建 一个 复杂的 覆盖物 
        var myCompOverlay = new ComplexCustomOverlay(point, detail.community)
        map.addOverlay(myCompOverlay)

    }

    getDetail = async () => {
        const id = this.props.match.params.id
        const res = await axios.get("houses/" + id)
        this.setState({ detail: res.body })
        this.initAddress()
    }

    render() {
        const { detail } = this.state
        if (!Object.keys(detail).length) {
            return <></>
        }
        return (
            <React.Fragment>
                <div className={styles.hk_detail}>
                    <NavBar
                        mode="light"
                        icon={<Icon type="left" />}
                        onLeftClick={() => this.props.history.go(-1)}
                        style={{
                            backgroundColor: "rgba(0,0,0,0)",
                            position: "fixed",
                            width: "100%",
                            top: 0,
                            left: 0,
                            zIndex: 10000000
                        }}
                        rightContent={[
                            <span key="0" className="iconfont icon-share" />

                        ]}
                    >  <span>{detail.community}</span>  </NavBar>

                    {/* 轮播图 */}
                    <div className="detail_carousel">
                        <Carousel
                            autoplay
                            infinite
                        >
                            {detail.houseImg.map((val, i) => (
                                <img
                                    key={i}
                                    src={REACT_APP_API_URL + val}
                                    alt=""
                                    style={{ width: '100%', verticalAlign: 'top' }}
                                    onLoad={() => {
                                        window.dispatchEvent(new Event('resize'))
                                        this.setState({ imgHeight: 'auto' })
                                    }}
                                />
                            ))}
                        </Carousel>
                    </div>
                    {/* 轮播图 */}

                    {/* 标题 */}
                    <div className={styles.detail_house_title_wrap}>
                        <div className={styles.detail_house_title}>{detail.title}</div>
                        <div className={styles.detail_house_title_tags}>
                            {detail.tags.map(v => <span key={v}> {v} </span>)}
                        </div>
                    </div>
                    {/* 标题 */}

                    {/* 房子信息 */}
                    <div className={styles.detail_house_info}>
                        <div className={styles.detail_house_info_item_wrap}>
                            <div className={styles.detail_house_info_item1}>
                                <span>{detail.price}</span> / 月
              </div>
                            <div className={styles.detail_house_info_item2}>
                                租金
              </div>
                        </div>
                        <div className={styles.detail_house_info_item_wrap}>
                            <div className={styles.detail_house_info_item1}>
                                <span>{detail.roomType}</span>
                            </div>
                            <div className={styles.detail_house_info_item2}>
                                房型
              </div>
                        </div>
                        <div className={styles.detail_house_info_item_wrap}>
                            <div className={styles.detail_house_info_item1}>
                                <span>{detail.size}</span> 平米
              </div>
                            <div className={styles.detail_house_info_item2}>
                                面积
              </div>
                        </div>
                    </div>
                    {/* 房子信息 */}

                    {/* 房子的形状 */}
                    <div className={styles.detail_roomType}>
                        <div className={styles.detail_roomType_item}>
                            <span>装修:</span>
                            <span>精装</span>
                        </div>
                        <div className={styles.detail_roomType_item}>
                            <span>朝向:</span>
                            <span>{detail.oriented.join(' ')}</span>
                        </div>
                        <div className={styles.detail_roomType_item}>
                            <span>楼层:</span>
                            <span>{detail.floor}</span>
                        </div>
                        <div className={styles.detail_roomType_item}>
                            <span>类型:</span>
                            <span>普通住宅</span>
                        </div>
                    </div>
                    {/* 房子的形状 */}

                    {/* 地址 */}
                    <div className={styles.detail_address}>
                        <div className={styles.detail_address_title}>小区:{detail.community}</div>
                        <div className={styles.detail_address_content}>
                            <div id="allmap" className={styles.detail_map} ></div>
                        </div>
                    </div>
                    {/* 地址 */}
                </div>
            </React.Fragment>
        )
    }
}
export default Details