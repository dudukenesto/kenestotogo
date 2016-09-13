import React, { PropTypes } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

const Tag = ({
    text,
    tagContainer,
    onPress,
}) => {
    const styles = StyleSheet.create({
        container: {
            backgroundColor: '#eee',
            paddingLeft: 5,
            paddingRight: 7,
            paddingVertical: 0,
            margin: 3,
            borderRadius: 15,
            height: 27,
        },
        innerContainer: {
            flex: 1,
            flexDirection: "row",
            justifyContent: 'center',
            alignItems: "center"
        },
        text: {
            fontSize: 14,
            color: '#000',
            padding: 0,
            margin: 0
        },
        userIcon: {
            fontSize: 30,
            left: -7,
        },
        closeIcon: {
            fontSize: 17,
            marginTop: 2,
            marginRight: -5,
            padding: 6,
        },
        avatar: {
            height: 30,
            width: 30,
            borderRadius: 15,
        },
    })

    return (
        <TouchableHighlight style={[styles.container, tagContainer]} >
            <View style={styles.innerContainer}>
                <Icon name="account-circle" style={styles.userIcon} />
                <Text style={styles.text}>{text}</Text>
                <Icon name="close" style={styles.closeIcon} onPress={onPress} />
            </View>
        </TouchableHighlight>
    );
}

export default Tag;