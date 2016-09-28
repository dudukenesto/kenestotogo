'use strict';
// var React = require('react');
import React, {Component} from 'react';
import KenestoTagAutocomplete from './KenestoTagAutocomplete';
import DropDownTrigger from './DropDownTrigger';
import ViewContainer from '../components/ViewContainer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux'
import * as peopleAcions from '../actions/peopleActions'
import {getSelectedDocument} from '../utils/documentsUtils';
import ProgressBar from './ProgressBar'
var ReactNative = require('react-native');

var {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback
} = ReactNative;

import ProggressBar from "../components/ProgressBar";


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
  },
  {
    id: 16,
    fullName: 'group A',
    email: 'group A',
    type: 'internal',
    permissions: 'download',
    url: ''
  },
  {
    id: 17,
    fullName: 'group B',
    email: 'group B',
    type: 'internal',
    permissions: 'download',
    url: ''
  }
]

class AddPeople extends Component {
  
  constructor(props) {
    super(props)

        this.state = {
          showSharingList: true,
          showPermissionsPopup: false
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
    this.refs.mainContainer2.showMessage("info", errorMessage);
  }
  
  submitSelectedTags(){
    // VALIDATE TAGS, COMBINE this.state.selected WITH PERMISSIONS AND SEND TO SERVER
  }

  componentWillMount(){
  //  alert(JSON.stringify(this.props.navReducer));
       var document = getSelectedDocument(this.props.documentlists, this.props.navReducer); 
        this.setState({ document: document});

        this.props.dispatch(peopleAcions.RequestShareObjectInfo(document.Id, document.FamilyCode, document.Name));
//alert(document)
     // alert('document = ' + document.Name)
   //  alert(this.props.UsersAndGroups)

     
    }

  
  // EXAMPLE OF CUSTOM AUTOCOMPLETE ROW TEMPLATE. rowData INCLUDES ALL FIELDS.
  // 
  getAutocompleteRowTemplate(searchedtext, rowData) {
    return (
      <View style={{flexDirection: "row"}}>
        {searchedtext}
        <Text> - {rowData.type}</Text>        
      </View>
    )
  }
  
  // EXAMPLE OF CUSTOM TAG TEMPLATE
  // 
  getTagTemplate(tag, removeTag){
    return (
      <View>
        <Icon name="account-circle" />
        <Text>{tag.tagName}</Text>
        <Icon name="close" onPress={removeTag.bind(this, tag) } />
      </View>
    )
  } 
  
  renderTrigger(){
    return (
      <View style={styles.dropDownTriggerTemplate}>
        <Icon name="remove-red-eye" style={styles.icon} />
        <Icon name="keyboard-arrow-down" style={styles.icon} />
      </View>
    )
  }
  

  renderCurrentPermissions(){

 // alert('this.props.ObjectInfo.UsersPermissions = ' + this.props.ObjectInfo.UsersPermissions[0].Name)

     var permissions = this.props.ObjectInfo.UsersPermissions.map(function(permission){
    
                return (

                <Text key={permission.ParticipantUniqueID}>{permission.Name}</Text>
    
          );
            });

return permissions
  
  }
  
  
  render() {    

   
    if (this.props.isFetching)
    {
      return (<View style={styles.creatingFolder}>
                        <ProgressBar isLoading={true}/>
                    </View>
          )
    }

    return (
      <ViewContainer ref="mainContainer">
        <View style={styles.container}>
          <KenestoTagAutocomplete
            ref='tagInput'
            suggestions={this.props.UsersAndGroups}
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
            autocompleteRowTemplate={this.getAutocompleteRowTemplate.bind(this) }
            // tagTemplate={this.getTagTemplate.bind(this)}
            autocompleteField={"Name"}
            uniqueField={"ParticipantUniqueID"}
            />

          
          <DropDownTrigger
            dropDownTriggerTemplate={this.renderTrigger.bind(this)}
            dropDownTriggerStyle={styles.dropDownTriggerStyle}   
            aligningOptionsWithTrigger={"right"}
            openingDirection={"down"}        
            />

          {this.state.showSharingList == true ?
            <ScrollView keyboardShouldPersistTaps={true} showsVerticalScrollIndicator={false}>
              <View style={{ flex: 1 }}>
                <View style={styles.sharingTitleContainer}>
                  <Text style={styles.sharingTitle}>Sharing</Text>
                </View>

                <View>
                              {this.renderCurrentPermissions.bind(this)()}
        
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
  sharingTitleContainer: {
    height: 45,
    backgroundColor: '#F5F6F8',
    justifyContent: 'center',
    paddingLeft: 25
  },
  sharingTitle: {
    fontWeight: '400',
    color: '#000',
  },
  icon: {
    fontSize: 15,
    color: '#333'
  },
  dropDownTriggerStyle: {marginTop:450, zIndex:100},
  dropDownTriggerTemplate: {
    flex: 1,
    flexDirection: "row"
  },
  
});



function mapStateToProps(state) {
 
  const { peopleReducer, documentlists ,navReducer  } = state


  return {
isFetching: peopleReducer.isFetching,
documentlists, 
navReducer, 
ObjectInfo:  peopleReducer.ObjectInfo, 
UsersAndGroups:  peopleReducer.UsersAndGroups
    
  }
}

export default connect(mapStateToProps)(AddPeople)
