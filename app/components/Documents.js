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
import {fetchTableIfNeeded, refreshTable, changeTable} from '../actions/documentlists'
import {updateDocumentList} from '../actions/documentlist'
import ViewContainer from '../components/ViewContainer';
import KenestoHelper from '../utils/KenestoHelper';
import ActionButton from 'react-native-action-button';
import * as routes from '../constants/routes'


// const Documents = ({_goBack}) => (
//   <View style={styles.container}>
//     <Text style={styles.title}>Documents page</Text>
//     <Button onPress={_goBack} label='Go Back' />
//   </View>
// )

class Documents extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isFetchingTail: false
    }
    this.foldersTrail = [];
    this.onEndReached = this.onEndReached.bind(this)
    this.selectItem = this.selectItem.bind(this)
    this._onRefresh = this._onRefresh.bind(this)
    this._onGoBack = this._onGoBack.bind(this)
    this._onSort = this._onSort.bind(this)
    this._onChangeVisibleRows = this._onChangeVisibleRows.bind(this)
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
    const {dispatch, documentlist} = this.props
    dispatch(fetchTableIfNeeded(documentlist))
  }

  componentWillReceiveProps(nextProps) {
    const {dispatch, documentlist, documentlists} = this.props
    if (documentlist.catId !== nextProps.documentlist.catId) {
      //dispatch(changeTable(nextProps.documentlist));
    }
  }

  componentDidUpdate() {
    this._showStatusBar()
  }
  onEndReached() {
    const {dispatch, documentlist} = this.props
    dispatch(fetchTableIfNeeded(documentlist))
  }


  selectItem(document) {
    const {dispatch, documentlist} = this.props

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


      var folderT = new Object();
      folderT.catId = newId;
      folderT.name = newName;
      folderT.fId = fId;
      this.foldersTrail.push(folderT);

      dispatch(updateDocumentList(newId, newName, fId, documentlist.sortDirection, documentlist.sortBy))
      var nextDocumentlist = {
        name: newName,
        catId: newId,
        fId: fId,
        sortDirection: constans.ASCENDING,
        sortBy: constans.ASSET_NAME
      }
      dispatch(changeTable(nextDocumentlist));
    }
    else {

      var data = {
        title: document.Name,
        id: document.Id,
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



  _onGoBack() {
    const {dispatch, documentlist, documentlists} = this.props
    var baseCatId;
    if (documentlist.catId.indexOf(splitChars) >= 0) {
      var dtlStr = documentlist.catId.split(splitChars);
      var baseCatId = dtlStr[0];
    }
    else {
      baseCatId = documentlist.catId;
    }

    this.foldersTrail.pop();

    var catId = this.foldersTrail.length > 0 ? this.foldersTrail[this.foldersTrail.length - 1].catId : baseCatId;
    var name = this.foldersTrail.length > 0 ? this.foldersTrail[this.foldersTrail.length - 1].name : this.getCategoryName(baseCatId);
    var fid = this.foldersTrail.length > 0 ? this.foldersTrail[this.foldersTrail.length - 1].fId : "";


    var nextDocumentlist = {
      name: name,
      catId: catId,
      fId: fid,
      sortDirection: documentlist.sortDirection,
      sortBy: documentlist.sortBy
    }

    dispatch(updateDocumentList(catId, name, fid, documentlist.sortDirection, documentlist.sortBy))

    //dispatch(changeTable(nextDocumentlist));
  }

  _onRefresh(type, message) {
    const {dispatch, documentlist} = this.props
    dispatch(refreshTable(documentlist))
  }

  _onSort(sortDirection, sortBy) {
    const {dispatch, documentlist} = this.props

    documentlist.sortDirection = sortDirection;
    documentlist.sortBy;
    //dispatch(updateDocumentList(documentlist.catId, documentlist.name, documentlist.fid, sortDirection, sortBy))
    dispatch(refreshTable(documentlist));
  }

  _onChangeVisibleRows(visibleRows, changedRows) {
    console.log("visibleRows: " + JSON.stringify(visibleRows))
    console.log("changedRows: " + JSON.stringify(changedRows))
  }
  
  _renderSortBar() {
    const {dispatch, documentlist, documentlists} = this.props

    const sortBy = constans.ASSET_NAME;
    const sortDirection = documentlist.sortDirection == null || documentlist.sortDirection == "" ? constans.ASCENDING : documentlist.sortDirection;
    const isFetching = documentlist.catId in documentlists ? documentlists[documentlist.catId].isFetching : false;
    const hasError = documentlist.catId in documentlists ? documentlists[documentlist.catId].hasError : false;
    const errorMessage = documentlist.catId in documentlists ? documentlists[documentlist.catId].errorMessage : "";

    const showBreadCrums = this.foldersTrail.length > 0 ? true : false;
    var parentName = this.foldersTrail.length > 1 ? this.foldersTrail[this.foldersTrail.length - 1].name : this.getCategoryName(constans.ALL_DOCUMENTS);

    return (
      <View style={styles.sortContainer}>

        {
          (sortDirection == constans.ASCENDING)
            ? (
              <Icon name="arrow-downward" style={styles.arrowButtonIcon} onPress= {() => this._onSort(constans.DESCENDING, sortBy) }/>
            ) :
            (
              <Icon name="arrow-upward" style={styles.arrowButtonIcon} onPress= {() => this._onSort(constans.ASCENDING, sortBy) }/>
            )
        }
        <Text>{this.getSortByName(sortBy) }</Text>
        {
          (!isFetching && showBreadCrums)
            ? (
              <Icon name="arrow-back" style={styles.arrowButtonIcon} onPress={this._onGoBack.bind(this) }/>
            )
            : (
              <View></View>
            )
        }
      </View>
    )
  }

  _renderSectionHeader(sectionData, sectionID) {
   
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>{sectionData}</Text>
      </View>
    )
  }

  _showStatusBar() {
    const {documentlist, documentlists} = this.props
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
    const {documentlist, documentlists} = this.props
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
    const {dispatch, documentlists, documentlist } = this.props

    const isFetching = documentlist.catId in documentlists ? documentlists[documentlist.catId].isFetching : false
    var additionalStyle = {};
    let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    let dataSource = documentlist.catId in documentlists ? documentlists[documentlist.catId].dataSource : ds.cloneWithRows([])
    return (

      <ViewContainer ref="masterView" style={[styles.container, additionalStyle]}>
        {this._renderSortBar() }
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
