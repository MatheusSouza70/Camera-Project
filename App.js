import React, { useState, useEffect, useRef } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Image
} from 'react-native'

import { Camera, CameraType } from 'expo-camera'

import { FontAwesome } from '@expo/vector-icons'

export default function App() {
  const camRef = useRef(null)
  const [hasPermission, setHasPermission] = useState(null)
  const [type, setType] = useState(CameraType.back)
  const [capturedPhoto, setCapturedphoto] = useState(null)
  const[open, setOpen] = useState(false)

  useEffect(() => {
    ;(async () => {
      const { status } = await Camera.requestCameraPermissionsAsync()
      setHasPermission(status === 'granted')
    })()
  }, [])

  if (hasPermission === null) {
    return <View />
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>
  }

  async function takePicture() {
    if (camRef) {
      const data = await camRef.current.takePictureAsync()
      setCapturedphoto(data.uri)
      setOpen(true)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera style={styles.camera} type={type} ref={camRef}>
        <View style={styles.buttonTroca}>
          <TouchableOpacity
            onPress={() => {
              setType(
                type === CameraType.back ? CameraType.front : CameraType.back
              )
            }}
          >
            <FontAwesome name="exchange" size={22} color="white"></FontAwesome>
          </TouchableOpacity>
        </View>
        <View style={styles.Photo}>
          <TouchableOpacity onPress={takePicture}>
            <FontAwesome name="camera" size={22} color="white"></FontAwesome>
          </TouchableOpacity>
        </View>
      </Camera>
      {capturedPhoto && (
        <Modal animationType="slide" transparent={true} visible={open}>
          <View style={styles.contentModal}>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setOpen(false)
              }}
            >
              <FontAwesome name="close" size={40} color="white"></FontAwesome>
            </TouchableOpacity>

            <Image style={styles.imgPhoto} source={{ uri: capturedPhoto }} />
          </View>
        </Modal>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  camera: {
    width: '100%',
    height: '100%'
  },
  buttonTroca: {
    position: 'absolute',
    bottom: 50,
    left: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    maargin: 20,
    height: 50,
    width: 50,
    borderRadius: 50
  },
  Photo: {
    position: 'absolute',
    bottom: 50,
    right: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    maargin: 20,
    height: 50,
    width: 50,
    borderRadius: 50
  },
  contentModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    margin: 20,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    left: 2,
    margin: 25,
  },
  imgPhoto: {
    width: "100%",
    height: 400,
  }
})
