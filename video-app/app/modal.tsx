import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ModalScreen() {
  return (
    <ThemedView style={styles.container}>

      <ThemedText type="title" style={styles.title}>
        📱 Video Platform
      </ThemedText>

      <ThemedText style={styles.text}>
        Aplicação desenvolvida para gerenciamento de vídeos e destaques.
      </ThemedText>

      <View style={styles.section}>
        <ThemedText style={styles.subtitle}>
          Funcionalidades:
        </ThemedText>

        <ThemedText>• Cadastro de vídeos</ThemedText>
        <ThemedText>• Criação de destaques</ThemedText>
        <ThemedText>• Controle de acesso por usuário</ThemedText>
        <ThemedText>• Expiração de vídeos</ThemedText>
        <ThemedText>• Pesquisa de vídeos</ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.subtitle}>
          Tecnologias:
        </ThemedText>

        <ThemedText>• Django REST API</ThemedText>
        <ThemedText>• React Native</ThemedText>
        <ThemedText>• Expo Router</ThemedText>
      </View>

      <Link href="/" dismissTo style={styles.link}>
        <ThemedText type="link">
          ← Voltar para o app
        </ThemedText>
      </Link>

    </ThemedView>
  );
}

const styles = StyleSheet.create({

  container:{
    flex:1,
    padding:30,
    justifyContent:"center"
  },

  title:{
    fontSize:28,
    marginBottom:20
  },

  text:{
    marginBottom:20,
    fontSize:16
  },

  section:{
    marginBottom:20
  },

  subtitle:{
    fontWeight:"bold",
    marginBottom:6
  },

  link:{
    marginTop:20
  }

});