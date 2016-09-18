import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView, Image, TouchableOpacity} from 'react-native';
import {getFileUploadUrl} from '../utils/documentsUtils'
import {NativeModules, Dimensions} from 'react-native';
import {connect} from 'react-redux'

var ImagePicker = NativeModules.ImageCropPicker;

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
      initial: true
    };
  }

  scaledHeight(oldW, oldH, newW) {
    return (oldH / oldW) * newW;
  }


  upload(){
      const url = getFileUploadUrl(this.props.env, this.props.sessionToken, this.state.image.name);

       fetch(url)
      .then(response => response.json())
      .then(json => {
        
        if (json.ResponseData.ResponseStatus == "FAILED") {
            alert(failed)
          // dispatch(emitError(json.ResponseData.ErrorMessage,'error details'))
          // dispatch(emitError(json.ResponseData.ErrorMessage,""))
        }
        else {
         var AccessUrl = json.ResponseData.AccessUrl;

console.log(AccessUrl)
           console.log('accessUrl = ' + AccessUrl);
                fetch(AccessUrl,{
                method: 'put',
                headers: {
                    'Accept': 'multipart/form-data',
                    'Content-Type': 'multipart/form-data'
                },
                body:  this.state.avatarData// JSON.stringify({fileContents : this.state.avatarData})
                }).then(response => {
                    
                        alert( JSON.stringify(response));
                }).catch((error) => {
                        console.log("error:" + JSON.stringify(error))
                        this.props.dispatch(emitError("Failed to upload to s3",""))
                    }).done();
 
                    
        }
      })
      .catch((error) => {
        console.log("error:" + JSON.stringify(error))
        this.props.dispatch(emitError("Failed to retrieve statistics",""))


      })
    
  }

  takePhoto(){
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      includeBase64: true
    }).then(image => {
      console.log('received image', image);
      const imageName = image.path.substring(image.path.lastIndexOf("/") + 1);
     
      this.setState({
        image: {uri: `data:${image.mime};base64,`+ image.data, width: image.width, height: image.height, name: imageName},
        images: null, 
        initial: false
      });
    }).catch(e => {});
    
  }

componentDidMount(){
   this.takePhoto();
}
   render() {
       const buttons = this.state.initial? null : (<View>
            <TouchableOpacity onPress={this.takePhoto.bind(this)} style={styles.button}>
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

    {buttons}

    </View>;
  }
}

function mapStateToProps(state) {    

  return {
      env: state.accessReducer.env, 
      sessionToken: state.accessReducer.sessionToken
  }
}

export default connect(mapStateToProps)(Scan)