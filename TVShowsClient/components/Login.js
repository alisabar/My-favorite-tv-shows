import React from 'react';
import { Text, View , TextInput, TouchableHighlight, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { URL } from './Config.js';
import * as actions from './ReduxStore/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import EmailInput from './EmailInput';
import PasswordInput from './PasswordInput';
import { register } from './style';

function mapStateToProps(initialState) {
  console.log('initial state : ', initialState);
  return {

    state: initialState
  }
}
function mapDispatchToProps(dispatch) {
  return {
    dispatchActions: bindActionCreators(actions, dispatch)
  }
}
class MyLogin extends React.Component {

  static navigationOptions = {
    title: 'Log-In',
  };

  constructor(props) {

    super(props);
    this.SubmitForm = this.SubmitForm.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handlePassword = this.handlePassword.bind(this);

    this.state = {
      email: '',
      password: '',
      is_pass_filled: false,
      is_email_filled: false,
      is_email_filled: false,
      is_pass_filled: false,
      is_email_valid: false,
      is_pass_valid: false,
      valid_pass_msg: '',
      valid_email_msg: '',

    };
  }

  componentDidMount = () => {
    console.log("component did mount login");

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
    const { dispatchActions } = this.props
    const { navigate } = this.props.navigation;
    console.log('submit form pressed');
    console.log('email: ' + this.state.email);
    console.log('password: ' + this.state.password);
    const email = this.state.email ? this.state.email : '';
    const password = this.state.password ? this.state.password : '';

    if ((this.state.is_email_valid && this.state.is_pass_valid)) {

      console.log('calling login Url: ' + URL);
      console.log(URL.concat('/api/login'));

      fetch(URL.concat('/api/login'), {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.userId) {
            dispatchActions.setUserID(responseJson.userId);
            console.log('responseJson after login: ', responseJson);
            navigate('MyFavourites');
          }

          else if (responseJson.err) {
            console.log(responseJson.err);
            ToastAndroid.showWithGravity(responseJson.err, ToastAndroid.SHORT, ToastAndroid.CENTER);

          }

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
    console.log("in login");
    return (
      <View style={register.container}>
        <Text style={register.title}>
          Log In
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
export default connect(mapStateToProps, mapDispatchToProps)(MyLogin)
