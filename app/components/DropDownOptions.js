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
                    top: this.state.triggerSettings.top - optHeight,
                    left: (this.state.triggerSettings.aligning === 'left') ? this.state.triggerSettings.left : this.state.triggerSettings.left + this.state.triggerSettings.width - optWidth
                }
            })
        }
        else {            
            this.setState({
                position: {
                    top: this.state.triggerSettings.top + this.state.triggerSettings.height,
                    left: (this.state.triggerSettings.aligning === 'left') ? this.state.triggerSettings.left : this.state.triggerSettings.left + this.state.triggerSettings.width - optWidth
                }
            }) 
        }

    }

    renderRow(rowData) {
        console.log(rowData)
        return(
            <TouchableHighlight>
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
    }

    // onSelectOption() {
    
    // }

    render() {
        return (
            this.state.showDropDown ?
                <View style={[styles.dropDownOptionsContainer]} ref={"DropDownOptions"}>
                    <TouchableWithoutFeedback onPress={this.closeDropDown.bind(this) }>
                        <View style={{ flex: 1 }}>
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
        // borderWidth: 3,
        // borderColor: "red",
        // backgroundColor: "#eee",   

    },
    optionsContent: {
        borderWidth: 1,
        borderColor: "green",
        backgroundColor: "#fff",
        // marginTop: 40,
        // marginRight: 40,
        width: 170,
        // height: 300
    },
    optionsList: {},

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