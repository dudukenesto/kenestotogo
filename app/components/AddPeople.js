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
  {
    id: 1,
    fullName: 'Scott Supplier',
    email: 'scott@kenestodemo.com',
    type: 'internal',
    permissions: 'all',
    url: ''
  },
  {
    id: 2,
    fullName: 'Lisa Supplier',
    email: 'lisa@kenestodemo.com',
    type: 'internal',
    permissions: 'all',
    url: ''
  },
  {
    id: 3,
    fullName: 'Jeff Supplier',
    email: 'jeff@kenestodemo.com',
    type: 'internal',
    permissions: 'all',
    url: ''
  },
  {
    id: 4,
    fullName: 'Joe Supplier',
    email: 'joe@kenestodemo.com',
    type: 'internal',
    permissions: 'all',
    url: ''
  },
  {
    id: 5,
    fullName: 'Mary Brown',
    email: 'mary@abc.com',
    type: 'external',
    permissions: 'view',
    url: ''
  },
  {
    id: 6,
    fullName: 'John Smith',
    email: 'john@abc.com',
    type: 'external',
    permissions: 'view',
    url: ''
  },
  {
    id: 7,
    fullName: 'Harry Potter',
    email: 'harrysukapotter@magic.com',
    type: 'external',
    permissions: 'view',
    url: ''
  },
  {
    id: 8,
    fullName: 'Hermiona',
    email: 'hermiona@magic.com',
    type: 'external',
    permissions: 'download',
    url: ''
  },
  {
    id: 9,
    fullName: 'dr. House',
    email: 'house@medicalcenter.com',
    type: 'external',
    permissions: 'download',
    url: ''
  },
  {
    id: 10,
    fullName: 'Ra',
    email: 'ra@god.com',
    type: 'multitenant',
    permissions: 'all',
    url: ''
  },
  {
    id: 11,
    fullName: 'Gandalf The Grey',
    email: 'gandalf@middleearth.com',
    type: 'multitenant',
    permissions: 'all',
    url: ''
  },
  {
    id: 12,
    fullName: 'Daenerys of the House Targaryen, also known as Daenerys Stormborn and the Dragon Queen',
    email: 'khalissy@vesteros.com',
    type: 'external',
    permissions: 'download',
    url: ''
  },
  {
    id: 14,
    fullName: 'Hodor',
    email: 'hodor@hodorhodor.com',
    type: 'external',
    permissions: 'view',
    url: ''
  },
  {
    id: 15,
    fullName: 'Asya Polyak',
    email: 'asya@polyak.com',
    type: 'multitenant',
    permissions: 'burn them all',
    url: ''
  }
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
  getAutocompleteRowTemplate(searchedtext, rowData) {
    return (
      <View style={{flexDirection: "row"}}>
        {searchedtext}
        <Text> - {rowData.fullName}</Text>        
      </View>
    )
  }
  
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
            autocompleteRowTemplate={this.getAutocompleteRowTemplate.bind(this)}
            // tagTemplate={this.getTagTemplate.bind(this)}
            autocompleteField={"email"}
            filteringUniqueField={"email"}
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