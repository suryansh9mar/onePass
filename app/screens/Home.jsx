import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { FloatingAction } from 'react-native-floating-action';
import { colors } from '../Assets/colors';
import Clipboard from '@react-native-clipboard/clipboard';


const HomeScreen = ({ navigation,onLogOut }) => {
  const [passwords, setPasswords] = useState([]);


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadPasswords();

    });

    return unsubscribe;
  }, [navigation]);
  
  const handleLogout = async()=>{
    onLogOut();
  }

 useEffect(() => {
  navigation.setOptions({
    title: 'Home',
    headerShown: true,
    headerStyle: {
      backgroundColor: colors.Primary,
      elevation: 10,
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize:25,         
    },
    headerRight: () => (
      <View style={styles.header}>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Icon name="logout" size={25} color='#fff' />
      </TouchableOpacity>
    </View>
    ),
  })
 
  
 }, [navigation])
 


  const loadPasswords = async () => {
    try {
      const storedPasswords = await AsyncStorage.getItem('passwords');
      // await AsyncStorage.clear()
      if (storedPasswords) {
        setPasswords(JSON.parse(storedPasswords));
      }
    } catch (error) {
      console.log('Error loading passwords', error);
    }
  };
  const getInitials = (text) => {
    return text.charAt(0).toUpperCase();
  };

  const getRandomColor = () => {
    const colors = ['#1ABC9C', '#16A085', '#2ECC71', '#27AE60', '#F39C12'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const copyPasswordToClipboard = (password) => {
    Clipboard.setString(password);
   
  };

  const renderPasswordItem = ({ item }) => (
    <TouchableOpacity  style={styles.itemContainer} 
    onPress={() => navigation.navigate('PassScreen', { passwordData: item })}>
      <View style={[styles.avatarContainer, { backgroundColor: getRandomColor() }]}>
        <Text style={styles.avatarText}>{getInitials(item.website)}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.websiteText}>{item.website}</Text>
        <Text style={styles.usernameText}>{item.username}</Text>
      </View>
      <TouchableOpacity onPress={() => copyPasswordToClipboard(item.password)}>
        <Icon name="copy1" size={20} color={colors.Primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No passwords added yet!</Text>
      <TouchableOpacity style={styles.bigAddBtn} onPress={() => navigation.navigate('AddPass')}>
        <Text style={styles.textBigAddBtn}>
          Add Password
        </Text>
      </TouchableOpacity>
      <LottieView
        source={{ uri: 'https://lottie.host/c069a629-1624-4a5e-a240-a912f4b1cfe5/BcoPfiorDU.json' }}
        autoPlay
        loop
        style={styles.lottieAnimation}

      />
      
    </View>
  );

  return (
    <View style={styles.container}>
      {passwords.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={passwords}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={renderPasswordItem}
        
        />
      )}
      <FloatingAction
        onPressMain={() => navigation.navigate('AddPass')}
        showBackground={false}
        color={colors.Secondary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal:15,
  },
  itemContainer: {
   
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#fff',
    
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    elevation:6,
  },
  avatarText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
  },
  header: {    
    marginHorizontal: 10,    
  },
  logoutButton: {
    padding: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigAddBtn: {
    padding: 20,
    paddingHorizontal: 90,
    backgroundColor: colors.Secondary,
    borderRadius: 10,
    marginBottom: 70,
    

  },
  textBigAddBtn: {
    color: '#fff',
    fontSize: 22,
  },
  lottieAnimation: {
    width: 250,
    height: 250,
    marginBottom: 50,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 50,
  },
  passwordItem: {
    padding: 15,
    marginTop:20,
    borderWidth: 1,
    borderColor: colors.Primary,
    borderRadius:10,
    


  },
  passwordText: {
    fontSize: 16,
  },
  websiteText:{
   fontWeight:'bold',
   fontSize:20,
   color:colors.Text,
  },
  usernameText:{
   fontWeight:'500',
   fontSize:16,
   color:colors.SecondaryText,

  },
  passwordText:{
  //  color:colors.Success,

  },

});

export default HomeScreen;
