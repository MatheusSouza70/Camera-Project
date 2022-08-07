import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  View,
  Modal,
} from "react-native";
import { Camera } from "expo-camera";
import { FontAwesome } from "@expo/vector-icons";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
import { Ionicons } from "@expo/vector-icons";
import * as Sharing from "expo-sharing";
import Constants from "expo-constants";

export default function App() {
  const camRef = useRef(null);
  const [hasPermission, setHaspermission] = useState(null);
  const [capturedPhoto, setcapturedPhoto] = useState(null);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.torch);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHaspermission(status === "granted");
    })();

    (async () => {
      const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
      setHaspermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) return <Text>Acesso negado!</Text>;

  async function takePicture() {
    if (camRef) {
      const data = await camRef.current.takePictureAsync();
      setcapturedPhoto(data.uri);
      setOpen(true);
      console.log(data);
    }
  }

  async function savePicture() {
    const asset = await MediaLibrary.createAssetAsync(capturedPhoto)
      .then(() => {
        alert("Foto salva com sucesso!");
      })
      .catch((error) => console.log(error));
  }

  const onShare = async () => {
    await Sharing.shareAsync(capturedPhoto);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={{ color: "black", top: 80, fontSize: 34 }}> DevCam</Text>
      </View>
      <Camera
        style={{ flex: 1 }}
        type={type}
        ref={camRef}
        flashMode={flashMode}
        whiteBalance={this.state?.whiteBalance}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={{ position: "absolute", bottom: 200, left: 20 }}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <Ionicons name="ios-camera-reverse" size={43} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ position: "absolute", bottom: 40, left: 20 }}
            onPress={() => setFlashMode(Camera.Constants.FlashMode.torch)}
          >
            <Ionicons name="flash" size={43} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ position: "absolute", bottom: 120, left: 20 }}
            onPress={() => setFlashMode(Camera.Constants.FlashMode.off)}
          >
            <Ionicons name="flash-off" size={43} color="#FFF" />
          </TouchableOpacity>
        </View>
      </Camera>
      <TouchableOpacity style={styles.button} onPress={takePicture}>
        <FontAwesome name="camera" size={23} color="#333" />
      </TouchableOpacity>

      {capturedPhoto && (
        <Modal animationType="slide" transparent={false} visible={open}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              margin: 20,
            }}
          >
            <View style={{ margin: 10, flexDirection: "row" }}>
              <TouchableOpacity
                style={{ margin: 10 }}
                onPress={() => setOpen(false)}
              >
                <FontAwesome name="window-close" size={50} color="#121212" />
              </TouchableOpacity>

              <TouchableOpacity style={{ margin: 10 }} onPress={savePicture}>
                <FontAwesome name="upload" size={50} color="#121212" />
              </TouchableOpacity>

              <TouchableOpacity style={{ margin: 10 }} onPress={onShare}>
                <FontAwesome name="share" size={50} color="#121212" />
              </TouchableOpacity>
            </View>

            <Image
              style={{ width: "100%", height: 450, borderRadius: 20 }}
              source={{ uri: capturedPhoto }}
            />
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    margin: 30,
    borderRadius: 30,
    height: 70,
  },
  topBar: {
    flex: 0.2,
    backgroundColor: "white",
    color: "black",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: Constants.statusBarHeight / 2,
  },
});
