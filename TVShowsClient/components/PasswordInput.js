import React from 'react';
import { input } from './style'
import { Text, View, TextInput, TouchableHighlight , ToastAndroid } from 'react-native';

export default class PasswordInput extends React.Component {

  constructor(props) {
    super(props);


    this.validatePass = this.validatePass.bind(this);
    this.state = {
      password: '',
      is_pass_filled: false,
      is_pass_valid: props.is_pass_valid,
      valid_pass_msg: props.valid_pass_msg,
      return_pass : props.getPass
    };

  }
  componentDidMount = () => {

    console.log("In PasswordInput component did mount. ");


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
       this.props.onPassword(pass, this.state.is_pass_valid)

    }


    render(){
        return(
        <View>
            <View style={input.row}>
              <Text style={input.label}>
                Password:
            </Text>
              <TextInput
                style={input.input}
                onChangeText={(password) => this.validatePass(password)}
                value={this.state.password}
              />

            </View>

            <View style={input.row}>
              <Text style={input.msg}>
                {this.state.is_pass_filled ?
                 this.state.is_pass_valid ? '' : this.state.valid_pass_msg :
                 this.state.valid_pass_msg}
              </Text>
            </View>
        </View>
        )

    }

}