import React, { Component } from "react";
import {View, Text, TextInput, StyleSheet, TouchableWithoutFeedback, AsyncStorage, Image} from "react-native";
import Button from "react-native-button";
import Tcomb from "tcomb-form-native";
import config from '../utils/app.config';
import ProggressBar from "../components/ProgressBar";
import * as routes from '../constants/routes';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import * as constans from '../constants/GlobalConstans'
import * as accessActions from '../actions/Access'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
var stricturiEncode = require('strict-uri-encode');

var Form = Tcomb.form.Form;

var _ = require('lodash');
const formStylesheet = _.cloneDeep(Form.stylesheet);

var Email = Tcomb.refinement(Tcomb.String, function (s) {
  return /\S+@\S+\.\S+/.test(s);
});
Email.getValidationErrorMessage = function (value, path, context) {
  return 'Email Address (Username) is not valid';
};

var Password = Tcomb.refinement(Tcomb.String, function (s) {
  return s.length >= 0;
});

Password.getValidationErrorMessage = function (value, path, context) {
  return 'Field is required!';
};

var User = Tcomb.struct({      
  username: Email,  //required email
  password: Password,
});

var usernameIconStyle = {}
var passwordIconStyle = {}
// CUSTOM FIELDS TEMPLATE FOR DRAWING ICON. ref:  https://github.com/gcanti/tcomb-form-native/blob/master/lib/templates/bootstrap/textbox.js


