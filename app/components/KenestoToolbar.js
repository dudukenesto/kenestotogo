import React from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {getDocumentsContext} from '../utils/documentsUtils'
import * as constans from '../constants/GlobalConstans'
import {
  View,
  Text,
  StyleSheet,
  ToolbarAndroid
} from 'react-native'


let styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#3a3f41',
    height: 50,
  },

})


class KenestoToolbar extends React.Component {

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
    }
    return toolbarActions;
  }


    
  render() {
  
    return (
        <Icon.ToolbarAndroid 
                    style={styles.toolbar}
                    onActionSelected={this.props.onActionSelected}
                    titleColor='#333'
                    backgroundColor='#eee'
                    title={'Kenesto hello'}
                    navIconName='menu'
                    iconColor='orange'
                   onIconClicked = {this.props.onIconClicked}
                    actions={this.getToolbarActions()}
                    overflowIconName="more"
                />

    )
  }

  


}




export default KenestoToolbar
