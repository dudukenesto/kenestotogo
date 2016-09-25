'use strict';

import React, { Component, PropTypes } from 'react';
import {
    StyleSheet,
    // Text,
    View,
    // ScrollView,
    // TextInput,
    ListView,
    TouchableWithoutFeedback,
    // TouchableHighlight,
    // Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class KenestoDropDown extends Component {

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
    }

    onSelectOption() {

    }

    render() {
        console.log('render fired', this.state)
        return (
            <View style={styles.dropDownContainer}>
                <TouchableWithoutFeedback onPress={this.toggleDropDown.bind(this) } >
                    <View style={styles.dropDownTrigger}>
                        <Icon name="remove-red-eye" style={styles.icon} />
                        <Icon name="keyboard-arrow-down" style={styles.icon} />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    dropDownContainer: {
        height: 35,
        width: 60,
        borderWidth: 0.5,
        // borderColor: '#F5F6F8',
        borderColor: '#000',
        position: 'absolute',
        top: 15,
        right: 13,
    },
    dropDownTrigger: {
        flex: 1,
        flexDirection: "row"
    },
    dropDownOptionsContainer: {},
})