import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView, Image, TouchableOpacity} from 'react-native';
import {getFileUploadUrl,getDocumentsContext} from '../utils/documentsUtils'
import {uploadToKenesto} from '../actions/documentlists'
import {NativeModules, Dimensions} from 'react-native';
import {connect} from 'react-redux'
import RNFetchBlob from 'react-native-fetch-blob'
import ProggressBar from "../components/ProgressBar";
var ImagePicker = NativeModules.ImageCropPicker;
import {CameraKitCamera, CameraKitGalleryView} from 'react-native-camera-kit'
var FilePickerModule = NativeModules.FilePickerModule;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    backgroundColor: 'blue',
    marginBottom: 10
  },
  text: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center'
  }
});



class Scan extends React.Component {

  constructor() {
    super();
    this.state = {
      image: null,
      images: null, 
      initial: true, 
    };
  }

  scaledHeight(oldW, oldH, newW) {
    return (oldH / oldW) * newW;
  }


  upload(){
      

    const documentsContext = getDocumentsContext(this.props.navReducer);
    const url = getFileUploadUrl(this.props.env, this.props.sessionToken, this.state.image.name, "", "",  documentsContext.fId);

  const fileName = this.state.image.path.substring(this.state.image.path.lastIndexOf('/') + 1); 
  const name = fileName.substring(0,  fileName.lastIndexOf('.'));
 
this.setState({uploading : true});

this.props.dispatch(uploadToKenesto({name: name, uri : this.state.image.path, type: this.state.image.type, data: this.state.image.data,fileName : fileName},url));
    
  }

  takePhoto(cropping : boolean){

    ImagePicker.openCamera({
      cropping: cropping,
      width: 400,
      height: 400,
        includeBase64: true
    }).then(image => {

     const imageName = image.path.substring(image.path.lastIndexOf("/") + 1);
           
      this.setState({
        initial: false, 
        image: {uri: `data:${image.mime};base64,`+ image.data, width: image.width, height: image.height, name: imageName, data: image.data, path: image.path, type: image.mime},
        images: null});

    }).catch(e => alert(JSON.stringify(e)));

    
  }

    selectFromLib(cropping : boolean){

    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping : false,
       includeBase64: false
    }).then(image => {


      
    const imageName = image.path.substring(image.path.lastIndexOf("/") + 1);

    alert(imageName);
           
      // this.setState({
      //   initial: false, 
      //   image: {uri: `data:${image.mime};base64,`+ image.data, width: image.width, height: image.height, name: imageName, data: image.data, path: image.path, type: image.mime},
      //   images: null});

    }).catch(e => alert(JSON.stringify(e)));

    
  }

updateImage(image : Object){
  //var ff = this.camera.capture;
       //   const img = await ff(true);
       //alert(this.camera)
}

componentDidMount(){
  if (this.props.isCameraScan)
      this.takePhoto(true);
  else 
  this.selectFromLib(true);

}
   render() {

     if (this.state.uploading){
        return(
          <View>
            <Text>uploading file....</Text>
            <ProggressBar isLoading={true} />
           </View>
            )

     }

     console.log('render scan: ' + this.state.initial)
       const buttons = this.state.initial? null : (<View>
            <TouchableOpacity onPress={() => {this.takePhoto.bind(this)(true)}} style={styles.button}>
                <Text style={styles.text}>Shoot again</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.upload.bind(this)} style={styles.button}>
                <Text style={styles.text}>Upload to Kenesto</Text>
            </TouchableOpacity>
          </View>);

    return <View style={styles.container}>
      <ScrollView>
        {this.state.image ? <Image style={{width: 300, height: 300, resizeMode: 'contain'}} source={this.state.image} /> : null}
        {this.state.images ? this.state.images.map(i => <Image key={i.uri} style={{width: 300, height: this.scaledHeight(i.width, i.height, 300)}} source={i} />) : null}
      </ScrollView>
      <Text>
        {this.state.initial}
      </Text>
    {buttons}

    </View>;
  }
}

function mapStateToProps(state) {    
var {navReducer} = state; 


  return {
      env: state.accessReducer.env, 
      sessionToken: state.accessReducer.sessionToken,
      isFetching: state.documentlists.isFetching,
      navReducer : navReducer
  
  }
}

export default connect(mapStateToProps)(Scan)