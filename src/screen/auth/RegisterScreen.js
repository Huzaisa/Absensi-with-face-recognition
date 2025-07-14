import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import BoldText from '../../components/text/BoldText';
import RegisterForm from '../../components/form/RegisterForm';
import { sc, vs } from '../../constant/Dimension';

export default function RegisterScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        <View style={styles.header}>
          <BoldText text="Register" size={30} />
        </View>
        <RegisterForm />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7FB' },
  inner: { flex: 1, alignItems: 'center' },
  header: {
    marginTop: vs(40),
    marginBottom: vs(10),
    alignSelf: 'flex-start',
    marginLeft: sc(20),
  },
});
