packages with special handling: 

* react-native-orientation
    problem: npm not synced with latest version 
    solution: instead of installing with npm install, copy folder from master to node_modules folder 
    and run: react-native link react-native-orientation
*  react-native-webview-bridge
    problem: npm not synced with latest version 
    solution: copy the following files from the master to the local react-native-webview-bridge inside node_modules
        * C:\Work\Dev\react native\projects\KenestoToGo\node_modules\react-native-webview-bridge\webview-bridge\index.android.js
        * C:\Work\Dev\react native\projects\KenestoToGo\node_modules\react-native-webview-bridge\webview-bridge\index.ios.js
* react-native-crop-picker 
    problem: npm not synced with latest version 
    solution: instead of installing with npm install, copy folder from master to node_modules folder 
    and run: react-native link react-native-picker, 
    also make sure cnages have been made in: settings.gradle, buil.gradle, androidManifest.xml, MainApplication.java