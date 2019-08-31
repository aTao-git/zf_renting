import React from 'react'

import { HashRouter as Router, Route } from 'react-router-dom'
import Home from './pages/Home'
import List from './pages/List'
import My from './pages/My'
import News from './pages/News'
import Layout from './components/Layout'
export default class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Router>
          <Route path="/" exact render={() => <Layout><Home /></Layout>} />
          <Route path="/list" render={() => <Layout><List /></Layout>} />
          <Route path="/news" render={() => <Layout><News /></Layout>} />
          <Route path="/my" render={() => <Layout><My /></Layout>} />
        </Router>
      </React.Fragment>
    )
  }
}
