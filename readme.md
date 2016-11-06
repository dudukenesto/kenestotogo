packages with special handling: 

* react-native-orientation
    problem: npm not synced with latest version 
    solution: instead of installing with npm install, copy folder from master to node_modules folder 
    and run: react-native link react-native-orientation
    then replace the content of index.js with the content of KenestoDeviceOrientation.js OR use require('./KenestoDeviceOrientation') instead require('react-native-orientation');
* react-native-crop-picker 
    problem: current version not complient with latest react native version
    solution: replace \node_modules\react-native-image-crop-picker\android\src\main\java\com\reactnative\ivpusic\imagepicker\PickerModule.js 
    with the one in \apapendix