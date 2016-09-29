'use strict';

import React, { Component, PropTypes} from 'react';
import {
    StyleSheet,
    // Text,
    View,
    // ScrollView,
    // TextInput,
    // ListView,
    TouchableWithoutFeedback,
    // Dimensions,
    // TouchableHighlight,
} from 'react-native';
import {connect} from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons';

class DropDownTrigger extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selected: ''
        }
    }

    openDropDown() {

        this.refs.DropDownTrigger.measure((fx, fy, width, height, px, py) => {
            var triggerSettings = {
                top: py,
                left: px,
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
                        {dropDownTriggerTemplate(this.state.selected || this.props.selected) }
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