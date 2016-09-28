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
    Dimensions,
    // TouchableHighlight,
    // Dimensions
} from 'react-native';
import {connect} from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons';

var {height, width} = Dimensions.get('window');

class DropDownTrigger extends Component {

    constructor(props) {
        super(props);

        this.state = {
            // showDropDown: false,
            //   listPosition: {
            //     top: 100,
            //     left: 0,
            //     right: 0,
            //   },
        }
    }

    openDropDown() {

        this.refs.DropDownTrigger.measure((fx, fy, width, height, px, py) => {
            // console.log('Component width is: ' + width)
            // console.log('Component height is: ' + height)
            // // console.log('X offset to frame: ' + fx)
            // // console.log('Y offset to frame: ' + fy)
            // console.log('X offset to page: ' + px)
            // console.log('Y offset to page: ' + py)
            var triggerSettings = {
                top: px,
                left: py,
                width: width,
                height: height,
                aligning: this.props.aligningOptionsWithTrigger,
                direction: this.props.openingDirection
            }
            this.context.dropDownContext.openDropDown(triggerSettings);
        })

    }

    render() {
        const {dropDownTriggerTemplate, dropDownTriggerStyle, } = this.props;
        
        return (
            <View style={[styles.dropDownTriggerStyle, dropDownTriggerStyle]} ref={"DropDownTrigger"}>
                <TouchableWithoutFeedback onPress={this.openDropDown.bind(this) } >
                    <View style={{flex: 1}}>
                        {dropDownTriggerTemplate() }
                    </View>
                </TouchableWithoutFeedback>                
            </View>
            
        )
    }

}

const styles = StyleSheet.create({
    dropDownTriggerStyle: {
        height: 35,
        width: 60,
        
        // height: height,
        // width: width,
        
        borderWidth: 0.5,
        // borderColor: '#F5F6F8',
        borderColor: '#000',
        position: 'absolute',
        top: 15,
        right: 13,   
    }
})

DropDownTrigger.contextTypes = {
    dropDownContext: React.PropTypes.object 
}

function mapStateToProps(state) {
  const { navReducer } = state
  
  return {
      navReducer: navReducer
  }
}

export default connect(mapStateToProps)(DropDownTrigger)