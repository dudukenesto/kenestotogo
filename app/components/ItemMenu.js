import React from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'
import Button from './Button'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {connect} from 'react-redux'
import fontelloConfig from '../assets/icons/config.json';
import { createIconSetFromFontello } from  'react-native-vector-icons'
import {getSelectedDocument} from '../utils/documentsUtils'
const KenestoIcon = createIconSetFromFontello(fontelloConfig);

let styles = StyleSheet.create({
    container: {
        flex: 1,
        flexWrap: "wrap",
        flexDirection: 'row',
        paddingTop: 35,
               
        // FOR LANDSCAPE ORIENTATION:
        
        // alignSelf: 'stretch',
        // justifyContent: 'space-between',
        // paddingHorizontal: 20,        
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

export class ItemMenu extends React.Component{
      constructor(props){
        super (props);
    }


    render(){

        var document = getSelectedDocument(this.props.documentlists, this.props.navReducer); 
        return(
            <View style={styles.container}>
                <View style={styles.actionHolder}>
                    <Icon name="create-new-folder" style={styles.actionButtonIcon} />
                    <Text style={styles.actionName}>hallooo</Text>
                </View>
                
                <View style={styles.actionHolder}>
                    <Icon name="file-upload" style={styles.actionButtonIcon} />
                    <Text style={styles.actionName}>kuku</Text>
                </View>
                
                <View style={styles.actionHolder}>
                    <Icon name="photo-camera" style={styles.actionButtonIcon} />
                    <Text style={styles.actionName}>pupu</Text>
                </View>                
            </View>
        )
    }

}

ItemMenu.contextTypes = {
    itemMenuContext:  React.PropTypes.object
}


function mapStateToProps(state) {
  const { documentlists, navReducer } = state
  
  return {
      documentlists : documentlists, 
      navReducer: navReducer

  }
}


export default connect(mapStateToProps)(ItemMenu)