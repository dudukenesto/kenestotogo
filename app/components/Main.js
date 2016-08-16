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
import {pop} from '../actions/navActions'

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



    getChildContext(){
        return { kModal:this.refs.modalPlusMenu };
    }

constructor (props) {
    super(props)
        this.state = {};
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
      }
  }

  onNavIconClicked(){
       this.context.drawer.open();
  }

  closeMenuModal(){
      this.refs.modalPlusMenu.close();
  }

  openMenuModal(){
    this.refs.modalPlusMenu.open();
  }

  openCreateFolder(){
    this.refs.CreateFolder.open();
 
  }

  closeCreateFolder(){
     this.refs.CreateFolder.close();
  }
  

    render(){

          var BContent = <Text style={styles.text}>error message</Text>  
        return(
             <View style={styles.container}> 
                <Icon.ToolbarAndroid 
                    style={styles.toolbar}
                    onActionSelected={this.onActionSelected}
                    titleColor='#fff'
                    backgroundColor='#888'
                    title={'Kenesto hello'}
                    navIconName='menu'
                    iconColor='orange'
                   onIconClicked = {this.onNavIconClicked.bind(this)}
                    actions={[
                            {title: 'Search', iconName: 'search',iconSize: 30, show: 'always', iconColor: '#000'  },
                             {title: 'GoBack', iconName: 'arrow-back', show: 'always', iconColor: '#000' },
                            {title: 'Filter', iconName: 'more-vert', show: 'always', iconColor: '#000' }
                            ]}
                    overflowIconName="more"
                />
                <NavigationRootContainer />
                <Modal style={[styles.modal, styles.plusMenu]} position={"bottom"}  ref={"modalPlusMenu"} isDisabled={false}>
                    <PlusMenu closeMenuModal = {this.closeMenuModal.bind(this)} openMenuModal = {this.openCreateFolder.bind(this)} 
                       openCreateFolder = {this.openCreateFolder.bind(this)} 
                        closeCreateFolder={this.closeCreateFolder.bind(this)}/>
                </Modal>
                 <Modal style={[styles.modal, styles.createFolder]} position={"center"}  ref={"CreateFolder"} isDisabled={false}>
                    <CreateFolder closeMenuModal = {this.closeMenuModal.bind(this)} openMenuModal = {this.closeCreateFolder.bind(this)} 
                     closeCreateFolder={this.closeCreateFolder.bind(this)}
                     />
                </Modal>

            </View>
        )
    
    }
}

Main.childContextTypes = {
    kModal:  React.PropTypes.object
}

Main.contextTypes = {
    drawer: React.PropTypes.object
};

function mapStateToProps(state) {
 
  const { documentlists, documentlist } = state
  const {env, sessionToken } = state.accessReducer; 
  return {
    documentlist,
    documentlists,
    env,
    sessionToken
    
  }
}

export default connect(mapStateToProps)(Main)