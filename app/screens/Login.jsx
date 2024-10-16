import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../Assets/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import LottieView from 'lottie-react-native';



const LoginScreen = ({ navigation, onLogIn }) => {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleLogin = async () => {
        const hardCodedEmail = 'admin@gmail.com';
        const hardCodedPassword = '12345678';

        if (email === hardCodedEmail && password === hardCodedPassword) {
            onLogIn()
        } else {
            alert('Incorrect Email or Password');
        }
    };
    return (
        <View style={styles.container}>
            <LottieView
                source={{ uri: 'https://lottie.host/b9c14d72-687c-4269-afc5-9d1ea6bee8f7/FALUk8P3W3.json' }}
                autoPlay
                loop
                style={styles.lottie}
            />
            <Text style={styles.title}>OnePass</Text>
            <TextInput
                style={styles.input}
                inputMode='email'
                placeholder=" Email"
                value={email}
                onChangeText={setEmail}
            />
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passInput}
                    secureTextEntry={!isPasswordVisible}
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                    <Icon name={isPasswordVisible ? 'eye-slash' : 'eye'} size={24} color="#34495E" />
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.Background,
    },
    lottie: {
        width: 300,
        height: 230,
        marginBottom: 60,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.Primary,
        marginBottom: 20,
    },
    input: {
        width: '80%',
        padding: 10,
        borderColor: colors.Text,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
    },
    passInput: {
        flex: 1

    },
    button: {
        backgroundColor: colors.Secondary,
        padding: 15,
        borderRadius: 10,
        paddingHorizontal: 30,


    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 17,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
        borderWidth: 1,
        borderColor: '#34495E',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
});

export default LoginScreen;
