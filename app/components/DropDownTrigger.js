'use strict';
import * as navActions from '../actions/navActions'
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
var Orientation = require('./KenestoDeviceOrientation');

class DropDownTrigger extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selected: this.props.selected,
            triggerIsActive: false,
            orientation: Orientation.getInitialOrientation()
        }
    }
    
    componentDidMount() {
        this.orientationListener = Orientation.addOrientationListener(this._orientationDidChange.bind(this));
    }

    componentWillUnmount() {
        this.orientationListener.remove();
        Orientation.removeOrientationListener();
    }

    _orientationDidChange(orientation) {
        this.setState({
            orientation: orientation == 'LANDSCAPE' ? 'LANDSCAPE' : 'PORTRAIT'
        })
        this.setState({
            triggerIsActive: false
        })
        
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
          this.props.dispatch(navActions.updateDropdownData(this.props.id, triggerSettings, this.props.options, this.props.optionTemplate))
         //   this.context.dropDownContext.openDropDown(triggerSettings, this.props.options, this.props.optionTemplate);
        })
        
        this.setState({
            triggerIsActive: true,
        })
    }

       componentWillReceiveProps(nextprops){

          
          var indexOfId = nextprops.fetchingList.indexOf(this.props.id);
       
          //alert(indexOfId + ' ' + this.props.id)
           if (this.props.clickedTrigger == this.props.id && nextprops.triggerSelectedValue != '')
           {   
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
  const { navReducer, peopleReducer } = state
  return {
      clickedTrigger: navReducer.clickedTrigger, 
      triggerSelectedValue: navReducer.triggerSelectedValue, 
      fetchingList : peopleReducer.fetchingList,
      fetchingListChanged : peopleReducer.fetchingListChanged

  }
}

export default connect(mapStateToProps)(DropDownTrigger)