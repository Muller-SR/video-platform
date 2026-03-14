import { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, StyleSheet } from "react-native";
import { router } from "expo-router";

type LoginResponse = {
  token: string;
  user_id: number;
};

export default function LoginScreen() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    try {

      const response = await fetch("http://192.168.1.109:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      const data: LoginResponse = await response.json();

      console.log("Login response:", data);

      if (response.ok) {

        globalThis.token = data.token;
        globalThis.userId = data.user_id;

        router.replace("/");

      } else {

        Alert.alert("Erro", "Usuário ou senha inválidos");

      }

    } catch (error) {

      console.log("Erro login:", error);
      Alert.alert("Erro", "Não foi possível conectar ao servidor");

    }

  };

  return (

    <View style={styles.container}>

      <Text style={styles.title}>Video Platform</Text>
      <Text style={styles.subtitle}>Entre na sua conta</Text>

      <Text style={styles.label}>Usuário</Text>

      <TextInput
        placeholder="Digite seu usuário"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />

      <Text style={styles.label}>Senha</Text>

      <TextInput
        placeholder="Digite sua senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Pressable
        onPress={handleLogin}
        style={styles.button}
      >
        <Text style={styles.buttonText}>
          Entrar
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.push("/register")}
        style={styles.registerButton}
      >
        <Text style={styles.registerText}>
          Criar conta
        </Text>
      </Pressable>

    </View>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: "#f5f5f5",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },

  subtitle: {
    textAlign: "center",
    marginBottom: 35,
    color: "#666",
  },

  label: {
    fontWeight: "600",
    marginBottom: 5,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
  },

  button: {
    backgroundColor: "#3b5cff",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },

  registerButton: {
    marginTop: 20,
  },

  registerText: {
    textAlign: "center",
    color: "#3b5cff",
    fontWeight: "500",
  },

});