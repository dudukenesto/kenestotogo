import React from "react"; 
import {View, Text,TextInput, StyleSheet, Animated, Dimensions, Switch} from "react-native";
import Button from "react-native-button";
import Modal from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProgressBar from './ProgressBar'
import config from '../utils/app.config';
import * as documentsActions from '../actions/documentlists'
import {getSelectedDocument} from '../utils/documentsUtils'
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
    // modal: {
    //     justifyContent: 'center',
    //     alignItems: 'center'
    // },
    // InProggress: {
    //     height: 500, 
    //     width: 500
    // },
});

class EditFolder extends React.Component {
    constructor(props){
        super (props);
        var document = getSelectedDocument(this.props.documentlists, this.props.navReducer); 
        this.state = {
            isVault: document.IsVault,
            folderName: document.Name,
            folderId:document.Id
        };
    }

    componentDidMount() {
  //      if (!this.props.creatingFolder)
  //          this.refs.folderName.focus();
    }

    componentWillReceiveProps(nextprops){
    }

    _edit() {
        if (this.state.folderName != false) {
            this.props.dispatch(documentsActions.EditFolder(this.state.folderId ,this.state.folderName, this.state.isVault));
            this.props.closeModal();
        }
    }
    render(){
        return (
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Edit folder</Text>
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
                        // style={{ j}}
                        value={this.state.isVault} />
                </View>
                <View style={styles.buttonsContainer}>
                    <Button onPress={this._edit.bind(this) } containerStyle={styles.singleBtnContainer} style={styles.button}>Edit</Button>
                    <Button onPress={this.props.closeModal.bind(this) } containerStyle={styles.singleBtnContainer} style={styles.button}>Cancel</Button>
                </View>

            </View>
        );
    }
}


 
function mapStateToProps(state) {
    const { documentlists,navReducer} = state
    return {
        documentlists,
        navReducer
    }
}


export default connect(mapStateToProps)(EditFolder)