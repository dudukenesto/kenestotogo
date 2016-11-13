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
import ItemMenu from './ItemMenu'
import Modal from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/MaterialIcons'
import CreateFolder from './CreateFolder'
import EditDocument from './EditDocument'
import EditFolder from './EditFolder'
import UpdateVersions from './UpdateVersions'
import {connect} from 'react-redux'
import KenestoToolbar from './KenestoToolbar'
import * as documentsActions from '../actions/documentlists'
import {pop, updateRouteData, clearToast} from '../actions/navActions'
import * as constans from '../constants/GlobalConstans'
import {getDocumentsContext} from '../utils/documentsUtils'
import Error from './Error'
import Info from './Info'
import Confirm from './Confirm'
import CheckInDocument from './CheckInDocument'


var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;
import DropDownOptions from './DropDownOptions';
var Orientation = require('./KenestoDeviceOrientation');

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
  itemMenu: {
    height: 235
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
  updateVersionsModal: {
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
    marginRight: 40,
    width: 170,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  inactiveOption: {
    color: "#ccc",
  },
  activeOption: {
    color: "#000",
  },
  iconStyle: {
    fontSize: 22,
    color: "#000",
    textAlign: "center",
    textAlignVertical: "center",
    marginRight: 15,
  },
  disabledIcon: {
    color: "#ccc"
  },
})

class Main extends React.Component {



  getChildContext() {

    return {
      plusMenuContext: this.refs.modalPlusMenu, 
      itemMenuContext: this.refs.modalItemMenu,
      errorModal: this.refs.errorModal,
      dropDownContext: this.refs.dropDownOptionsContainer
    };
  }

