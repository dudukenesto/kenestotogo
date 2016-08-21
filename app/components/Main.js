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
<<<<<<< HEAD
import {pop} from '../actions/navActions'
import KenestoToolbar from './KenestoToolbar'
=======
import * as documentsActions from '../actions/documentlists'
import {pop, updateRouteData} from '../actions/navActions'
import * as constans from '../constants/GlobalConstans'
import {getDocumentsContext} from '../utils/documentsUtils'
>>>>>>> refs/remotes/origin/dev

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
    height: 150
  },
  createFolder: {
<<<<<<< HEAD
    height: 280, 
    width: 320 
  },
   btnModal: {
=======
    height: 280,
    width: 320
  },

  btnModal: {
>>>>>>> refs/remotes/origin/dev
    position: "absolute",
    top: 100,
    right: 0,
    backgroundColor: "transparent"
  },
  ifProcessing: {
    height: 90, 
    width: 320,
    justifyContent: 'center',
    alignItems: 'center', 
  }
})

class Main extends React.Component {



  getChildContext() {
    return { kModal: this.refs.modalPlusMenu };
  }

  constructor(props) {
    super(props)
<<<<<<< HEAD
        this.state = {
          ifCreatingFolder: false,
        };
         this.onActionSelected = this.onActionSelected.bind(this)
  }

  onActionSelected(position){
      switch (position) {
          case 0:
         this.refs.modalPlusMenu.open();
              break;
             case 1:
               const {dispatch} = this.props
                dispatch(pop())
              break;
            case 2:
          alert(2);
              break;
      
          default:
              break;
=======
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
>>>>>>> refs/remotes/origin/dev
      }

    dispatch(updateRouteData(routeData));
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

<<<<<<< HEAD
  closeCreateFolder(){
    // alert(3)
     this.refs.CreateFolder.close();
     this.setState({ifCreatingFolder: false})
  }
  
  setProcessingStyle(){
    this.setState({ifCreatingFolder: true})
  }
    render(){

          var BContent = <Text style={styles.text}>error message</Text> 
          var modalStyle = this.state.ifCreatingFolder? styles.ifProcessing : [styles.modal, styles.createFolder]
        return(
             <View style={styles.container}> 
               

                <KenestoToolbar  onActionSelected={this.onActionSelected}
                                  onIconClicked = {this.onNavIconClicked.bind(this)}
                 />
                
                <NavigationRootContainer />
                <Modal style={[styles.modal, styles.plusMenu]} position={"bottom"}  ref={"modalPlusMenu"} isDisabled={false}>
                    <PlusMenu closeMenuModal = {this.closeMenuModal.bind(this)} openMenuModal = {this.openCreateFolder.bind(this)} 
                       openCreateFolder = {this.openCreateFolder.bind(this)} 
                        closeCreateFolder={this.closeCreateFolder.bind(this)}/>
                </Modal>
                 
                <Modal style= {modalStyle} position={"center"}  ref={"CreateFolder"} isDisabled={false}>
                    <CreateFolder closeMenuModal = {this.closeMenuModal.bind(this)} openMenuModal = {this.closeCreateFolder.bind(this)} 
                     closeCreateFolder={this.closeCreateFolder.bind(this)} setCreateFolderStyle={this.setProcessingStyle.bind(this)}
                     />
                </Modal>

            </View>
        )
    
=======
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
    var toolbarActions = [];
    switch (sortDirection) {
      case constans.ASCENDING:
        toolbarActions.push({ title: 'Search', iconName: 'search', iconSize: 30, show: 'always', iconColor: '#000' });
        if (navReducer.index > 1) {
          toolbarActions.push({ title: 'GoBack', iconName: 'arrow-back', show: 'always', iconColor: '#000' });
        }
        toolbarActions.push({ title: 'Arrowdownward', iconName: 'arrow-downward', show: 'always', iconColor: '#000' });
        toolbarActions.push({ title: 'Filter', iconName: 'more-vert', show: 'always', iconColor: '#000' })
        break;
      case constans.DESCENDING:
        toolbarActions.push({ title: 'Search', iconName: 'search', iconSize: 30, show: 'always', iconColor: '#000' });
        if (navReducer.index > 1) {
          toolbarActions.push({ title: 'GoBack', iconName: 'arrow-back', show: 'always', iconColor: '#000' });
        }
        toolbarActions.push({ title: 'arrowUpward', iconName: 'arrow-upward', show: 'always', iconColor: '#000' });
        toolbarActions.push({ title: 'Filter', iconName: 'more-vert', show: 'always', iconColor: '#000' })
        break;
      default:
        toolbarActions.push({ title: 'Search', iconName: 'search', iconSize: 30, show: 'always', iconColor: '#000' });
        if (navReducer.index > 1) {
          toolbarActions.push({ title: 'GoBack', iconName: 'arrow-back', show: 'always', iconColor: '#000' });
        }
        break;
>>>>>>> refs/remotes/origin/dev
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

<<<<<<< HEAD
Main.childContextTypes = {
    kModal:  React.PropTypes.object
}

Main.contextTypes = {
    drawer: React.PropTypes.object
};

function mapStateToProps(state) {
 
  const { documentlists, documentlist } = state
  const {env, sessionToken } = state.accessReducer; 
=======
function mapStateToProps(state) {

  const { documentlists, navReducer} = state
  const {env, sessionToken } = state.accessReducer;
>>>>>>> refs/remotes/origin/dev
  return {
    documentlists,
    navReducer,
    env,
    sessionToken

  }
}

<<<<<<< HEAD
export default connect(mapStateToProps)(Main)
=======
export default connect(mapStateToProps)(Main)


Main.childContextTypes = {
  kModal: React.PropTypes.object
}

Main.contextTypes = {
  drawer: React.PropTypes.object
};
>>>>>>> refs/remotes/origin/dev
