import React, { Component } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {getDocumentsContext} from '../utils/documentsUtils'
import * as constans from '../constants/GlobalConstans'
import * as documentsActions from '../actions/documentsActions'
import * as navActions from '../actions/navActions'
import {getDocumentsTitle} from '../utils/documentsUtils'
import * as routes from '../constants/routes'
import {hideToast} from '../actions/navActions'

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ToolbarAndroid
} from 'react-native'


let styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#eee',
    height: 50,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 9,
  },
  iconStyle: {
    fontSize: 24,
    padding: 3,
    color: "#000",
    textAlign: "center",
    textAlignVertical: "center",
  },
  iconDisabled: {
    color: "#ccc",
  },
  arrowUp: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 5,
    paddingRight: 5,
    marginBottom: -10,
    fontSize: 20,
  },
  arrowDown: {
    paddingTop: 0,
    paddingBottom: 0,
    fontSize: 20,
    marginBottom: -2,
  },
  shareIconContainer: {
    marginRight: 5,
  },
  shareIcon: {
    color: "#888",
    fontSize:20
  },
  folderName: {
    justifyContent: "flex-start",
    flex: 1,
    paddingLeft: 10,
  },
  searchBoxContainer: {
    paddingLeft: 9,
    paddingRight: 9,
    flexDirection: "row",
    height: 50,
    alignItems: "center",
  },
  textInputContainer: {
    flex: 1,
    marginLeft: 3,
  },
  textInput: {
    flex: 1,
    flexDirection: "row",
  },
  popupInactive: {
    marginRight: 1
  },
  popupActive: {
    borderWidth: 1,
    borderColor: "#999",
    borderRightColor: "#999",
    marginRight: -1,
    backgroundColor: "#fff"
  },
  sortingInactive: {
    borderWidth: 1,
    borderLeftColor: "transparent",
    borderColor: "#ccc",
  },
  buttonsInactive: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonsActive: {
    flexDirection: "row",
  }
})


class KenestoToolbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isSearchBoxOpen: false,
      searchText:""
    }
  }
  
  onPressSearchBox() {

    var data = {
        key:"documents|search",
        name: "documents|" + "search",
        catId: constans.SEARCH_DOCUMENTS,
        fId: "",
        sortDirection: constans.ASCENDING,
        sortBy: constans.ASSET_NAME,
        isVault:false,
        keyboard: ""
      }
      this.props.dispatch(documentsActions.initializeSearchBox(data));
      
      this.setState({
        isSearchBoxOpen: true,
        searchText:""
      })
  }

  onGoBack() {
    this.props.onActionSelected(1)
    this.props.dispatch(hideToast());
  }

  onSort() {
    this.props.onActionSelected(2)
  }

  onSortBy(value) {
    this.props.onActionSelected(3, value)
  }

  onPressPopupMenu() {
    this.props.onPressPopupMenu();
  }
  
  hidePopupMenu() {
    this.props.hidePopupMenu();
  }

  hideSearchBox() {
    var routeData ={
                name: getDocumentsTitle(constans.SEARCH_DOCUMENTS),
                catId: constans.SEARCH_DOCUMENTS,
                fId: "",
                sortDirection: constans.ASCENDING,
                sortBy: constans.ASSET_NAME,
                keyboard:""
            }
            
    this.props.onActionSelected(1)
    this.setState({
      isSearchBoxOpen: false
    });
  }

  _submitSearch(text){
    var routeData ={
                name: getDocumentsTitle(constans.SEARCH_DOCUMENTS),
                catId: constans.SEARCH_DOCUMENTS,
                fId: "",
                sortDirection: constans.ASCENDING,
                sortBy: constans.ASSET_NAME,
                keyboard:text
            }

    this.props.dispatch(documentsActions.refreshTable(routeData, true));
     this.setState({
      searchText: text
    });
    
  }

  renderSearchBox() {
    return (
      <View style={styles.searchBoxContainer}>
       <Icon name="arrow-back" onPress={this.hideSearchBox.bind(this) } style={styles.iconStyle} />
        <View style={styles.textInputContainer}><TextInput style={styles.textInput} onChangeText={(text) => this._submitSearch(text)} value={this.state.searchText}/></View>
        <Icon name="search" style={styles.iconStyle} />
      </View>
    )
  }


  renderIconsSet() {
    const {navReducer} = this.props
    var documentlist = getDocumentsContext(navReducer);
    // const sortBy = documentlist.sortBy;
    const sortDirection = documentlist.sortDirection != undefined ? documentlist.sortDirection : "";
    var title =  navReducer.routes[navReducer.index].data != null? navReducer.routes[navReducer.index].data.name: navReducer.routes[navReducer.index].title;
    var showGoBack = (navReducer.routes[navReducer.index].key.indexOf('documents') > -1 && navReducer.routes[navReducer.index].data.fId != "") 
              || navReducer.routes[navReducer.index].key === 'document' || navReducer.routes[navReducer.index].key === 'addPeople' || navReducer.routes[navReducer.index].key === 'scan'  ? true : false;
    var isDocumentsTollbar = (navReducer.routes[navReducer.index].key.indexOf('documents') > -1) ? true : false;
    var isAddPeoplePage = (navReducer.routes[navReducer.index].key.indexOf('addPeople') > -1) ? true : false;
    return (
      <View style= {styles.toolbar} >
        <View>
          {showGoBack ?
            <Icon name="arrow-back" style={[styles.iconStyle]} onPress={this.onGoBack.bind(this) } />
            :
            <Icon name="menu" style={[styles.iconStyle, { color: "orange" }]} onPress={this.props.onIconClicked} />
          }

        </View>
        <View style={styles.folderName}>
          <Text style={{ fontSize: 20 }} numberOfLines={1}>{title}</Text>
        </View>
        {isDocumentsTollbar ?
          <View style={{ flexDirection: "row" }}>
          <Icon name="search" style={[styles.iconStyle]}  onPress={this.onPressSearchBox.bind(this) }/>


          <View style={[this.props.isPopupMenuOpen ? styles.buttonsActive : styles.buttonsInactive]}>
            <View style={[styles.popupInactive, this.props.isPopupMenuOpen ? styles.popupActive : {}]}>
              <Icon name="more-vert" style={[styles.iconStyle]} onPress={this.onPressPopupMenu.bind(this) } />
            </View>

            <View style={this.props.isPopupMenuOpen ? styles.sortingInactive : {}}>
              {sortDirection == constans.ASCENDING ?
                <View>
                  <Icon name="keyboard-arrow-up" style={[styles.iconStyle, styles.arrowUp]}  onPress={this.onSort.bind(this) }/>
                  <Icon name="keyboard-arrow-down" style={[styles.iconStyle, styles.arrowDown, styles.iconDisabled]} onPress={this.onSort.bind(this) }/>
                </View>
                :
                <View>
                  <Icon name="keyboard-arrow-up" style={[styles.iconStyle, styles.arrowUp, styles.iconDisabled]}  onPress={this.onSort.bind(this) }/>
                  <Icon name="keyboard-arrow-down" style={[styles.iconStyle, styles.arrowDown]} onPress={this.onSort.bind(this) }/>
                </View>
              }
            </View>
          </View>
        </View>
          :
          <View></View>
        }
        {isAddPeoplePage && <View style={styles.shareIconContainer}><Icon name="send" style={[styles.iconStyle, styles.shareIcon]} onPress={this.addPeople.bind(this)} /></View>}
      </View>
    )
  }
  

  addPeople() {
    const {documentsReducer} = this.props
    if (documentsReducer.sharingPermissions.length === 0) {
      return false;
    }
    this.props.dispatch(documentsActions.ShareDocument());
  }

  render() {
    const {navReducer} = this.props
    var documentlist = getDocumentsContext(navReducer);
    const sortBy = documentlist.sortBy;
    const sortDirection = documentlist.sortDirection != undefined ? documentlist.sortDirection : "";
    var isDocumentsTollbar = (navReducer.routes[navReducer.index].key.indexOf('documents') > -1) ? true : false;
    
    if (documentlist.catId == constans.SEARCH_DOCUMENTS && this.state.isSearchBoxOpen && isDocumentsTollbar) {
      return (<View>
        {this.renderSearchBox() }
      </View>)
    }
    else {
      return (<View>
      
        {this.renderIconsSet() }
        
      </View>)
    }
  }
}




export default KenestoToolbar
