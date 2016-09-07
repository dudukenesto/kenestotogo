import React from 'react'

let {
  Component
} = React
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import AddPeople from '../components/AddPeople'

class AddPeopleContainer extends Component {
  render() {
  
    return (
      <AddPeople {...this.props} />
    )
  }

}

function mapStateToProps(state) {
 
  const { documentlists, documentlist,navReducer } = state
  const {env, sessionToken } = state.accessReducer; 
  
  return {
    navReducer,
    documentlist,
    documentlists,
    env,
    sessionToken
    
  }
}

export default connect(mapStateToProps)(AddPeopleContainer)
