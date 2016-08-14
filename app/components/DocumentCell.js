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

import Icon from 'react-native-vector-icons/MaterialIcons';

//var getStyleFromScore = require('./getStyleFromScore');
var getImageSource = require('./GetImageSource');
//var getTextFromScore = require('./getTextFromScore');

var DocumentCell = React.createClass({
  render: function() {
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    
    var imageSource = require('../assets/thumbnail_img.png'); 
           
    if (this.props.document.HasThumbnail)
      imageSource ={uri: this.props.document.ThumbnailUrl}
      
      var elementIcon;
      if (this.props.document.FamilyCode == 'FOLDER'){
        elementIcon = <Icon name="folder" style={styles.icon} />
      }
      else {
        elementIcon = <Image source = {imageSource} style={styles.cellImage} />
      }
      function menuPressed(){
        alert('menu pressed...');
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
                Modified blah-blah-blah
              </Text>
            </View>
            <TouchableElement onPress={menuPressed}>
              <View style={styles.iconContainer}>
                <Icon name="more-vert" style={styles.icon} />
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
    marginLeft: 10,
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
  },
  cellImage: {
    height: 55,
    width: 55,
  },
  icon: {
    fontSize: 22,
    color: '#888',    
    
  },
  cellBorder: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: StyleSheet.hairlineWidth,
    marginLeft: 4,
  },
  
});

module.exports = DocumentCell;
