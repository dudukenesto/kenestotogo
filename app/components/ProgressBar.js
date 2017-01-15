import React from "react";
import {View, StyleSheet, Platform, ActivityIndicator, ActivityIndicatorIOS} from "react-native";

var styles = StyleSheet.create({
  spinner: {
    alignSelf: "center",
    width: 30,
    height: 30,
  },
});

export default class extends React.Component {
    
    render(){
        
        if (Platform.OS === 'ios') 
            return (
               <ActivityIndicatorIOS
                animating={this.props.isLoading}
                style={styles.spinner}
                />
            );
         else{
             if (this.props.isLoading) {
                  return (
                        <ActivityIndicator
                            styleAttr="Large"
                            style={styles.spinner}
                            size={this.props.size || 'small'}
                            color={this.props.color || "#000"}
                            />
                  )
             }
             else{
                  return (
                        <View style={styles.spinner} />
                  )
             }

         }
    }
}
