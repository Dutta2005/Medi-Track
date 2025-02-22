import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Button, Image } from 'react-native';
import { Text,  View } from 'react-native';

function HomeScreen() {
    const navigation = useNavigation()
    return (
        <View className='bg-dark-bg min-h-screen'>
            {/* <View>
                <Text className='text-3xl font-bold'><Text>Medi </Text>Track</Text>
            </View> */}
            <Image 
            source={require('../../assets/Logo.png')}
            classname=''
             />
            <View className='mx-9'>
                <Button
                title='Login'
                onPress={() => navigation.navigate('login')}
                />
                <Button
                title='Signup'
                onPress={() => navigation.navigate('signup')}
                />
            </View>
        </View>
    );
}

export default HomeScreen;