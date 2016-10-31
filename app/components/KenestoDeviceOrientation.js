var Orientation = require('react-native').NativeModules.Orientation;
var DeviceEventEmitter = require('react-native').DeviceEventEmitter;
var listeners = {};
var id = 0;
var META = '__listener_id';


// BASED ON yamill/react-native-orientation AND inProgress-team/react-native-orientation-controller (BOTH HAVE CRITICAL BUGS WHICH ARE NOT FIXED FOR A LONG TIME)


function getKey(listener){
  if (!listener.hasOwnProperty(META)){
    if (!Object.isExtensible(listener)) {
      return 'F';
    }
    Object.defineProperty(listener, META, {
      value: 'L' + ++id,
    });
  }
  return listener[META];
};

module.exports = {
  getOrientation(cb) {
    Orientation.getOrientation((error,orientation) =>{
      cb(error, orientation);
    });
  },
  getSpecificOrientation(cb) {
    Orientation.getSpecificOrientation((error,orientation) =>{
      cb(error, orientation);
    });
  },
  lockToPortrait() {
    Orientation.lockToPortrait();
  },
  lockToLandscape() {
    Orientation.lockToLandscape();
  },
  lockToLandscapeRight() {
    Orientation.lockToLandscapeRight();
  },
  lockToLandscapeLeft() {
    Orientation.lockToLandscapeLeft();
  },
  unlockAllOrientations() {
    Orientation.unlockAllOrientations();
  },
  addOrientationListener(callback) {
    return DeviceEventEmitter.addListener(
      'orientationDidChange', function (data) {
        callback(data.orientation);
      }
    );
  },
  removeOrientationListener(listener) {
    DeviceEventEmitter.removeListener('orientationDidChange', listener);
  },
  
  // NEED TO BE FIXED, LIKE addOrientationListener/removeOrientationListener, IF WE WILL NEED SUCH A FUNCTIONALITY EVER
  
  // addSpecificOrientationListener(cb) {
  //   var key = getKey(cb);
  //   listeners[key] = DeviceEventEmitter.addListener(specificOrientationDidChangeEvent,
  //     (body) => {
  //       cb(body.specificOrientation);
  //     });
  // },
  // removeSpecificOrientationListener(cb) {
  //   var key = getKey(cb);
  //   if (!listeners[key]) {
  //     return;
  //   }
  //   listeners[key].remove();
  //   listeners[key] = null;
  // },
  getInitialOrientation() {
    return Orientation.initialOrientation;
    
  }
}
