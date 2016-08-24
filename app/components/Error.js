import React from "react"; 
import {View, Text,TextInput, StyleSheet, Animated, Dimensions} from "react-native";
import Button from "react-native-button";
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProgressBar from './ProgressBar'
import config from '../utils/app.config';
import * as documentsActions from '../actions/documentlists'
import * as navActions from '../actions/navActions'
import {createFolder} from '../actions/documentlists'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

var styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor:"white",
        padding: 15,
    },
    titleContainer: {
        flex: 1,
        flexDirection: "row",
        // justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    title: {
        fontSize: 20,
        color: "#000",
        alignSelf: "center",
    },
    nameContainer: {
        flex: 1,
        flexDirection:'row',
        alignItems: "center",
    },
    icon: {
        color: '#000',
        fontSize: 20,
        marginRight: 5,
    },
    textEdit: {
        flex: 1,
        color: "#000",
        height: 50,            
        fontSize: 17,
        textAlign: "center",
        paddingBottom: 15,
    },
    buttonsContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'center',
        marginTop: 20, 
        alignSelf: "stretch",   
    },
    singleBtnContainer: {
        width: 140,
        justifyContent: "center",
        height: 50,
        backgroundColor: "#F5F6F8",
        borderWidth: 0.5,
        borderColor: "#BEBDBD"
   },
    button: {
        color: "#666666",
        fontWeight: "normal",
        fontSize: 18, 
   },
    creatingFolder: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:"white",
   },
    processingMessage: {
        fontSize: 16,
        marginRight: 40
    },
});

class Error extends React.Component {
    constructor(props){
        super (props);
    }



    clearError(){
      
        this.props.closeModal();
    }

    componentDidMount(){
        this.props.dispatch(navActions.clearError());
    }

     

    render(){

        return (
           
                <View style={styles.container}>
                    <View style={styles.titleContainer}>
                        <Icon name="error" style={styles.icon} />
                        <Text style={styles.title}>{this.props.errorTitle}</Text>
                    </View>
                    
                    <View style={styles.nameContainer}>
                        <Text style={styles.textEdit}>{this.props.errorDetails}</Text>
                    </View>
                    
                    <View style={styles.buttonsContainer}>
                        <Button onPress={this.clearError.bind(this)} containerStyle={styles.singleBtnContainer} style={styles.button}>ok</Button>
                    </View>
                        
                </View>
        );
    }
}


 
function mapStateToProps(state) {    
  

  return {
      hasError : state.navReducer.HasError, 
      errorTitle : state.navReducer.GlobalErrorTitle, 
      errorDetails: state.navReducer.GlobalErrorDetails
  }
}


export default connect(mapStateToProps)(Error)