import { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function AddVideo() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  const cadastrarVideo = async () => {

    if (!globalThis.token) {
      Alert.alert("Erro", "Usuário não autenticado");
      return;
    }

    try {

      const response = await fetch("http://192.168.1.109:8000/api/videos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${globalThis.token}`,
        },
        body: JSON.stringify({
          title,
          description,
          video_url: url,
        }),
      });

      const data = await response.json();

      if (response.ok) {

        Alert.alert("Sucesso", "Vídeo cadastrado");

        setTitle("");
        setDescription("");
        setUrl("");

        router.replace("/");

      } else {

        Alert.alert("Erro", "Não foi possível cadastrar o vídeo");

      }

    } catch (error) {

      console.log("Erro:", error);
      Alert.alert("Erro de conexão com o servidor");

    }

  };

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Cadastrar vídeo
      </Text>

      <TextInput
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Descrição"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />

      <TextInput
        placeholder="URL do vídeo"
        value={url}
        onChangeText={setUrl}
        style={styles.input}
      />

      <Pressable
        onPress={cadastrarVideo}
        style={styles.button}
      >
        <Text style={styles.buttonText}>
          Salvar vídeo
        </Text>
      </Pressable>

    </View>

  );

}

const styles = StyleSheet.create({

  container:{
    flex:1,
    padding:20,
    backgroundColor:"#f5f5f5"
  },

  title:{
    fontSize:26,
    fontWeight:"bold",
    marginBottom:20
  },

  input:{
    borderWidth:1,
    borderColor:"#ccc",
    padding:12,
    borderRadius:8,
    marginBottom:15,
    backgroundColor:"#fff"
  },

  button:{
    backgroundColor:"#3b5cff",
    padding:15,
    borderRadius:8,
    marginTop:10
  },

  buttonText:{
    color:"#fff",
    textAlign:"center",
    fontWeight:"bold",
    fontSize:16
  }

});