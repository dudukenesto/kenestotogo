import React from 'react'
import * as accessActions from '../actions/Access'

let {
  Component
} = React
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import KenestoLauncher from '../components/KenestoLauncher'

class LauncherContainer extends Component {
  render() {
  
    return (
      <KenestoLauncher {...this.props} />
    )
  }

  


}





function mapStateToProps(state) {

  const {isLoggedIn, env  } = state.accessReducer; 
  return {
    isLoggedIn, 
    env
  }
}

function  matchDispatchToProps(dispatch) {

    return bindActionCreators({
        updateLoginInfo : accessActions.updateLoginInfo, 
        setEnv: accessActions.setEnv, 
        login : accessActions.login, 
        updateIsFetching: accessActions.updateIsFetching,
        dispatch,
       
    }, dispatch)
    
}

export default connect(mapStateToProps,matchDispatchToProps)(LauncherContainer)
