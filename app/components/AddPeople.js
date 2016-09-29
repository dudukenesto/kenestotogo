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
  TouchableWithoutFeedback,
  Image
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

var globalOptions = [
  {
    icon: "remove-red-eye",
    title: "View only"
  },
  {
    icon: "file-download",
    title: "Download"
  },
  {
    icon: "update",
    title: "Update"
  }
];

var userOptions = [
  {
    icon: "remove-red-eye",
    title: "View only"
  },
  {
    icon: "file-download",
    title: "Download"
  },
  {
    icon: "update",
    title: "Update"
  },
  {
    icon: "not-interested",
    title: "Delete share"
  }
]

class AddPeople extends Component {

  constructor(props) {
    super(props)

    this.state = {
      showSharingList: true,
      globalPermissions: 'VIEW_ONLY'
    };
  }

  _onChange() {

  }

  _onUpdateLayout() {

  }

  _onUpdateTags() {

  }

  showSharingList() {
    this.setState({ showSharingList: true })
  }

  hideSharingList() {
    this.setState({ showSharingList: false })
  }

  formatNewTag(tag) {
    // trim spaces, check for email correct format etc. 
    // If the formatted text is not a correct email - return false
    tag = tag.trim();
    return /\S+@\S+\.\S+/.test(tag) ? tag : false;
  }

  onErrorAddNewTag(tag) {     // show error message/toast
    var errorMessage = tag + ' is not a valid email!'
    this.refs.mainContainer2.showMessage("info", errorMessage);
  }

  submitSelectedTags() {
    // VALIDATE TAGS, COMBINE this.state.selected WITH PERMISSIONS AND SEND TO SERVER
  }

  componentWillMount() {
    //  alert(JSON.stringify(this.props.navReducer));
    var document = getSelectedDocument(this.props.documentlists, this.props.navReducer);
    this.setState({ document: document });

    this.props.dispatch(peopleAcions.RequestShareObjectInfo(document.Id, document.FamilyCode, document.Name));
    //alert(document)
    // alert('document = ' + document.Name)
    //  alert(this.props.UsersAndGroups)


  }

  // EXAMPLE OF CUSTOM AUTOCOMPLETE ROW TEMPLATE. rowData INCLUDES ALL FIELDS.
  // 
  getAutocompleteRowTemplate(searchedtext, rowData) {
    return (
      <View style={{ flexDirection: "row" }}>
        {searchedtext}
      </View>
    )
  }

  // EXAMPLE OF CUSTOM TAG TEMPLATE
  // 
  getTagTemplate(tag, removeTag) {
    return (
      <View>
        <Icon name="account-circle" />
        <Text>{tag.tagName}</Text>
        <Icon name="close" onPress={removeTag.bind(this, tag) } />
      </View>
    )
  }

  renderPermissionsTrigger(selected) {

    if (!selected) {
      selected = "VIEW_ONLY";
    }
    var iconName;
    switch (selected) {
      case "VIEW_ONLY":
        iconName = "remove-red-eye";
        break;
      case "ALLOW_DOWNLOAD":
        iconName = "file-download";
        break;
      case "ALLOW_UPDATE_VERSIONS":
        iconName = "update";
        break;
    }
    return (
      <View style={styles.dropDownTriggerTemplate}>
        <Icon name={iconName} style={styles.icon} />
        <Icon name="keyboard-arrow-down" style={[styles.icon, styles.iconDown]} />
      </View>
    )
  }
  
  renderOptionTemplate(rowData){
    return(
      <View style={styles.optionRow}>
        <Icon name={rowData.icon} />
        <Text>{rowData.title}</Text>
      </View>
    )
  }


  renderCurrentPermissions() {

    console.log('\n\n\n\n\n\n ================== MY LOG START ==================  \n\n\n\n\n\n')

    var permissions = this.props.ObjectInfo.UsersPermissions.map(function (permission) {
      
      var iconName;
      var uri = 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Poster-sized_portrait_of_Barack_Obama.jpg'
      if (!permission.ThumbnailPath) {
        if (permission.IsGroup) {
          iconName = 'group';
        }
        else {
          iconName = permission.IsExternal ? 'person-outline' : 'person'
        }
      }

      return (
        <View style={styles.sharingRow} key={permission.UserId}>
          <View style={styles.roundIcon}>
            {!permission.ThumbnailPath ? <Icon name={iconName} style={styles.iconMedium} /> : <Image source = {{ uri: uri }} style={styles.thumbnail} />}
          </View>
          <Text key={permission.ParticipantUniqueID}>{permission.Name}</Text>

          <DropDownTrigger
            dropDownTriggerTemplate={this.renderPermissionsTrigger.bind(this) }
            dropDownTriggerStyle={styles.dropDownTriggerStyle}
            optionTemplate={this.renderOptionTemplate.bind(this)}
            options={userOptions}
            aligningOptionsWithTrigger={"right"}
            openingDirection={"down"}
            selected={permission.PermissionType}
            
            />
        </View>

      );
    }, this);

    return permissions

  }

  render() {

    if (this.props.isFetching) {
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
            dropDownTriggerTemplate={this.renderPermissionsTrigger.bind(this) }
            dropDownTriggerStyle={styles.dropDownTriggerStyle}
            optionTemplate={this.renderOptionTemplate.bind(this)}
            
            options={globalOptions}
            aligningOptionsWithTrigger={"right"}
            openingDirection={"down"}
            selected={this.state.globalPermissions}
            
            />

          {this.state.showSharingList == true ?
            <ScrollView keyboardShouldPersistTaps={true} showsVerticalScrollIndicator={false}>
              <View style={{ flex: 1 }}>
                <View style={styles.sharingTitleContainer}>
                  <Text style={styles.sharingTitle}>Sharing</Text>
                </View>

                <View>
                  {this.renderCurrentPermissions.bind(this)() }
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
    color: '#333',
    paddingLeft: 3,
    paddingRight: 3
  },
  iconDown: {
    fontSize: 18, 
    paddingRight: 0,
  },
  iconMedium: {
    fontSize: 22,
    color: "#999",
    borderWidth: 1,
    marginLeft: 2
  },
  roundIcon: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 7,
    overflow: "hidden"
  },
  dropDownTriggerStyle: {},
  dropDownTriggerTemplate: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  sharingRow: {
    flexDirection: "row",
    height: 50,
    alignItems: "center",
    marginLeft: 30,
  },
  thumbnail: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  optionRow: {
    flexDirection: "row",
    
  },


});

function mapStateToProps(state) {

  const { peopleReducer, documentlists, navReducer  } = state


  return {
    isFetching: peopleReducer.isFetching,
    documentlists,
    navReducer,
    ObjectInfo: peopleReducer.ObjectInfo,
    UsersAndGroups: peopleReducer.UsersAndGroups
  }
}

export default connect(mapStateToProps)(AddPeople)
