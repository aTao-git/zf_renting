import React from 'react'
import { axios } from '../../utils/request'
import { Carousel } from 'antd-mobile'
export default class Home extends React.Component {
  state = {
    imageList: []
  }
  componentDidMount() {
    // simulate img loading
    axios.get('/home/swiper').then(res => {
      console.log(res)
      this.setState({
        imageList: res.body
      })
    })
  }
  render() {
    return (
      <div className='zf-home'>
        <div className='zf-swider'>
          {this.state.imageList.length && (
            <Carousel autoplay infinite>
              {this.state.imageList.map(val => (
                <a
                  key={val.id}
                  href='http://www.alipay.com'
                  style={{
                    display: 'inline-block',
                    width: '100%',
                    height: 150
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
      </div>
    )
  }
}
