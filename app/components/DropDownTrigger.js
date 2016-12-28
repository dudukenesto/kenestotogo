'use strict';
import * as uiActions from '../actions/uiActions'
import ProgressBar from './ProgressBar'
import React, { Component, PropTypes} from 'react';
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
} from 'react-native';
import {connect} from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons';
import _ from "lodash";

class DropDownTrigger extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selected: this.props.selected,
            triggerIsActive: false
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

          //  alert(this.context.dropDownContext.openDropDown)
          this.props.dispatch(uiActions.updateDropdownData(this.props.id, triggerSettings, this.props.options, this.props.optionTemplate))
         //   this.context.dropDownContext.openDropDown(triggerSettings, this.props.options, this.props.optionTemplate);
        })
        
        this.setState({
            triggerIsActive: true,
        })
    }

    componentWillReceiveProps(nextprops) {
        if (!nextprops.IsDropdownOptionsOpen && this.props.IsDropdownOptionsOpen) {
            this.setState({
                triggerIsActive: false
            })
        }

        var indexOfId = nextprops.fetchingList.indexOf(this.props.id);
       
          //alert(indexOfId + ' ' + this.props.id)
           if (this.props.clickedTrigger == this.props.id && nextprops.triggerSelectedValue != '')
           {   //alert(nextprops.triggerSelectedValue)
               if (nextprops.triggerSelectedValue == 'NONE')
               {    
                   var xx = this.props.id.split('_'); 
                   if (typeof xx != 'undefined' && xx.length > 1)
                    {
                        this.setState({isFetching: indexOfId > -1})
                        this.props.removeOption(xx[1])
                    }
                 
                 
               }
               else
                //  alert(this.props.fetchingList + ' ' +nextprops.fetchingList)
                    this.setState({ selected: nextprops.triggerSelectedValue, isFetching: indexOfId > -1})
                   
           }
           else{
             //    alert(this.props.fetchingList + ' ' + nextprops.fetchingList)
                this.setState({ isFetching: indexOfId > -1})
           }
               
        }


    render() {

    
        const {dropDownTriggerTemplate, dropDownTriggerStyle, dropDownTriggerContainer, activeTriggerStyle, id} = this.props;
        return (
            <View style={[styles.dropDownTriggerContainer, dropDownTriggerContainer]}>
                <View style={[styles.dropDownTriggerStyle, dropDownTriggerStyle, this.state.triggerIsActive && activeTriggerStyle]} ref={"DropDownTrigger"}>
                    <TouchableWithoutFeedback onPress={this.openDropDown.bind(this) }>
                        
                            { dropDownTriggerTemplate(this.state.selected, this.state.isFetching)}
                        
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
  //const { navReducer, peopleReducer } = state
  const { uiReducer,peopleReducer } = state
  return {
      clickedTrigger: uiReducer.clickedTrigger, 
      triggerSelectedValue: uiReducer.triggerSelectedValue, 
      IsDropdownOptionsOpen: uiReducer.IsDropdownOptionsOpen,
      fetchingList : peopleReducer.fetchingList,
      fetchingListChanged : peopleReducer.fetchingListChanged

  }
}

export default connect(mapStateToProps)(DropDownTrigger)