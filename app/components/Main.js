import React from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ToolbarAndroid,
  TouchableWithoutFeedback
} from 'react-native'

import NavigationRootContainer from '../containers/navRootContainer'
import PlusMenu from './PlusMenu'
import Modal from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/MaterialIcons'
import CreateFolder from './CreateFolder'
import {connect} from 'react-redux'
import KenestoToolbar from './KenestoToolbar'
import * as documentsActions from '../actions/documentlists'
import {pop, updateRouteData} from '../actions/navActions'
import * as constans from '../constants/GlobalConstans'
import {getDocumentsContext} from '../utils/documentsUtils'
import Error from './Error'
import Info from './Info'


let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
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
 error: {
    height: 280,
    width: 320
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
  ifProcessing: {
    height: 90, 
    width: 320,
    justifyContent: 'center',
    alignItems: 'center', 
  },
  searchBoxContainer: {
    flexDirection: "row",
    height: 50,
    marginBottom: 3,
  },
  popupMenuContainer: {  
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  popupMenu: {
    flex: 1,
    alignItems: "flex-end",
  },
  popupMenuContent: {
    borderWidth: 1,
    borderColor: "#999",
    backgroundColor: "#fff",
    marginTop: 40,
    marginRight: 36,
    width: 200,
    height: 100,
    
  },
})

class Main extends React.Component {



  getChildContext() {
    return { kModal: this.refs.modalPlusMenu
            , errorModal: this.refs.errorModal };
  }

  constructor(props) {
    super(props)
        this.state = {
          ifCreatingFolder: false,
          isPopupMenuOpen: false
        };
         this.onActionSelected = this.onActionSelected.bind(this);
         this.onPressPopupMenu = this.onPressPopupMenu.bind(this);
  }

  onPressPopupMenu() {
    this.setState({
      isPopupMenuOpen: true
    })
  }
  
  hidePopupMenu() {
    this.setState({
      isPopupMenuOpen: false
    });
  }
  
  onActionSelected(position, value) {
    const {dispatch, navReducer} = this.props
    switch (position) {
      case 0:
        // this.refs.modalPlusMenu.open();
        break;
      case 1:
        if (navReducer.index > 1) {
          dispatch(pop())
        }
        break;
      case 2:
        this.onSort();
      case 3:
        this.onSortBy(value);
        break;
      default:
        break;
    }
  }
  onSortBy(sortBy) {
    const {dispatch} = this.props
    var currRouteData = getDocumentsContext(this.props);
    var routeData =
      {
        name: currRouteData.name,
        catId: currRouteData.catId,
        fId: currRouteData.fId,
        sortDirection: currRouteData.sortDirection,
        sortBy: sortBy
      }
    dispatch(documentsActions.refreshTable(routeData));
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

  closeModal(ref: string){
    this.refs[ref].close(); 
  }

  openModal(ref: string){
    this.refs[ref].open();
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

  closeCreateFolder(){
    // alert(3)
     this.refs.CreateFolder.close();
     this.setState({ifCreatingFolder: false})
  }

  
  setProcessingStyle(){
    this.setState({ifCreatingFolder: true})

  }

  componentWillReceiveProps(nextprops){
         if (nextprops.navReducer.HasError){
          this.openModal("errorModal");
      }
       if (nextprops.navReducer.HasInfo){
          this.openModal("infoModal");
      }
    }

    render(){

          var BContent = <Text style={styles.text}>error message</Text> 
          var modalStyle = this.state.ifCreatingFolder? styles.ifProcessing : [styles.modal, styles.createFolder]         
          
          var showPopupMenu = this.state.isPopupMenuOpen;
          
            return(
             <View style={styles.container}> 
             
                <KenestoToolbar   onActionSelected={this.onActionSelected}
                                  onPressPopupMenu={this.onPressPopupMenu}
                                  onIconClicked = {this.onNavIconClicked.bind(this)}
                                  navReducer={this.props.navReducer} 
                                  isPopupMenuOpen={this.state.isPopupMenuOpen}
                 />
                
                <NavigationRootContainer />
                <Modal style={[styles.modal, styles.plusMenu]} position={"bottom"}  ref={"modalPlusMenu"} isDisabled={false}>
                    <PlusMenu closeMenuModal = {this.closeMenuModal.bind(this)} openMenuModal = {this.openCreateFolder.bind(this)} 
                       openCreateFolder = {this.openCreateFolder.bind(this)}  createError={()=> this.openModal("errorModal")}
                        closeCreateFolder={this.closeCreateFolder.bind(this)}/>
                </Modal>
                 
                <Modal style= {modalStyle} position={"center"}  ref={"CreateFolder"} isDisabled={false}>
                    <CreateFolder closeMenuModal = {this.closeMenuModal.bind(this)} openMenuModal = {this.closeCreateFolder.bind(this)} 
                     closeCreateFolder={this.closeCreateFolder.bind(this)} setCreateFolderStyle={this.setProcessingStyle.bind(this)}
                     />
                </Modal>
                 <Modal style={[styles.modal, styles.error]} position={"center"}  ref={"errorModal"} isDisabled={false}>
                    <Error closeModal = {() => this.closeModal("errorModal")} openModal = {() => this.openModal("errorModal")}/>
                </Modal>
                <Modal style={[styles.modal, styles.error]} position={"center"}  ref={"infoModal"} isDisabled={false}>
                    <Info closeModal = {() => this.closeModal("infoModal")} openModal = {() => this.openModal("infoModal")}/>
                </Modal>
                       
                 {showPopupMenu ?
                   <View style={styles.popupMenuContainer}>
                     <TouchableWithoutFeedback onPress={this.hidePopupMenu.bind(this) } >
                       <View style={styles.popupMenu}>
                         <View style={styles.popupMenuContent}>
                           <Text>Popup Menu</Text>
                         </View>
                       </View>
                     </TouchableWithoutFeedback>
                   </View>
                   :
                   <View></View>
                 }
          
        
              </View>
            )    
    }
}


Main.childContextTypes = {
    kModal:  React.PropTypes.object, 
    errorModal: React.PropTypes.object, 
}

Main.contextTypes = {
    drawer: React.PropTypes.object
};

function mapStateToProps(state) {

  const { documentlists, navReducer} = state
  const {env, sessionToken } = state.accessReducer;
  //alert(sessionToken);
  return {
    documentlists,
    navReducer,
    env,
    sessionToken

  }
}

export default connect(mapStateToProps)(Main)

