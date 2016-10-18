'use strict';

import React, { Component, PropTypes} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableWithoutFeedback,
    TouchableHighlight,
    Dimensions
} from 'react-native';
import {connect} from 'react-redux';
var Orientation = require('./KenestoDeviceOrientation');
var {height, width} = Dimensions.get('window');

class DropDownOptions extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showDropDown: false,
            orientation: Orientation.getInitialOrientation(),
            position: {
                top: -10000,
                left: -10000
            }
        }
    }

    openDropDown(triggerSettings, options, optionTemplate) {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        
        this.setState({
            showDropDown: true,
            triggerSettings: triggerSettings,
            options: options,
            optionTemplate: optionTemplate,
            dataSource: ds.cloneWithRows(options),
        })
    }

    closeDropDown() {
        this.setState({
            showDropDown: false,
            position: {
                top: -10000,
                left: -10000
            }
        });
        console.log('\n\n\n\n\n\n ================== MY LOG START ==================  \n\n\n\n\n\n')
    }

    getDimensions(event) {
        const {width, height} = event.nativeEvent.layout;
        return (
            {
                optWidth: width,
                optHeight: height
            }
        )
    }
    
    getOpeningDirection(triggerSettings, optHeight){
        var windowHeight = (this.state.orientation === 'PORTRAIT') ? height : width;
        if ((triggerSettings.direction === 'up' && triggerSettings.top > optHeight) ||
            (triggerSettings.direction === 'down' && windowHeight-triggerSettings.top-triggerSettings.height < optHeight)) {
            return true;
        }
        else {
            return false;
        }
    }
    
    setPosition(event){
        var {optWidth, optHeight} = this.getDimensions(event);
        var openUp = this.getOpeningDirection(this.state.triggerSettings, optHeight);
        if(openUp){            
            this.setState({
                position: {
                    top: this.state.triggerSettings.top - optHeight + 1,
                    left: (this.state.triggerSettings.aligning === 'left') ? this.state.triggerSettings.left : this.state.triggerSettings.left + this.state.triggerSettings.width - optWidth
                }
            })
        }
        else {            
            this.setState({
                position: {
                    top: this.state.triggerSettings.top + this.state.triggerSettings.height - 1,
                    left: (this.state.triggerSettings.aligning === 'left') ? this.state.triggerSettings.left : this.state.triggerSettings.left + this.state.triggerSettings.width - optWidth
                }
            }) 
        }

    }
    
    onPress(){
        
    }

    renderRow(rowData) {

        return (
            <TouchableHighlight underlayColor={'#eee'} onPress={this.onPress}>
                {this.state.optionTemplate ?
                    this.state.optionTemplate(rowData)
                    :
                    <Text>{rowData.title}</Text>
                }
            </TouchableHighlight>
        )
    }

    getListView() {

        return (
            <View>
                <ListView
                    style={styles.optionsList}
                    keyboardShouldPersistTaps={true}
                    dataSource={this.state.dataSource}
                    enableEmptySections={true}
                    renderRow={this.renderRow.bind(this) }
                    // key={this.state.position}
                    />
            </View>
        )
    }

    componentWillReceiveProps(nextprops){
      //  alert(this.state.showDropDown + ' ' + nextprops.showDropDown);
        if (this.state.showDropDown && !nextprops.showDropDown)
            this.closeDropDown();
         if (!this.state.showDropDown && nextprops.showDropDown)
            this.openDropDown(nextprops.dropDownTrigger, nextprops.dropDownOptions, nextprops.dropDownOptionTemplate);     
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
        
        this.closeDropDown();
    }

    render() {
        return (
            this.state.showDropDown ?
                <View style={[styles.dropDownOptionsContainer]} ref={"DropDownOptions"}>
                    <TouchableWithoutFeedback onPress={this.closeDropDown.bind(this) }>
                        <View style={{flex: 1}}>
                            <View style={[styles.optionsContent, this.state.position]} onLayout={(event) => this.setPosition(event) }>
                                {this.state.showDropDown && this.getListView() }
                            </View>

                        </View>
                    </TouchableWithoutFeedback>


                </View>
                :
                <View></View>
        )
    }

}

const styles = StyleSheet.create({

    dropDownOptionsContainer: {
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        // backgroundColor:"#eee"
    },
    optionsContent: {
        borderWidth: 0.5,
        borderColor: "#666",
        backgroundColor: "#fff",
        width: 170,
        paddingVertical: 10,
    },
    optionsList: {},

})

DropDownOptions.contextTypes = {
    dropDownContext: React.PropTypes.object
}

function mapStateToProps(state) {
    const { navReducer } = state

    return {
        showDropDown: navReducer.showDropDown,
         dropDownTrigger : navReducer.dropDownTrigger, 
         dropDownOptions: navReducer.dropDownOptions, 
        triggerSelectedChanged: navReducer.triggerSelectedChanged,
         dropDownOptionTemplate : navReducer.dropDownOptionTemplate
    }
}

export default connect(mapStateToProps)(DropDownOptions)

