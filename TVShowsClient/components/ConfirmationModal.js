import React, { Component, useState, useEffect } from "react";
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from "react-native";

const ConfirmModal = (props) => {
  const [modalVisible, setModalVisible] = useState(props.visible);
  const [messageModalVisible, setMessageModalVisible] = useState(props.msgvisible);
  const [flag, setFlag] = useState(props.flag)
  const [message, setMessage] = useState(props.message);



  const positiveAnswer = () => {

    setModalVisible(!modalVisible);
    props.onClick(true); // pass any argument to the callback
  }
  const negativeAnswer = () => {

    setModalVisible(!modalVisible);
    props.onClick(false); // pass any argument to the callback
  }


  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Would you like to delete {message}?</Text>
            <View style={styles.modalButtons}>
              <TouchableHighlight
                style={styles.modalButton}
                onPress={positiveAnswer}

              >
                <Text style={styles.textStyle}>yes</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.modalButton}
                onPress={negativeAnswer}
              >
                <Text style={styles.textStyle}>No</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableHighlight
        style={styles.openButton}
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Icon name="trash" size={20} color="white" />
      </TouchableHighlight>
    </View>
  )


  //   else{
  //      return(
  //       <View style={styles.centeredView}>
  //             <Modal
  //               animationType="fade"
  //               transparent={true}
  //               visible={modalVisible}
  //             >
  //               <View style={styles.centeredView}>
  //                 <View style={styles.modalView}>
  //                   <Text style={styles.modalText}>{message}</Text>
  //                 </View>
  //               </View>
  //             </Modal>
  //        </View>)
  //   }

};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  modalButtons: {
    alignItems: "stretch",
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    marginLeft: 4,
    backgroundColor: "#2196F3",
    borderRadius: 25,
    padding: 10,
    elevation: 2,
  },
  openButton: {
    backgroundColor: '#000080',
    borderRadius: 25,
    padding: 10,
    marginBottom: 20,
  },
  textStyle: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: "center"
  }
});

export default ConfirmModal;
