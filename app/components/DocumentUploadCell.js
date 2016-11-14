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
import {getIconNameFromExtension} from '../utils/documentsUtils';
import * as Progress from 'react-native-progress';
const KenestoIcon = createIconSetFromFontello(MartialExtendedConf);
const CustomIcon = createIconSetFromFontello(customConfig);

var DocumentUploadCell = React.createClass({

    toggleUpload: function (id, familyCode){
      var {dispatch} = this.props; 
   
      dispatch(updateSelectedObject(id, familyCode, ""));
      dispatch(getDocumentPermissions(id, familyCode))
      // this.context.itemMenuContext.open();
    },
    
    cancelUpload: function(id, familyCode){
      alert('cancel: \n\n'+id)
    },
    
    renderActions: function (TouchableElement, uploadingInProgress) {
      return (
        uploadingInProgress ?
          <TouchableElement onPress={ (() => { this.toggleUpload(this.props.document.Id, this.props.document.FamilyCode) }).bind(this) }>
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

            <TouchableElement onPress={ (() => { this.toggleUpload(this.props.document.Id, this.props.document.FamilyCode) }).bind(this) }>
              <View style={styles.actionContainer}>
                <Icon name="refresh" style={styles.moreMenu} />
              </View>
            </TouchableElement>
          </View>
      )
    },

  render: function() {
    
    // * * * * * * * * DUMMY STATIC VALUES, PER DOCUMENT * * * * * * * *
    var uploadingInProgress = true;//                                  *
    var documentSize = Math.floor(Math.random()*100)//                 *
    var progress = Math.random();//                                    *
    var uploaded = Math.floor(documentSize * progress);//              *
    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    var realProgressBar = <View style={styles.progressBarContainer}><Progress.Bar progress={progress} width={75} height={4} borderRadius={0} borderWidth={0} unfilledColor={"#ccc"} /></View>
    var dummyProgressBar = <View style={styles.progressBarContainer}><Progress.Bar indeterminate={true}  width={75} height={4} borderRadius={0} borderWidth={0} unfilledColor={"#ccc"} /></View>
    // var dummyProgressBar = <View style={styles.progressBarContainer}><Progress.Circle size={20} indeterminate={true} /></View> // circle; crashes the app
    // var dummyProgressBar = <View style={styles.progressBarContainer}><Progress.CircleSnail size={20} colors={['red', 'green', 'blue']}  /></View> // circleSnail; crashes the app
    

    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    
    var imageSource = require('../assets/thumbnail_img.png'); 
          
    var elementIcon;

    elementIcon = <KenestoIcon name="folder" style={styles.kenestoIcon} />

    
      
    // console.log('\n\n\n\n\n\n ================== MY LOG START ==================  \n\n\n\n\n\n')
    // console.log(document)
    // console.log('\n\n\n\n\n\n ================== MY LOG END ==================  \n\n\n\n\n\n')
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
              <View style={{ flexDirection: "row" }}>
                {uploadingInProgress ?
                  <Text style={styles.documentYear} numberOfLines={1}>
                    {uploaded} MB / {documentSize} MB
                  </Text>
                  :
                  <Text style={styles.documentYear} numberOfLines={1}>
                    Upload paused
                  </Text>
                }
                {dummyProgressBar}
              </View>
            </View>
            {this.renderActions(TouchableElement, uploadingInProgress)}            
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
  progressBarContainer: {
    justifyContent: "center",
    marginHorizontal: 15,
  },
  
});

DocumentUploadCell.contextTypes = {
    itemMenuContext:  React.PropTypes.object,
};



module.exports = DocumentUploadCell // connect(mapStateToProps)(DocumentUploadCell)