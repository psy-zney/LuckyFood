import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import { CameraView, CameraType, useCameraPermissions, FlashMode } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  onClose: () => void;
  onPhotoTaken: (uri: string) => void;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function LocketCamera({ onClose, onPhotoTaken }: Props) {
  const [facing, setFacing] = useState<CameraType>('front');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <MaterialIcons name="camera-alt" size={64} color="#FFF" style={{ marginBottom: 20 }} />
          <Text style={styles.permissionText}>Ứng dụng cần quyền truy cập Camera để chụp ảnh nhật ký.</Text>
          <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
            <Text style={styles.permissionButtonText}>Cấp Quyền Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Quay Lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash(current => (current === 'off' ? 'on' : 'off'));
  };

  const takePicture = async () => {
    if (cameraRef.current && !isTakingPhoto) {
      setIsTakingPhoto(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });
        if (photo) {
          onPhotoTaken(photo.uri);
        }
      } catch (err) {
        console.error('Error taking photo:', err);
      } finally {
        setIsTakingPhoto(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.iconButton}>
            <MaterialIcons name="group" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="person" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Camera Preview */}
        <View style={styles.cameraWrapper}>
          <CameraView 
            ref={cameraRef}
            style={styles.camera} 
            facing={facing}
            flash={flash}
            mode="picture"
          />
        </View>

        {/* Bottom Controls */}
        <View style={styles.controls}>
          <TouchableOpacity onPress={toggleFlash} style={styles.controlBtn}>
            <MaterialIcons name={flash === 'on' ? 'flash-on' : 'flash-off'} size={28} color="#FFF" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={takePicture} 
            style={[styles.shutterButtonOuter, isTakingPhoto && styles.shutterButtonOuterDisabled]}
            disabled={isTakingPhoto}
          >
            <View style={styles.shutterButtonInner} />
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleCameraFacing} style={styles.controlBtn}>
            <MaterialIcons name="flip-camera-ios" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  appContainer: {
    flex: 1,
    backgroundColor: '#1E1E1E', // Dark gray background like Locket
    borderRadius: 36,
    overflow: 'hidden',
    margin: 8,
    paddingTop: 16,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraWrapper: {
    width: SCREEN_WIDTH - 48,
    height: (SCREEN_WIDTH - 48) * 1.33, // Aspect ratio 4:3 roughly
    alignSelf: 'center',
    borderRadius: 36,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  controlBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterButtonOuter: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 4,
    borderColor: '#FFD700', // Yellowish border
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterButtonOuterDisabled: {
    opacity: 0.5,
  },
  shutterButtonInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFF',
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#1E1E1E',
    margin: 8,
    borderRadius: 36,
  },
  permissionText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    marginBottom: 16,
  },
  permissionButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    padding: 16,
  },
  cancelButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});
