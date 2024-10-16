import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../Assets/colors';
import Clipboard from '@react-native-clipboard/clipboard';

const PassScreen = ({ route, navigation }) => {
    const { passwordData } = route.params;
    const [currentData, setCurrentData] = useState(passwordData);
    useEffect(() => {
        navigation.setOptions({
            title: 'Add Password',
            headerShown: true,
            headerStyle: {
                backgroundColor: colors.Primary,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 25,
            },
            headerRight: () => (
                <View >
                    <TouchableOpacity style={{ padding: 10 }} onPress={() => navigation.navigate('EditPass', { data: currentData })}>
                        <Icon name="edit" size={25} color='#fff' />
                    </TouchableOpacity>
                </View>
            ),

        })

        const unsubscribe = navigation.addListener('focus', () => {
            newData();
        });

        return unsubscribe; // Cleanup on unmount
   

    }, [navigation])

    const newData = async () => {
        const storedPasswords = await AsyncStorage.getItem('passwords');
        const passwordsArray = storedPasswords ? JSON.parse(storedPasswords) : {};
        const updatedPasswords = passwordsArray.find(item => item.id === passwordData.id);
        setCurrentData(updatedPasswords)
    }

    const deletePassword = async () => {
        Alert.alert('Delete Password', 'Are you sure?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'OK',
                onPress: async () => {
                    try {
                        const storedPasswords = await AsyncStorage.getItem('passwords');
                        const passwordsArray = storedPasswords ? JSON.parse(storedPasswords) : [];
                        const updatedPasswords = passwordsArray.filter(item => item.id !== currentData.id);

                        await AsyncStorage.setItem('passwords', JSON.stringify(updatedPasswords));
                        navigation.goBack(); // Navigate back after deletion
                    } catch (error) {
                        Alert.alert('Error deleting password');
                    }
                },
            },
        ]);
    };

    const copyToClipboard = () => {
        Clipboard.setString(currentData.password);

    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Website:</Text>
            <Text style={styles.value}>{currentData.website}</Text>

            <Text style={styles.label}>Username:</Text>
            <Text style={styles.value}>{currentData.username}</Text>

            <Text style={styles.label}>Password:</Text>
            <Text style={styles.value} >{currentData.password}</Text>
            <Text style={styles.label}>Created on:</Text>
            <Text style={styles.value} >{currentData.creationDate}</Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={copyToClipboard}>
                    <Icon name="copy" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Copy Password</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.deleteButton} onPress={deletePassword}>
                    <Icon name="trash" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Delete Password</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 100,
        paddingHorizontal: 25,
        backgroundColor: '#f5f5f5',
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.Primary,
        marginBottom: 5,
    },
    value: {
        fontSize: 16,
        marginBottom: 20,
        color: '#555',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.Secondary,
        padding: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        width: '48%',
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'red',
        padding: 12,
        borderRadius: 10,
        width: '48%',
    },
    buttonText: {
        marginLeft: 10,
        color: '#fff',
        fontSize: 16,
    },
});

export default PassScreen;
