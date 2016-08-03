// import React from 'react'
// import { AppRegistry } from 'react-native'
// import NavigationDrawer from './app/components/NavigationDrawer'

// import configureStore from './app/store/configure-store'
// const store = configureStore()

// import NavigationRootContainer from './app/containers/navRootContainer'

// import App from './app/containers/app'

// import { Provider } from 'react-redux'

// const KenestoM = () => (
//   <Provider store={store}>
//     <App />
//   </Provider>
// )
// AppRegistry.registerComponent('KenestoM', () => KenestoM);

// dudu m

import React from 'react-native'
import Root from './app/root'

const {
  AppRegistry
} = React

AppRegistry.registerComponent('KenestoToGo', () => Root)





