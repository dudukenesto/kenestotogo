
import React from "react";
import {View, Text, StyleSheet, AsyncStorage, ListView, Image } from "react-native";
import Button from "react-native-button";
import LeftMenuItem from './LeftMenuItem';
import {updateRouteData} from '../actions/navActions'
import * as accessActions from '../actions/Access'
import {connect} from 'react-redux'

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: "#fff"
    },
    headerContainer: {
        height: 100,
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#F5F6F8",
        borderBottomWidth: 2,
        borderBottomColor: '#EbEbEb',
        marginBottom: 10
    },
    avatarContainer: {
        margin: 15
    },
    avatar: {
        height: 50,
        width: 50,
        borderRadius: 25,
  },
    userInfoContainer: {
        flex: 1
    },
     rowSeparator: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        height: 1,
        marginLeft: 4,
  },
  rowSeparatorSelected: {
        opacity: 1,
  },
  rowSeparatorHide: {
        opacity: 0
  }
});



class TabView extends React.Component {

    constructor(props){
        super (props);
        this.state = {
                dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
        }), 
        }
    }

    componentWillMount(){
        this.loadMenu();
    }




    getDataSource(menuItems: Array<any>) : ListView.DataSource  {
        return this.state.dataSource.cloneWithRows(menuItems);
    }

   loadMenu(selectedIndex = 0){
        var menuItems = [
            {
                Index: 0,
                itemTitle : 'My Documents', 
                itemCount : 60, 
                itemIcon: 'folder',
                selected: true,
                customStyle: ''
            },
            {
                Index: 1,
                itemTitle : 'Shared with me', 
                itemCount : 140, 
                itemIcon: 'folder',
                selected: false,
                customStyle: ''
            },
            {
                Index: 2,
                itemTitle : 'All Documents', 
                itemCount :20, 
                itemIcon: 'folder',
                selected: false,
                customStyle: ''
            },
            {
                Index: 3,
                itemTitle : 'Checked-out Documents', 
                itemCount : 42, 
                itemIcon: 'android',
                selected: false,
                customStyle: ''
            },
             {
                Index: 4,
                itemTitle : 'Archived Documents', 
                itemCount : 18, 
                itemIcon: 'restore',
                selected: false,
                customStyle: ''
            },
            {
                Index: 5,
                itemTitle : 'My usage space', 
                itemCount : null, 
                itemIcon: 'android',
                selected: false,
                customStyle: ''
            },
            {
                Index: 6,
                itemTitle : 'Logout', 
                itemCount : null, 
                itemIcon: 'power-settings-new',
                selected: false,
                customStyle: {color: "#FA8302"}
            }
        ]; 

 this.setState({
          dataSource:  this.getDataSource(menuItems), 
          selectedItem : selectedIndex 
        });
       
    }

    
    render(){
        const drawer = this.context.drawer;

        return (
            <View style={styles.screenContainer}>
                <View style={[styles.headerContainer, this.props.sceneStyle]}>
                    <View style={styles.avatarContainer}>
                        <Image source={require('../assets/userpic.jpg')} style={styles.avatar} />
                    </View>
                    <View  style={styles.userInfoContainer}>
                        <Text style={{color: '#000'}}>Username</Text>
                        <Text>{this.props.loggedUser}loggedUser (this.props.loggedUser)</Text>
                    </View>
                                        
                </View>
                <View>
                    <ListView 
                        ref="MenuList"
                        renderSeparator={this.renderSeparator.bind(this)}
                        dataSource={this.state.dataSource}
                        renderFooter={null}
                        renderRow={this.renderRow.bind(this)}
                        onEndReached={null}
                        automaticallyAdjustContentInsets={false}
                        keyboardDismissMode="on-drag"
                        keyboardShouldPersistTaps={true}
                        showsVerticalScrollIndicator={false}
                    />
                
                </View>
            </View>
            
        );
    }



SelectItem(menuitem : Object){
        const {dispatch, navReducer, closeDrawer} = this.props

        if (menuitem.Index == 6)
        {
            this.props.closeDrawer()
            dispatch(accessActions.logOut());
            return;
        }
    
        this.loadMenu(menuitem.Index);
       
    }


renderSeparator( sectionID: number | string,
    rowID: number | string,
    adjacentRowHighlighted: boolean){
        var style = styles.rowSeparator;
        if (adjacentRowHighlighted) {
            style = [style, styles.rowSeparatorHide];
        }
        return (
        <View key={'SEP_' + sectionID + '_' + rowID}  style={style}/>
        );
    }


    renderRow(listItem: Object,
        sectionID: number | string,
        rowID: number | string,
        highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void){
     
    return (
        <LeftMenuItem
                key={listItem.Id}
                onSelect={() => this.SelectItem(listItem)}
                onHighlight={() => highlightRowFunc(sectionID, rowID)}
                onUnhighlight={() => highlightRowFunc(null, null)}
                listItem={listItem}
                IsSelected = {listItem.Index == this.state.selectedItem}
            />
    );
     
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

export default connect(mapStateToProps)(TabView)

// TabView.contextTypes = {
//     drawer: React.PropTypes.object
// };
