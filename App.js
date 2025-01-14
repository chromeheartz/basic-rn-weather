import { StatusBar } from "expo-status-bar";
import { theme } from "./colors";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Platform
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";

const STORAGE_KEY = "@toDos";
const CATEGORY_KEY = "@categorys";

export default function App() {
  const [working, setWorking] = useState();
  const travel = async () => {
    const travelState = {
      Category: {
        state: false,
      },
    };
    try {
      await AsyncStorage.setItem(CATEGORY_KEY, JSON.stringify(travelState));
      loadCates();
    } catch (error) {
      console.log(error);
    }
  };
  const work = async () => {
    const workState = {
      Category: {
        state: true,
      },
    };
    try {
      await AsyncStorage.setItem(CATEGORY_KEY, JSON.stringify(workState));
      loadCates();
    } catch (error) {
      console.log(error);
    }
  };

  const loadCates = async () => {
    try {
      const categoryState = await AsyncStorage.getItem(CATEGORY_KEY);
      const parse = JSON.parse(categoryState);
      setWorking(parse["Category"]["state"]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadToDos();
    loadCates();
  }, []);

  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const saveToDos = async (toSave) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (error) {
      console.log(error);
    }
  };
  const loadToDos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      setToDos(JSON.parse(s));
    } catch (error) {
      console.log(error);
    }
  };
  const addTodo = async () => {
    if (text === "") {
      return;
    }
    // save to do
    // const newToDos = Object.assign({}, toDos, {
    //   [Date.now()]: { text, work: working },
    // });
    const newToDos = {
      ...toDos,
      [Date.now()]: { text, working: working },
    };

    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };
  // console.log(toDos);
  const onChangeText = (payload) => setText(payload);
  const deleteTodDo = async (key) => {
    if(Platform.OS === "web") {
      const ok = confirm("Do you want to delete this To Do?")
      if (ok) {
        const newToDos = { ...toDos };
        delete newToDos[key];
        setToDos(newToDos);
        saveToDos(newToDos);
      }
    } else {
      Alert.alert(
        "Delete To DO?",
        "are you sure?", // null 가능
        [
          {
            text: "cancel",
          },
          {
            text: "i'm sure",
            style: "destructive",
            onPress: () => {
              const newToDos = { ...toDos };
              delete newToDos[key];
              setToDos(newToDos);
              saveToDos(newToDos);
            },
          },
        ]
      );
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar style="white" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ fontSize: 38, fontWeight: "600", color: working ? "white" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
                  fontSize: 38, fontWeight: "600",
              color: !working ? "white" : theme.grey,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        onChangeText={onChangeText}
        onSubmitEditing={addTodo}
        value={text}
        returnKeyType="done"
        placeholder={working ? "Add a To Do" : "Where do you want to go?"}
        style={styles.input}
      />
      <ScrollView>
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working ? (
            <View key={key} style={styles.toDo}>
              <Text style={styles.toDoText}>{toDos[key].text}</Text>
              <TouchableOpacity onPress={() => deleteTodDo(key)}>
                <Text>
                  <Feather name="delete" size={20} color="red" />
                </Text>
              </TouchableOpacity>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
    fontSize: 18,
    marginVertical: 20,
  },
  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
