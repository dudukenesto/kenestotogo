import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ToolbarAndroid
} from 'react-native'

import NavigationRootContainer from '../containers/navRootContainer'

let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  toolbar: {
    backgroundColor: '#3a3f41',
    height: 50,
  }
})
//  {title: 'Menu', icon: require('../assets/menu-icon2.png'), show: 'always'},
let toolbarActions = [
    {title: 'Search', icon: require('../assets/search100.png'), show: 'always'},
   {title: 'Filter', icon: require('../assets/menudots.png'), show: 'always'}
]


export default class Main extends React.Component {

constructor (props) {
    super(props)
        this.state = {};
         this.onActionSelected = this.onActionSelected.bind(this)
  }

  onActionSelected(position){
      switch (position) {
          case 0:
          alert(0);
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

    render(){
        return(
            <View style={styles.container}> 
                
                <NavigationRootContainer />
            </View>
        )
    
    }
}

Main.contextTypes = {
    drawer: React.PropTypes.object
};
