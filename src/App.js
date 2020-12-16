// import logo from './logo.svg'; // NOTE untuk access ke LOGO
import './App.css';
import React from 'react'
import Navigation from './component/navbar'
import { Route, Switch } from 'react-router-dom'

import NotFound from './page/404_page'

import Home from './page/home'
import Login from './page/login'
import signUp from './page/Sign_Up'
import UserCart from './page/userCart'
import History from './page/history'
import HistoryAdmin from './page/historyAdmin.jsx'

// NOTE ini untuk keep log in
import Axios from 'axios'

// NOTE import action untuk log in
import { login } from "./action"

// NOTE import connect untuk aktifin fuction dari redux
import { connect } from "react-redux"



class App extends React.Component {
  componentDidMount() {
    Axios.get(`http://localhost:2000/users?username=${localStorage.username}`)
      .then((res) => {
        this.props.login(res.data[0])
      })
      .catch((err) => console.log(err))
  }
  render() {
    console.log(this.props.role)
    if (this.props.role === 'admin') {
      return (
        <div>
          <Navigation />
          <Switch>
            <Route path='/' component={Home} exact />
            <Route path='/login' component={Login} />
            <Route path='/sign-up' component={signUp} />
            <Route path='/history_admin' component={HistoryAdmin} />
            <Route path='*' component={NotFound} />

          </Switch>
        </div>
      )
    }
    return (
      <div>
        <Navigation />
        <Switch>
          <Route path='/' component={Home} exact />
          <Route path='/login' component={Login} />
          <Route path='/sign-up' component={signUp} />
          <Route path='/cart' component={UserCart} />
          <Route path='/history' component={History} />
          <Route path='*' component={NotFound} />
        </Switch>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    username: state.user.username,
    role: state.user.role
  }
}


export default connect(mapStateToProps, { login })(App);