formStylesheet.textbox.normal = {
    height: 50,            
    fontSize: 17,
    paddingLeft: 40,
    paddingBottom: 15,  
}
formStylesheet.textbox.error = {
    height: 50,            
    fontSize: 17,
    paddingLeft: 40  
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#fff",
        padding: 36,
    },
    formContainer: {
        flex: 1,
    },
    logoContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
    },
    logo: {
        width: 178,
        height: 61, 
    },
    loginBtn: {       
        color: "#fff",
        fontWeight: "bold",
        fontSize: 18,
    },
    loginBtnContainer: {
        height: 50,
        backgroundColor: "#F6841F",
        justifyContent: "center",
        marginTop: 20,
    },
    forgotPwd: {
        alignSelf: "center",
        fontSize: 16,   
        marginTop: 12,    
    },
    form: {
        flex: 2,
        paddingTop: 20,
    },
    formIcon: {
        fontSize: 32,
        height: 30,
        color: '#ddd',
        position: "absolute",
        top: 5
    },  
    formIcon2: {
        fontSize: 32,
        height: 30,
        color: '#000',
        position: "absolute",
        top: 5
    },  
});


 class Login  extends React.Component { 
     constructor(props) {

         super(props)

         this.state = {
             value: {
                 username: "",
                 password: "",
             },
         }
     }
    
    onChange(value) {
        if(value.username != false){
            usernameIconStyle = { color: "#000" }
        }
        else {
            usernameIconStyle = { color: "#ddd" }
        }
        if(value.password != false){
            passwordIconStyle = { color: "#000" }
        }
        else {
            passwordIconStyle = { color: "#ddd" }
        }
        // this.props.Update
        this.setState({value});
    }

    
    _renderProgressBar(){
        if (this.props.isFetching){
            return(
            <ProggressBar isLoading={true} />
            )
        }
        else{
            return(
                <ProggressBar isLoading={false} />
            )
            
            }
        
        }
   NavigateToForgotPassword(){

      const  forgotPasswordRoute = {
                type: 'push',
                route: {
                    key: 'forgotPassword',
                    title: 'forgotPassword',
                    userName: this.state.value.username
                }
                }
        this.props._handleNavigate(forgotPasswordRoute)
   }

    //  componentWillReceiveProps(nextProps){
    //     if (nextProps.isLoggedIn)
    //     {
    //          var data = {
    //               key : "documents",
    //               name: "My Documents",
    //               catId: constans.MY_DOCUMENTS,
    //               fId: "",
    //               sortDirection: constans.ASCENDING,
    //               sortBy: constans.ASSET_NAME
    //           }
    //           this.props._handleNavigate(routes.documentsRoute(data));
    //     } 
            
    // }



   _makeLogin(){

         var value = this.refs.form.getValue();
       
        if (value == null) { // if validation fails, value will be null
            return false; // value here is an instance of Person
        }
        // kukudssss1111

       this.props.dispatch(accessActions.login(this.state.value.username, this.state.value.password, this.props.env))
   }
   
   usernameTemplate(locals) {
       var stylesheet = locals.stylesheet;
       var formGroupStyle = stylesheet.formGroup.normal;
       var textboxStyle = stylesheet.textbox.normal;
       var errorBlockStyle = stylesheet.errorBlock;


       if (locals.hasError) {
           formGroupStyle = stylesheet.formGroup.error;
           textboxStyle = stylesheet.textbox.error;
       }
       var error = locals.hasError && locals.error ? <Text accessibilityLiveRegion="polite" style={errorBlockStyle}>{locals.error}</Text> : null;
       return (
           <View style={formGroupStyle}>
               <Icon name="person" style={[styles.formIcon, usernameIconStyle]} />
               <TextInput
                   placeholderTextColor={locals.placeholderTextColor}
                   selectionColor={locals.selectionColor}
                   underlineColorAndroid={locals.underlineColorAndroid}
                   onKeyPress={locals.onKeyPress}
                   placeholder={locals.placeholder}
                   style={textboxStyle}
                   value={locals.value}
                   onChangeText={(value) => { locals.onChange(value) } }
                   />
               {error}
           </View>
       )
   }

     passwordTemplate(locals) {
         var stylesheet = locals.stylesheet;
         var formGroupStyle = stylesheet.formGroup.normal;
         var textboxStyle = stylesheet.textbox.normal;
         var errorBlockStyle = stylesheet.errorBlock;

         if (locals.hasError) {
             formGroupStyle = stylesheet.formGroup.error;
             textboxStyle = stylesheet.textbox.error;
         }
         var error = locals.hasError && locals.error ? <Text accessibilityLiveRegion="polite" style={locals.stylesheet.errorBlock}>{locals.error}</Text> : null;
         return (
             <View style={formGroupStyle}>
                 <Icon name="https" style={[styles.formIcon, passwordIconStyle]} />
                 <TextInput
                     placeholderTextColor={locals.placeholderTextColor}
                     selectionColor={locals.selectionColor}
                     underlineColorAndroid={locals.underlineColorAndroid}
                     secureTextEntry={locals.secureTextEntry}
                     onKeyPress={locals.onKeyPress}
                     placeholder={locals.placeholder}
                     style={textboxStyle}
                     value={locals.value}
                     onChangeText={(value) => { locals.onChange(value) } }
                     />
                 {error}
             </View>
         )
     }
    
    _renderLogin(){
       
       var options = {
    stylesheet: formStylesheet,
    fields: {
        username: {
            template: this.usernameTemplate,
            placeholder: 'Username',
            label: ' ',
            autoFocus: true,
            placeholderTextColor: '#ccc',
            underlineColorAndroid: "#ccc",
            selectionColor: "orange",
        },
        password: {
            template: this.passwordTemplate,
            placeholder: 'Password',
            label: ' ',
            secureTextEntry: true,
            placeholderTextColor: '#ccc',
            underlineColorAndroid: "#ccc",
            selectionColor: "orange",
        }
    }
};

                            
            return(
                <KeyboardAwareScrollView style={{flex:1}} showsVerticalScrollIndicator={false}>
                    <View style={{height: 460}}>
                        {this._renderProgressBar()}
                        <View style={styles.logoContainer}><Image source={require('../assets/kenesto_logo.png')} style={styles.logo}></Image></View>
                        <View style={styles.form}><Form
                                    ref="form"
                                    type={User}
                                    value={this.state.value}
                                    onChange={this.onChange.bind(this)}
                                    options={options}
                                />
                            
                            <Button containerStyle={styles.loginBtnContainer} onPress={this._makeLogin.bind(this)} style={styles.loginBtn}>Login</Button>

                            <TouchableWithoutFeedback onPress={ this.NavigateToForgotPassword.bind(this)} >
                                <View>
                                    <Text style={styles.forgotPwd}>Forgot Your Password?</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>     
                    </View>                
                </KeyboardAwareScrollView>
              )
    }

    render(){
        
        return (
          <View style={[styles.container, this.props.style]}>
            {this._renderLogin()}
          </View>
       
        );
    }
}


Login.contextTypes = {
    errorModal:  React.PropTypes.object
};


module.exports = Login;