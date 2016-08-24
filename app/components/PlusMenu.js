import React from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'
import Button from './Button'
import Icon from 'react-native-vector-icons/MaterialIcons'

import fontelloConfig from '../assets/icons/config.json';
import { createIconSetFromFontello } from  'react-native-vector-icons'
const KenestoIcon = createIconSetFromFontello(fontelloConfig);

let styles = StyleSheet.create({
    container: {
        flex: 1,
        flexWrap: "wrap",
        flexDirection: 'row',
        paddingTop: 35,
    },
    actionButtonIcon: {
        fontSize: 45,
    },
    actionHolder: {        
        width: 90,
        height: 90,
        margin: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    actionName: {
        textAlign: "center",
        fontSize: 14,
        color: "#000", 
    },
    
})

export default class PlusMenu extends React.Component{
      constructor(props){
        super (props);
    }

    addFolder(){
        this.props.closeMenuModal("modalPlusMenu");
       // this.props.createError();
        this.props.openCreateFolder();
    }
    

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.actionHolder}>
                    <Icon name="create-new-folder" style={styles.actionButtonIcon} onPress={this.addFolder.bind(this)} />
                    <Text style={styles.actionName}>New Folder</Text>
                </View>
                
                <View style={styles.actionHolder}>
                    <Icon name="file-upload" style={styles.actionButtonIcon} />
                    <Text style={styles.actionName}>Upload File</Text>
                </View>
                
                <View style={styles.actionHolder}>
                    <Icon name="photo-camera" style={styles.actionButtonIcon} />
                    <Text style={styles.actionName}>Scan</Text>
                </View>                
            </View>
        )
    }

}

PlusMenu.contextTypes = {
    kModal:  React.PropTypes.object
}