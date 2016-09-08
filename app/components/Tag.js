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
            // flexDirection: "row",
            // justifyContent: 'center',
            backgroundColor: '#eee',
            paddingHorizontal: 10,
            padding: 0,
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
            // alignSelf: "center"
        },
        userIcon: {
            fontSize: 30,
            // position: "absolute",
            left: -12,
            // top: -2
        },
        avatar: {
            height: 30,
            width: 30,
            borderRadius: 15,
        },
    })

    return (
        <TouchableHighlight style={[styles.container, tagContainer]} onPress={onPress}>
            <View style={styles.innerContainer}>
                <Icon name="account-circle" style={styles.userIcon} />
                <Text style={styles.text}>{text}</Text>
            </View>
        </TouchableHighlight>
    );
}

Tag.propTypes = {
    text: PropTypes.string,
    tagContainer: View.propTypes.style,
    onPress: PropTypes.func,
}

Tag.defaultProps = {
    text: 'none',
    tagContainer: null,
    onPress: () => { },
}

export default Tag;