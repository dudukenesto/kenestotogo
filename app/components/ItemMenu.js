import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image
} from 'react-native'
import Button from './Button'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {connect} from 'react-redux'
import fontelloConfig from '../assets/icons/config.json';
import { createIconSetFromFontello } from  'react-native-vector-icons'
import {getSelectedDocument} from '../utils/documentsUtils'
import MartialExtendedConf from '../assets/icons/config.json';
const KenestoIcon = createIconSetFromFontello(MartialExtendedConf);
var moment = require('moment');

let styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: 'stretch',        
    },
    menuHeader: {
        borderBottomWidth: 1,
        borderBottomColor: "#999"
    },
    menuItemsContainer: {
        marginTop: 12
    },
    actionIcons: {
        flexDirection: 'row',
        marginRight: 20,        
    },    
    actionHolder: {
        flexDirection: "row",
        height: 48,
        alignItems: "center",
        paddingHorizontal: 33,
    },
    actionName: {
        fontSize: 14,
        marginLeft: 22,
        color: "#000",
        fontWeight: "bold"
    },
    textContainer: {
        flex: 1,
        marginLeft: 7,
    },
    documentTitle: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 2,
    },
    documentYear: {
        color: '#999999',
    },
    row: {
        alignItems: 'center',
        backgroundColor: 'white',
        flexDirection: 'row',
        padding: 5,
    },
    iconContainer: {
        height: 57,
        width: 57,
        alignItems: 'center',
        justifyContent: "center",
        marginLeft: 10
    },
    previewThumbnail: {
        height: 40,
        width: 55,
        borderWidth: 0.5,
        borderColor: "#999"
    },
    icon: {
        fontSize: 22,
        color: '#888',
    },
    actionIcon: {
        paddingHorizontal: 10,
    },
    iconFiletype: {
        height: 40,
        width: 55,
        alignItems: 'center',
        justifyContent: "center",
  },
})

export class ItemMenu extends React.Component{
      constructor(props){
        super (props);
    }


    render(){

        var document = getSelectedDocument(this.props.documentlists, this.props.navReducer); 
        
        var elementIcon;
        if (document.HasThumbnail) {
            elementIcon = <Image source = {{ uri: document.ThumbnailUrl }} style={styles.previewThumbnail} />
        }
        else {
            if (document.FamilyCode == 'FOLDER') {
                elementIcon = <KenestoIcon name="folder" style={styles.icon} />
            }
            else {
                if (typeof document.IconName != 'undefined')
                    elementIcon = <View style={styles.iconFiletype}><KenestoIcon name={document.IconName} style={styles.icon} /></View>
                else
                    elementIcon = <View style={styles.iconFiletype}><KenestoIcon name="description" style={styles.icon} /></View>
            }
        }


        return(
            <View style={styles.container}>
                <View style={styles.menuHeader}>
                    <View style={styles.row}>
                        <View style={styles.iconContainer}>
                            {elementIcon}
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.documentTitle} numberOfLines={2}>
                                {document.Name}
                            </Text>
                            <Text style={styles.documentYear} numberOfLines={1}>
                                {  "Modified " + moment(document.ModificationDate).format('MMM DD, YYYY') }

                            </Text>
                        </View>
                        <View style={[styles.iconContainer, styles.actionIcons]}>
                            <KenestoIcon name="word" style={[styles.icon, styles.actionIcon]} />
                            <KenestoIcon name="powerpoint" style={styles.icon} />
                        </View>
                    </View>    
                </View>
                
                
                
                
                
                <View style={styles.menuItemsContainer}>  
                    <View style={styles.actionHolder}>
                        <KenestoIcon name="word" style={styles.icon} />
                        <Text style={styles.actionName}>Share (share)</Text>
                    </View>
                    
                    <View style={styles.actionHolder}>
                        <KenestoIcon name="word" style={styles.icon} />
                        <Text style={styles.actionName}>Rename (rename-box)</Text>
                    </View>
                    
                    <View style={styles.actionHolder}>
                        <KenestoIcon name="word" style={styles.icon} />
                        <Text style={styles.actionName}>Delete (delete)</Text>
                    </View>    
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