import React from 'react'
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableWithoutFeedback
} from 'react-native'
import Button from './Button'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {connect} from 'react-redux'
import fontelloConfig from '../assets/icons/config.json';
import { createIconSetFromFontello } from  'react-native-vector-icons'
import {getSelectedDocument, getDocumentsContext} from '../utils/documentsUtils'
import * as documentsActions from '../actions/documentlists'
import MartialExtendedConf from '../assets/icons/config.json';
import * as routes from '../constants/routes'
import * as navActions from '../actions/navActions'
import * as docActions from '../actions/documentlists'
import ProggressBar from "../components/ProgressBar";
import ViewContainer from './ViewContainer';

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
    actionIconsContainer: {
        flexDirection: 'row',
        marginRight: 5,    
        alignItems: 'center', 
    },
    singleActionIconContainer: {
        padding: 10,
        alignItems: 'center',
        justifyContent: "center",
        
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
        fontSize: 22,
        color: '#888',
        margin: 0,
    },
    iconFiletype: {
        height: 40,
        width: 55,
        alignItems: 'center',
        justifyContent: "center",
  },
})

class ItemMenu extends React.Component{
        constructor(props){
            super (props);
            this.state = {
                document: null
            }
        }

    
    startDownload(){
         //this.props.dispatch(docActions.downloadDocument(this.state.document.Id, this.state.document.FileName));
         this.props.closeItemMenuModal();
     
         this.props.dispatch(docActions.downloadDocument(this.state.document.Id, this.state.document.FileName));
        //  this.props.dispatch(navActions.clearToast());
     //   
        //alert('start Download')
    }
    
    viewDocument(){
         const documentsContext = getDocumentsContext(this.props.navReducer);
         
        var data = {
        key: "document",
        name: this.state.document.Name,
        documentId: this.state.document.Id,
        catId: documentsContext.catId,
        fId: documentsContext.fId,
        viewerUrl: this.state.document.ViewerUrl, 
        isExternalLink : this.state.document.IsExternalLink,
        isVault: this.state.document.IsVault,

        env: this.props.env
      }

      
       this.props.dispatch(navActions.push(routes.documentRoute(data).route));

       this.props.closeItemMenuModal();
    }
    
    shareDocument(){
 //  alert('nav = ' + this.props.navReducer);
       const documentsContext = getDocumentsContext(this.props.navReducer);

      // alert(documentsContext)
         var data = {
        key: "addPeople",
        name: this.state.document.Name,
        documentId: this.state.document.Id,
        familyCode: this.state.document.familyCode,
        catId: documentsContext.catId,
        fId: documentsContext.fId,
        sortDirection: documentsContext.sortDirection,
        sortBy: documentsContext.sortBy
      }

    
      
       this.props.dispatch(navActions.push(routes.addPeopleRoute(data).route));

        this.props.closeItemMenuModal();

    }
    
    editFolder(){
        this.props.closeItemMenuModal();
        this.props.openEditFolderModal()
    }
    
    editDocument(){
        this.props.closeItemMenuModal();
        this.props.openEditDocumentModal()
    }

    checkinDocument(){
        this.props.closeItemMenuModal();
        this.props.openCheckInModal()
    }
    
    checkoutDocument(){
        this.props.closeItemMenuModal();
        this.props.dispatch(documentsActions.CheckOut());
    }
    
    discardCheckOut(){
        this.props.closeItemMenuModal();
        this.props.dispatch(documentsActions.DiscardCheckOut());
    }

    deleteDocument(){

         // this.refs.mainContainer.showMessage("info", errorMessage)

        this.props.closeItemMenuModal();
        if (this.state.document.FamilyCode == "FOLDER")
         this.props.dispatch(navActions.emitConfirm("Delete Folder", "Are you sure you want to delete?", () =>  this.props.dispatch(docActions.deleteFolder(this.state.document.Id))))   
        else
           this.props.dispatch(navActions.emitConfirm("Delete "+this.state.document.Name, "Are you sure you want to delete?", () =>  this.props.dispatch(docActions.deleteAsset(this.state.document.Id, this.state.document.FamilyCode))))
    }

  componentWillMount(){
        var document = getSelectedDocument(this.props.documentlists, this.props.navReducer); 
        this.setState({ document: document});
    }
   
   _renderShareAction(document)
    {
            if(this.props.documentlists.selectedObject.permissions.AllowShare)
            {
                return(<TouchableHighlight onPress={this.shareDocument.bind(this) } underlayColor="#E9EAEC">
                                <View style={styles.actionHolder}>
                                    <Icon name="share" style={styles.icon} />
                                    <Text style={styles.actionName}>Share</Text>
                                </View>
                            </TouchableHighlight>)
            }
            else
            {
                return(<View></View>)
            }
    }
   
    _renderEditAction(document)
    {
            if(this.props.documentlists.selectedObject.permissions.IsOwnedByRequestor)
            {
                if (this.state.document.FamilyCode == 'FOLDER') {
                    return( <TouchableHighlight onPress={this.editFolder.bind(this)} underlayColor="#E9EAEC">
                        <View style={styles.actionHolder}>
                            <Icon name="edit" style={styles.icon} />
                            <Text style={styles.actionName}>Edit Folder</Text>
                        </View>
                    </TouchableHighlight>)
                }
                else
                {
                    return( <TouchableHighlight onPress={this.editDocument.bind(this)} underlayColor="#E9EAEC">
                        <View style={styles.actionHolder}>
                            <Icon name="edit" style={styles.icon} />
                            <Text style={styles.actionName}>Edit Document</Text>
                        </View>
                    </TouchableHighlight>)
                }
            }
            else
            {
                return(<View></View>)
            }
    }

