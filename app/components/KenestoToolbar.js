import React from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
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
  render() {
  
    return (
        <Icon.ToolbarAndroid 
                    style={styles.toolbar}
                    onActionSelected={this.props.onActionSelected}
                    titleColor='#fff'
                    backgroundColor='#888'
                    title={'Kenesto hello'}
                    navIconName='menu'
                    iconColor='orange'
                   onIconClicked = {this.props.onIconClicked}
                    actions={[
                            {title: 'Search', iconName: 'search',iconSize: 30, show: 'always', iconColor: '#000'  },
                             {title: 'GoBack', iconName: 'arrow-back', show: 'always', iconColor: '#000' },
                            {title: 'Filter', iconName: 'more-vert', show: 'always', iconColor: '#000' }
                            ]}
                    overflowIconName="more"
                />

    )
  }

  


}




export default KenestoToolbar
