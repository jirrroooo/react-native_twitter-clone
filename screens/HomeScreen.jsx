import React from 'react'
import { View, Text, Button } from 'react-native'


function HomeScreen({navigation}) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Home Screen / Feed</Text>
        <Button title='New Tweet' onPress={() => navigation.navigate('New Tweet')} />
        <Button title='Tweet Screen' onPress={() => navigation.navigate('Tweet Screen')} />
        <Button title='Profile Tweet' onPress={() => navigation.navigate('Profile Screen')} />
    </View>
  )
}

export default HomeScreen;