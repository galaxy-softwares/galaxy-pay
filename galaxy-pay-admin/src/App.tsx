import React, { FC } from 'react'
import './App.css'
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import BaseLayout from './layouts/baseLayout'
import Merchant from './view/merchant'
import Login from './view/login'
import Trade from './view/trade'
import Detail from './view/merchant/detail'

const Routers = [
  { path: '/', name: 'Merchant', component: Merchant, auth: true },
  { path: '/Trade', name: 'Trade', component: Trade, auth: true },
  { path: '/merchant/:id', name: 'Detail', component: Detail, auth: true }
]

const App: FC = () => {
  return (
    <Router>
      <Switch>
        {Routers.map((item, index) => {
          return (
            <Route
              key={index}
              path={item.path}
              exact
              render={() => (
                <BaseLayout>
                  <item.component />
                </BaseLayout>
              )}
            />
          )
        })}
        <Route path="/login" component={Login} />
        <Redirect from={'*'} to={'/'} />
      </Switch>
    </Router>
  )
}

export default App
