import { StyleSheet} from 'react-native';

const input = StyleSheet.create({
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
  }

})

const register = StyleSheet.create({
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

export {register, input}