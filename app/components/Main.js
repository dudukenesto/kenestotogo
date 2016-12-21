import React from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ToolbarAndroid,
  TouchableWithoutFeedback,
  AppState
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
import Processing from './Processing'
import {connect} from 'react-redux'
import KenestoToolbar from './KenestoToolbar'
import * as documentsActions from '../actions/documentsActions'
import {pop, updateRouteData, clearToast,updatedOrientation} from '../actions/navActions'
import * as constans from '../constants/GlobalConstans'
import {getDocumentsContext} from '../utils/documentsUtils'
import Error from './Error'
import Toast from './Toast'
import Info from './Info'
import Confirm from './Confirm'
import CheckInDocument from './CheckInDocument'
import { writeToLog } from '../utils/ObjectUtils'
import * as Animatable from 'react-native-animatable';
import {config} from '../utils/app.config'
//import PubNub from 'pubnub'
//import PushController from './PushController';
//import PushNotification from 'react-native-push-notification';
//import OneSignal from 'react-native-onesignal';
var MessageBarAlert = require('react-native-message-bar').MessageBar;
// var MessageBarManager = require('react-native-message-bar').MessageBarManager;
import DropDownOptions from './DropDownOptions';
var Orientation = require('./KenestoDeviceOrientation');
var Dimensions = require('Dimensions');
var { width, height } = Dimensions.get('window');

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
  toast: {
    height: 50,
  },
  createFolder: {
    height: 280,
    width: 320
  },
  ifProcessing: {
    height: 90,
    width: 320,
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingModal: {
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
  popupMenuContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  toolbarContainer:{
      flex: 1,
      position: 'absolute',
      left: 0,
      top: 0,
      right: 0,
      height: 50,
      zIndex: 100,
      opacity: 0.8,
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
      dropDownContext: this.refs.dropDownOptionsContainer, 
      toolBar: this.refs.toolBar
    };
  }

  constructor(props) {
    super(props)

        this.state = {
       //   ifCreatingFolder: false,
          isPopupMenuOpen: false,
          isDropDownOpen: true,
          toastMessage: '',
          toastType: '' 
          // pubnub :new PubNub({  publishKey: config.pubnub.publishKey,
          // subscribeKey: config.pubnub.subscribeKey,
          // ssl: config.pubnub.ssl})
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
    dispatch(documentsActions.refreshTable(routeData, true));
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

    dispatch(documentsActions.refreshTable(routeData, true));
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
    //this.setState({ ifCreatingFolder: false })
  }


  // setProcessingStyle() {
  //   this.setState({ ifCreatingFolder: true })

  // }

  componentWillReceiveProps(nextprops) {
    if (nextprops.navReducer.isProcessing) {
      this.openModal("processingModal");
    }
    else 
    {
      this.closeModal("processingModal")
    }

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
      this.setState({
        toastType: nextprops.navReducer.GlobalToastType,
        toastMessage: nextprops.navReducer.GlobalToastMessage
      })

      this.openModal("toastModal");
      setTimeout(this.closeToast.bind(this), 4000)
      this.props.dispatch(clearToast());
    }
   

  }
  
  closeToast(){
    this.refs.toastModal.close();
  }

    // handleAppStateChange(appState) {
    //   if (appState === 'background') {
    //     let date = new Date(Date.now() + (5000));

    //     if (Platform.OS === 'ios') {
    //       date = date.toISOString();
    //     }

    //     PushNotification.localNotificationSchedule({
    //       message: "My Notification Message",
    //       date,
    //     });
    //   }
    // }


  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange.bind(this));
    // OneSignal.configure({});
   // AppState.addEventListener('change', this.handleAppStateChange);
    // MessageBarManager.registerMessageBar(this.refs.alert);
  }


  _orientationDidChange(orientation) {
    var o =  orientation == 'LANDSCAPE' ? 'LANDSCAPE' : 'PORTRAIT';
    this.props.dispatch(updatedOrientation(o));
  }

  // showMessage(type: string, message: string, title: string){
  //   const alertProps = {
  //     duration: 1500,
  //     message: message,
  //     alertType: type,
  //     position: 'bottom',
  //     messageStyle: { textAlign: 'center', color: '#fff', margin: 5 },
  //     stylesheetSuccess: { backgroundColor: '#3290F1', strokeColor: '#3290F1' },
  //     stylesheetWarning: { backgroundColor: '#F2B702', strokeColor: '#F2B702' },
  //     stylesheetError: { backgroundColor: '#f00', strokeColor: '#f00' },
  //     stylesheetInfo: { backgroundColor: '#333', strokeColor: '#333' },
  //   }
  //   if (type === constans.ERROR) {
  //     alertProps.avatar = require('../assets/icn_error_toast.png');
  //     alertProps.avatarStyle = { height: 20, width: 20, alignSelf: 'center', marginLeft: 5 };
  //   }

  //    MessageBarManager.showAlert(alertProps);
  // }

  // hideMessageBar(){
  //   MessageBarManager.hideAlert();
  // }

    componentWillMount(){
//  MessageBarManager.unregisterMessageBar();

      // this.state.pubnub.addListener({
      //     message: function(pubnubMessage) {

      //       //  PushNotification.localNotification({ message : pubnubMessage.message.Subject, userInfo : pubnubMessage.message})

      //       //  console.log('pubnubMessage.message.Subject = ' + pubnubMessage.message.Subject);
      //       //  console.log('pubnubMessage.message.Text = ' + pubnubMessage.message.Text);
      //         // handle message
      //     }
      // })

      // this.state.pubnub.subscribe({ 
      //     channels: ['scott@kenestodemo.com'] 
      // });


  }
  
  showToolBar(){
    this.refs.toolBar.fadeInDown(0);
  }
  
  hideToolBar(){
    this.refs.toolBar.fadeOutUp(0);
  }



  render() {
    const {navReducer} = this.props
    var BContent = <Text style={styles.text}>error message</Text>
    //var modalStyle = this.state.ifCreatingFolder ? styles.ifProcessing : [styles.modal, styles.createFolder]
   var modalStyle =  [styles.modal, styles.createFolder]; 
    var showPopupMenu = this.state.isPopupMenuOpen;
    var showKenestoToolbar =  navReducer.routes[navReducer.index].key === 'login' || navReducer.routes[navReducer.index].key === 'forgotPassword' || navReducer.routes[navReducer.index].key === 'KenestoLauncher' ? false : true;
    var documentlist = getDocumentsContext(navReducer);
    var toolbarStyle = navReducer.routes[navReducer.index].key === 'document' ? styles.toolbarContainer : null;
    const sortBy = documentlist.sortBy;

    return (
      <View style={styles.container}>
        {showKenestoToolbar ?
          <Animatable.View ref={"toolBar"} easing="ease-in-out-cubic" style={toolbarStyle} duration={600}> 
            <KenestoToolbar
              onActionSelected={this.onActionSelected}
              onPressPopupMenu={this.onPressPopupMenu}
              onIconClicked = {this.onNavIconClicked.bind(this) }
              navReducer={this.props.navReducer}
              documentsReducer = {this.props.documentsReducer}
              isPopupMenuOpen={this.state.isPopupMenuOpen}
              dispatch={this.props.dispatch}
              />
          </Animatable.View>
          :
          <View></View>
        }
        <NavigationRootContainer closeItemMenuModal ={this.closeItemMenuModal.bind(this) } isItemMenuModalOpen ={this.isItemMenuModalOpen.bind(this) } closeDrawer ={this.closeDrawer.bind(this) } isDrawerOpen ={this.isDrawerOpen.bind(this) } isMenuModalOpen={this.isMenuModalOpen.bind(this) } closeMenuModal={this.closeMenuModal.bind(this)  }/>
         <Modal style= {styles.processingModal} position={"center"}  ref={"processingModal"} isDisabled={false} animationDuration={0}>
          <Processing  closeModal = {() => this.closeModal("processingModal") }  openModal = {() => this.openModal("processingModal")}/>
        </Modal>
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
            closeCreateFolder={this.closeCreateFolder.bind(this)} openProcessingModal={() => this.openModal("processingModal")} 
            closeProcessingModal={() => this.closeModal("processingModal") }
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
        <Modal style={[styles.modal, styles.toast]} position={"bottom"}  ref={"toastModal"} isDisabled={false} backdrop={false}>
          <Toast closeModal = {() => this.closeModal("toastModal") } openModal = {() => this.openModal("toastModal")} toastType={this.state.toastType} toastMessage={this.state.toastMessage} />
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

//  <PushController dispatch={this.props.dispatch} navReducer={this.props.navReducer} env={this.props.env} height={height} width={width}/>

Main.childContextTypes = {
  plusMenuContext: React.PropTypes.object,
  itemMenuContext: React.PropTypes.object,
  errorModal: React.PropTypes.object,
  dropDownContext: React.PropTypes.object, 
  toolBar: React.PropTypes.object, 
}

Main.contextTypes = {
  drawer: React.PropTypes.object
};

function mapStateToProps(state) {

  const { documentsReducer, navReducer} = state
  const {env, sessionToken, email } = state.accessReducer;
  //alert(sessionToken);
  return {
    documentsReducer,
    navReducer,
    env,
    sessionToken,

  }
}

export default connect(mapStateToProps)(Main)