    _renderDeleteAction(document)
    {
            if(this.props.documentlists.selectedObject.permissions.IsOwnedByRequestor)
            {
                return( <TouchableHighlight onPress={this.deleteDocument.bind(this) } underlayColor="#E9EAEC">
                    <View style={styles.actionHolder}>
                        <Icon name="delete" style={styles.icon} />
                        <Text style={styles.actionName}>Delete</Text>
                    </View>
                </TouchableHighlight>)
            }
            else
            {
                return(<View></View>)
            }
    }
    _renderCheckinAction(document)
    {
            if(this.props.documentlists.selectedObject.permissions.AllowCheckin)
            {
                return( <TouchableHighlight onPress={this.checkinDocument.bind(this) } underlayColor="#E9EAEC">
                    <View style={styles.actionHolder}>
                        <Icon name="edit" style={styles.icon} />
                        <Text style={styles.actionName}>Check In</Text>
                    </View>
                </TouchableHighlight>)
            }
            else
            {
                return(<View></View>)
            }
    }

    _renderDiscardCheckOutAction(document)
    {
            if(this.props.documentlists.selectedObject.permissions.AllowDiscardCheckout)
            {
                return( <TouchableHighlight onPress={this.discardCheckOut.bind(this) } underlayColor="#E9EAEC">
                    <View style={styles.actionHolder}>
                        <Icon name="edit" style={styles.icon} />
                        <Text style={styles.actionName}>Discard Check Out</Text>
                    </View>
                </TouchableHighlight>)
            }
            else
            {
                return(<View></View>)
            }
    }
    
    _renderCheckoutAction(document)
    {
            if(this.props.documentlists.selectedObject.permissions.AllowCheckout)
            {
                return( <TouchableHighlight onPress={this.checkoutDocument.bind(this) } underlayColor="#E9EAEC">
                    <View style={styles.actionHolder}>
                        <Icon name="edit" style={styles.icon} />
                        <Text style={styles.actionName}>Check Out</Text>
                    </View>
                </TouchableHighlight>)
            }
            else
            {
                return(<View></View>)
            }
    }
    _renderMenuItemActions(isFetching) {
         var document = getSelectedDocument(this.props.documentlists, this.props.navReducer);
        if (!isFetching) {
              
              
            return (
                <ScrollView keyboardShouldPersistTaps={true} showsVerticalScrollIndicator={false}>
                    <View style={styles.menuItemsContainer}>
                        { this._renderShareAction(document) }
                        { this._renderCheckinAction(document) }
                        { this._renderCheckoutAction(document) }
                        { this._renderDiscardCheckOutAction(document) }
                        { this._renderEditAction(document) }
                        { this._renderDeleteAction(document) }

                    </View>
                </ScrollView>)
        }
        else {
            return (<View style={[styles.container, styles.centerText]}>
                <View style={styles.textContainer}>
                    <Text>Please wait...</Text>
                    <ProggressBar isLoading={true} />
                </View>
            </View>)
        }
    }

    render(){
        var elementIcon;
        const {navReducer} = this.props
        var currRouteData = getDocumentsContext(navReducer);
        const isFetching = this.props.documentlists.isFetchingSelectedObject;

        if (this.state.document.HasThumbnail) {
            elementIcon = <Image source = {{ uri: this.state.document.ThumbnailUrl }} style={styles.previewThumbnail} />
        }
        else {
            if (this.state.document.FamilyCode == 'FOLDER') {
                elementIcon = <KenestoIcon name="folder" style={styles.icon} />
            }
            else {
                if (typeof this.state.document.IconName != 'undefined')
                    elementIcon = <View style={styles.iconFiletype}><KenestoIcon name={this.state.document.IconName} style={styles.icon} /></View>
                else
                    elementIcon = <View style={styles.iconFiletype}><KenestoIcon name="description" style={styles.icon} /></View>
            }
        }


     return(
            <ViewContainer ref="itemMenuContainer" style={styles.container}> 
                <View style={styles.menuHeader}>
                    <View style={styles.row}>
                        <View style={styles.iconContainer}>
                            {elementIcon}
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.documentTitle} numberOfLines={2}>
                                {this.state.document.Name}
                            </Text>
                            <Text style={styles.documentYear} numberOfLines={1}>
                                {  "Modified " + moment(this.state.document.ModificationDate).format('MMM DD, YYYY') }

                            </Text>
                        </View>
                        
                        <View style={styles.actionIconsContainer}>
                            <TouchableWithoutFeedback onPress={this.startDownload.bind(this)}>
                                <View style={styles.singleActionIconContainer}>
                                    <Icon name="file-download" style={styles.actionIcon} />
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={this.viewDocument.bind(this)}>
                                <View style={styles.singleActionIconContainer}>
                                    <Icon name="remove-red-eye" style={styles.actionIcon} />
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        
                    </View>    
                </View>
                {this._renderMenuItemActions(isFetching)}
            </ViewContainer>
        )
    }

}

ItemMenu.contextTypes = {
    itemMenuContext:  React.PropTypes.object
}


function mapStateToProps(state) {
  const { documentlists, navReducer } = state
   const {env } = state.accessReducer;
  return {
      documentlists : documentlists, 
      navReducer: navReducer, 
      env: env

  }
}


export default connect(mapStateToProps)(ItemMenu)