import React, { Component } from 'react'
import Home from './Home'
import About from './About'
import ForgotPassword from './ForgotPassword'
import Documents from './Documents'
import Document from './Document'
import LoginContainer from '../containers/LoginContainer'
import DocumentsContainer from '../containers/DocumentsContainer'
import LauncherContainer from '../containers/LauncherContainer'

import {
  BackAndroid,
  NavigationExperimental
} from 'react-native'

const {
  Reducer: NavigationTabsReducer,
  CardStack: NavigationCardStack
} = NavigationExperimental

class NavRoot extends Component {
  constructor (props) {
    super(props)
    this._renderScene = this._renderScene.bind(this)
    this._handleBackAction = this._handleBackAction.bind(this)
  }
  componentDidMount () {
    BackAndroid.addEventListener('hardwareBackPress', this._handleBackAction)
  }
  componentWillUnmount () {
    BackAndroid.removeEventListener('hardwareBackPress', this._handleBackAction)
  }
  _renderScene (props) {
    const { route } = props.scene
    if (route.key === 'KenestoLauncher')
    {
      return <LauncherContainer _handleNavigate={this._handleNavigate.bind(this)}/>
    }
    if (route.key ===  'home') {
      return <Home  _handleNavigate={this._handleNavigate.bind(this)}  />
    }
    if (route.key === 'about') {
      return <About _goBack={this._handleBackAction.bind(this)} />
    }

    if (route.key === 'forgotPassword') {
      return <ForgotPassword userName={route.userName} _goBack={this._handleBackAction.bind(this)} />
    }

     if (route.key === 'login') {
      return <LoginContainer _handleNavigate={this._handleNavigate.bind(this)} />
    }

     if (route.key === 'documents') {
      return <DocumentsContainer _goBack={this._handleBackAction.bind(this)} _handleNavigate={this._handleNavigate.bind(this)}/>
    }

     if (route.key === 'document') {
      return <Document _goBack={this._handleBackAction.bind(this)} {...this.props}/>
    }
  }
  _handleBackAction () {
    if (this.props.navigation.index === 0) {
      return false
    }
    this.props.popRoute()
    return true
  }
  _handleNavigate (action) {
    switch (action && action.type) {
      case 'push':
        this.props.pushRoute(action.route)
        return true
      case 'back':
      case 'pop':
        return this._handleBackAction()
      default:
        return false
    }
  }
  render () {
    return (
      <NavigationCardStack
        style={{flex: 1}}
        navigationState={this.props.navigation}
        onNavigate={this._handleNavigate.bind(this)}
        renderScene={this._renderScene} />
    )
  }
}

export default NavRoot
