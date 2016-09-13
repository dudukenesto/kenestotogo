'use strict';
// var React = require('react');
import React, {Component} from 'react';
import KenestoTagAutocomplete from './KenestoTagAutocomplete';
import ViewContainer from '../components/ViewContainer';
var ReactNative = require('react-native');

var {
  View,
  Text,
  // TextInput,
  StyleSheet,
  // TouchableOpacity,
  // Dimensions,
  // TouchableWithoutFeedback
} = ReactNative;
// import Button from './Button'
import ProggressBar from "../components/ProgressBar";
// import _ from 'lodash';
// import TagInput from 'react-native-taginput';

// var HEADER = '#3b5998';
// var BGWASH = 'rgba(255,255,255,0.8)';
// var DISABLED_WASH = 'rgba(255,255,255,0.25)';

var suggestions = [
    '1scott@kenestodemo.com',
    '2lisa@kenestodemo.com',
    '3jeff@kenestodemo.com',
    '4joe@kenestodemo.com',
    '5admin@kenestodemo.com',
    '6asd@asa.sd',
    '7sdf@asa.sd',
    '8ghjkl@asa.sd',
    '9rty@asa.sd',
    '10wer@asa.sd'
    ]
class AddPeople extends Component {
  
  constructor(props) {
    super(props)

        this.state = {
          showSharingList: true
        };
  }
  
  _onChange(){
    
  }
  
  _onUpdateLayout(){
    
  }
  
  _onUpdateTags(){
    
  }
  
  showSharingList(){
    this.setState({showSharingList: true})
  }
  
  hideSharingList(){
    this.setState({showSharingList: false})
  }
  
  formatNewTag(tag){      
    // trim spaces, check for email correct format etc. 
    // If the formatted text is not a correct email - return false
    tag = tag.trim();
    return /\S+@\S+\.\S+/.test(tag) ? tag : false;
  }
  
  onErrorAddNewTag(tag){     // show error message/toast
    var errorMessage = tag + ' is not a valid email!'
    this.refs.mainContainer.showMessage("info", errorMessage);
  }
  
  submitSelectedTags(){
    // VALIDATE TAGS, COMBINE this.state.selected WITH PERMISSIONS AND SEND TO SERVER
  }
  
  render() {
    return (
      <ViewContainer ref="mainContainer">
        <View style={styles.container}>
        
          <KenestoTagAutocomplete
            ref='tagInput'
            suggestions={suggestions}
            containerStyle={styles.autocompleteContainer}
            inputContainerStyle={styles.tagsInputContainer}
            listStyle={styles.listStyle}
            newTagContainerStyle={styles.newTagContainerStyle}
            newTagStyle={styles.newTagStyle}
            rowContainerStyle={styles.rowContainerStyle}
            autocompleteTextStyle={styles.autocompleteTextStyle}
            onChange={this._onChange.bind(this)}
            onUpdateLayout={this._onUpdateLayout.bind(this)}
            onUpdateTags={this._onUpdateTags.bind(this)}
            onHideTagsList={this.showSharingList.bind(this)}
            onShowTagsList={this.hideSharingList.bind(this)}
            onSubmit={this.submitSelectedTags.bind(this)}
            title={"Add Users"}
            minCharsToStartAutocomplete={1}
            allowAddingNewTags={true}
            addNewTagTitle={"Add a new user: "}
            formatNewTag={this.formatNewTag.bind(this)}
            onErrorAddNewTag={this.onErrorAddNewTag.bind(this)}
            // autocompleteField={"email"}
          />
          
          {this.state.showSharingList==true? 
            <View style={{}}>
              <View>
                <Text>Sharing</Text>
              </View>
          
            <View>
              <Text>list of people</Text>
              <Text>list of people</Text>
              <Text>list of people</Text>
            </View>
          </View> : 
          <View style={{}}></View>
          }
        
        </View>      
      </ViewContainer>
      
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
  },
  autocompleteContainer: {
    backgroundColor: "#fff"
  },
  tagsInputContainer: {},
  listStyle: {},
  newTagContainerStyle: {},
  newTagStyle: {},
  rowContainerStyle: {},
  autocompleteTextStyle: {},
});

module.exports = AddPeople;