import React, { Component } from 'react'
import {View,
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

const KenestoIcon = createIconSetFromFontello(fontelloConfig);

import _ from "lodash";
import {fetchTableIfNeeded, refreshTable} from '../actions/documentlists'
import ViewContainer from '../components/ViewContainer';
import KenestoHelper from '../utils/KenestoHelper';
import ActionButton from 'react-native-action-button';
import * as routes from '../constants/routes'
import {getDocumentsContext} from '../utils/documentsUtils'

// const Documents = ({_goBack}) => (
//   <View style={styles.container}>
//     <Text style={styles.title}>Documents page</Text>
//     <Button onPress={_goBack} label='Go Back' />
//   </View>
// )

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
    this._onSort = this._onSort.bind(this)
  }

  getCategoryName(categoryType) {
    switch (categoryType) {
      case constans.ALL_DOCUMENTS:
        return "All Documents"
      default:
        return "";
    }
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
  getBaseCatId(categoryType) {
    switch (categoryType) {
      case constans.ALL_DOCUMENTS:
        return "All Documents"
      default:
        return "";
    }
  }

  componentWillMount() {
    const {dispatch} = this.props
    dispatch(fetchTableIfNeeded())
  }



  componentDidUpdate() {
    this._showStatusBar()
  }
  onEndReached() {
    const {dispatch} = this.props
    dispatch(fetchTableIfNeeded())
  }


  selectItem(document) {
    const {dispatch} = this.props
    var documentlist = getDocumentsContext(this.props);
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
        key : "documents|"+fId,
        name: newName,
        catId: newId,
        fId: fId,
        sortDirection: constans.ASCENDING,
        sortBy: constans.ASSET_NAME
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
        viewerUrl: document.ViewerUrl
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
    const {dispatch} = this.props
    var documentlist = getDocumentsContext(this.props);
    dispatch(refreshTable(documentlist))
  }

  _onSort(sortDirection, sortBy) {
    const {dispatch} = this.props
    var documentlist = getDocumentsContext(this.props);
    documentlist.sortDirection = sortDirection;
    documentlist.sortBy;
    dispatch(refreshTable(documentlist));
  }

  _renderSectionHeader(sectionData, sectionID) {
   
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>{sectionData}</Text>
      </View>
    )
  }

  _showStatusBar() {
    const {documentlists} = this.props
    var documentlist = getDocumentsContext(this.props);
    const hasError = documentlist.catId in documentlists ? documentlists[documentlist.catId].hasError : false;
    const errorMessage = documentlist.catId in documentlists ? documentlists[documentlist.catId].errorMessage : "";

    if (hasError && this.refs.masterView != undefined) {
      this.refs.masterView.showMessage("error", errorMessage);
    }
  }

  openModal(){
  //this.refs.modal3.open();
  this.context.kModal.open();
}


  _renderTableContent(dataSource, isFetching) {
    const {documentlists} = this.props
    var documentlist = getDocumentsContext(this.props);
    const itemsLength = documentlist.catId in documentlists ? documentlists[documentlist.catId].items.length : 0;

    if (itemsLength == 0) {
      return (<NoDocuments
        filter={this.state.filter}
        isFetching={isFetching}
        onRefresh={this._onRefresh.bind(this) }
        />)
    }
    else {
      return (
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
              document={document}/>
            )
          } }
          onEndReached={this.onEndReached}
          automaticallyAdjustContentInsets={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps={true}
          showsVerticalScrollIndicator={false}
          />
      )
    }
  }

  render() {
    console.log("render")
    const {dispatch, documentlists,navReducer } = this.props
    var currRoute = navReducer.routes[navReducer.index];
    var documentlist = getDocumentsContext(this.props);
    const isFetching = documentlist.catId in documentlists ? documentlists[documentlist.catId].isFetching : false
    var additionalStyle = {};
    let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    let dataSource = documentlist.catId in documentlists ? documentlists[documentlist.catId].dataSource : ds.cloneWithRows([])
    return (

      <ViewContainer ref="masterView" style={[styles.container, additionalStyle]}>
        <View style={styles.separator} />

        {this._renderTableContent(dataSource, isFetching) }
        <ActionButton buttonColor="rgba(231,76,60,1)" onPress={() => this.openModal()}>
        </ActionButton>
      </ViewContainer>
    )
  }
}



var NoDocuments = React.createClass({
  render: function () {
    var text = 'No documents found';
    if (this.props.isFetching) {
      return false;
    }

    return (
      <View style={[styles.container, styles.centerText]}>
        <Text style={styles.noDocumentsText}>{text}</Text>
        <Button onPress={this.props.onRefresh}>refresh</Button>
      </View>
    );
  }
});




var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  centerText: {
    alignItems: 'center',
  },
  noDocumentsText: {
    marginTop: 80,
    color: '#888888',
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
    fontSize: 20,
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
    
// TO REMOVE!!!
    // height: 0
  },
  sectionLabel: {
    color: '#2f2f2f',
    textAlign: 'left'
  },
});

Documents.contextTypes = {
    kModal:  React.PropTypes.object
};


export default Documents