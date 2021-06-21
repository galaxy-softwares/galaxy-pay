import React, { FC } from 'react'
import './App.less'

import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import BaseLayout from './layouts/baseLayout'
import { AppPayPage } from './view/apppay/appPayPage'
import Login from './view/login'
import Trade from './view/trade'
import Detail from './view/apppay/detail'
import { SoftwarePage } from './view/software/softwarePage'
import { HomePage } from './view/home/HomePage'

const Routers = [
  { path: '/', name: 'Home', component: HomePage, auth: true },
  { path: '/softwares', name: 'Sotfware', component: SoftwarePage, auth: true },
  { path: '/apppay', name: 'AppPay', component: AppPayPage, auth: true },
  { path: '/apppay/modify', name: 'AppPay', component: AppPayPage, auth: true },
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
        <Redirect from={'*'} to={'/softwares'} />
      </Switch>
    </Router>
  )
}

export default App
