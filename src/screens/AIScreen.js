import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AIScreen({ navigation }) {
  const [messages, setMessages] = useState([
    { id: "1", role: "assistant", text: "Salut Théo 👋, prêt à progresser aujourd’hui ?" },
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const flatListRef = useRef(null);
  const slideAnim = useRef(new Animated.Value(-900)).current;

  // Slide du haut vers le bas
  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 8,
    }).start();
    setTimeout(() => inputRef.current?.focus(), 400);
  }, []);

  // Scroll automatique vers le bas
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg = { id: Date.now().toString(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTimeout(() => {
      const reply = {
        id: Date.now().toString(),
        role: "assistant",
        text: "Très bien 💪. Continuons ensemble !",
      };
      setMessages((prev) => [...prev, reply]);
    }, 600);
  };

  const renderMsg = ({ item }) => (
    <View
      style={[
        styles.msgBubble,
        item.role === "user" ? styles.msgUser : styles.msgAI,
      ]}
    >
      <Text style={styles.msgText}>{item.text}</Text>
    </View>
  );

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
      {/* Bandeau haut avec flèche de retour */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-up" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assistant Smarter</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Chat */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.chatContainer}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMsg}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 10 }}
          showsVerticalScrollIndicator={false}
        />

        {/* Zone d'entrée */}
        <View style={styles.inputRow}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Écris ton message ici..."
            placeholderTextColor="#9aa5b5"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2F6BED", // cohérent avec Home
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 18,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: "#2F6BED",
  },
  headerTitle: {
    fontWeight: "700",
    fontSize: 18,
    color: "#fff",
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "#EAF0FF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
  },
  msgBubble: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 4,
    maxWidth: "75%",
  },
  msgUser: { alignSelf: "flex-end", backgroundColor: "#2F6BED" },
  msgAI: { alignSelf: "flex-start", backgroundColor: "#D8E3FF" },
  msgText: { color: "#1C1C1C" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1.5,
    borderColor: "#CCD4E2",
  },
  sendBtn: {
    backgroundColor: "#2F6BED",
    marginLeft: 8,
    padding: 12,
    borderRadius: 14,
  },
});
