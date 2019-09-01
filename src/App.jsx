import React from 'react'

import { HashRouter as Router, Route } from 'react-router-dom'
import Home from './pages/Home'
import List from './pages/List'
import My from './pages/My'
import News from './pages/News'
import Layout from './components/Layout'
import CityList from './pages/CityList'
import store from './store'
import { citySet } from './store/actionCreator'
export default class App extends React.Component {
  componentDidMount () {
    this.getLocalCity()
  }
  getLocalCity () {
    const myCity = new window.BMap.LocalCity()
    myCity.get((result) => {
      const cityName = result.name
      store.dispatch(citySet(cityName))
    })
  }
  render() {
    return (
      <React.Fragment>
        <Router>
          <Route path="/" exact render={() => <Layout><Home /></Layout>} />
          <Route path="/list" render={() => <Layout><List /></Layout>} />
          <Route path="/news" render={() => <Layout><News /></Layout>} />
          <Route path="/my" render={() => <Layout><My /></Layout>} />
          <Route path="/citylist" component={ CityList } />
        </Router>
      </React.Fragment>
    )
  }
}
