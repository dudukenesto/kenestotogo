

import React from "react";
import {View, Text,TextInput,ScrollView, StyleSheet,PanResponder, Animated, Dimensions} from "react-native";
import Button from "react-native-button";
import Icon from 'react-native-vector-icons/Ionicons';
import config from '../utils/app.config';

var {
  height: deviceHeight, width: deviceWidth
} = Dimensions.get("window");



var styles = StyleSheet.create({
     containerTop: {
        position: "absolute",
        top:0,
        bottom:0,
        left:0,
        right:0,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    container: {
        
    height: deviceHeight,
    width: deviceWidth,
    flex: 1, 
    justifyContent: 'flex-end', 
    backgroundColor:"rgba(52,52,52,0.5)"
    },

    containerOp: {
     
      
    flex: 1, 
    justifyContent: 'flex-start', 
    height: deviceHeight
    },

    displayIcon: {
        fontSize: 30,
        height: 250,
        color: 'blue',
  },
   content:{
        flexDirection:'row',
          justifyContent: 'flex-end',
        alignItems: 'center',
        
    },
    view: {
      
       position: "absolute",
       // top:0,
        bottom:0,
        left:0,
        right:0,
        height: 350,

        alignItems: 'center', 
        backgroundColor: 'black', 
         flexDirection: 'row',
        margin: 0,
       // height:350,
        width: deviceWidth
    },
    textEdit: {
        height: 40, 
        width: 200,
        borderColor: 'grey', 
        backgroundColor: 'white',

        borderWidth: 1
  },

   containerx:{
        flex: 1, 
        justifyContent: 'flex-end', 
        backgroundColor:"white"
    },
    viewx: {
         flexDirection: 'row',
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'black', 
        height:350,
        margin: 1,
        
    },


});

export default class extends React.Component {
    constructor(props){
        super (props);
        this._menuStyles = {
            style: {
                    
                  bottom:0
                }
        }

         this.floatingMenu =  (null : ?{ setNativeProps(props: Object): void })

        //this.PrevOffset = new Animated.Value(350); 
        this.prevVal = 350;

        this.state = {
            offset: new Animated.Value(350), 
            coverHeight: new Animated.Value(-deviceHeight), 
            folderName: '',
            opacity: new Animated.Value(0),
            _panResponder: {},
            _panOverlayResponder: {},
            _previousTop: 0,
           
          //  currentFolderId : props.folderId, 
        };
    }


_updateNativeStyles(){
        this.floatingMenu && this.floatingMenu.setNativeProps(this._menuStyles);
}




_handlePanResponderGrantOverlay(e: Object, gestureState: Object){
   this.closeModal();
}

_handleStartShouldSetPanResponderOverlay(e: Object, gestureState: Object){
    return false;
}

_handleMoveShouldSetPanResponderOverlay(e: Object, gestureState: Object){
    return false;
}

    

_handleStartShouldSetPanResponder(e: Object, gestureState: Object){
    return true;
}

_handleMoveShouldSetPanResponder(e: Object, gestureState: Object){
    return true;
}

_handlePanResponderGrant(e: Object, gestureState: Object){

}

_handlePanResponderMove(e: Object, gestureState: Object){

var scalingFactor = Math.abs(gestureState.vy) > 1 ? 4 : 12; 

var pop = false;
var maxBottom =  Math.min(deviceHeight - 350, this._menuStyles.style.bottom - (gestureState.dy)/scalingFactor);
if (maxBottom > 0)
    maxBottom = 0;
if (maxBottom < -350)
{
     maxBottom = -350;
        pop = true;
}
   
this._menuStyles.style.bottom = maxBottom;// this._menuStyles.style.bottom - gestureState.dy;

this._updateNativeStyles();

}

_handlePanResponderEnd(e: Object, gestureState: Object){
if (gestureState.dy > 150)
    this.closeModal();
else
{
   // this._menuStyles.style.bottom = 0;
   // this._updateNativeStyles();
     this.showModal();
}
   
//closeModal
}


componentWillMount(){
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove.bind(this),
      onPanResponderRelease: this._handlePanResponderEnd.bind(this),
      onPanResponderTerminate: this._handlePanResponderEnd.bind(this),
    });

    this._panOverlayResponder = PanResponder.create({
          onStartShouldSetPanResponder: this._handleStartShouldSetPanResponderOverlay,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponderOverlay,
        onPanResponderGrant: this._handlePanResponderGrantOverlay.bind(this),
    });
}

 componentDidMount() {
         Animated.parallel([         
        Animated.timing(this.state.opacity, {
        duration: 150,
        toValue: 0.5
    }),
    
    Animated.timing(this.state.offset, {
        duration: 150,
        toValue: 0
    })
    
    ]).start();
}


updateOffset(){
   this.setState({offset:  new Animated.Value(350)});
}

updateZaba(){

this._menuStyles.style.bottom = 0;
      //  this.setState({offset:  new Animated.Value(0)});
   // alert(this.state.offset._value)
  //   this._menuStyles.style.bottom = 0;
 this._updateNativeStyles();
}

showModal(){


   // this._menuStyles.style.bottom = 0;
   // this._updateNativeStyles();


var newVal = new Animated.Value(350-this._menuStyles.style.bottom);

 //   alert('baba' + this._menuStyles.style.bottom + ' ' + this.state.offset._value)


    Animated.parallel([         
        Animated.timing(this.state.opacity, {
        duration: 150,
        toValue: 0.5
    }),
    
    Animated.timing(newVal, {
        duration: 150,
        toValue: -0
    })

    ]).start(this.updateZaba.bind(this));

 }


closeModal() {


    Animated.timing(this.state.offset, {
        duration: 150,
        toValue: 350
    }).start();

    Animated.timing(this.state.opacity, {
        duration: 300,
        toValue: 0
    }).start(Actions.pop);
    }

    
       

 
   

    render(){

        return (
          
                    <Animated.View  ref={(floatingMenu) => {
                                            this.floatingMenu = floatingMenu;
                                        }}
           style={[styles.containerTop ,{backgroundColor:'rgb(52,52,52)', opacity: this.state.opacity}, 
                            ]}
                               {...this._panOverlayResponder.panHandlers} 
                            >
                             
                                <Animated.View style={[styles.view ,{backgroundColor: 'rgba(0,0,0,1.0)' }, 
                                                            {transform: [{translateY: this.state.offset}]}]}
                                                             {...this._panResponder.panHandlers}
                                                             >
                                        <View style={styles.content}>
                                                    <Button onPress={this.closeModal.bind(this)}>Close</Button>
                                        </View>         
                                </Animated.View>
                   
                              
 
                      </Animated.View>        
                     
   
        );
    }
}
