import React, { Component } from 'react'
import {View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  Dimensions,
  Image,
  ListView,
  TouchableOpacity,
  ActivityIndicatorIOS,
  Platform,
  ActivityIndicator,
  RefreshControl
} from 'react-native'
import {MKButton} from 'react-native-material-kit';
import {  emitToast, clearToast} from '../actions/navActions'

import ProggressBar from "../components/ProgressBar";
import Icon from 'react-native-vector-icons/MaterialIcons'
import { createIconSetFromFontello } from  'react-native-vector-icons'
import fontelloConfig from '../assets/icons/config.json';
import * as constans from '../constants/GlobalConstans'
import Modal from 'react-native-modalbox';
import Button from "react-native-button";
import InteractionManager from 'InteractionManager'

let deviceWidth = Dimensions.get('window').width
let deviceHeight = Dimensions.get('window').height

var dismissKeyboard = require('dismissKeyboard');
var DocumentCell = require('../components/DocumentCell');
const splitChars = '|';



import _ from "lodash";
import {fetchTableIfNeeded, refreshTable} from '../actions/documentlists'
import ViewContainer from '../components/ViewContainer';
import KenestoHelper from '../utils/KenestoHelper';
import ActionButton from 'react-native-action-button';
import * as routes from '../constants/routes'

import {getDocumentsContext, getDocumentsTitle} from '../utils/documentsUtils'

class Documents extends Component {
  constructor(props) {
    super(props)
    this.documentsProps = this.props.data

    this.state = {
      isFetchingTail: false
    }

    this.onEndReached = this.onEndReached.bind(this)
    this.selectItem = this.selectItem.bind(this)
    this._onRefresh = this._onRefresh.bind(this)
    // this._onSort = this._onSort.bind(this)
  }


  getSortByName(sortBy) {
    switch (sortBy) {
      case constans.ASSET_NAME:
        return "Name"
      case constans.MODIFICATION_DATE:
        return "Modification Date"
      default:
        return "";
    }
  }


  componentWillMount() {
    const {dispatch} = this.props
    console.log("documents componentWillMount")
    dispatch(fetchTableIfNeeded())
  }


  componentDidUpdate() {
    this._showStatusBar()
  }

  onEndReached() {
    const {dispatch} = this.props
    console.log("documents onEndReached")
    dispatch(fetchTableIfNeeded())
  }


  selectItem(document) {
    const {dispatch, navReducer} = this.props
    var documentlist = getDocumentsContext(navReducer);
    if (document.FamilyCode == 'FOLDER') {
      var newId;
      var newName = document.Name;
      var fId = document.Id;
      if (documentlist.catId.indexOf(splitChars) >= 0) {
        var dtlStr = documentlist.catId.split(splitChars);
        var newId = `${dtlStr[0]}${splitChars}${document.Id}`//i.e all_docuemnts|{folderID}
      }
      else {
        var newId = `${documentlist.catId}${splitChars}${document.Id}`
      }

      var data = {
        key: "documents|" + fId,
        name: newName,
        catId: newId,
        fId: fId,
        sortDirection: constans.ASCENDING,
        sortBy: constans.ASSET_NAME,
        isVault:document.IsVault
      }
      this.props._handleNavigate(routes.documentsRoute(data));

    }
    else {
      var data = {
        key: "document",
        name: document.Name,
        documentId: document.Id,
        catId: documentlist.catId,
        fId: documentlist.fId,
        viewerUrl: document.ViewerUrl, 
        isExternalLink : document.IsExternalLink,
        isVault:document.IsVault,

        env: this.props.env
      }
      this.props._handleNavigate(routes.documentRoute(data));

    }

  }

  onSearchChange(event) {
    var filter = event.nativeEvent.text.toLowerCase();

    this.clearTimeout(this.timeoutID);
    this.timeoutID = this.setTimeout(() => this.searchDocuments(filter), 100);
  }

  renderSeparator(
    sectionID,
    rowID,
    adjacentRowHighlighted
  ) {
    var style = styles.rowSeparator;
    if (adjacentRowHighlighted) {
      style = [style, styles.rowSeparatorHide];
    }
    return (
      <View key={'SEP_' + sectionID + '_' + rowID}  style={style}/>
    );
  }



  _onRefresh(type, message) {
    const {dispatch, navReducer} = this.props
    var documentlist = getDocumentsContext(navReducer);
    dispatch(refreshTable(documentlist))
  }

  // _onSort(sortDirection, sortBy) {
  //   const {dispatch} = this.props
  //   var documentlist = getDocumentsContext(this.props);
  //   documentlist.sortDirection = sortDirection;
  //   documentlist.sortBy;
  //   dispatch(refreshTable(documentlist));
  // }

