/**
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @flow
 */
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

var moment = require('moment');
import Icon from 'react-native-vector-icons/MaterialIcons';
import MartialExtendedConf from '../assets/icons/config.json';
import { createIconSetFromFontello } from  'react-native-vector-icons'
import {updateSelectedObject,getDocumentPermissions} from '../actions/documentlists'
import {connect} from 'react-redux'
import {getIconNameFromExtension} from '../utils/documentsUtils'
const KenestoIcon = createIconSetFromFontello(MartialExtendedConf);

//var getStyleFromScore = require('./getStyleFromScore');
var getImageSource = require('./GetImageSource');
//var getTextFromScore = require('./getTextFromScore');

var DocumentCell = React.createClass({

    menuPressed: function (id, familyCode){
      var {dispatch} = this.props; 
   
      dispatch(updateSelectedObject(id, familyCode, ""));
      dispatch(getDocumentPermissions(id, familyCode))
      this.context.itemMenuContext.open();
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
          elementIcon = <KenestoIcon name="safe" style={styles.icon} />
        else
          elementIcon = <KenestoIcon name="folder" style={styles.icon} />
      }
      else {
        // const iconName = this.props.document.IconName == 'word'? 'file-music' : this.props.document.IconName;
        // console.log(getIconNameFromExtension(this.props.document.FileExtension))
        // 
        if (typeof this.props.document.IconName != 'undefined')
          elementIcon = <View style={styles.iconFiletype}><KenestoIcon name={getIconNameFromExtension(this.props.document.FileExtension)} style={styles.icon} /></View>
        else
          elementIcon = <View style={styles.iconFiletype}><KenestoIcon name="description" style={styles.icon} /></View>
      }
    }
      

    return (
      <View>  
        <TouchableElement
          onPress={this.props.onSelect}
          onShowUnderlay={this.props.onHighlight}
          onHideUnderlay={this.props.onUnhighlight}>
          <View style={styles.row}>
            <View style={styles.iconContainer}>
              {elementIcon}
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.documentTitle} numberOfLines={2}>
                {this.props.document.Name}
              </Text>
              <Text style={styles.documentYear} numberOfLines={1}>
                {  "Modified "+ moment(this.props.document.ModificationDate).format('MMM DD, YYYY')}
                
              </Text>
            </View>
            <TouchableElement onPress={ (()=> { this.menuPressed(this.props.document.Id, this.props.document.FamilyCode)}).bind(this) }>
              <View style={styles.iconContainer}>
                <Icon name="more-vert" style={styles.moreMenu} />
              </View>
            </TouchableElement>
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
    marginLeft: 10
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
  }
  
});

DocumentCell.contextTypes = {
    itemMenuContext:  React.PropTypes.object,
};



module.exports = DocumentCell // connect(mapStateToProps)(DocumentCell)