  constructor(props) {
    super(props)

        this.state = {
          ifCreatingFolder: false,
          isPopupMenuOpen: false,
          orientation: 'unknown',
          isDropDownOpen: true
        };
         this.onActionSelected = this.onActionSelected.bind(this);
         this.onPressPopupMenu = this.onPressPopupMenu.bind(this);
        const {dispatch} = this.props

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
        this.onSortDirection();
        break;
      case 3:
        this.onSortBy(value);
        break;
      default:
        break;
    }
  }
  onSortBy(sortBy) {
    const {dispatch, navReducer} = this.props
    var currRouteData = getDocumentsContext(navReducer);
    var routeData =
      {
        name: currRouteData.name,
        catId: currRouteData.catId,
        fId: currRouteData.fId,
        sortDirection: currRouteData.sortDirection,
        sortBy: sortBy
      }
    dispatch(documentsActions.refreshTable(routeData));
    this.hidePopupMenu();
  }

  onSortDirection() {
    const {dispatch, navReducer} = this.props
    var currRouteData = getDocumentsContext(navReducer);
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

  closeModal(ref: string) {
    this.refs[ref].close();
  }

  openModal(ref: string) {
    this.refs[ref].open();
  }

  onNavIconClicked() {
    this.context.drawer.open();
  }

  closeDrawer() {
    return this.props.closeDrawer();
  }

  closeMenuModal() {
    this.refs.modalPlusMenu.close();
  }

  closeItemMenuModal() {
   // this.props.dispatch(documentsActions.updateSelectedObject(''));
    this.refs.modalItemMenu.close();
  }

  isItemMenuModalOpen() {
    return this.refs.modalItemMenu.state.isOpen;
  }

  isMenuModalOpen() {
    return this.refs.modalPlusMenu.state.isOpen;
  }

  openMenuModal() {
    this.refs.modalPlusMenu.open();
  }

  isDrawerOpen() {
    return this.props.isDrawerOpen();
  }

  openCheckInModal()
  {
    this.openModal("checkInModal");
  }

  openEditFolderModal()
  {
    this.openModal("editFolderModal");
  }
  
  openEditDocumentModal()
  {
    this.openModal("editDocumentModal");
  }
  
  openUpdateVersionsModal()
  {
    this.openModal("updateVersionsModal");
  }
  
  openCreateFolder() {
    this.refs.CreateFolder.open();

  }

  closeCreateFolder() {
    this.refs.CreateFolder.close();
    this.setState({ ifCreatingFolder: false })
  }


  setProcessingStyle() {
    this.setState({ ifCreatingFolder: true })

  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.navReducer.HasError) {
      this.openModal("errorModal");
    }
    if (nextprops.navReducer.HasInfo) {
      this.openModal("infoModal");
    }
    if (nextprops.navReducer.HasConfirm) {
      this.openModal("confirmModal");
    }
  
    if (nextprops.navReducer.HasToast)
    {
      const type = nextprops.navReducer.GlobalToastType; 
      const message = nextprops.navReducer.GlobalToastMessage;
      const title = nextprops.navReducer.GlobalToastTitle;

      this.showMessage(type, message, title);
      this.props.dispatch(clearToast());
    }

  }
  
  _orientationDidChange(orientation) {
    if (orientation == 'LANDSCAPE') {
      this.setState({orientation: 'horizontal'})
    } else {
      this.setState({orientation: 'vertical'})
    }
  }
  
  showMessage(type: string, message: string, title: string){

     MessageBarManager.showAlert({
        title: title,
        message: message,
        alertType: type,
        position: 'bottom',
        messageStyle:  {textAlign: 'center', color: '#fff', margin: 5},
        stylesheetSuccess: {backgroundColor: '#3290F1', strokeColor: '#3290F1'},
        stylesheetWarning: {backgroundColor: '#F2B702', strokeColor: '#F2B702'},
        stylesheetError: {backgroundColor: '#DE4040', strokeColor: '#DE4040'},
        stylesheetInfo: {backgroundColor: '#333', strokeColor: '#DE4040'},
    });
  }

    componentWillMount(){
 MessageBarManager.unregisterMessageBar();



  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange.bind(this));
    MessageBarManager.registerMessageBar(this.refs.alert);
    //this.showMessage("info", "asset deleted successfully");
    //  this.refs.mainContainer.showMessage("info", "asset deleted successfully");
  }

  render() {
    const {navReducer} = this.props
    var BContent = <Text style={styles.text}>error message</Text>
    var modalStyle = this.state.ifCreatingFolder ? styles.ifProcessing : [styles.modal, styles.createFolder]

    var showPopupMenu = this.state.isPopupMenuOpen;
    var showKenestoToolbar = navReducer.routes[navReducer.index].key === 'login' || navReducer.routes[navReducer.index].key === 'forgotPassword' || navReducer.routes[navReducer.index].key === 'KenestoLauncher' ? false : true;
    var documentlist = getDocumentsContext(navReducer);
    const sortBy = documentlist.sortBy;

    return (
      <View style={styles.container}>
        {showKenestoToolbar ?

          <KenestoToolbar   onActionSelected={this.onActionSelected}
            onPressPopupMenu={this.onPressPopupMenu}
            onIconClicked = {this.onNavIconClicked.bind(this) }
            navReducer={this.props.navReducer}
            documentlists = {this.props.documentlists}
            isPopupMenuOpen={this.state.isPopupMenuOpen}
            dispatch={this.props.dispatch}
            />
          :
          <View></View>
        }
        <NavigationRootContainer closeItemMenuModal ={this.closeItemMenuModal.bind(this) } isItemMenuModalOpen ={this.isItemMenuModalOpen.bind(this) } closeDrawer ={this.closeDrawer.bind(this) } isDrawerOpen ={this.isDrawerOpen.bind(this) } isMenuModalOpen={this.isMenuModalOpen.bind(this) } closeMenuModal={this.closeMenuModal.bind(this)  }/>
        <Modal style={[styles.modal, styles.plusMenu]} position={"bottom"}  ref={"modalPlusMenu"} isDisabled={false}>
          <PlusMenu closeMenuModal = {this.closeMenuModal.bind(this) } 
            openCreateFolder = {this.openCreateFolder.bind(this) }  createError={() => this.openModal("errorModal") }
            closeCreateFolder={this.closeCreateFolder.bind(this) }/>
        </Modal>
        <Modal style={[styles.modal, styles.itemMenu]} position={"bottom"}  ref={"modalItemMenu"} isDisabled={false}>
          <ItemMenu closeItemMenuModal = {this.closeItemMenuModal.bind(this) }
             createError={() => this.openModal("errorModal") }
            closeCreateFolder={this.closeCreateFolder.bind(this) } openUpdateVersionsModal={this.openUpdateVersionsModal.bind(this) } openCheckInModal={this.openCheckInModal.bind(this) } openEditDocumentModal={this.openEditDocumentModal.bind(this) } openEditFolderModal={this.openEditFolderModal.bind(this)}/>
        </Modal>
        <Modal style= {modalStyle} position={"center"}  ref={"CreateFolder"} isDisabled={false}>
          <CreateFolder closeMenuModal = {this.closeMenuModal.bind(this) } openMenuModal = {this.closeCreateFolder.bind(this) }
            closeCreateFolder={this.closeCreateFolder.bind(this) } setCreateFolderStyle={this.setProcessingStyle.bind(this) }
            />
        </Modal>
        <Modal style= {modalStyle} position={"center"}  ref={"checkInModal"} isDisabled={false}>
          <CheckInDocument closeModal = {() => this.closeModal("checkInModal") } openModal = {() => this.openModal("checkInModal") }/>
        </Modal>
        <Modal style= {modalStyle} position={"center"}  ref={"editFolderModal"} isDisabled={false}>
          <EditFolder closeModal = {() => this.closeModal("editFolderModal") } openModal = {() => this.openModal("editFolderModal") }/>
        </Modal>
        <Modal style= {modalStyle} position={"center"}  ref={"editDocumentModal"} isDisabled={false}>
          <EditDocument closeModal = {() => this.closeModal("editDocumentModal") } openModal = {() => this.openModal("editDocumentModal") }/>
        </Modal>
        <Modal style= {styles.updateVersionsModal} position={"center"}  ref={"updateVersionsModal"} isDisabled={false}>
          <UpdateVersions closeModal = {() => this.closeModal("updateVersionsModal") } openModal = {() => this.openModal("updateVersionsModal") }/>
        </Modal>
        <Modal style={[styles.modal, styles.error]} position={"center"}  ref={"errorModal"} isDisabled={false}>
          <Error closeModal = {() => this.closeModal("errorModal") } openModal = {() => this.openModal("errorModal") }/>
        </Modal>
        <Modal style={[styles.modal, styles.error]} position={"center"}  ref={"infoModal"} isDisabled={false}> 
          <Info closeModal = {() => this.closeModal("infoModal") } openModal = {() => this.openModal("infoModal") }/>
        </Modal>
        <Modal style={[styles.modal, styles.error]} position={"center"}  ref={"confirmModal"} isDisabled={false}>
          <Confirm closeModal = {() => this.closeModal("confirmModal") } openModal = {() => this.openModal("confirmModal") }/>
        </Modal>

        {showPopupMenu ?
          <View style={styles.popupMenuContainer}>
            <TouchableWithoutFeedback onPress={this.hidePopupMenu.bind(this) } >
              <View style={styles.popupMenu}>
                <View style={styles.popupMenuContent}>

                  <View>
                    <TouchableWithoutFeedback onPress={(value) => this.onSortBy(constans.ASSET_NAME) } disabled={sortBy == constans.ASSET_NAME}>
                      <View style={styles.optionContainer}>
                        <Icon name="sort-by-alpha" style={[styles.iconStyle, sortBy != constans.ASSET_NAME ? {} : styles.disabledIcon]} />
                        <Text style={sortBy != constans.ASSET_NAME ? styles.activeOption : styles.inactiveOption}>Sort by Name</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>

                  <View>
                    <TouchableWithoutFeedback onPress={(value) => this.onSortBy(constans.MODIFICATION_DATE) } disabled={sortBy == constans.MODIFICATION_DATE}>
                      <View style={styles.optionContainer}>
                        <Icon name="date-range" style={[styles.iconStyle, sortBy != constans.MODIFICATION_DATE ? {} : styles.disabledIcon]} />
                        <Text style={sortBy != constans.MODIFICATION_DATE ? styles.activeOption : styles.inactiveOption}>Sort by Date</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>

                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
          :
          <View></View>
        }

      <MessageBarAlert ref="alert" />
        <DropDownOptions ref={"dropDownOptionsContainer"} />
        
      </View>
    )
  }
}


Main.childContextTypes = {
  plusMenuContext: React.PropTypes.object,
  itemMenuContext: React.PropTypes.object,
  errorModal: React.PropTypes.object,
  dropDownContext: React.PropTypes.object
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
    sessionToken, 

  }
}

export default connect(mapStateToProps)(Main)