  _renderSectionHeader(sectionData, sectionID) {

    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>{sectionData}</Text>
      </View>
    )
  }

  _showStatusBar() {
    const {documentlists, navReducer} = this.props
    var documentlist = getDocumentsContext(navReducer);
    const hasError = documentlist.catId in documentlists ? documentlists[documentlist.catId].hasError : false;
    const errorMessage = documentlist.catId in documentlists ? documentlists[documentlist.catId].errorMessage : "";
    if (hasError && this.refs.masterView != undefined) {
      //this.refs.masterView.showMessage("success", errorMessage);
      this.props.dispatch(emitToast("error", "", "Error loading documents list"));
      this.peops.dispatch(clearToast());
    }
  }


  openModal() {
    //this.refs.modal3.open();
    this.context.plusMenuContext.open();
  }


  _renderTableContent(dataSource, isFetching) {
    const {documentlists, navReducer} = this.props
    var documentlist = getDocumentsContext(navReducer);
    const itemsLength = documentlist.catId in documentlists ? documentlists[documentlist.catId].items.length : 0;

    if (itemsLength == 0) {

        return (<NoDocuments
          filter={this.state.filter}
          isFetching={isFetching}
          onRefresh={this._onRefresh.bind(this) }
          documentlist={documentlist}/>)
    }
    else {
      return (
        <ScrollView>
        <ListView
          ref="listview"
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={this._onRefresh.bind(this) }
              />
          }
          enableEmptySections={true}
          renderSeparator={this.renderSeparator}
          dataSource={dataSource}
          renderSectionHeader={this._renderSectionHeader.bind(this) }
          renderRow={(document, sectionID, rowID, highlightRowFunc) => {
            return (<DocumentCell
              key={document.Id}
              onSelect={this.selectItem.bind(this, document) }
              //onHighlight={this.highlightRowFunc(sectionID, rowID)}
              //onUnhighlight={this.highlightRowFunc(null, null)}
              dispatch = {this.props.dispatch}
              document={document}/>
            )
          } }
          onEndReached={this.onEndReached}
          automaticallyAdjustContentInsets={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps={true}
          showsVerticalScrollIndicator={false}
          />
          <View style={{backgroundColor: '#F5F6F8', height: 100}}></View>
          </ScrollView>
      )
    }
  }

  render() {

    const {dispatch, documentlists, navReducer } = this.props
    const CustomButton = new MKButton.coloredFab()
      .withBackgroundColor('#FF811B')
      // .withShadowRadius(2)
      // .withShadowOffset({ width: 0, height: 2 })
      // .withShadowOpacity(.7)
      // .withShadowColor('black')
      .withOnPress(() => {
        this.openModal();
      })
      .withTextStyle({
        color: 'white',
        fontSize: 28
      })
      .withStyle({
        position: "absolute",
        right: 20,
        bottom: 20,
        width: 60,
        height: 60,
      })
      .withText('+')
      .build();

    //var currRoute = navReducer.routes[navReducer.index];
    var documentlist = getDocumentsContext(navReducer);
    // console.log("render documents page: " +JSON.stringify(documentlist))
    //const isFetching = documentlist.catId in documentlists ? documentlists[documentlist.catId].isFetching : false
    const isFetching = documentlists.isFetching;
    var additionalStyle = {};
    let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    let dataSource = documentlist.catId in documentlists ? documentlists[documentlist.catId].dataSource : ds.cloneWithRows([])
    let showCustomButton = documentlist.catId == constans.SEARCH_DOCUMENTS ? false : true
    return (

      <ViewContainer ref="masterView" style={[styles.container, additionalStyle]}>
        <View style={styles.separator} elevation={5}/>

        {this._renderTableContent(dataSource, isFetching) }
        {showCustomButton? <CustomButton /> : <View></View>}
       
      </ViewContainer>
    )
  }

}


var NoDocuments = React.createClass({
  render: function () {
    var text = 'No documents found';
    if (this.props.isFetching) {
      return (
        <View style={[styles.container, styles.centerText]}>
          <View style={styles.textContainer}>
            <Text>Please wait...</Text>
            <ProggressBar isLoading={true} />
          </View>
        </View>)
    }
    else {
       if(this.props.documentlist.catId == constans.SEARCH_DOCUMENTS)
       {
        return (
            <View style={[styles.container, styles.centerText]}>
              <View style={styles.textContainer}>
                <Text style={styles.noDocumentsText}>{text}</Text>
              </View>
            </View>
          );
       }
       else
       {
          return (
            <View style={[styles.container, styles.centerText]}>
              <View style={styles.textContainer}>
                <Text style={styles.noDocumentsText}>{text}</Text>
              </View>
              <View style={styles.buttonContainer}>
                <Button onPress={this.props.onRefresh} containerStyle={styles.singleBtnContainer} style={styles.button}>Refresh</Button>
              </View>
            </View>
          );
       }
      
    }
  }
});




var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  buttonContainer: {
    flex: 1,
  },
  centerText: {
    alignItems: 'center',
  },
  noDocumentsText: {
    color: '#888888',
    fontSize: 16
  },
  separator: {
    height: 1,
    backgroundColor: '#eeeeee',
  },
  rowSeparator: {
    backgroundColor: "#eee",
    height: 1,
  },
  rowSeparatorHide: {
    opacity: 0.0,
  },
  actionButtonIcon: {
    fontSize: 24,
    height: 22,
    color: 'white',
  },
  arrowButtonIcon: {
    fontSize: 20,
    height: 22,
    color: '#2f2f2f',
  },
  sectionHeader: {
    padding: 15,
    paddingLeft: 20,
    backgroundColor: '#F5F6F8',
    alignSelf: 'stretch',
  },
  sortContainer: {
    padding: 0,
    backgroundColor: '#eeeeee',
    flex: 0,
    flexDirection: "row-reverse",
  },
  sectionLabel: {
    color: '#2f2f2f',
    textAlign: 'left'
  },
  singleBtnContainer: {
    width: 140,
    marginTop: 15,
    justifyContent: "center",
    height: 50,
    backgroundColor: "#F5F6F8",
    borderWidth: 0.5,
    borderColor: "#BEBDBD"
  },
  button: {
    color: "#666666",
    fontWeight: "normal",
    fontSize: 18,
  }
});

Documents.contextTypes = {
  plusMenuContext: React.PropTypes.object
};

export default Documents