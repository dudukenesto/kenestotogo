import React, { Component } from 'react'
import {
  View,
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
import { emitToast, clearToast } from '../actions/navActions'

import ProggressBar from "../components/ProgressBar";
import Icon from 'react-native-vector-icons/MaterialIcons'
import { createIconSetFromFontello } from 'react-native-vector-icons'
import fontelloConfig from '../assets/icons/config.json';
import * as constans from '../constants/GlobalConstans'
import Modal from 'react-native-modalbox';
import Button from "react-native-button";
import InteractionManager from 'InteractionManager'
import {getDownloadFileUrl, getIconNameFromMimeType} from '../utils/documentsUtils'
import { writeToLog } from '../utils/ObjectUtils'
import {getEnvIp} from '../utils/accessUtils'

const window = Dimensions.get('window');
let deviceWidth = Dimensions.get('window').width
let deviceHeight = Dimensions.get('window').height

var dismissKeyboard = require('dismissKeyboard');
var DocumentCell = require('../components/DocumentCell');
var DocumentUploadCell = require('../components/DocumentUploadCell');

const splitChars = '|';

import _ from "lodash";
import { fetchTableIfNeeded, refreshTable } from '../actions/documentsActions'
import ViewContainer from '../components/ViewContainer';
import KenestoHelper from '../utils/KenestoHelper';
import ActionButton from 'react-native-action-button';
import * as routes from '../constants/routes'

import { getDocumentsContext, getDocumentsTitle } from '../utils/documentsUtils'

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

getViewerUrl(document){
   if(document.isExternalLink)
    {
      return document.ViewerUrl;
    }
    else
    {
      var longDimension = window.width > window.height ? window.width : window.height;
      var shortDimension = window.height > window.width ? window.width : window.height;
      var width = this.props.navReducer.orientation === 'PORTRAIT' ? shortDimension : longDimension;
      var height = this.props.navReducer.orientation === 'PORTRAIT' ? longDimension : shortDimension;
      var url = document.ViewerUrl.replace('localhost', getEnvIp(this.props.env)) + "&w=" + width + "&h=" + height;
      return url;
    }
}

  componentWillMount() {
    const {dispatch} = this.props
    dispatch(fetchTableIfNeeded())
  }

  componentDidUpdate( prevProps,  prevState) {
    const {documentsReducer, navReducer} = this.props
    var documentlist = getDocumentsContext(navReducer);
    this._showStatusBar()

    if (documentlist.catId in documentsReducer) {
      if (documentsReducer[documentlist.catId].uploadItems.length > 0) {
        this.scrollToTop()
      }
      // else if (documentsReducer[documentlist.catId].lastUploadId != "") {
      //   alert(JSON.stringify(this.props.documentsReducer[documentlist.catId].lastUploadId)+",  "+JSON.stringify(prevProps.documentsReducer[documentlist.catId].lastUploadId))
      //   this.scrollToItem(documentsReducer[documentlist.catId].lastUploadId)
      // }
      // else
      // {
      //   this.scrollToTop() 
      // }
    }


  }

  onEndReached() {
    const {dispatch} = this.props
    dispatch(fetchTableIfNeeded())
  }


  selectItem(document) {
    const {dispatch, navReducer} = this.props
    var documentlist = getDocumentsContext(navReducer);
    if (document.FamilyCode == 'UPLOAD_PROGRESS')
      return false;
    else if (document.FamilyCode == 'FOLDER') {
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
        isVault: document.IsVault
      }
      this.props._handleNavigate(routes.documentsRoute(data));

    }
    else {
      if (document.MimeType.indexOf('video') > -1)
      {
        // fetch(getDownloadFileUrl(this.props.env, this.props.sessionToken, document.Id))
        // .then(
            
        // )

       
            var url = getDownloadFileUrl(this.props.env, this.props.sessionToken, document.Id);

            fetch(url)
            .then(response => response.json())
            .then(json => {
                var downloadUrl = json.ResponseData.AccessUrl;
                var downloadUrl = json.ResponseData.AccessUrl;
                var longDimension = deviceWidth > deviceHeight ? deviceWidth :deviceHeight;
                var shortDimension = deviceHeight > deviceWidth ? deviceWidth : deviceHeight;
              
                 document.ViewerUrl =document.ViewerUrl + '&tu='+ encodeURIComponent(document.ThumbnailUrl); 
                 var data = {
                      key: "document",
                      name: document.Name,
                      documentId: document.Id,
                      familyCode: document.FamilyCode,
                      catId: documentlist.catId,
                      fId: documentlist.fId,
                      viewerUrl: this.getViewerUrl(document),
                      isExternalLink : document.IsExternalLink,
                      isVault:document.IsVault,
                      ThumbnailUrl : document.ThumbnailUrl,
                      env: this.props.env,
                      dispatch: this.props.dispatch
                    }
                    this.props._handleNavigate(routes.documentRoute(data));



            }).catch(error => {

              alert('error: ' + error)
             //   dispatch(navActions.emitToast('error downloading document'))
              //  writeToLog(email, constans.ERROR, `function downloadDocument - error downloading document - url: ${url}`, error)

            })
            .done();
      }
      else{
            
          var data = {
              key: "document",
              name: document.Name,
              documentId: document.Id,
              familyCode: document.FamilyCode,
              catId: documentlist.catId,
              fId: documentlist.fId,
              viewerUrl: this.getViewerUrl(document), 
              isExternalLink : document.IsExternalLink,
              isVault:document.IsVault,
              ThumbnailUrl : document.ThumbnailUrl,
              env: this.props.env, 
              dispatch: this.props.dispatch
            }
            this.props._handleNavigate(routes.documentRoute(data));

      }
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
      <View key={'SEP_' + sectionID + '_' + rowID} style={style} />
    );
  }



  _onRefresh(type, message) {
    const {dispatch, navReducer} = this.props
    var documentlist = getDocumentsContext(navReducer);
    dispatch(refreshTable(documentlist, false))
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
    const {documentsReducer, navReducer} = this.props
    var documentlist = getDocumentsContext(navReducer);
    const hasError = documentlist.catId in documentsReducer ? documentsReducer[documentlist.catId].hasError : false;
    const errorMessage = documentlist.catId in documentsReducer ? documentsReducer[documentlist.catId].errorMessage : "";
    if (hasError && this.refs.masterView != undefined) {
      //this.refs.masterView.showMessage("success", errorMessage);
      this.props.dispatch(emitToast("error", "Error loading documents list"));
      this.peops.dispatch(clearToast());
    }
  }


  openModal() {
    //this.refs.modal3.open();
    this.context.plusMenuContext.open();
  }

  scrollToTop() {
    const {documentsReducer, navReducer} = this.props
    var documentlist = getDocumentsContext(navReducer);
    if (documentsReducer[documentlist.catId].uploadItems.length > 0) {
      var uploadingScrollPosition = documentsReducer[documentlist.catId].uploadItems.length > 3 ? (documentsReducer[documentlist.catId].uploadItems.length - 1) * 67 + 52 : 0;
      this.refs.listview.scrollTo({ y: uploadingScrollPosition })
    }

  }

  scrollToItem(id) {
    const {documentsReducer, navReducer, dispatch} = this.props;
    var documentlist = getDocumentsContext(navReducer);
    try {
        const documents = documentsReducer[documentlist.catId].items;
        const document = documents.find(d => (d.Id === id));
        if(typeof (document) != 'undefined')
        {
       
          const index = documents.indexOf(document);
          const sectionHeaderHeights = index > 0 && documents[0].FamilyCode != document.FamilyCode ? 104 : 52
          const position = index * 67 + sectionHeaderHeights;
          this.refs.listview.scrollTo({ y: position });
        }

    }
    catch (err) {
      writeToLog("", constans.ERROR, `function scrollToItem - Failed! `, err)
    }
     
  }


  _renderTableContent(isFetching) {

    const {documentsReducer, navReducer} = this.props
    var documentlist = getDocumentsContext(navReducer);
    var itemsLength = documentlist.catId in documentsReducer ? documentsReducer[documentlist.catId].items.length : 0;

    var uploadsLength = documentlist.catId in documentsReducer ? documentsReducer[documentlist.catId].uploadItems.length : 0;
    itemsLength += uploadsLength;
    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => {
        r1["Id"] !== r2["Id"] || r1["uploadStatus"] !== r2["uploadStatus"] || r1["IsUploading"] !== r2["IsUploading"]
      }
    })
    let dataSource = documentlist.catId in documentsReducer ? documentsReducer[documentlist.catId].dataSource : ds.cloneWithRows([]);

    //itemsLength+= documentsReducer[documentlist.catId].uploadItems.length;


    if (itemsLength == 0) {

      return (<NoDocuments
        filter={this.state.filter}
        isFetching={isFetching}
        onRefresh={this._onRefresh.bind(this)}
        documentlist={documentlist} />)
    }
    else {

      return (
        <ListView
          ref="listview"
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={this._onRefresh.bind(this)}
              />
          }
          enableEmptySections={true}
          renderSeparator={this.renderSeparator}
          dataSource={dataSource}
          renderSectionHeader={this._renderSectionHeader.bind(this)}
          renderRow={(document, sectionID, rowID, highlightRowFunc) => {



            var documentCell = document.FamilyCode == 'UPLOAD_PROGRESS' ? <DocumentUploadCell
              key={document.Id}
              onSelect={this.selectItem.bind(this, document)}
              dispatch={this.props.dispatch}
              document={document} documentsReducer={this.props.documentsReducer} /> :
              <DocumentCell
                key={document.Id}
                onSelect={this.selectItem.bind(this, document)}
                dispatch={this.props.dispatch}
                documentsReducer={this.props.documentsReducer}
                document={document} />

            return (documentCell)
          } }
          renderFooter={() => {
            return <View style={{ height: 100 }}>


            </View>
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

    try {
      const {dispatch, documentsReducer, navReducer } = this.props
      var documentlist = getDocumentsContext(navReducer);
      // console.log("render documents page: " +JSON.stringify(documentlist))
      //const isFetching = documentlist.catId in documentsReducer ? documentsReducer[documentlist.catId].isFetching : false
      const isFetching = documentsReducer.isFetching;
      var additionalStyle = {};

      let showCustomButton = documentlist.catId == constans.SEARCH_DOCUMENTS ? false : true
      return (

        <ViewContainer ref="masterView" style={[styles.container, additionalStyle]}>
          <View style={styles.separator} elevation={5} />

          {this._renderTableContent(isFetching)}
          {showCustomButton ? <ActionButton buttonColor="#FF811B" onPress={() => this.openModal()} >
          </ActionButton> : <View></View>}

        </ViewContainer>
      )
    } catch (error) {

      return null;
    }

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
      if (this.props.documentlist.catId == constans.SEARCH_DOCUMENTS) {
        return (
          <View style={[styles.container, styles.centerText]}>
            <View style={styles.textContainer}>
              <Text style={styles.noDocumentsText}>{text}</Text>
            </View>
          </View>
        );
      }
      else {
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
    backgroundColor: '#F5F6F8',
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