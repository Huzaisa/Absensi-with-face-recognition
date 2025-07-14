import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  ActivityIndicator,
  Image,
  Text,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ms, sc, vs } from '../../constant/Dimension';
import CommonButton from '../button/CommonButton';
import SemiBoldText from '../text/SemiBoldText';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

import EyeOn from '../../../assets/images/eye.svg';
import EyeOff from '../../../assets/images/eye-off.svg';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSelectPhoto = async () => {
    Alert.alert(
      'Unggah Foto Wajah',
      'Pilih sumber gambar:',
      [
        {
          text: 'Kamera',
          onPress: async () => {
            const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
            if (cameraPerm.status !== 'granted') {
              return Alert.alert('Izin ditolak', 'Akses kamera diperlukan.');
            }

            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              quality: 0.8,
            });

            if (!result.canceled && result.assets.length > 0) {
              setPhoto(result.assets[0]);
            }
          },
        },
        {
          text: 'Galeri',
          onPress: async () => {
            const galleryPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (galleryPerm.status !== 'granted') {
              return Alert.alert('Izin ditolak', 'Akses galeri diperlukan.');
            }

            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              quality: 0.8,
            });

            if (!result.canceled && result.assets.length > 0) {
              setPhoto(result.assets[0]);
            }
          },
        },
        { text: 'Batal', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      return Alert.alert('Warning', 'Semua field wajib diisi.');
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('email', email.trim());
      formData.append('password', password);

      if (photo) {
        formData.append('photo', {
          uri: photo.uri,
          name: 'face.jpg',
          type: 'image/jpeg',
        });
      }

      await axios.post(
        'http://192.168.100.108:3000/api/auth/register?type=faceImage',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      ToastAndroid.show('Registrasi berhasil', ToastAndroid.SHORT);
      navigation.navigate('Login');
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      Alert.alert(
        'Registrasi gagal',
        err.response?.data?.detail || err.response?.data?.message || 'Terjadi kesalahan'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <SemiBoldText text="Name" size={18} />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.field}>
        <SemiBoldText text="Email" size={18} />
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.field}>
        <SemiBoldText text="Password" size={18} />
        <View style={styles.passwordWrapper}>
          <TextInput
            style={[styles.input, { color: '#000' }]}
            placeholder="Password"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.icon} onPress={handleShowPassword}>
            {showPassword ? <EyeOff /> : <EyeOn />}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.field}>
        <SemiBoldText text="Foto Wajah" size={18} />
        {photo ? (
          <>
            <Image source={{ uri: photo.uri }} style={styles.thumbnail} />
            <Text style={styles.fileName}>{photo.uri.split('/').pop()}</Text>
            <TouchableOpacity onPress={handleSelectPhoto}>
              <Text style={styles.changeLink}>Ganti Foto</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.photoButton} onPress={handleSelectPhoto}>
            <Text>Pilih atau Ambil Foto</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.buttonWrapper}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <CommonButton text="Register" onPress={handleRegister} />
        )}
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.link}>
        <SemiBoldText text="Sudah punya akun? Masuk" size={14} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center' },
  field: { width: sc(320), marginBottom: vs(10), alignItems: 'center' },
  input: {
    width: '100%',
    height: vs(45),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: ms(10),
    paddingHorizontal: sc(15),
    fontSize: ms(14),
    fontFamily: 'QuicksandMedium',
  },
  passwordWrapper: {
    position: 'relative',
    width: '100%',
  },
  icon: {
    position: 'absolute',
    right: sc(15),
    top: vs(10),
  },
  photoButton: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: ms(10),
    padding: 10,
    alignItems: 'center',
  },
  thumbnail: {
    width: sc(320),
    height: sc(150),
    borderRadius: ms(10),
    resizeMode: 'cover',
    marginBottom: vs(8),
  },
  fileName: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  changeLink: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  buttonWrapper: { marginTop: vs(20) },
  link: { marginTop: vs(15) },
});

export default RegisterForm;
