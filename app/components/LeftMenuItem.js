import React from "react";
import {View, Text, StyleSheet,Image,Platform, TouchableHighlight, TouchableNativeFeedback} from "react-native";
import Button from "react-native-button";


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF",
    },
    row: {
        alignItems: 'center',
        backgroundColor: 'white',
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 30,
        paddingRight: 15,
    },
    selectedRow: {
        backgroundColor: "#E9EAEC",
    },
    selectedItem: {
        fontWeight : '900'
    },
    itemIcon: {
        backgroundColor: 'transparent',
        height: 22,
        marginRight: 15,
        width:22,
    },
    itemTitle: {
        fontSize: 14,
        marginRight: 10,
    },
    itemCount: {
      flex: 1,
      textAlign: 'right',
         
    }
});


export default class LeftMenuItem extends React.Component {

     constructor(props){
         if (typeof props == 'undefined')
           
            props = null;
            
        super(props);
       
    }
    render(){
       
    
       var TouchableElement = TouchableHighlight;
        if (Platform.OS === 'android') {
                TouchableElement = TouchableNativeFeedback;
        }
 

        var imageName = this.props.IsSelected ? this.props.listItem.iconSeleted :  this.props.listItem.itemIcon;
        var itemTitleStyle = this.props.IsSelected ? [styles.itemTitle,  styles.selectedItem] : styles.itemTitle; 
        var itemCountStyle = this.props.IsSelected ? [styles.itemCount,  styles.selectedItem] : styles.itemCount; 
        var rowStyle = this.props.IsSelected ? [styles.row,  styles.selectedRow] : styles.row; 

        return (
            <View>
                <TouchableElement
                        onPress={this.props.onSelect}
                        onShowUnderlay={this.props.onHighlight}
                        onHideUnderlay={this.props.onUnhighlight}>
                        <View style={rowStyle}>
                            <Image    
                                source={{ uri: imageName, isStatic: true }}                 
                                style={styles.itemIcon}
                            />
                            <Text style={itemTitleStyle} >
                                {this.props.listItem.itemTitle}
                            </Text>
                            <Text style={itemCountStyle}>
                                {this.props.listItem.itemCount}
                            </Text>
                        </View>
                </TouchableElement>
            </View>
            
        );
    }
    

}

