import React from "react";
import {View, Text, StyleSheet, TouchableHighlight, AsyncStorage, } from "react-native";
import Button from "react-native-button";
import Tcomb from "tcomb-form-native";
import config from '../utils/app.config';
import ProggressBar from "../components/ProgressBar";
import * as routes from '../constants/routes'


var stricturiEncode = require('strict-uri-encode');

var Form = Tcomb.form.Form;

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

var options = {
    fields: {
    username: {
    placeholder: 'Username',
    label: ' ',
    autoFocus: true
    },
     password: {
     placeholder: 'Password',
     label: ' ',
     secureTextEntry:true
    }
 }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF",
    },
    welcome: {
        fontSize: 20,
        textAlign: "center",
        margin: 10,
    },
    instructions: {
        textAlign: "center",
        color: "#333333",
        marginBottom: 5,
    },
     spinner: {
        width: 30,
        height: 30,
   },
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
       
          

           
                            
            return(<View style={[styles.container, this.props.style]}>
                {this._renderProgressBar()}

            <Form
                ref="form"
                type={User}
                value={this.state.value}
                onChange={this.onChange.bind(this)}
                options={options}
            />
            
            <Button onPress={this._makeLogin.bind(this)}>Login</Button>

            <TouchableHighlight
                onPress={ this.NavigateToForgotPassword.bind(this)}
                 >
                <Text>Forgot Password?</Text>
                </TouchableHighlight>
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