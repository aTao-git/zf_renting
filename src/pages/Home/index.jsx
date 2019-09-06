import React from 'react'
import { axios } from '../../utils/request'
import { Carousel } from 'antd-mobile'
import nav1 from '../../assets/images/nav-1.png'
import nav2 from '../../assets/images/nav-2.png'
import nav3 from '../../assets/images/nav-3.png'
import nav4 from '../../assets/images/nav-4.png'
import styles from './index.module.scss'
import { REACT_APP_API_URL } from "../../utils/urls"
import SearchInput from './SearchInput'
export default class Home extends React.Component {
  state = {
    imageList: [],
    groupList: [],
    newsList: []
  }
  componentDidMount() {
    // simulate img loading
    axios.get('/home/swiper').then(res => {
      this.setState({
        imageList: res.body
      })
    })
    axios.get('/home/groups').then(res => {
      this.setState({
        groupList: res.body
      })
    })
    axios.get('/home/news').then(res => {
      this.setState({
        newsList: res.body
      })
    })
  }
  render() {
    return (
      <div className='zf-home'>
        {/* 轮播图部分开始 */}
        <div className={styles.zf_slider}>
          <div className={styles.search_input}>
            <SearchInput />
          </div>
          {this.state.imageList.length && (
            <Carousel autoplay infinite>
              {this.state.imageList.map(val => (
                <a
                  key={val.id}
                  href='http://www.alipay.com'
                  style={{
                    display: 'inline-block',
                    width: '100%',
                    height: 180
                  }}
                >
                  <img
                    src={`http://hkzf.zbztb.cn${val.imgSrc}`}
                    alt=''
                    style={{ width: '100%', verticalAlign: 'top' }}
                    onLoad={() => {
                      // 解决图片高度的bug使用
                      window.dispatchEvent(new Event('resize'))
                      this.setState({ imgHeight: 'auto' })
                    }}
                  />
                </a>
              ))}
            </Carousel>
          )}
        </div>
        {/* 轮播图部分结束 */}
        {/* 首页导航栏部分开始 */}
        <nav>
          <div className={styles.home_nav}>
            <div className={styles.nav_item}>
              <img src={nav1} alt='' />
              <p>整租</p>
            </div>
            <div className={styles.nav_item}>
              <img src={nav2} alt='' />
              <p>合租</p>
            </div>
            <div className={styles.nav_item}>
              <img src={nav3} alt='' />
              <p>地图找房</p>
            </div>
            <div className={styles.nav_item}>
              <img src={nav4} alt='' />
              <p>去出租</p>
            </div>
          </div>
        </nav>
        {/* 首页导航栏部分结束 */}
        {/* 租房小组部分开始 */}
        <section>
          <div className={styles.home_group}>
            <div className={styles.group_title}>
              <div className={styles.title_main}>租房小组</div>
              <div className={styles.title_more}>更多</div>
            </div>
            <div className={styles.group_list}>
              {this.state.groupList.map(v => <div key={v.id} className={styles.group_item}>
                <div className={styles.group_item_title}>
                  <h5>{v.title}</h5>
                  <p>{v.desc}</p>
                </div>
                <div className={styles.group_item_img}>
                  <img src={REACT_APP_API_URL + v.imgSrc} alt="" />
                </div>
              </div>)}
            </div>
          </div>
        </section>
        {/* 租房小组部分结束 */}
        {/* 最新资讯部分开始 */}
        <section>
          <div className={styles.news}>
            <div className={styles.news_title}>
              <h4>最新资讯</h4>
            </div>
            {this.state.newsList.map(v => <div key={v.id} className={styles.news_item}>
              <div className={styles.news_item_img}>
                <img src={REACT_APP_API_URL + v.imgSrc} alt="" />
              </div>
              <div className={styles.news_item_main}>
                <div className={styles.news_main_top}>
                  <h4>{v.title}</h4>
                </div>
                <div className={styles.news_main_bottom}>
                  <div>{v.from}</div>
                  <div>{v.date}</div>
                </div>
              </div>
            </div>)}
          </div>
        </section>
        {/* 最新资讯部分结束 */}
      </div>
    )
  }
}
