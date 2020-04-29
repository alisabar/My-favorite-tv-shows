import React from 'react';
import { Text, View, TextInput, TouchableHighlight , ToastAndroid } from 'react-native';
import { URL } from './Config.js';
import EmailInput from './EmailInput';
import PasswordInput from './PasswordInput';
import { register } from './style';

export default class MyRegistration extends React.Component {

  static navigationOptions = {
    title: 'Sign-Up',
  };

  constructor(props) {
    super(props);
    this.handleEmail = this.handleEmail.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.SubmitForm = this.SubmitForm.bind(this);
    this.state = {
      email: '',
      password: '',
      msg: '',
      is_pass_filled: false,
      is_email_filled: false,
      is_email_valid: false,
      is_pass_valid: false,
      valid_pass_msg: '',
      valid_email_msg: '',


    };

  }
  componentDidMount = () => {

    console.log("In register component did mount. ");
  }

    handleEmail= (email, is_email_valid)=>{
        this.setState({
            email: email,
            is_email_valid: is_email_valid
        })
    }
    handlePassword= (password, is_pass_valid)=>{
        this.setState({
            password: password,
            is_pass_valid: is_pass_valid
        })
    }

  SubmitForm = () => {

    const { navigate } = this.props.navigation;
    console.log('submit form pressed');
    console.log('email: ' + this.state.email);
    console.log('password: ' + this.state.password);

    if (this.state.is_email_valid && this.state.is_pass_valid) {
      fetch(URL.concat('/api/register'), {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.state.email ? this.state.email : '',
          password: this.state.password ? this.state.password : ''
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log('responseJson: ', responseJson);
          ToastAndroid.showWithGravity(`Welcome!`, ToastAndroid.SHORT, ToastAndroid.CENTER);
          navigate('MyFavourites');
        })
        .catch((error) => {
          console.error(error);
        });
    }
    else {
      if (!this.state.is_email_valid) {
        this.setState({
          is_email_filled: false,
          valid_email_msg: 'Please enter correct email'
        })
      }

      else if (!this.state.is_pass_valid) {
        this.setState({
          is_pass_filled: false,
          valid_pass_msg: 'Please enter correct password'
        })
      }
    }

  }

  render() {

      return (
        <View style={register.container}>
          <Text style={register.title}>
            Registration
          </Text>
          <View style={register.form}>
                <EmailInput
                      onEmail={this.handleEmail}
                      is_email_filled= {this.state.is_email_valid}
                      valid_email_msg= {this.state.valid_email_msg}
                />
                <PasswordInput
                    onPassword={this.handlePassword}
                    is_pass_filled = {this.state.is_pass_filled}
                    valid_pass_msg = {this.state.valid_pass_msg}
                />
                <View style={register.submitButton}>
                  <TouchableHighlight
                    onPress={this.SubmitForm}
                    style={register.button}>
                    <Text style={register.buttonText}>
                      Submit
                  </Text>
                  </TouchableHighlight>
                </View>
          </View>
        </View>
      );


  }
}


