'use strict';

import React, { Component, PropTypes} from 'react';
import {
    StyleSheet,
    // Text,
    View,
    // ScrollView,
    // TextInput,
    ListView,
    TouchableWithoutFeedback,
    // Dimensions,
    // TouchableHighlight,
    // Dimensions
} from 'react-native';
import {connect} from 'react-redux'
// import Icon from 'react-native-vector-icons/MaterialIcons';

// var {height, width} = Dimensions.get('window');

class DropDownOptions extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showOverlay: false,
            //   listPosition: {
            //     top: 100,
            //     left: 0,
            //     right: 0,
            //   },
        }
    }

    foo(){
        console.log('FOO')
       
    }
    
    onSelectOption() {
        console.log('\n\n\n\n\n\n ================= \n\n')
        console.log(this.state)
        console.log('\n======= END ====== \n\n\n\n\n\n')
    }

    render() {
       
        // const {dropDownContainerStyle} = this.props;
        
        return (
            <View style={[styles.dropDownOptionsContainer]} ref={"DropDownOptions"}>
                <TouchableWithoutFeedback>
                    <View style={{flex: 1}}>
                                                
                    </View>
                </TouchableWithoutFeedback>
                
                {this.state.showOverlay && <View style={styles.overlay}>
                    
                </View>}
                
            </View>
            
        )
    }

}

const styles = StyleSheet.create({
    
    dropDownOptionsContainer: {
        position: "absolute",
        // top: 0, left: 0, right: 0, bottom: 0,
        borderWidth: 3,
        borderColor: "red",
        // backgroundColor: "#eee",   

    },
})

DropDownOptions.contextTypes = {
    dropDownContext: React.PropTypes.object 
}

function mapStateToProps(state) {
  const { navReducer } = state
  
  return {
      navReducer: navReducer
  }
}

module.exports = DropDownOptions;