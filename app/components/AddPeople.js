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
  ScrollView,
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
    '10wer@asa.sd',
    '11wer@zxa.sd',
    '12wer@zxa.sd'
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
  
  
  // EXAMPLE OF CUSTOM AUTOCOMPLETE ROW TEMPLATE. rowData INCLUDES ALL FIELDS.
  // 
  // getAutocompleteRowTemplate(searchedtext, rowData) {
  //   return (
  //     <View>
  //       <Text>ASD</Text>
  //       {searchedtext}
  //     </View>
  //   )
  // }
  
  // EXAMPLE OF CUSTOM TAG TEMPLATE
  // 
  // getTagTemplate(tag, removeTag){
  //   return (
  //     <View>
  //       <Icon name="account-circle" />
  //       <Text>{tag}</Text>
  //       <Icon name="close" onPress={removeTag.bind(this, tag) } />
  //     </View>
  //   )
  // } 
  
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
            tagContainerStyle={styles.tagContainerStyle}
            onChange={this._onChange.bind(this) }
            onUpdateLayout={this._onUpdateLayout.bind(this) }
            onUpdateTags={this._onUpdateTags.bind(this) }
            onHideTagsList={this.showSharingList.bind(this) }
            onShowTagsList={this.hideSharingList.bind(this) }
            onSubmit={this.submitSelectedTags.bind(this) }
            title={"Add Users"}
            minCharsToStartAutocomplete={1}
            allowAddingNewTags={true}
            addNewTagTitle={"Add a new user: "}
            formatNewTag={this.formatNewTag.bind(this) }
            onErrorAddNewTag={this.onErrorAddNewTag.bind(this) }
            // autocompleteRowTemplate={this.getAutocompleteRowTemplate.bind(this)}
            // tagTemplate={this.getTagTemplate.bind(this)}
            // autocompleteField={"email"}
            />

          {this.state.showSharingList == true ?
            <ScrollView keyboardShouldPersistTaps={true} showsVerticalScrollIndicator={false}>
              <View style={{ flex: 1 }}>
                <View>
                  <Text>Sharing</Text>
                </View>

                <View>
                  <Text>1 list of people</Text>
                  <Text>list of people</Text>
                  <Text>list of people</Text>
                  <Text>list of people</Text>
                  <Text>5 list of people</Text>
                  <Text>list of people</Text>
                  <Text>list of people</Text>
                  <Text>list of people</Text>
                  <Text>list of people</Text>
                  <Text>10 list of people</Text>
                  <Text>list of people</Text>
                  <Text>list of people</Text>
                  <Text>list of people</Text>
                  <Text>list of people</Text>
                  <Text>15 list of people</Text>
                  <Text>list of people</Text>
                  <Text>list of people</Text>
                  <Text>list of people</Text>
                  <Text>list of people</Text>
                  <Text>20 list of people</Text>
                  <Text>list of people</Text>
                  <Text>list of people</Text>
                  <Text>list of people</Text>
                  <Text>24 list of people</Text>
                </View>
              </View>
            </ScrollView>
            :
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
    backgroundColor: '#fff',   
  },
  autocompleteContainer: {

  },
  tagsInputContainer: {},
  listStyle: {},
  newTagContainerStyle: {},
  newTagStyle: {},
  rowContainerStyle: {},
  autocompleteTextStyle: {},
  tagContainerStyle: {},
});

module.exports = AddPeople;