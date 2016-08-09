import React from "react";
import {View, Text, TextInput, StyleSheet, TouchableHighlight, AsyncStorage, Image, } from "react-native";
import Button from "react-native-button";
import Tcomb from "tcomb-form-native";
import config from '../utils/app.config';
import ProggressBar from "../components/ProgressBar";
import * as routes from '../constants/routes';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

// CUSTOM FIELDS TEMPLATE FOR DRAWING ICON. ref:  https://github.com/gcanti/tcomb-form-native/blob/master/lib/templates/bootstrap/textbox.js
// function textboxTemplate(locals)
// {
//     return(
//         <View >
//             <Icon name={locals.iconName} />
//             <TextInput 
//                 placeholder={locals.placeholder}
//             />
//         </View>
//     )
// }
var options = {
    stylesheet: formStylesheet,
    // templates: {
    //     textbox: textboxTemplate,
    // },
    fields: {
        username: {
            placeholder: 'Username',
            label: ' ',
            autoFocus: true,
            placeholderTextColor: '#ccc',
            underlineColorAndroid: "#ccc",
            selectionColor: "orange",
            iconName: "person",            
        },
        password: {
            placeholder: 'Password',
            label: ' ',
            secureTextEntry: true,
            placeholderTextColor: '#ccc',
            underlineColorAndroid: "#ccc",
            selectionColor: "orange",
            iconName: "https",
        }
    }
};

formStylesheet.textbox.normal = {
    height: 50,            
    fontSize: 17,
    marginBottom: -20,  
    // paddingLeft: 35  
}
formStylesheet.textbox.error = {
    height: 50,            
    fontSize: 17,
    // paddingLeft: 35  
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
        marginTop: 40,
    },
    forgotPwd: {
        alignSelf: "center",
        fontSize: 16,   
        marginTop: 12,    
    },
    logoContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "flex-end",
    },
    form: {
        flex: 3,
    },
    
        
    // welcome: {
    //     fontSize: 20,
    //     textAlign: "center",
    //     margin: 10,
    // },
    
//     instructions: {
//         textAlign: "center",
//         color: "#333333",
//         marginBottom: 5,
//     },
//      spinner: {
//         width: 30,
//         height: 30,
//    },


});


 class Login  extends React.Component { 
      constructor(props) {

         
            super(props)

            this.state = {
            value:{
                username: "",
                password: ""
            },    
         }
         
      }
    
    onChange(value) {
        this.props.Update
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

     componentWillReceiveProps(nextProps){
        if (nextProps.isLoggedIn)
        {
            this.props._handleNavigate(routes.documentsRoute);
        } 
            
    }



   _makeLogin(){

         var value = this.refs.form.getValue();
       
        if (value == null) { // if validation fails, value will be null
            return false; // value here is an instance of Person
        }
        // kukudssss1111

       this.props.dispatch(this.props.login(this.state.value.username, this.state.value.password, this.props.env))
   }

   //aaaaaaa
    
    _renderLogin(){
       
          

           
                            
            return(<View style={[this.props.style, styles.formContainer]}>
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

                    <TouchableHighlight
                        onPress={ this.NavigateToForgotPassword.bind(this)}
                        >
                        <Text style={styles.forgotPwd}>Forgot Your Password?</Text>
                    </TouchableHighlight>
                </View>

            </View>
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

module.exports = Login;