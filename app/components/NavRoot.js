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
  constructor(props) {
    super(props)
    this._renderScene = this._renderScene.bind(this)
    this._handleBackAction = this._handleBackAction.bind(this)
  }
  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this._handleBackAction)
  }
  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this._handleBackAction)
  }
  _renderScene(props) {


    const { route } = props.scene

    if (route.key === 'KenestoLauncher') {
      return <LauncherContainer _handleNavigate={this._handleNavigate.bind(this) }/>
    }
    if (route.key === 'home') {
      return <Home  _handleNavigate={this._handleNavigate.bind(this) }  />
    }
    if (route.key === 'about') {
      return <About _goBack={this._handleBackAction.bind(this) } />
    }

    if (route.key === 'forgotPassword') {
      return <ForgotPassword userName={route.userName} _goBack={this._handleBackAction.bind(this) }  />
    }

    if (route.key === 'login') {
      return <LoginContainer _handleNavigate={this._handleNavigate.bind(this) } />
    }

    if (route.key != "" && typeof route.key != 'undefined' && (route.key.indexOf('documents') > -1)) {
      return <DocumentsContainer _goBack={this._handleBackAction.bind(this) } _handleNavigate={this._handleNavigate.bind(this) } data={route.data}/>
    }

    if (route.key === 'document') {
      return <Document _goBack={this._handleBackAction.bind(this) } data={route.data} _handleNavigate={this._handleNavigate.bind(this) }/>
    }
  }

  _handleBackAction() {

    if (this.props.navigation.routes[this.props.navigation.routes.length-1].key == 'forgotPassword'){
        this.props.popRoute()
         return true
    }
    if (this.props.navigation.routes.length > 1 && ((this.props.navigation.routes[1].key === 'login' && this.props.navigation.index > 2) || (this.props.navigation.routes[1].key.indexOf('documents') > -1 && this.props.navigation.index > 1))) {
      this.props.popRoute()
      return true
    }
    else {
      return false
    }

  }

  _handleNavigate(action) {
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
  render() {
    return (
      <NavigationCardStack
        style={{ flex: 1 }}
        navigationState={this.props.navigation}
        onNavigate={this._handleNavigate.bind(this) }
        renderScene={this._renderScene} />
    )
  }
}

export default NavRoot
