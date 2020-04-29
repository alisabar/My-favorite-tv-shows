import React from 'react';
import { input } from './style'
import { Text, View, TextInput, TouchableHighlight , ToastAndroid } from 'react-native';

export default class EmailInput extends React.Component {
     constructor(props) {
        super(props);

        this.validateEmail = this.validateEmail.bind(this);

        this.state = {

          email: '',
          is_email_filled: false,
          is_email_valid: props.is_email_valid,
          valid_email_msg: props.valid_email_msg,
          return_email : props.getEmail

        };

      }
      componentDidMount = () => {

        console.log("In EmailInput component did mount. ");

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
        this.props.onEmail(email, this.state.is_email_valid);

      }

      render(){
        return(
                <View>
                        <View style={input.row}>
                          <Text style={input.label}>
                            Email:
                          </Text>
                          <TextInput
                            style={input.input}
                            onChangeText={(email) => this.validateEmail(email)}
                            value={this.state.email}
                          />
                        </View>
                        <View style={input.row}>
                          <Text style={input.msg}>
                            {this.state.is_email_filled ?
                             this.state.is_email_valid ? '' : this.state.valid_email_msg :
                             this.state.valid_email_msg}
                          </Text>
                        </View>
                </View>
        )

      }
}

