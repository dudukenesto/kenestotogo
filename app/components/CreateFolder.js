import React from "react"; 
import {View, Text,TextInput, StyleSheet, Animated, Dimensions} from "react-native";
import Button from "react-native-button";

import Icon from 'react-native-vector-icons/MaterialIcons';
import config from '../utils/app.config';
import * as documentsActions from '../actions/documentlists'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

var styles = StyleSheet.create({

    displayIcon: {
        fontSize: 30,
        height: 30,
        color: 'blue',
  },
   content:{
        flexDirection:'row',
    },
    textEdit: {
        height: 40, 
        width: 100,
        borderColor: 'grey', 
        backgroundColor: 'white',
 
        borderWidth: 1
  },
});

class CreateFolder extends React.Component {
    constructor(props){
        super (props);

        this.state = {
           
            folderName: '',
        };
    }

    componentDidMount() {
     
        this.refs.folderName.focus();
    }

    create(){
        this.props.dispatch(this.props.createFolder(this.state.folderName))
    }

     

    render(){
        return (
           
                <View style={{  width:250,
                                height:250,
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor:"white" }}>
                    <Text>Create new folder</Text>
                    <View style={styles.content}>
                         <Icon name="folder" style={styles.displayIcon} />
                          <TextInput
                            ref="folderName"
                            value={this.state.folderName} 
                            onChangeText={folderName => this.setState({folderName})}
                            style={styles.textEdit}
                            placeholder="Folder Name"
                           
                            />
                    </View>
                    <View style={styles.content}>
                        <Button onPress={this.create.bind(this)}>Create</Button>
                        <Button onPress={this.props.closeCreateFolder.bind(this)}>Close</Button>
                    </View>
                </View>
        );
    }
}



function mapStateToProps(state) {    
  

  return {
    folderId : state.documentlist.fId
  }
}

function  matchDispatchToProps(dispatch) {
    return bindActionCreators({
       createFolder : documentsActions.createFolder, 
        dispatch,
       
    }, dispatch)
    
}

export default connect(mapStateToProps,matchDispatchToProps)(CreateFolder)