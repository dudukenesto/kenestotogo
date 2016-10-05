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
import * as navActions from '../actions/navActions'
var {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
  Dimensions
} = ReactNative;
var {height, width} = Dimensions.get('window');
var Orientation = require('./KenestoDeviceOrientation');

import ProggressBar from "../components/ProgressBar";

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
      globalPermissions: 'VIEW_ONLY',
      orientation: Orientation.getInitialOrientation()
    };
  }

  componentDidMount() {
    this.orientationListener = Orientation.addOrientationListener(this._orientationDidChange.bind(this));
  }

  componentWillUnmount() {
    this.orientationListener.remove();
    Orientation.removeOrientationListener();
  }

  _orientationDidChange(orientation) {
    this.setState({
      orientation: orientation == 'LANDSCAPE' ? 'LANDSCAPE' : 'PORTRAIT'
    })
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
    //this.refs.mainContainer2.showMessage("info", errorMessage);
    this.props.dispatch(navActions.emitToast("info", "", errorMessage));
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
      <View style={styles.dropDownTriggerTemplateContainer}>
        <View style={styles.dropDownTriggerTemplate}>
          <Icon name={iconName} style={styles.icon} />
          <Icon name="keyboard-arrow-down" style={[styles.icon, styles.iconDown]} />
        </View>
      </View>
    )
  }

  renderOptionTemplate(rowData) {
    return (
      <View style={styles.optionRow}>
        <Icon name={rowData.icon} style={styles.icon} />
        <Text style={styles.optionTitle}>{rowData.title}</Text>
      </View>
    )
  }


  renderCurrentPermissions() {

    

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
      var textWidth = (this.state.orientation == 'PORTRAIT') ? width - 140 : height - 140;
      console.log(this.state.orientation, textWidth, width, height)
      return (
        <View style={styles.sharingRow} key={permission.UserId}>
          <View style={styles.roundIcon}>
            {!permission.ThumbnailPath ? <Icon name={iconName} style={styles.iconMedium} /> : <Image source = {{ uri: uri }} style={styles.thumbnail} />}
          </View>
          <View style={{ maxWidth: textWidth }}>
            <Text key={permission.ParticipantUniqueID} numberOfLines={1}>{permission.Name}</Text>
          </View>
          <DropDownTrigger
            dropDownTriggerTemplate={this.renderPermissionsTrigger.bind(this) }
            dropDownTriggerStyle={styles.dropDownTriggerStyle}
            activeTriggerStyle={styles.activeTriggerStyle}
            optionTemplate={this.renderOptionTemplate.bind(this) }
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
            dropDownTriggerStyle={styles.dropDownGlobalTriggerStyle}
            dropDownTriggerContainer={styles.dropDownTriggerContainer}
            activeTriggerStyle={styles.activeTriggerStyle}
            optionTemplate={this.renderOptionTemplate.bind(this) }

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
  dropDownTriggerStyle: {
    borderColor: "transparent"
  },
  dropDownGlobalTriggerStyle: {
    borderColor: "#ccc"
  },
  dropDownTriggerContainer: {
    position: 'absolute',
    top: 13,
    right: 0,
  },
  activeTriggerStyle: {
    borderColor: "#000"
  },
  dropDownTriggerTemplateContainer: {
    flex: 1,
    alignItems: "center",
  },
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
    alignItems: "center",
    height: 45,
    paddingHorizontal: 12,
  },
  optionTitle: {
    paddingLeft: 8
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
