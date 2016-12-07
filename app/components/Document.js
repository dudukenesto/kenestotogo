'use strict';
var React = require('react');
var ReactNative = require('react-native');
var {
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  WebView,
  Dimensions,
} = ReactNative;
import Button from './Button'
import {getEnvIp} from '../utils/accessUtils'
var HEADER = '#3b5998';
var BGWASH = 'rgba(255,255,255,0.8)';
var DISABLED_WASH = 'rgba(255,255,255,0.25)';
const window = Dimensions.get('window');
var TEXT_INPUT_REF = 'urlInput';
var WEBVIEW_REF = 'webview';
import ProggressBar from "../components/ProgressBar";
import WebViewBridge from 'react-native-webview-bridge';
import Icon from 'react-native-vector-icons/MaterialIcons';
var Orientation = require('./KenestoDeviceOrientation');
import {createResponder} from 'react-native-gesture-responder';
import { writeToLog } from '../utils/ObjectUtils'
import * as constans from '../constants/GlobalConstans'
import { toggleToolbar } from '../actions/navActions'
class Document extends React.Component{
  constructor(props){
  
    super(props);
   
    this.documentProps = this.props.data// _.filter(routes, function(o) { return o.key == 'document'; })[0];
   
    this.state = {  
      isLoading: true,
      scalingEnabled: true,
       orientation: Orientation.getInitialOrientation(),
      url:"", 
      prevPinch: null, 
      pinchDirection : null, 
      thumbnailUrl: this.props.data.ThumbnailUrl
    };
  }
  

 componentDidMount() {
          this.orientationListener = Orientation.addOrientationListener(this._orientationDidChange.bind(this));
 }

componentWillMount(){
//   console.log('window.height =' + window.height )
//   var url = ""
//   if (this.props.data.isExternalLink)
//       var url =this.props.data.viewerUrl;
//   else
//      url = this.props.data.viewerUrl.replace('localhost', getEnvIp(this.props.data.env)) + "&w=" + window.width + "&h=" + window.height;

//  this.setState( {url : url });
   
  if(this.props.data.isExternalLink)
    {
      var url =this.props.data.viewerUrl;
      this.setState( {url : url });
    }
    else
    {
      Orientation.getOrientation(this.updateOrientation.bind(this))
    }


      this.gestureResponder = createResponder({
    onStartShouldSetResponder: (evt, gestureState) => true,
    onStartShouldSetResponderCapture: (evt, gestureState) =>true,
    onMoveShouldSetResponder: (evt, gestureState) => true,
    onMoveShouldSetResponderCapture: (evt, gestureState) => true,
    onResponderGrant: (evt, gestureState) => {},
    onResponderMove: (evt, gestureState) => {

        if ( typeof(gestureState.pinch) != 'undefined' && typeof(gestureState.previousPinch) != 'undefined') {
         var diff = gestureState.pinch - gestureState.previousPinch;
          if (this.state.startPinch == null)
            this.setState({startPinch : gestureState.pinch, pinchDirection: diff > 0 ? "in" : "out"})
          else{
              if (diff < 0 && this.state.pinchDirection == 'in')
              {
                this.setState({startPinch: gestureState.pinch, pinchDirection : "out"})
              }
              else if (diff > 0 && this.state.pinchDirection == 'out')
              {
                this.setState({startPinch: gestureState.pinch, pinchDirection : "in"})
              }
          }

         const absDistance =  Math.round(Math.abs(gestureState.pinch -  this.state.startPinch));
         const mod = absDistance % 5; 
         if (mod == 0)
         {
           //console.log('mode = ' + mod)
            if (this.state.pinchDirection == "in")
                this.zoomIn();
            else {
              this.zoomOut();
            }
         }
     }

        
    },
    onResponderTerminationRequest: (evt, gestureState) => false,
    onResponderRelease: (evt, gestureState) => {
   //   console.log('gestureState.doubleTapUp = ' + gestureState.doubleTapUp)
       if (gestureState.doubleTapUp)
          this.setZoom(100);
    },
    
    onResponderTerminate: (evt, gestureState) => {
    },
    
    
    onResponderSingleTapConfirmed: (evt, gestureState) => {
       this.props.data.dispatch(toggleToolbar());
    },
 moveThreshold: 2,
    debug: false
  });
    
}

 _orientationDidChange(orientation) {
    this.setState({
      orientation: orientation
    })
   // this.changeVideoOrientation("orientation");
  }
  
