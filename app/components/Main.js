import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ToolbarAndroid
} from 'react-native'

import NavigationRootContainer from '../containers/navRootContainer'
import PlusMenu from './PlusMenu'
import Modal from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/MaterialIcons'
import CreateFolder from './CreateFolder'
import {connect} from 'react-redux'
import * as documentsActions from '../actions/documentlists'
import {pop, updateRouteData} from '../actions/navActions'
import * as constans from '../constants/GlobalConstans'
import {getDocumentsContext} from '../utils/documentsUtils'


let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  toolbar: {
    backgroundColor: '#3a3f41',
    height: 50,
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center'
  },


  plusMenu: {
    height: 160
  },
  createFolder: {
    height: 280,
    width: 320
  },

  btnModal: {
    position: "absolute",
    top: 100,
    right: 0,
    backgroundColor: "transparent"
  },
})
class Main extends React.Component {



  getChildContext() {
    return { kModal: this.refs.modalPlusMenu };
  }

  constructor(props) {
    super(props)
    this.state = {};
    this.onActionSelected = this.onActionSelected.bind(this)
  }

  onActionSelected(position) {
    const {dispatch, navReducer} = this.props
    switch (position) {
      case 0:
        this.refs.modalPlusMenu.open();
        break;
      case 1:
        if (navReducer.index > 1) {
          dispatch(pop())
        }
        else {
          this.onSort();
        }
        break;
      case 2:
        if (navReducer.index > 1) {
          this.onSort();
        }
        else {
          this.refs.MenuContext.openMenu('sortMenu');
        }
        break;
      default:
        break;
    }
  }

  onSort() {
    const {dispatch} = this.props
    var currRouteData = getDocumentsContext(this.props);
    var sortDirection = currRouteData.sortDirection == constans.ASCENDING ? constans.DESCENDING : constans.ASCENDING;
    var routeData =
      {
        name: currRouteData.name,
        catId: currRouteData.catId,
        fId: currRouteData.fId,
        sortDirection: sortDirection,
        sortBy: currRouteData.sortBy
      }

    dispatch(documentsActions.refreshTable(routeData));
  }

  onNavIconClicked() {
    this.context.drawer.open();
  }

  closeMenuModal() {
    this.refs.modalPlusMenu.close();
  }

  openMenuModal() {
    this.refs.modalPlusMenu.open();
  }

  openCreateFolder() {
    this.refs.CreateFolder.open();

  }

  closeCreateFolder() {

    //alert(documentsActions.UpdateCreateingFolderState)
    this.refs.CreateFolder.close();
    this.props.dispatch(documentsActions.UpdateCreateingFolderState(0));
  }

  getToolbarActions() {
    const {navReducer} = this.props
    var documentlist = getDocumentsContext(this.props);
    // const sortBy = documentlist.sortBy;
    const sortDirection = documentlist.sortDirection != undefined ? documentlist.sortDirection : "";
    var showBackArrow = navReducer.routes.length > 1 && ((navReducer.routes[1].key === 'login' && navReducer.index > 2) || (navReducer.routes[1].key.indexOf('documents') > -1 && navReducer.index > 1))?true:false;

    var toolbarActions = [];
    switch (sortDirection) {
      case constans.ASCENDING:
        toolbarActions.push({ title: 'Search', iconName: 'search', iconSize: 30, show: 'always', iconColor: '#000' });
        if (showBackArrow) {
          toolbarActions.push({ title: 'GoBack', iconName: 'arrow-back', show: 'always', iconColor: '#000' });
        }
        toolbarActions.push({ title: 'Arrowdownward', iconName: 'arrow-downward', show: 'always', iconColor: '#000' });
        toolbarActions.push({ title: 'Filter', iconName: 'more-vert', show: 'always', iconColor: '#000' })
        break;
      case constans.DESCENDING:
        toolbarActions.push({ title: 'Search', iconName: 'search', iconSize: 30, show: 'always', iconColor: '#000' });
        if (showBackArrow) {
          toolbarActions.push({ title: 'GoBack', iconName: 'arrow-back', show: 'always', iconColor: '#000' });
        }
        toolbarActions.push({ title: 'arrowUpward', iconName: 'arrow-upward', show: 'always', iconColor: '#000' });
        toolbarActions.push({ title: 'Filter', iconName: 'more-vert', show: 'always', iconColor: '#000' })
        break;
      default:
        toolbarActions.push({ title: 'Search', iconName: 'search', iconSize: 30, show: 'always', iconColor: '#000' });
        if (showBackArrow) {
          toolbarActions.push({ title: 'GoBack', iconName: 'arrow-back', show: 'always', iconColor: '#000' });
        }
        break;
    }
    return toolbarActions;
  }

  render() {


    var BContent = <Text style={styles.text}>error message</Text>
    return (
      <View style={styles.container}>


        <Icon.ToolbarAndroid
          style={styles.toolbar}
          onActionSelected={this.onActionSelected}
          titleColor='#fff'
          backgroundColor='#888'
          title={'Kenesto hello'}
          navIconName='menu'
          iconColor='orange'
          onIconClicked = {this.onNavIconClicked.bind(this) }
          actions={this.getToolbarActions() }
          overflowIconName="more"
          />
        <NavigationRootContainer />
        <Modal style={[styles.modal, styles.plusMenu]} position={"bottom"}  ref={"modalPlusMenu"} isDisabled={false}>
          <PlusMenu closeMenuModal = {this.closeMenuModal.bind(this) } openMenuModal = {this.openCreateFolder.bind(this) }
            openCreateFolder = {this.openCreateFolder.bind(this) }
            closeCreateFolder={this.closeCreateFolder.bind(this) }/>
        </Modal>
        <Modal style={[styles.modal, styles.createFolder]} position={"center"}  ref={"CreateFolder"} isDisabled={false}>
          <CreateFolder closeMenuModal = {this.closeMenuModal.bind(this) } openMenuModal = {this.closeCreateFolder.bind(this) }
            closeCreateFolder={this.closeCreateFolder.bind(this) }
            />
        </Modal>

      </View>
    )

  }
}

function mapStateToProps(state) {

  const { documentlists, navReducer} = state
  const {env, sessionToken } = state.accessReducer;
  return {
    documentlists,
    navReducer,
    env,
    sessionToken

  }
}

export default connect(mapStateToProps)(Main)


Main.childContextTypes = {
  kModal: React.PropTypes.object
}

Main.contextTypes = {
  drawer: React.PropTypes.object
};