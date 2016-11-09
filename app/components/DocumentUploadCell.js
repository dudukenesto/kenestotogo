'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View
} = ReactNative;

import Icon from 'react-native-vector-icons/MaterialIcons';
import MartialExtendedConf from '../assets/icons/config.json';
import customConfig from '../assets/icons/customConfig.json';
import { createIconSetFromFontello } from  'react-native-vector-icons'
import {updateSelectedObject,getDocumentPermissions} from '../actions/documentlists'
import {connect} from 'react-redux'
import {getIconNameFromExtension} from '../utils/documentsUtils'
const KenestoIcon = createIconSetFromFontello(MartialExtendedConf);
const CustomIcon = createIconSetFromFontello(customConfig);

// * * * * * * * * DUMMY STATIC VALUES * * * * * * * * * * *
var uploadingInProgress = true;//                          *
var progress = Math.random();//                      *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

var DocumentUploadCell = React.createClass({

    toggleUpload: function (id, familyCode, document){
      var {dispatch} = this.props; 
   
      dispatch(updateSelectedObject(id, familyCode, ""));
      dispatch(getDocumentPermissions(id, familyCode))
      // this.context.itemMenuContext.open();
      
      console.log('\n\n\n\n\n\n ================== MY LOG START ==================  \n\n\n\n\n\n')
      console.log(document)
      console.log('\n\n\n\n\n\n ================== MY LOG END ==================  \n\n\n\n\n\n')
    },
    
    cancelUpload: function(id, familyCode){
      alert('cancel: \n\n'+id)
    },
    
    renderActions: function (TouchableElement) {
      return (
        uploadingInProgress ?
          <TouchableElement onPress={ (() => { this.toggleUpload(this.props.document.Id, this.props.document.FamilyCode, this.props.document) }).bind(this) }>
            <View style={styles.actionContainer}>
              <Icon name="pause" style={styles.moreMenu} />
            </View>
          </TouchableElement>
          :
          <View style={styles.actions}>
            <TouchableElement onPress={ (() => { this.cancelUpload(this.props.document.Id, this.props.document.FamilyCode) }).bind(this) }>
              <View style={styles.actionContainer}>
                <Icon name="close" style={styles.moreMenu} />
              </View>
            </TouchableElement>

            <TouchableElement onPress={ (() => { this.toggleUpload(this.props.document.Id, this.props.document.FamilyCode, this.props.document) }).bind(this) }>
              <View style={styles.actionContainer}>
                <Icon name="refresh" style={styles.moreMenu} />
              </View>
            </TouchableElement>
          </View>
      )
    },

  render: function() {

    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    
    var imageSource = require('../assets/thumbnail_img.png'); 
          
    var elementIcon;
    if (this.props.document.HasThumbnail){
      elementIcon = <Image source = {{uri: this.props.document.ThumbnailUrl}} style={styles.previewThumbnail} />
    }
    else {
      if (this.props.document.FamilyCode == 'FOLDER'){
        if(this.props.document.IsVault)
          elementIcon = <CustomIcon name="safe" style={styles.icon} />
        else
          elementIcon = <KenestoIcon name="folder" style={styles.kenestoIcon} />
      }
      else {
        if (typeof this.props.document.IconName != 'undefined') {
          var iconName = getIconNameFromExtension(this.props.document.FileExtension).iconName;
          var customStyle = getIconNameFromExtension(this.props.document.FileExtension).customStyle;
          elementIcon = <View style={styles.iconFiletype}>
            { iconName === 'solidw' ? 
              <CustomIcon name={iconName} style={[styles.icon, customStyle]} />
              :
              <KenestoIcon name={iconName} style={[styles.kenestoIcon, customStyle]} />
            }

          </View>
        }
        else
          elementIcon = <View style={styles.iconFiletype}><KenestoIcon name="description" style={styles.kenestoIcon} /></View>
      }
    }
      

    return (
      <View>  
        <TouchableElement>
          <View style={styles.row}>
            <View style={styles.iconContainer}>
              {elementIcon}
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.documentTitle} numberOfLines={1}>
                {this.props.document.Name}
              </Text>
              {uploadingInProgress ?
                <Text style={styles.documentYear} numberOfLines={1}>
                  XX MB / YY MB
                </Text>
                :
                <Text style={styles.documentYear} numberOfLines={1}>
                  Upload paused
                </Text>
              }

              
            </View>
            {this.renderActions(TouchableElement)}            
          </View>
        </TouchableElement>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    marginLeft: 7,
  },
  documentTitle: {
    //flex: 1,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  documentYear: {
    color: '#999999',
    fontSize: 12,
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
    marginLeft: 10,    
  },
  actionContainer: {
    marginHorizontal: 10
  },
  previewThumbnail: {
    height: 40,
    width: 55,
    borderWidth: 0.5,
    borderColor: "#bbb"
  },
  icon: {
    fontSize: 22,
    color: '#888',    
  },
  kenestoIcon: {
        fontSize: 22,
        color: '#888',
        marginTop: -12
    },
  iconFiletype: {
    height: 40,
    width: 55,
    alignItems: 'center',
    justifyContent: "center",
    // borderWidth: 0.5,
    // borderColor: "#999"
  },
  moreMenu: {
    fontSize: 22,
    color: '#888', 
  },
  actions: {
    flexDirection: "row"
  },
  
});

DocumentUploadCell.contextTypes = {
    itemMenuContext:  React.PropTypes.object,
};



module.exports = DocumentUploadCell // connect(mapStateToProps)(DocumentUploadCell)
