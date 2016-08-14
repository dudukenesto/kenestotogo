import React from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'
import Button from './Button'
import Icon from 'react-native-vector-icons/MaterialIcons'

let styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    actionButtonIcon: {
        fontSize: 60,
        height: 60,
    },
})

export default class PlusMenu extends React.Component{
      constructor(props){
        super (props);
    }

    addFolder(){
        this.props.closeMenuModal();
        this.props.openCreateFolder();
    }
    

    render(){
        return(
            <View style={styles.container}>
        
                 <Icon name="create-new-folder" style={styles.actionButtonIcon} onPress={this.addFolder.bind(this)} />
                 <Text>New Folder</Text>
            </View>
        )
    }

}

PlusMenu.contextTypes = {
    kModal:  React.PropTypes.object
}