  componentWillUnmount(){
    this.orientationListener.remove();
    Orientation.removeOrientationListener();
  }
 
updateOrientation(error, orientation) {
    var longDimension = window.width > window.height ? window.width : window.height;
    var shortDimension = window.height > window.width ? window.width : window.height;
    var width = orientation === 'PORTRAIT' ? shortDimension : longDimension;
    var height = orientation === 'PORTRAIT' ? longDimension - 75 : shortDimension - 70;
    var url = this.props.data.viewerUrl.replace('localhost', getEnvIp(this.props.data.env)) + "&w=" + width + "&h=" + height;
    this.setState({
      orientation: orientation,
      url: url
    });
  }

 onLoadEnd(){
    // this.setState({isLoading: false});
 }
 
 renderLoading(){
   return (
     this.state.isLoading ?
       <View style={styles.loading}>
         <ProggressBar isLoading={true} />
       </View>
       :
       <View></View>
   )
 }
 

onBridgeMessage(message){
  if (message == 'ViewerDocumentLoaded')
    setTimeout(this.hideLoading.bind(this), 300)
    }

hideLoading(){
  this.setState({isLoading: false});
}
  zoomIn(){
      const { webviewbridge } = this.refs;
     webviewbridge.sendToBridge("zoomIn");
  }
   zoomOut(){
       const { webviewbridge } = this.refs;
      webviewbridge.sendToBridge("zoomOut");

  }
  setZoom(value){
      const { webviewbridge } = this.refs;
      webviewbridge.sendToBridge("setZoom_" + value.toString());
  }

  render(){

    const injectScript = `
      (function () {
              if (WebViewBridge)
                   WebViewBridge.onMessage = function (message) {
                        if (message.indexOf("setZoom") >  -1)
                        {
                             var zoomLevel = parseInt(message.split("_")[1]);
                             activateSetZoom(zoomLevel);
                        } 
                        else
                          switch (message) {
                                    case "zoomIn":
                                        activateZoomIn();
                                    break;
                                    case "zoomOut":
                                            activateZoomOut();
                                    break;
                                    case "setZoom":
                                            activateSetZoom(100);
                                    break;
                                   
                                }
                        

                   }
                 
       }());
    
    `; 
    return(

      <View style={{ flex: 1 }}>
        
            {this.renderLoading()}
      
            <WebViewBridge
              ref="webviewbridge"
              style={styles.webview_body}
              source={{ uri: this.state.url }}
              onLoadEnd={this.onLoadEnd.bind(this) }
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              scalesPageToFit={true}
              onBridgeMessage={this.onBridgeMessage.bind(this)}
              injectedJavaScript={injectScript}
                   {...this.gestureResponder}
              />

      </View>

        
    )
  }
  
  
  
  
}

var styles = StyleSheet.create({
   title: {
    marginBottom: 20,
    fontSize: 22,
    textAlign: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: HEADER,
  },
  addressBarRow: {
    flexDirection: 'row',
    padding: 8,
  },
  webView: {
    backgroundColor: BGWASH,
    height: 350,
  },
  addressBarTextInput: {
    backgroundColor: BGWASH,
    borderColor: 'transparent',
    borderRadius: 3,
    borderWidth: 1,
    height: 24,
    paddingLeft: 10,
    paddingTop: 3,
    paddingBottom: 3,
    flex: 1,
    fontSize: 14,
  },
  navButton: {
    width: 20,
    padding: 3,
    marginRight: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BGWASH,
    borderColor: 'transparent',
    borderRadius: 3,
  },
  disabledButton: {
    width: 20,
    padding: 3,
    marginRight: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DISABLED_WASH,
    borderColor: 'transparent',
    borderRadius: 3,
  },
  goButton: {
    height: 24,
    padding: 3,
    marginLeft: 8,
    alignItems: 'center',
    backgroundColor: BGWASH,
    borderColor: 'transparent',
    borderRadius: 3,
    alignSelf: 'stretch',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
    height: 22,
  },
  statusBarText: {
    color: 'white',
    fontSize: 13,
  },
  spinner: {
    width: 20,
    marginRight: 6,
  },
  buttons: {
    flexDirection: 'row',
    height: 30,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    flex: 0.5,
    width: 0,
    margin: 5,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: 'gray',
    
  },
  
  webview_header: {
    paddingLeft: 10,
    backgroundColor: '#FF6600',
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  header_item: {
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'center'
  },
  webview_body: {
    flex: 1,
    backgroundColor: 'transparent',
    // width: 300,
    // height: 400,
  },

  page_title: {
    color: '#FFF'
  },
  moreMenu: {
    fontSize: 22,
    color: '#888',
  },
  loading: {
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#fefefe', 
    position: "absolute", 
    zIndex: 1, 
    top: 0, left: 0, bottom: 0, right: 0
  }

});

module.exports = Document;