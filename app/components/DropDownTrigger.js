'use strict';
import * as navActions from '../actions/navActions'
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
            selected: this.props.selected,
            triggerIsActive: false
        }
    }

    openDropDown() {
console.log('\n\n\n\n\n\n ================== MY LOG START ==================  \n\n\n\n\n\n')
        this.refs.DropDownTrigger.measure((fx, fy, width, height, px, py) => {
            var triggerSettings = {
                top: py,
                left: px,
                width: width,
                height: height,
                aligning: this.props.aligningOptionsWithTrigger,
                direction: this.props.openingDirection
            }

          //  alert(this.context.dropDownContext.openDropDown)
          this.props.dispatch(navActions.updateDropdownData(this.props.id, triggerSettings, this.props.options, this.props.optionTemplate))
         //   this.context.dropDownContext.openDropDown(triggerSettings, this.props.options, this.props.optionTemplate);
        })
        
        this.setState({
            triggerIsActive: true
        })
    }

       componentWillReceiveProps(nextprops){
       //    alert(this.props.id + ' ' + this.props.clickedTrigger + ' ' + nextprops.clickedTrigger )
           if (this.props.clickedTrigger == this.props.id)
           {
              
                this.setState({ selected: nextprops.triggerSelectedValue})
           }
               
        }

    componentWillMount(){
        // var selectedTrigger; 
        //         if (this.state.)
        //         if (this.props.clickedTrigger == this.props.id)
        //             alert(this.props.clickedTrigger)
    }

    render() {

        const {dropDownTriggerTemplate, dropDownTriggerStyle, dropDownTriggerContainer, activeTriggerStyle, id} = this.props;
       
        return (
            <View style={[styles.dropDownTriggerContainer, dropDownTriggerContainer]}>
                <View style={[styles.dropDownTriggerStyle, dropDownTriggerStyle, this.state.triggerIsActive && activeTriggerStyle]} ref={"DropDownTrigger"}>
                    <TouchableWithoutFeedback onPress={this.openDropDown.bind(this) }>
                        
                            {dropDownTriggerTemplate(this.state.selected) }
                        
                    </TouchableWithoutFeedback>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    dropDownTriggerContainer: {
        flex: 1,
        minWidth: 55,
        alignItems: "flex-end",
        paddingRight:13,
    },
    dropDownTriggerStyle: {
        height: 35,
        width: 55,        
        borderWidth: 0.5,
        // borderColor: '#F5F6F8',
        borderColor: '#000',   
    }
})

DropDownTrigger.contextTypes = {
    dropDownContext: React.PropTypes.object 
}

function mapStateToProps(state) {
  const { navReducer } = state
  return {
      clickedTrigger: navReducer.clickedTrigger, 
      triggerSelectedValue: navReducer.triggerSelectedValue
  }
}

export default connect(mapStateToProps)(DropDownTrigger)