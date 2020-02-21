import React from 'react'
import { Text, View, StyleSheet, TouchableHighlight } from 'react-native'
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';


const TVShowComponent = (props) => {


    return (

        <View style={styles.box} >
            <View style={styles.row}>
                <Text style={styles.header} >
                    Name:
                     </Text>
                <Text style={styles.content} >
                    {props.name}
                </Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.header} >
                    Language:
                  </Text>
                <Text style={styles.content} >
                    {props.language}
                </Text>



            </View>
            <View style={styles.row}>
                <Text style={styles.header} >
                    Genres:
                  </Text>
                <View style={styles.genres}>

                    <Text style={styles.genre}> {props.genres.join(' , ')} </Text>

                </View>
            </View>

        </View>




    )
}
export default TVShowComponent

const styles = StyleSheet.create({
    box: {
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderColor: 'blue',
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 3,
    },
    content: {
        flex: 0.7,
        color: 'blue',
        fontSize: 15,
        marginLeft: 5,
    },
    header: {
        flex: 0.3,
        fontWeight: 'bold',
        fontSize: 15,
        color: 'black',
        marginLeft: 10,
    },
    genres: {
        flex: 0.7,
    },
    genre: {
        marginTop: 3,
        color: 'blue',
        fontSize: 15,
    },
})