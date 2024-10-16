import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import zxcvbn from 'zxcvbn';
import { TouchableOpacity } from 'react-native';
import { colors } from '../Assets/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Slider } from '@miblanchard/react-native-slider';
import moment from 'moment';

const AddPasswordScreen = ({ navigation }) => {
    const [website, setWebsite] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(null);
    const [isPasswordVisible, setIsPasswordVisible] = useState(true);
    const [length, setLength] = useState(12);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(false);
    const [includeLowercase, setIncludeLowercase] = useState(true);
    const [includeUppercase, setIncludeUppercase] = useState(true);
    const [creationDate] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));

   
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
    });

    const handlePasswordChange = (text) => {
        setPassword(text);
        if (text.length === 0) {
            setPasswordStrength(null);
        }
        const strength = zxcvbn(text);
        setPasswordStrength(strength.score); 
    };

    const checkPassStrength = () => {
        if (passwordStrength === 0) {
            return <Text style={{ color: 'red', fontSize: 20, fontWeight: 'bold' }}>Weak</Text>;
        } else if (passwordStrength === 1) {
            return <Text style={{ color: 'orange', fontSize: 20, fontWeight: 'bold' }}>Fair</Text>;
        } else if (passwordStrength === 2) {
            return <Text style={{ color: '#d8d253', fontSize: 20, fontWeight: 'bold' }}>Good</Text>;
        } else if (passwordStrength === 3) {
            return <Text style={{ color: '#8bd853', fontSize: 20, fontWeight: 'bold' }}>Strong</Text>;
        } else if (passwordStrength === 4) {
            return <Text style={{ color: '#275d28', fontSize: 20, fontWeight: 'bold' }}>Very Strong</Text>;
        }
        return <Text style={{ color: 'gray' }}>N/A</Text>;
    };

    
    const generatePassword = () => {
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        let characterSet = '';
        if (includeNumbers) characterSet += numbers;
        if (includeSymbols) characterSet += symbols;
        if (includeLowercase) characterSet += lowercase;
        if (includeUppercase) characterSet += uppercase;

        let generatedPassword = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characterSet.length);
            generatedPassword += characterSet[randomIndex];
        }

        setPassword(generatedPassword);
        handlePasswordChange(generatedPassword);
    };

    const savePassword = async () => {
        if (!website || !username || !password) {
            Alert.alert('Please fill all fields');
            return;
        }

        const newPassword = { website, username, password, passwordStrength, id: Date.now() ,creationDate};
        try {
            const storedPasswords = await AsyncStorage.getItem('passwords');
            const passwordsArray = storedPasswords ? JSON.parse(storedPasswords) : [];
            passwordsArray.push(newPassword);
            await AsyncStorage.setItem('passwords', JSON.stringify(passwordsArray));
            Alert.alert('Password saved!');
            navigation.goBack(); 
        } catch (error) {
            Alert.alert('Error saving password');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Website URL or Name"
                value={website}
                onChangeText={setWebsite}
            />
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />

            <View style={styles.passContainer}>
                <TextInput
                    style={styles.passInput}
                    placeholder="Password"
                    value={password}
                    onChangeText={handlePasswordChange}
                    secureTextEntry={isPasswordVisible}
                />
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                    <Icon name={isPasswordVisible ? 'eye-slash' : 'eye'} size={24} color="#34495E" />
                </TouchableOpacity>
            </View>

            <Text style={styles.strengthLabel}>Password Strength: {password.length !== 0 ? checkPassStrength() : 'N/A'}</Text>

            <View style={styles.sliderContainer}>
                <Text>Password Length: {length}</Text>
                <Slider
                    style={{ width: '100%' }}
                    minimumValue={8}
                    maximumValue={20}
                    step={1}
                    value={length}
                    onValueChange={setLength}
                />
            </View>

            <View style={styles.optionsContainer}>
                <View style={styles.optionRow}>
                    <TouchableOpacity onPress={() => setIncludeNumbers(!includeNumbers)}>
                        <Text>{includeNumbers ? '☑️' : '⬜'} Numbers</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIncludeSymbols(!includeSymbols)}>
                        <Text>{includeSymbols ? '☑️' : '⬜'} Symbols</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.optionRow}>
                <Text> ☑️ Lowercase</Text>
                    <TouchableOpacity onPress={() => setIncludeUppercase(!includeUppercase)}>
                        <Text>{includeUppercase ? '☑️' : '⬜'} Uppercase</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.regenerateButton} onPress={generatePassword}>
                    <Text style={styles.textBtn}>Generate</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={savePassword}>
                    <Text style={styles.textBtn}>Save Password</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    strengthLabel: {
        marginBottom: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    passContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    passInput: {
        flex: 1,
    },
    sliderContainer: {
        marginBottom: 20,
    },
    optionsContainer: {
        marginBottom: 20,
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    regenerateButton: {
        backgroundColor: colors.Primary,
        padding: 10,
        borderRadius: 10,
        width: '48%',
    },
    saveButton: {
        backgroundColor: colors.Secondary,
        padding: 10,
        borderRadius: 10,
        width: '48%',
    },
    textBtn: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default AddPasswordScreen;
