import React, { Component } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {getDocumentsContext} from '../utils/documentsUtils'
import * as constans from '../constants/GlobalConstans'
import * as documentsActions from '../actions/documentlists'
import {pop, updateRouteData} from '../actions/navActions'
import Menu, {
  MenuContext,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from 'react-native-popup-menu';

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
    padding: 5,
  },
  iconStyle: {
    fontSize: 24,
    margin: 5,
    color: "#000",
  },
  folderName: {
    justifyContent: "flex-start",
    flex: 1,
    paddingLeft: 10,
  },
  searchBoxContainer: {
    padding: 5,
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


  MenuContextContainer: {
    height: 70,
    flex: 1,
    flexDirection: "column",
    
    
    // borderWidth:1,
  },
  topbar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    // backgroundColor: 'black',
    paddingHorizontal: 5,
    paddingVertical: 10
  },
  menuTrigger: {
    flexDirection: 'row',
    paddingHorizontal: 10
  },
  menuTriggerText: {
    color: 'lightgrey',
    fontWeight: '600',
    fontSize: 20
  },
  disabled: {
    color: '#ccc'
  },
  divider: {
    marginVertical: 5,
    marginHorizontal: 2,
    borderBottomWidth: 1,
    borderColor: '#ccc'
  },

})


class KenestoToolbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isSearchBoxOpen: false
    }
  }
  onPressSearchBox() {
    this.setState({
      isSearchBoxOpen: true
    })
  }

  onGoBack() {
    this.props.onActionSelected(1)
  }

  onSort() {
    this.props.onActionSelected(2)
  }

  onSortBy(value) {
    this.props.onActionSelected(3, value)
  }

  onPressPopupMenu() {
    this.refs.MenuContext.openMenu('sortMenu');
  }

  hideSearchBox() {
    this.setState({
      isSearchBoxOpen: false
    });
  }

  // getToolbarActions() {
  //   const {navReducer} = this.props
  //   var documentlist = getDocumentsContext(this.props);
  //   // const sortBy = documentlist.sortBy;
  //   const sortDirection = documentlist.sortDirection != undefined ? documentlist.sortDirection : "";
  //   var toolbarActions = [];
  //   switch (sortDirection) {
  //     case constans.ASCENDING:
  //       toolbarActions.push({ title: 'Search', iconName: 'search', iconSize: 30, show: 'always', iconColor: '#000' });
  //       if (navReducer.index > 1) {
  //         toolbarActions.push({ title: 'GoBack', iconName: 'arrow-back', show: 'always', iconColor: '#000' });
  //       }
  //       toolbarActions.push({ title: 'Arrowdownward', iconName: 'arrow-downward', show: 'always', iconColor: '#000' });
  //       toolbarActions.push({ title: 'Filter', iconName: 'more-vert', show: 'always', iconColor: '#000' })
  //       break;
  //     case constans.DESCENDING:
  //       toolbarActions.push({ title: 'Search', iconName: 'search', iconSize: 30, show: 'always', iconColor: '#000' });
  //       if (navReducer.index > 1) {
  //         toolbarActions.push({ title: 'GoBack', iconName: 'arrow-back', show: 'always', iconColor: '#000' });
  //       }
  //       toolbarActions.push({ title: 'arrowUpward', iconName: 'arrow-upward', show: 'always', iconColor: '#000' });
  //       toolbarActions.push({ title: 'Filter', iconName: 'more-vert', show: 'always', iconColor: '#000' })
  //       break;
  //     default:
  //       toolbarActions.push({ title: 'Search', iconName: 'search', iconSize: 30, show: 'always', iconColor: '#000' });
  //       if (navReducer.index > 1) {
  //         toolbarActions.push({ title: 'GoBack', iconName: 'arrow-back', show: 'always', iconColor: '#000' });
  //       }
  //       break;
  //   }
  //   return toolbarActions;
  // }

  renderSearchBox() {
    return (
      <View style={styles.searchBoxContainer}>
        <Icon name="arrow-back" onPress={this.hideSearchBox.bind(this) } style={styles.iconStyle} />
        <View style={styles.textInputContainer}><TextInput style={styles.textInput} /></View>
        <Icon name="search" style={styles.iconStyle} />
      </View>
    )
  }


  renderIconsSet() {
    const {navReducer} = this.props
    var documentlist = getDocumentsContext(this.props);
    // const sortBy = documentlist.sortBy;
    const sortDirection = documentlist.sortDirection != undefined ? documentlist.sortDirection : "";
    var showGoBack = navReducer.routes.length > 1 && ((navReducer.routes[1].key === 'login' && navReducer.index > 2) || (navReducer.routes[1].key.indexOf('documents') > -1 && navReducer.index > 1)) ? true : false; //navReducer.index > 1?true:false;

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
          <Text style={{ fontSize: 20 }}>Folder Name</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Icon name="search" style={[styles.iconStyle]}  onPress={this.onPressSearchBox.bind(this) }/>
          <Icon name="more-vert" style={[styles.iconStyle]} onPress={this.onPressPopupMenu.bind(this) } />
          {sortDirection == constans.ASCENDING ?
            <Icon name="keyboard-arrow-up" style={[styles.iconStyle, { alignSelf: "flex-end" }]}  onPress={this.onSort.bind(this) }/>
            :
            <Icon name="keyboard-arrow-down" style={[styles.iconStyle, { alignSelf: "flex-end" }]} onPress={this.onSort.bind(this) }/>
          }
        </View>



      </View>
    )
  }

  render() {
    const {navReducer} = this.props
    var documentlist = getDocumentsContext(this.props);
    const sortBy = documentlist.sortBy;
    
    const sortDirection = documentlist.sortDirection != undefined ? documentlist.sortDirection : "";

    if (this.state.isSearchBoxOpen) {
      return (<View>
        {this.renderSearchBox() }
      </View>)
    }
    else {
      return (<View>

        {this.renderIconsSet() }
        <View style={styles.MenuContextContainer}>
          <MenuContext ref="MenuContext" >
            <View style={styles.topbar}>
              <Menu  name="sortMenu">
                <MenuTrigger style={styles.menuTrigger}/>
                <MenuOptions style={styles.menuOptions}>
                  <MenuOption value={constans.ASSET_NAME} disabled={sortBy == constans.ASSET_NAME?true:false} onSelect={(value) => this.onSortBy(value) }>
                    <Text style={sortBy != constans.ASSET_NAME? {}:styles.disabled}>Sort by Name</Text>
                  </MenuOption>
                  <View style={styles.divider}/>
                  <MenuOption value={constans.MODIFICATION_DATE} disabled={sortBy == constans.MODIFICATION_DATE?true:false} onSelect={(value) => this.onSortBy(value) }>
                    <Text style={sortBy != constans.MODIFICATION_DATE? {}:styles.disabled}>Sort by Date</Text>
                  </MenuOption>
                </MenuOptions>
              </Menu>
            </View>
          </MenuContext>
        </View>



      </View>)
    }






    // return (
    // <Icon.ToolbarAndroid 
    //             style={[styles.toolbar, this.props.style]}
    //             onActionSelected={this.props.onActionSelected}
    //             titleColor='#333'
    //             backgroundColor='#eee'
    //             title={'Kenesto hello'}
    //             navIconName='menu'
    //             iconColor='orange'
    //            onIconClicked = {this.props.onIconClicked}
    //             actions={this.getToolbarActions()}
    //             overflowIconName="more"
    //         />




  }



}




export default KenestoToolbar
