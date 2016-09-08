'use strict';
// var React = require('react');
import React, {Component} from 'react';
import KenestoTagAutocomplete from './KenestoTagAutocomplete';
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
  
  _onChange(){
    
  }
  
  _onUpdateLayout(){
    
  }
  
  _onUpdateTags(){
    
  }
  
  
  render() {
    return (
      <View style={styles.container}>
      
        <KenestoTagAutocomplete
          ref='tagInput'
          suggestions={suggestions}
          containerStyle={styles.autocompleteContainer}
          inputContainerStyle={styles.tagsInputContainer}
          listStyle={styles.newTagSuggestion}
          tagContainer={styles.tagContainer}
          onChange={this._onChange.bind(this)}
          onUpdateLayout={this._onUpdateLayout.bind(this)}
          onUpdateTags={this._onUpdateTags.bind(this)}
          placeholder="ASD"
        />
      </View>
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
  tagsInputContainer: {
    
  },
  newTagSuggestion: {
    backgroundColor: "#cfc",
  },
  
  
});

module.exports = AddPeople;