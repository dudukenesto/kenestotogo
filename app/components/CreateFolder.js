import React from "react"; 
import {View, Text,TextInput, StyleSheet, Animated, Dimensions} from "react-native";
import Button from "react-native-button";
import Modal from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProgressBar from './ProgressBar'
import config from '../utils/app.config';
import * as documentsActions from '../actions/documentlists'
import {createFolder} from '../actions/documentlists'
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
   modal: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  InProggress: {
    height: 500, 
    width: 500
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
  //      if (!this.props.creatingFolder)
  //          this.refs.folderName.focus();
    }

    componentWillReceiveProps(nextprops){

       

        if (nextprops.creatingFolder == 2)
        {
            this.props.closeCreateFolder();
            
           
        }
    }

    create(){
        this.props.dispatch(createFolder(this.state.folderName)); 

    }

     

    render(){

        if (this.props.creatingFolder == 1){

           
            return(         
                    <View style={{  
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor:"white" }}>
                      <Text>Creating a folder...</Text> 
                   <ProgressBar isLoading={true}/>
                   
                </View>
          
            )
        }

        return (
           
                <View style={{ 
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
    folderId : state.documentlist.fId,
    creatingFolder : state.documentlists.creatingFolder
  }
}

export default connect(mapStateToProps)(CreateFolder)