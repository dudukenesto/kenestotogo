import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  NativeModules
} from 'react-native'
import Button from './Button'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {connect} from 'react-redux'
import fontelloConfig from '../assets/icons/config.json';
import { createIconSetFromFontello } from  'react-native-vector-icons'
import * as navActions from '../actions/navActions'
import {scanRoute} from '../constants/routes'
import {getFileUploadUrl, getDocumentsContext} from '../utils/documentsUtils'
import {uploadToKenesto} from '../actions/documentlists'
var ImagePicker = NativeModules.ImageCropPicker;
const KenestoIcon = createIconSetFromFontello(fontelloConfig);

let styles = StyleSheet.create({
    container: {
        flex: 1,
        flexWrap: "wrap",
        flexDirection: 'row',
        paddingTop: 35,
               
        // FOR LANDSCAPE ORIENTATION:
        
        // alignSelf: 'stretch',
        // justifyContent: 'space-between',
        // paddingHorizontal: 20,        
    },
    actionButtonIcon: {
        fontSize: 45,
    },
    actionHolder: {        
        width: 90,
        height: 90,
        margin: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    actionName: {
        textAlign: "center",
        fontSize: 14,
        color: "#000", 
    },
    
})

class PlusMenu extends React.Component{
      constructor(props){
        super (props);
         this.state = {
            file: null,
            documentsContext: getDocumentsContext(this.props.navReducer), 
            readyForUpload: false
            };
    }

    
  upload(){
      
    
     const url = getFileUploadUrl(this.props.env, this.props.sessionToken, this.state.file.name, "", "",  this.state.documentsContext.fId);

    const fileName = this.state.file.path.substring(this.state.file.path.lastIndexOf('/') + 1); 
    const name = fileName.substring(0,  fileName.lastIndexOf('.'));
    this.props.dispatch(uploadToKenesto({name: name, uri : this.state.file.path, type: this.state.file.type},url));

     this.props.closeMenuModal("modalPlusMenu");
    
  }

    takePhoto(cropping : boolean){

        ImagePicker.openCamera({
        cropping: cropping,
        width: 400,
        height: 400,
            includeBase64: true
        }).then(image => {
//alert(image.path);
        const imageName = image.path.substring(image.path.lastIndexOf("/") + 1);
            
        this.setState({
            file: {uri: `data:${image.mime};base64,`+ image.data, width: image.width, height: image.height, name: imageName, data: image.data, path: image.path, type: image.mime},
        });

       this.upload();

        }).catch(e => alert(JSON.stringify(e)));

    
  }

  
    selectFromLib(cropping : boolean){

            ImagePicker.openPicker({
            width: 400,
            height: 400,
            cropping : false,
            includeBase64: true
            }).then(file => {
           
             const fileName = file.path.substring(file.path.lastIndexOf("/") + 1);

          
            this.setState({
                file: { name: fileName, path: file.path, type: file.mime},
            });

             this.upload();

            }).catch(e => alert(JSON.stringify(e)));

    
  }


    addFolder(){
        this.props.closeMenuModal("modalPlusMenu");
       // this.props.createError();
        this.props.openCreateFolder();
    }

    // scan(isCameraScan : boolean){
    //       this.props.closeMenuModal("modalPlusMenu");
    //        const documentsContext = getDocumentsContext(this.props.navReducer);

    //             var data = {
    //                     key: "scan",
    //                     baseFileId:"",
    //                     catId: documentsContext.catId,
    //                     fId: documentsContext.fId,
    //                     sortDirection: documentsContext.sortDirection,
    //                     sortBy: documentsContext.sortBy, 
    //                     isCameraScan: isCameraScan, 
    //                     name: 'Image to upload'
    //   }


    //     //  this.props.dispatch(navActions.push(scanRoute(data).route));
    // }
    

    render(){

        

        return(
            <View style={styles.container}>
                <View style={styles.actionHolder}>
                    <Icon name="create-new-folder" style={styles.actionButtonIcon} onPress={this.addFolder.bind(this)} />
                    <Text style={styles.actionName}>New Folder</Text>
                </View>
                
                <View style={styles.actionHolder}>
                    <Icon name="file-upload" style={styles.actionButtonIcon} onPress={()=> {this.selectFromLib.bind(this)(true)}}/>
                    <Text style={styles.actionName}>Upload File</Text>
                </View>
                
                <View style={styles.actionHolder}>
                    <Icon name="photo-camera" style={styles.actionButtonIcon} onPress={()=> {this.takePhoto.bind(this)(false)}} />
                    <Text style={styles.actionName}>Scan</Text>
                </View>                
            </View>
        )
    }

}

PlusMenu.contextTypes = {
    plusMenuContext:  React.PropTypes.object
}

function mapStateToProps(state) {
  const { navReducer } = state
  
  return {
      navReducer: navReducer,
        env: state.accessReducer.env, 
      sessionToken: state.accessReducer.sessionToken,

  }
}


export default connect(mapStateToProps)(PlusMenu)