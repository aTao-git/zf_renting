import React from 'react'
import { NavBar, Icon } from 'antd-mobile'
import SearchInput from '../Home/SearchInput'
import styles from "./index.module.scss"
import { withRouter } from "react-router-dom"
import Filter from "../../components/Filter"
class List extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="hk_list">
          <NavBar
            mode="light"
            icon={<Icon type="left" />}
            onLeftClick={() => this.props.history.go(-1)}
            style={{
              backgroundColor:"#cccccc"
            }}
          >
            <div className={styles.hk_list_header}>
              <SearchInput />
            </div>
          </NavBar>
          {/* 过滤 开始 */}
          <div className="list_fitler">
          <Filter />
          </div>
          {/* 过滤 结束 */}


        </div>
      </React.Fragment>
    );
  }
}
export default withRouter(List)