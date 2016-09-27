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
            showDropDown: false,
            //   listPosition: {
            //     top: 100,
            //     left: 0,
            //     right: 0,
            //   },
        }
    }

    toggleDropDown() {
        this.setState({
            showDropDown: !this.state.showDropDown
        })
        
        this.refs.DropDownTrigger.measure( (fx, fy, width, height, px, py) => {
            // console.log('Component width is: ' + width)
            // console.log('Component height is: ' + height)
            // // console.log('X offset to frame: ' + fx)
            // // console.log('Y offset to frame: ' + fy)
            // console.log('X offset to page: ' + px)
            // console.log('Y offset to page: ' + py)
        })
        
        // console.log('\n\n\n\n\n\n ================= \n\n')
        console.log(this.context.dropDownContext.props.bar)
         
        // this.context.dropDownContext.foo()
        this.context.dropDownContext.foo()
        // this.context.dropDownContext.props.bar
        console.log('\n======= END ====== \n\n\n')
        
    }

    render() {
        const {dropDownTriggerTemplate, DropDownTriggerStyle, } = this.props;
        
        return (
            <View style={[styles.DropDownTriggerStyle, DropDownTriggerStyle]} ref={"DropDownTrigger"}>
                <TouchableWithoutFeedback onPress={this.toggleDropDown.bind(this) } >
                    <View style={{flex: 1}}>
                        {dropDownTriggerTemplate() }
                    </View>
                </TouchableWithoutFeedback>                
            </View>
            
        )
    }

}

const styles = StyleSheet.create({
    DropDownTriggerStyle: {
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