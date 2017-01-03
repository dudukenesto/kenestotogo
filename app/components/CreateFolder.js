import React from "react"; 
import {View, Text,TextInput, StyleSheet, Animated, Dimensions, Switch} from "react-native";
import Button from "react-native-button";
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProgressBar from './ProgressBar'
import config from '../utils/app.config';
import * as documentsActions from '../actions/documentsActions'
import * as navActions from '../actions/navActions'
import {createFolder} from '../actions/documentsActions'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import { getDocumentsContext } from '../utils/documentsUtils'
var styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor:"white",
        padding: 15,
    },
    titleContainer: {
        flex: 1,
        justifyContent: "center",
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
        fontSize: 32,
        height: 30,
        position: "absolute",
        top: 18
    },
    textEdit: {
        flex: 1,
        color: "#000",
        // height: 50,            
        fontSize: 17,
        paddingLeft: 5,
        // paddingBottom: 15,
    },
    buttonsContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'space-between',
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

class CreateFolder extends React.Component {
    constructor(props){
        super (props);

        this.state = {
            isVault: false,
            folderName: '',
        };

       // alert(this.state.folderName)
    }


    create() {
       //alert(this.state.folderName  != '')
       if (this.state.folderName != '') {
           // this.props.setCreateFolderStyle();
           this.props.closeCreateFolder();
            this.props.dispatch(navActions.updateIsProcessing(true));
           setTimeout(() => {
               this.props.dispatch(createFolder(this.state.folderName, this.state.isVault || this.props.isParentVault));
           }, 100); 


       }
    }

    render(){

        if (this.props.creatingFolder == 1){
            return(         
                    <View style={styles.creatingFolder}>
                        <Text style={styles.processingMessage}>Creating a new folder</Text> 
                        <ProgressBar isLoading={true}/>
                    </View>
          
            )
        }

        return (
           
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Create a new folder</Text>
                </View>
                <View style={styles.nameContainer}>
                    <TextInput
                        ref="folderName"
                        value={this.state.folderName}
                        onChangeText={folderName => this.setState({ folderName }) }
                        style={styles.textEdit}
                        placeholder="Folder Name"
                        placeholderTextColor={"#ccc"}
                        selectionColor={"orange"}
                        underlineColorAndroid={"#ccc"}
                        />
                </View>
                <View style={styles.nameContainer}>
                    <Text style={styles.textEdit}>Vault folder</Text>
                    <Switch
                        onValueChange={(value) => this.setState({ isVault: value }) }
                        disabled={this.props.isParentVault}
                        value={this.state.isVault || this.props.isParentVault} />
                </View>
                <View style={styles.buttonsContainer}>
                    <Button onPress={this.create.bind(this) } containerStyle={styles.singleBtnContainer} style={styles.button}>Create</Button>
                    <Button onPress={this.props.closeCreateFolder.bind(this) } containerStyle={styles.singleBtnContainer} style={styles.button}>Cancel</Button>
                </View>

            </View>
        );
    }
}


 
function mapStateToProps(state) {    

 var documentlist = getDocumentsContext(state.navReducer);

  return {
    isParentVault : documentlist.isVault,
    creatingFolder : state.documentsReducer.creatingFolder
  }
}

// function  matchDispatchToProps(dispatch) {
//     return bindActionCreators({
//        createFolder : documentsActions.createFolder, 
       
//         dispatch,
       
//     }, dispatch)
    
// }

export default connect(mapStateToProps)(CreateFolder)