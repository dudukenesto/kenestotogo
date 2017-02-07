'use strict'

import React from 'react';
import { View,Text, StyleSheet } from 'react-native'


var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;

class ViewContainer extends React.Component {

  componentDidMount(){
//MessageBarManager.registerMessageBar(this.refs.alert);
  }

  componentWillMount(){

 //MessageBarManager.unregisterMessageBar();



  }


//   showMessage(type: string, message: string, title: string){
//      MessageBarManager.showAlert({
//         title: title,
//         message: message,
//         alertType: type,
//         position: 'bottom',
//         messageStyle:  {textAlign: 'center', color: '#fff', margin: 5},
//         stylesheetSuccess: {backgroundColor: '#3290F1', strokeColor: '#3290F1'},
//         stylesheetWarning: {backgroundColor: '#F2B702', strokeColor: '#F2B702'},
//         stylesheetError: {backgroundColor: '#DE4040', strokeColor: '#DE4040'},
//         stylesheetInfo: {backgroundColor: '#333', strokeColor: '#DE4040'},
//         // See Properties section for full customization
//         // Or check `index.ios.js` or `index.android.js` for a complete example
// });
//   }

  render() {
    return (
      <View style={[styles.viewContainer, this.props.style || {}]}>
      
      
        {this.props.children}
        
      </View>
    )
  }
}

const styles = StyleSheet.create({

  viewContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch"
  }
})

module.exports = ViewContainer
