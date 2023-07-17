import React from 'react';
import { Button, Text, View } from 'react-native';

export default function RegisterScreen({navigation}) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>This is the Register Screen</Text>
        <Button onPress={() => navigation.navigate('Login Screen')}
      title="Go to Login Screen" />
    </View>
  );
}