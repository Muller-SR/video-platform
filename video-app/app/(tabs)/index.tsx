import { useState, useCallback, useEffect } from "react";
import { View, Text, FlatList, Pressable, Modal, Image, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { Link, router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

type Video = {
  id: number;
  title: string;
  description: string;
  video_url: string;
  expires_at: string;
};

type Highlight = {
  id: number;
  video: number;
  title: string;
  start_time: number;
  end_time: number;
};

export default function HomeScreen() {

  const [videos, setVideos] = useState<Video[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [currentVideoId, setCurrentVideoId] = useState<number | null>(null);

  useEffect(() => {

    const timer = setTimeout(() => {
      if (!globalThis.token) {
        router.replace("/login");
      }
    }, 0);

    return () => clearTimeout(timer);

  }, []);

  const loadVideos = async () => {

    if (!globalThis.token) return;

    try {

      const response = await fetch("http://192.168.1.109:8000/api/videos/me/", {
        headers: {
          Authorization: `Token ${globalThis.token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setVideos(data);
      }

    } catch (err) {
      console.log("Erro vídeos:", err);
    }
  };

  const loadHighlights = async () => {

    try {

      const response = await fetch("http://192.168.1.109:8000/api/highlights/");
      const data = await response.json();

      if (response.ok) {
        setHighlights(data);
      }

    } catch (err) {
      console.log("Erro highlights:", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadVideos();
      loadHighlights();
    }, [])
  );

  const openVideo = (url: string, videoId: number) => {
    setVideoUrl(url);
    setCurrentVideoId(videoId);
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

  const getExpiration = (date?: string) => {

    if (!date) return "";

    const now = new Date();
    const expire = new Date(date);

    const diff = expire.getTime() - now.getTime();

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} dias`;
    if (hours > 0) return `${hours} horas`;

    return "expirando";
  };

  const videoHighlights = highlights.filter(
    (h) => h.video === currentVideoId
  );

  return (

    <View style={styles.container}>

      <Text style={styles.title}>Meus vídeos</Text>

      <Link href="/add-video" asChild>
        <Pressable style={styles.addButton}>
          <Text style={styles.addButtonText}>Cadastrar vídeo</Text>
        </Pressable>
      </Link>

      <FlatList
        data={videos}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text>Nenhum vídeo cadastrado</Text>}
        renderItem={({ item }) => (

          <View style={styles.card}>

            <Pressable onPress={() => openVideo(item.video_url, item.id)}>

              <Image
                source={{ uri: getThumbnail(item.video_url) }}
                style={styles.thumbnail}
              />

              <Text style={styles.videoTitle}>
                {item.title}
              </Text>

              <Text style={styles.description}>
                {item.description}
              </Text>

              <Text style={styles.expire}>
                Expira em {getExpiration(item.expires_at)}
              </Text>

            </Pressable>

            <Link href={`/add-highlight?videoId=${item.id}`}>
              <Text style={styles.highlightButton}>
                + Adicionar destaque
              </Text>
            </Link>

          </View>

        )}
      />

      <Modal visible={videoUrl !== null} animationType="slide">

        <View style={{ flex: 1 }}>

          {videoUrl && (
            <WebView source={{ uri: videoUrl }} style={{ flex: 1 }} />
          )}

          <View style={styles.highlightContainer}>

            <Text style={styles.highlightTitle}>
              Destaques do vídeo
            </Text>

            {videoHighlights.map((h) => (
              <Text key={h.id}>
                {h.title} ({h.start_time} - {h.end_time})
              </Text>
            ))}

          </View>

          <Pressable
            onPress={() => {
              setVideoUrl(null);
              setCurrentVideoId(null);
            }}
            style={styles.closeButton}
          >
            <Text style={styles.closeText}>
              Fechar vídeo
            </Text>
          </Pressable>

        </View>

      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },

  addButton: {
    backgroundColor: "#3b5cff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },

  addButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },

  thumbnail: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },

  videoTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },

  description: {
    color: "#555",
    marginTop: 4,
  },

  expire: {
    color: "#d9534f",
    marginTop: 6,
  },

  highlightButton: {
    color: "#3b5cff",
    marginTop: 10,
  },

  highlightContainer: {
    padding: 15,
  },

  highlightTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },

  closeButton: {
    backgroundColor: "#000",
    padding: 15,
  },

  closeText: {
    color: "#fff",
    textAlign: "center",
  },

});