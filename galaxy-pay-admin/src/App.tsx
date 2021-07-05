import React, { FC } from 'react'
import './App.less'

import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import BaseLayout from './layouts/baseLayout'
import { PayAppPage } from './view/payapp/payAppPage'
import Login from './view/login'
import { TradePage } from './view/trade'
import PayAppPageModifyPage from './view/payapp/payAppModifyPage'
import { SoftwarePage } from './view/software/softwarePage'
import { HomePage } from './view/home/HomePage'
import { RefundPage } from './view/refund/refundPage'

const Routers = [
  { path: '/', name: 'Home', component: HomePage, auth: true },
  { path: '/softwares', name: 'Sotfware', component: SoftwarePage, auth: true },
  { path: '/payapps', name: 'AppPay', component: PayAppPage, auth: true },
  { path: '/payapps/modify/:id?', name: 'AppPayModify', component: PayAppPageModifyPage, auth: true },
  { path: '/trades', name: 'Trade', component: TradePage, auth: true },
  { path: '/refunds', name: 'Refund', component: RefundPage, auth: true }
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
