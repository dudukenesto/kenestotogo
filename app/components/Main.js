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
   btnModal: {
    position: "absolute",
    top: 100,
    right: 0,
    backgroundColor: "transparent"
  },
})
//  {title: 'Menu', icon: require('../assets/menu-icon2.png'), show: 'always'},
let toolbarActions = [
    {title: 'Search', icon: require('../assets/search100.png'), show: 'always'},
   {title: 'Filter', icon: require('../assets/menudots.png'), show: 'always'}
]


export default class Main extends React.Component {



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
          alert(1);
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
  


    render(){

          var BContent = <Text style={styles.text}>error message</Text>  
        return(
             <View style={styles.container}> 
                <Icon.ToolbarAndroid 
                    style={styles.toolbar}
                    actions={toolbarActions}
                    onActionSelected={this.onActionSelected}
                    titleColor='#fff'
                    backgroundColor='#888'
                    title={'Kenesto hello'}
                    navIconName='menu'
                    iconColor='orange'
                    onIconClicked = {this.onNavIconClicked}
                    actions={[
                            {title: 'Search', iconName: 'search',iconSize: 30, show: 'always', iconColor: '#000'  },
                            {title: 'Filter', iconName: 'more-vert', show: 'always', iconColor: '#000' }
                            ]}
                    overflowIconName="more"
                />
                <NavigationRootContainer />
                <Modal style={[styles.modal, styles.plusMenu]} position={"bottom"}  ref={"modalPlusMenu"} isDisabled={false}>
                    <PlusMenu closeMenuModal = {this.closeMenuModal.bind(this)} openMenuModal = {this.openMenuModal.bind(this)} />
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
