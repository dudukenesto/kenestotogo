'use strict';
var React = require('react');
var ReactNative = require('react-native');
var {
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
} = ReactNative;
import Button from './Button'
import ProggressBar from "../components/ProgressBar";
import TagInput from 'react-native-tag-input';
var HEADER = '#3b5998';
var BGWASH = 'rgba(255,255,255,0.8)';
var DISABLED_WASH = 'rgba(255,255,255,0.25)';
class AddPeople extends React.Component{
  constructor(props){
    super(props);
   
    this.addPeopleProps = this.props.data;
   
    this.state = {  
      isLoading: true,
      scalingEnabled: true};
  }
  
 
 onLoadEnd(){
    this.setState({isLoading: false});
 }
 
 renderLoading(){
   return(
    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 80}}>
      <ProggressBar isLoading={true} />
    </View>
   )
 }
 
  
  render(){

    return(
      <View style={{ flex: 1}}>
        <Text>AddPeople</Text>
        <TagInput
  value={this.state.isLoading}
  onChange={(emails) => this.onEmailChange(isLoading)} />

      </View>
    )
  }
}

var styles = StyleSheet.create({
   title: {
    marginBottom: 20,
    fontSize: 22,
    textAlign: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: HEADER,
  }
});

module.exports = AddPeople;