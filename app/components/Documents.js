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
import * as constans from '../constants/GlobalConstans'
import Modal from 'react-native-modalbox';
//var Modal   = require('react-native-modalbox');
import InteractionManager from 'InteractionManager'

let deviceWidth = Dimensions.get('window').width
let deviceHeight = Dimensions.get('window').height

var dismissKeyboard = require('dismissKeyboard');
var DocumentCell = require('../components/DocumentCell');
const splitChars = '|';

import _ from "lodash";
import {fetchTableIfNeeded, refreshTable, changeTable} from '../actions/documentlists'
import {updateDocumentList} from '../actions/documentlist'
import ViewContainer from '../components/ViewContainer';
import KenestoHelper from '../utils/KenestoHelper';
import ActionButton from 'react-native-action-button';
import * as routes from '../constants/routes'
import Button from './Button'

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
  }

  getCategoryName(categoryType)
  {
    switch (categoryType) {
      case constans.ALL_DOCUMENTS:
        return "All Documents"
      default:
        return "";
    }
  }

 getBaseCatId(categoryType)
  {
    switch (categoryType) {
      case constans.ALL_DOCUMENTS:
        return "All Documents"
      default:
        return "";
    }
  }
  componentWillMount() {
    const {dispatch, env, sessionToken, documentlist} = this.props
    dispatch(fetchTableIfNeeded(env, sessionToken, documentlist))
  }

  componentWillReceiveProps(nextProps) {
    const {dispatch, env, sessionToken, documentlist, documentlists} = this.props
    if (documentlist.catId !== nextProps.documentlist.catId) {
      dispatch(changeTable(env, sessionToken, nextProps.documentlist));
    }
  }

  onEndReached() {
    const {dispatch, env, sessionToken, documentlist} = this.props
    dispatch(fetchTableIfNeeded(env, sessionToken, documentlist))
  }


  selectItem(document) {
    const {dispatch, env, sessionToken, documentlist} = this.props

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

      dispatch(updateDocumentList(newId, newName, fId))
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
    const {dispatch, env, sessionToken, documentlist, documentlists} = this.props
    var baseCatId ;
     if (documentlist.catId.indexOf(splitChars) >= 0) {
        var dtlStr = documentlist.catId.split(splitChars);
        var baseCatId = dtlStr[0];
      }
      else
      {
        baseCatId = documentlist.catId;
      }
     
    this.foldersTrail.pop();
      
    var catId = this.foldersTrail.length > 0 ? this.foldersTrail[this.foldersTrail.length-1].catId: baseCatId;
    var name = this.foldersTrail.length > 0 ? this.foldersTrail[this.foldersTrail.length-1].name: this.getCategoryName(baseCatId);
     var fid = this.foldersTrail.length > 0 ? this.foldersTrail[this.foldersTrail.length-1].fId: "";
    
    dispatch(updateDocumentList(catId, name, fid))
  }

  _onRefresh(type, message) {
    const {dispatch, env, sessionToken, documentlist} = this.props
    dispatch(refreshTable(env, sessionToken, documentlist))
  }

  _renderBreadCrums() {
    const {dispatch, env, sessionToken, documentlist, documentlists} = this.props

    const isFetching = documentlist.catId in documentlists ? documentlists[documentlist.catId].isFetching : false;
    const showBreadCrums = this.foldersTrail.length > 0 ? true : false;

    if (!isFetching && showBreadCrums) {

      var parentName =  this.foldersTrail.length > 1 ? this.foldersTrail[this.foldersTrail.length-1].name : this.getCategoryName(constans.ALL_DOCUMENTS);
      return (
        <View>
          <TouchableOpacity style={styles.backButton} onPress={this._onGoBack.bind(this) }>
            <Text style={styles.backLabel}>Go to {parentName} Page</Text>
          </TouchableOpacity>
        </View>)
    }
    else {
      return null;
    }
  }

  _renderSectionHeader(sectionData, sectionID) {

    return (

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>{sectionData}</Text>
      </View>
    )
  }
  _renderTableContent(dataSource, isFetching) {
    if (dataSource.getRowCount() === 0) {
      return (<NoDocuments
        filter={this.state.filter}
        isLoading={isFetching}
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


openModal(){
  //this.refs.modal3.open();
  this.context.kModal.open();
}



  render() {
    const {dispatch, documentlists, documentlist } = this.props

    const isFetching = documentlist.catId in documentlists ? documentlists[documentlist.catId].isFetching : false

    var items = documentlist.catId in documentlists ? documentlists[documentlist.catId].items : [],
      length = items.length,
      dataBlob = {},
      sectionIDs = [],
      rowIDs = [],
      foldersSection,
      docuemntsSection,
      folders,
      documents,
      i,
      j;


    dataBlob["ID1"] = "Folders";
    dataBlob["ID2"] = "Documents";

    sectionIDs[0] = "ID1";
    sectionIDs[1] = "ID2";

    folders = _.filter(items, function (o) { return o.FamilyCode == 'FOLDER'; });
    documents = _.filter(items, function (o) { return o.FamilyCode != 'FOLDER'; });

    // console.log("Folders:"+JSON.stringify(folders))

    // console.log("documents:"+JSON.stringify(documents))

    rowIDs[0] = [];
    for (j = 0; j < folders.length; j++) {
      folder = folders[j];
      // Add Unique Row ID to RowID Array for Section
      rowIDs[0].push(folder.Id);

      // Set Value for unique Section+Row Identifier that will be retrieved by getRowData
      dataBlob['ID1:' + folder.Id] = folder;
    }

    rowIDs[1] = [];
    for (j = 0; j < documents.length; j++) {
      document = documents[j];
      // Add Unique Row ID to RowID Array for Section
      rowIDs[1].push(document.Id);

      // Set Value for unique Section+Row Identifier that will be retrieved by getRowData
      dataBlob['ID2:' + document.Id] = document;
    }

    var getSectionData = (dataBlob, sectionID) => {
      return dataBlob[sectionID];
    }

    var getRowData = (dataBlob, sectionID, rowID) => {
      return dataBlob[sectionID + ':' + rowID];
    }
    let ds = new ListView.DataSource({
      getSectionData: getSectionData,
      getRowData: getRowData,
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    })


    let dataSource = documentlist.catId in documentlists ? ds.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs) : ds.cloneWithRows([])
    var additionalStyle = {};

    return (
      <ViewContainer  ref="masterView" style={[styles.container, additionalStyle]}>

       
        {this._renderBreadCrums() }
        <View style={styles.separator} />

        { isFetching &&
          <View style={styles.progressbar}>
            <ActivityIndicator styleAttr='Small' />
          </View>
        }

        {this._renderTableContent(dataSource, isFetching) }
        <ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item buttonColor='#9b59b6' title="open modal" onPress={() => this.openModal()}>
            <Icon name="https" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#3498db' title="Upload" onPress={() => Actions.animated() }>
            <Icon name="file-upload" style={styles.actionButtonIcon} />
          </ActionButton.Item>

          <ActionButton.Item buttonColor='#1abc9c' title="New Folder" onPress={() => Actions.createFolder({ env: this.state.env, currentFolderId: this.state.folderId, sessionToken: this.props.sessionToken, afterCreateCallback: this._onRefresh, updateLoading: this.updateLoadingState }) }>
            <Icon name="send" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>

        
      </ViewContainer>
    )
  }
}



var NoDocuments = React.createClass({
  render: function () {
    var text = '';
    if (this.props.filter) {
      text = `No results for "${this.props.filter}"`;
    } else if (!this.props.isLoading) {
      // If we're looking at the latest documents, aren't currently loading, and
      // still have no results, show a message
      text = 'No documents found';
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
    marginTop: 40
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
  scrollSpinner: {
    marginVertical: 20,
  },
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginLeft: 4,
  },
  rowSeparatorHide: {
    opacity: 0.0,
  },
  backButton: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#3C5773',
    alignSelf: 'stretch'
  },
  backLabel: {
    color: '#F4F4E9',
    textAlign: 'center'
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  sectionHeader: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#eeeeee',
    alignSelf: 'stretch'
  },
  sectionLabel: {
    color: '#2f2f2f',
    textAlign: 'center'
  },
    modal: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  modal2: {
    height: 230,
    backgroundColor: "#3B5998"
  },

  modal3: {
    height: 300,
    width: 300
  },
});

Documents.contextTypes = {
    kModal:  React.PropTypes.object
};


export default Documents
