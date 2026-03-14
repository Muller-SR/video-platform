import { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { router } from "expo-router";

export default function RegisterScreen() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {

    try {

      const response = await fetch("http://192.168.1.109:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      const data = await response.json();

      // MOSTRA NO TERMINAL DO EXPO O QUE O DJANGO RESPONDEU
      console.log("Register response:", data);

      if (!response.ok) {
        Alert.alert("Erro", data.error || "Erro ao criar conta");
        return;
      }

      // LOGIN AUTOMÁTICO APÓS CADASTRO
      globalThis.token = data.token;
      globalThis.userId = data.user_id;

      router.replace("/");

    } catch (error) {

      console.log("Erro register:", error);
      Alert.alert("Erro", "Não foi possível conectar ao servidor");

    }

  };

  return (

    <View style={{ flex:1, justifyContent:"center", padding:20 }}>

      <Text style={{ fontSize:24, marginBottom:20 }}>
        Criar conta
      </Text>

      <TextInput
        placeholder="Usuário"
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth:1, marginBottom:15, padding:10 }}
      />

      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth:1, marginBottom:20, padding:10 }}
      />

      <Pressable
        onPress={handleRegister}
        style={{ backgroundColor:"green", padding:15, borderRadius:5 }}
      >
        <Text style={{ color:"white", textAlign:"center" }}>
          Criar conta
        </Text>
      </Pressable>

      {/* BOTÃO PARA VOLTAR AO LOGIN */}
      <Pressable
        onPress={() => router.replace("/login")}
        style={{ marginTop:15 }}
      >
        <Text style={{ textAlign:"center", color:"blue" }}>
          Já tenho uma conta
        </Text>
      </Pressable>

    </View>

  );

}