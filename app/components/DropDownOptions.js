'use strict';

import React, { Component, PropTypes} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableWithoutFeedback,
    TouchableHighlight,
} from 'react-native';
import {connect} from 'react-redux';
var Orientation = require('./KenestoDeviceOrientation');

class DropDownOptions extends Component {

    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.state = {
            showDropDown: false,
            orientation: Orientation.getInitialOrientation(),
            dataSource: ds.cloneWithRows(['View', 'Download', 'Update'])
        }
    }

    openDropDown(triggerSettings) {
        this.setState({
            showDropDown: true,
            triggerSettings: triggerSettings
        })
    }

    // if open up: render the list, measure height, then onLayout --> setVertical position

    closeDropDown() {
        this.setState({
            showDropDown: false
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
    
    setPosition(event){
        var {optWidth, optHeight} = this.getDimensions(event);
                
    }
    
    log(data){
        console.log('\n\n\n\n\n\n ================== MY LOG START ==================  \n\n\n\n\n\n')
        console.log(data)       
    }

    renderRow(rowData) {
        return(
            <TouchableHighlight onPress={this.log.bind(this, rowData) }>
                <View style={{borderWidth:5, margin:1}}>
                    {this.props.optionTemplate ?
                        this.props.optionTemplate(rowData)
                        :
                        <Text>{rowData}</Text>
                    }

                </View>
            </TouchableHighlight>
        )
    }

    getListView() {
        return (

            <ListView
                style={styles.optionsList}
                keyboardShouldPersistTaps={true}
                dataSource={this.state.dataSource}
                enableEmptySections={true}
                renderRow={this.renderRow.bind(this) }
                // renderSeparator={this._renderSeparator.bind(this) }
                // renderFooter={this._renderFooter.bind(this) }
                // key={this.state.userInput + this.state.orientation}
                />
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
    //     console.log('\n\n\n\n\n\n ================= \n\n')
    //     console.log(this.state)
    //     console.log('\n======= END ====== \n\n\n\n\n\n')
    // }

    render() {
        // const {dropDownContainerStyle} = this.props;

        return (
            this.state.showDropDown ?
                <View style={[styles.dropDownOptionsContainer]} ref={"DropDownOptions"}>
                    <TouchableWithoutFeedback onPress={this.closeDropDown.bind(this) }>
                        <View style={{ flex: 1 }}>
                            <View style={styles.optionsContent} onLayout={(event) => this.setPosition(event) }>
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