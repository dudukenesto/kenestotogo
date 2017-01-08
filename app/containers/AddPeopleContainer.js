var ReactNative = require('react-native');
import React from 'react'
var {
  View,
  Text,
  // TextInput,
  StyleSheet,
  ScrollView,
  // TouchableOpacity,
  // Dimensions,
  // TouchableWithoutFeedback
} = ReactNative;
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


