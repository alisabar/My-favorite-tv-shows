import React from 'react';
import { Text, View, StyleSheet, TextInput, TouchableHighlight } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class MyLogin extends React.Component {

  static navigationOptions = {
    title: 'Log-In',
  };

  constructor(props) {
    super(props);
    this.SubmitForm = this.SubmitForm.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.validatePass = this.validatePass.bind(this);

    this.state = {
      email: '',
      password: '',
      msg: '',
      is_pass_filled: false,
      is_email_filled: false,
      is_email_filled: false,
      is_pass_filled: false,
      is_email_valid: false,
      is_pass_valid: false,
      valid_pass_msg: '',
      valid_email_msg: '',
      modalVisible: false,
    };
  }
  validateEmail = (email) => {

    const patt = /^[\w-\.]+@[a-zA-Z_]+?\.+[\w-]{2,4}$/;
    const result = patt.test(email);
    if (result) {
      this.setState({ email: email, is_email_filled: true, is_email_valid: true, valid_email_msg: '' });
    }
    else {
      this.setState({ email: email, is_email_valid: false, valid_email_msg: 'Invalid email address.' });
    }
  }
  validatePass = (pass) => {

    const patt = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/;
    const result = patt.test(pass);
    if (result) {
      this.setState({ password: pass, valid_pass_msg: '' })
      if (pass.length < 8) {
        this.setState({ is_pass_filled: false, is_pass_valid: false, valid_pass_msg: 'Password should be at least 8 characters long.' });
      }
      else if (pass.length >= 8) {
        this.setState({ is_pass_filled: true, valid_pass_msg: '', is_pass_valid: true })
      }
    } else if (pass.length == 0) {
      this.setState({ password: pass, is_pass_filled: false, valid_pass_msg: '', is_pass_valid: false })
    }
    else {
      this.setState({ password: pass, is_pass_valid: false, valid_pass_msg: 'Password should contain numbers and letters.' });
    }
  }
  componentDidUpdate = (prevProps, prevState) => {

    const { navigation } = this.props;
    const receivedEmail = navigation.getParam('email', '');
    const receivedPass = navigation.getParam('password', '');
    if (this.state.email.length == 0 && this.state.password.length == 0) {
      if (prevState.email != receivedEmail && prevState.password != receivedPass) {
        this.setState({
          email: receivedEmail ? receivedEmail : '',
          password: receivedPass ? receivedPass : ''
        })
      }
    }

  }
  SubmitForm = () => {
    const { navigate } = this.props.navigation;
    console.log('submit form pressed');
    console.log('email: ' + this.state.email);
    console.log('password: ' + this.state.password);
    const email = this.state.email ? this.state.email : '';
    const password = this.state.password ? this.state.password : '';
    if ((this.state.is_email_valid && this.state.is_pass_valid)) {

      console.log('calling login');

      fetch('http://192.168.1.7:5000/api/login', {
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
          console.log('responseJson after login: ', responseJson);
          this.setState({
            msg: responseJson.userId,
          }, async () => {

            try {
              console.log('before set item in async state');
              console.log(this.state.msg);

              await AsyncStorage.setItem('userId', this.state.msg);

              console.log('after set item in async state');
              navigate('MyFavourites');
            } catch (e) {
              console.log(e);
            }
          });
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
      <View style={styles.container}>
        <Text style={styles.title}>
          Log In
                 </Text>
        <Text style={styles.msg}>
          {this.state.msg ? this.state.msg : ''}
        </Text>
        <View style={styles.form}>
          <View style={styles.row}>
            <Text style={styles.label}>
              Email:
                 </Text>
            <TextInput
              style={styles.input}
              onChangeText={(email) => this.validateEmail(email)}
              value={this.state.email}
            />
          </View>
          <View style={styles.row}>

            <Text style={styles.msg}>
              {this.state.is_email_filled ? this.state.is_email_valid ? '' : this.state.valid_email_msg : this.state.valid_email_msg}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Password:
                 </Text>
            <TextInput
              style={styles.input}
              onChangeText={(password) => this.validatePass(password)}
              value={this.state.password}
            />

          </View>

          <View style={styles.row}>
            <Text style={styles.msg}>
              {this.state.is_pass_filled ? this.state.is_pass_valid ? '' : this.state.valid_pass_msg : this.state.valid_pass_msg}
            </Text>
          </View>
          <View style={styles.submitButton}>
            <TouchableHighlight
              onPress={this.SubmitForm}
              style={styles.button}>
              <Text style={styles.buttonText}>
                Submit
                   </Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    color: '#000080',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
  },
  form: {
    flex: 2,
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  msg: {
    color: 'red',
    fontSize: 15,
    paddingLeft: 120,
    paddingBottom: 30,
  },
  row: {
    flexDirection: 'row',
    paddingLeft: 10,
  },
  column: {
    flexDirection: 'column',
  },
  label: {
    flex: 1,
    marginTop: 5,
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    flex: 2,
    height: 40,
    borderColor: '#000080',
    borderRadius: 25,
    borderWidth: 1,
    fontSize: 15,
  },
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    padding: 10,
    height: 50,
    width: 100,
  },
  buttonText: {
    fontSize: 20,
    backgroundColor: '#000080',
    borderRadius: 30,
    color: 'white',
    textAlign: 'center',
  }
});