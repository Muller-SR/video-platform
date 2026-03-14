import { useState, useCallback } from "react";
import { View, Text, FlatList, Pressable, Modal, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { WebView } from "react-native-webview";

type Highlight = {
  id: number;
  video: number;
  description: string;
  start_time: number;
  end_time: number;
};

export default function HighlightsScreen() {

  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const loadHighlights = () => {
    fetch("http://192.168.1.109:8000/api/highlights/")
      .then((res) => res.json())
      .then((data) => {
        setHighlights(data);
      })
      .catch((err) => console.log(err));
  };

  useFocusEffect(
    useCallback(() => {
      loadHighlights();
    }, [])
  );

  const secondsToTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const openHighlight = (videoId: number, start: number) => {

    fetch(`http://192.168.1.109:8000/api/videos/${videoId}/`)
      .then((res) => res.json())
      .then((video) => {

        const url = video.video_url;

        let id = "";

        if (url.includes("watch?v=")) {
          id = url.split("watch?v=")[1].split("&")[0];
        } else if (url.includes("youtu.be/")) {
          id = url.split("youtu.be/")[1].split("&")[0];
        }

        const embedUrl = `https://www.youtube.com/embed/${id}?start=${start}&playsinline=1`;

        setVideoUrl(embedUrl);

      });
  };

  return (

    <View style={styles.container}>

      <Text style={styles.title}>Destaques</Text>

      <FlatList
        data={highlights}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (

          <Pressable
            onPress={() => openHighlight(item.video, item.start_time)}
            style={styles.card}
          >

            <Text style={styles.description}>
              🎬 {item.description}
            </Text>

            <Text style={styles.time}>
              ⏱ {secondsToTime(item.start_time)} - {secondsToTime(item.end_time)}
            </Text>

            <Text style={styles.open}>
              ▶ Assistir trecho
            </Text>

          </Pressable>

        )}
      />

      <Modal visible={videoUrl !== null} animationType="slide">

        <View style={{ flex: 1 }}>

          {videoUrl && (
            <WebView
              javaScriptEnabled
              domStorageEnabled
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction={false}
              source={{
                html: `
                  <html>
                    <body style="margin:0;padding:0;">
                      <iframe
                        width="100%"
                        height="100%"
                        src="${videoUrl}"
                        frameborder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                      ></iframe>
                    </body>
                  </html>
                `,
              }}
            />
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

  card:{
    backgroundColor:"#fff",
    padding:15,
    borderRadius:12,
    marginBottom:15,
    elevation:3
  },

  description:{
    fontSize:16,
    fontWeight:"bold"
  },

  time:{
    marginTop:6,
    color:"#666"
  },

  open:{
    marginTop:8,
    color:"#3b5cff",
    fontWeight:"600"
  },

  closeButton:{
    backgroundColor:"#3b5cff",
    padding:18
  },

  closeText:{
    color:"#fff",
    textAlign:"center",
    fontWeight:"bold"
  }

});