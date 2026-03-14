import { useState } from "react";
import { StyleSheet, TextInput, Image, Pressable, Modal, View, Text } from "react-native";
import { WebView } from "react-native-webview";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";

type Video = {
  id: number;
  title: string;
  description: string;
  video_url: string;
};

export default function ExploreScreen() {

  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const searchVideos = async (text: string) => {

    setQuery(text);

    if (text.length < 2) {
      setVideos([]);
      return;
    }

    try {

      const response = await fetch(
        `http://192.168.1.109:8000/api/videos/?q=${text}`,
        {
          headers: {
            Authorization: `Token ${globalThis.token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setVideos(data);
      } else {
        console.log("Erro busca:", data);
      }

    } catch (error) {
      console.log("Erro busca:", error);
    }
  };

  const getThumbnail = (url: string) => {

    let id = "";

    if (url.includes("watch?v=")) {
      id = url.split("watch?v=")[1];
    } else if (url.includes("youtu.be/")) {
      id = url.split("youtu.be/")[1];
    }

    if (id.includes("&")) {
      id = id.split("&")[0];
    }

    return `https://img.youtube.com/vi/${id}/0.jpg`;
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="magnifyingglass"
          style={styles.headerImage}
        />
      }
    >

      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{ fontFamily: Fonts.rounded }}
        >
          Explore vídeos
        </ThemedText>
      </ThemedView>

      <TextInput
        placeholder="Pesquisar vídeos..."
        value={query}
        onChangeText={searchVideos}
        style={styles.searchInput}
      />

      {videos.map((item) => (
        <Pressable
          key={item.id}
          style={styles.videoCard}
          onPress={() => setVideoUrl(item.video_url)}
        >

          <Image
            source={{ uri: getThumbnail(item.video_url) }}
            style={styles.thumbnail}
          />

          <ThemedText type="defaultSemiBold" style={styles.videoTitle}>
            {item.title}
          </ThemedText>

          <ThemedText style={styles.videoDescription}>
            {item.description}
          </ThemedText>

        </Pressable>
      ))}

      <Modal visible={videoUrl !== null} animationType="slide">

        <View style={{ flex: 1 }}>

          {videoUrl && (
            <WebView source={{ uri: videoUrl }} style={{ flex: 1 }} />
          )}

          <Pressable
            onPress={() => setVideoUrl(null)}
            style={styles.closeButton}
          >
            <Text style={styles.closeText}>
              Fechar vídeo
            </Text>
          </Pressable>

        </View>

      </Modal>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({

  headerImage: {
    bottom: -90,
    left: -35,
    position: "absolute",
  },

  titleContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },

  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },

  videoCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
  },

  thumbnail: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 8,
  },

  videoTitle: {
    fontSize: 16,
  },

  videoDescription: {
    color: "#666",
    marginTop: 4,
  },

  closeButton: {
    padding: 20,
    backgroundColor: "#3b5cff",
  },

  closeText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },

});