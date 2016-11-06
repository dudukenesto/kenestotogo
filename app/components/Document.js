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

class Document extends React.Component{
  constructor(props){
  
    super(props);
   
    this.documentProps = this.props.data// _.filter(routes, function(o) { return o.key == 'document'; })[0];
   
    this.state = {  
      isLoading: true,
      scalingEnabled: true,
      orientation: Orientation.getInitialOrientation(),
      url:""
    };
  }
  
  
    //  <ViewTransformer
    //     onGestureEnd={(e) => {
    //       console.log('onGestureEnd...' + JSON.stringify(e))
    //       return false;
    //     }}
    //     enableResistance={true}
    //     maxScale={20}
    //     style={{flex: 1}}>
    //       <View style={{ flex: 1}}>
    //     <WebView
    //       style={{ backgroundColor: BGWASH, position: 'absolute',top: 0, bottom: 0, left: 0, right: 0}}
    //      source={{uri: this.state.viewerUrl}}
          
    //         javaScriptEnabled={true}
    //         domStorageEnabled={true}
         
    //       scalesPageToFit={true}
    //     />
       
    //   </View>
    //   </ViewTransformer>

 componentDidMount() {
    this.orientationListener = Orientation.addOrientationListener(this._orientationDidChange.bind(this));
  }

componentWillMount(){
    if(this.props.data.isExternalLink)
    {
      var url =this.props.data.viewerUrl;
      this.setState( {url : url });
    }
    else
    {
      Orientation.getOrientation(this.updateOrientation.bind(this))
    }
    
}
  _orientationDidChange(orientation) {
    this.setState({
      orientation: orientation == 'LANDSCAPE' ? 'LANDSCAPE' : 'PORTRAIT'
    })
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
    //this.setState({isLoading: false});
 }
 
 renderLoading(){

   return(
    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 80}}>
      <ProggressBar isLoading={true} />
    </View>
   )
 }
 
      // <ViewTransformer
      //   onGestureEnd={(e) => {
      //     console.log('onGestureEnd...' + JSON.stringify(e))
      //     return false;
      //   }}
      //   enableResistance={true}
      //   maxScale={3}
      //   style={{flex: 1}}>
      //     <View style={{ flex: 1}}>
      //   <WebView
      //     style={{ backgroundColor: BGWASH, position: 'absolute',top: 0, bottom: 0, left: 0, right: 0}}
      //   // source={{uri: this.state.viewerUrl}}
      //     source={{uri: "http://10.0.0.105/static/hoops_web_viewer/client_side_renderer/hoops_web_viewer_mobile.html?/static/tempcache/session-db2ac1c3f805234f3b3f2e7d156971007db37c43/2c6407c0-b340-43e2-97e8-eb6c76cd6c6c.hsf"}}
      //       javaScriptEnabled={true}
      //       domStorageEnabled={true}
         
      //     scalesPageToFit={false}
      //   />
       
      // </View>
      // </ViewTransformer>
onBridgeMessage(message){
    const { webviewbridge } = this.refs;
  }


  render(){

    return(
      <View style={{ flex: 1}}>
          <View style={{flex: 1, backgroundColor: 'transparent', }}>
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
              renderLoading={this.renderLoading}
              />
          </View>

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
  }
  
});

module.exports = Document;