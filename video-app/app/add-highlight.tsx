import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";

export default function AddHighlight() {
  const { videoId } = useLocalSearchParams();

  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const timeToSeconds = (time: string) => {
    const parts = time.split(":").map(Number);
    return parts[0] * 60 + parts[1];
  };

  const saveHighlight = async () => {
    try {
      const response = await fetch("http://192.168.1.109:8000/api/highlights/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          video: Number(videoId),
          title: title,
          description: title,
          start_time: timeToSeconds(startTime),
          end_time: timeToSeconds(endTime),
        }),
      });

      const data = await response.json();

      console.log("Resposta da API:", data);

      if (response.ok) {
        router.back();
      } else {
        alert("Erro ao salvar: " + JSON.stringify(data));
      }
    } catch (error) {
      console.log("Erro de rede:", error);
      alert("Erro de conexão com o servidor");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Título do trecho</Text>

      <TextInput
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />

      <Text>Tempo inicial (mm:ss)</Text>

      <TextInput
        value={startTime}
        onChangeText={setStartTime}
        placeholder="01:30"
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />

      <Text>Tempo final (mm:ss)</Text>

      <TextInput
        value={endTime}
        onChangeText={setEndTime}
        placeholder="02:30"
        style={{ borderWidth: 1, marginBottom: 20, padding: 10 }}
      />

      <Pressable
        onPress={saveHighlight}
        style={{ backgroundColor: "blue", padding: 15 }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Salvar trecho
        </Text>
      </Pressable>
    </View>
  );
}