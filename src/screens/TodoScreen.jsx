import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
} from 'react-native';
import {useEffect, useState} from 'react';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import {
  AddCircle,
  CloseCircle,
  Edit2,
  TickCircle,
  Trash,
} from 'iconsax-react-native';
import {useNavigation} from '@react-navigation/native';
import * as Yup from 'yup';

const todoScheme = Yup.object().shape({
  text: Yup.string().required('Todo Kısmı Boş Bırakılamaz!'),
});

const TodoScreen = () => {
  const navigation = useNavigation();
  // STATES
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);
  // ASYNC STORAGE

  const saveTodos = async saveTodo => {
    try {
      // AS ekle yaparken setItem
      // key ve value ister
      // objeyi stringe çevirmek için json.stringify kullanırız
      await AsyncStorage.setItem('todos', JSON.stringify(saveTodo));
    } catch (error) {
      console.log(error);
    }
  };

  const loadTodos = async () => {
    try {
      const storedData = await AsyncStorage.getItem('todos');
      if (storedData) {
        setTodos(JSON.parse(storedData));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTodo = async id => {
    const updatedTodos = todos.filter(item => item.id !== id);
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  const completeTodo = async id => {
    const updatedTodos = todos.map(item =>
      item.id === id ? {...item, completed: !item.completed} : item,
    );
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  const updateTodos = id => {
    // id'sini bildiğimiz elemanı todos dizisi içerisinde bulmak için find methodu kullandık
    const existingTodo = todos?.find(item => item.id === id);
    // id'li elemanı dizide yoksa fonksiyonu durdur
    if (!existingTodo) return;

    Alert.prompt(
      'Edit Todo',
      'Update',
      newUpdateText => {
        if (newUpdateText) {
          const updateTodos = todos.map(item =>
            item?.id === id ? {...item, text: newUpdateText} : item,
          );
          setTodos(updateTodos);
          saveTodos(updateTodos);
        }
      },
      'plain-text',
      existingTodo.text,
    );
  };

  useEffect(() => {
    loadTodos();
  }, []);

  // FUNCS
  const addTodo = () => {
    try {
      todoScheme.validateSync({text: todo});
      const updatedTodos = [
        ...todos,
        {id: uuid.v4(), text: todo, completed: false},
      ];
      setTodos(updatedTodos);
      saveTodos(updatedTodos);
    } catch (error) {
      Alert.alert('Hata', error.errors[0]);
    }
  };

  // console.log(todos)
  return (
    <LinearGradient colors={['#fef3c7', '#a78bfa']} style={styles.container}>
      <SafeAreaView>
        {/* ADD TODO PART */}
        <Text style={styles.headerText}>TO-DO LIST</Text>
        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={text => setTodo(text)}
            placeholder="Todo Giriniz.."
            style={styles.input}
            value={todo}
          />
          <TouchableOpacity
            onPress={addTodo}
            style={[styles.button, styles.addButton]}>
            <AddCircle size="32" color="#FF8A65" variant="Broken" />
          </TouchableOpacity>
        </View>

        {/* TODOS LIST */}
        <FlatList
          data={todos}
          keyExtractor={item => item?.id?.toString()}
          renderItem={({item}) => (
            <View style={styles.todoItem}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Detail', {todo: item})}>
                <Text
                  style={[
                    styles.todoText,
                    item.completed && styles.completedText,
                  ]}>
                  {item?.text}
                </Text>
              </TouchableOpacity>

              <View style={{flexDirection: 'row'}}>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={() => completeTodo(item?.id)}
                    style={[styles.button, styles.completeButton]}>
                    <Text style={styles.buttonText}>
                      {item.completed ? (
                        <CloseCircle size="24" color="#000" />
                      ) : (
                        <TickCircle
                          size="27"
                          color="#ff8a65"
                          variant="Broken"
                        />
                      )}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={() => deleteTodo(item?.id)}
                    style={[styles.button, styles.deleteButton]}>
                    <Text style={styles.buttonText}>
                      <Trash size="32" color="#ff8a65" variant="Broken" />
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={() => updateTodos(item?.id)}
                    style={[styles.button, styles.updateButton]}>
                    <Text style={styles.buttonText}>
                      <Edit2 size="32" color="#ff8a65" variant="Broken" />
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default TodoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    flex: 1,
    borderRadius: 10,
    borderColor: 'gray',
  },
  button: {
    marginLeft: 10,
    borderRadius: 5,
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  buttonText: {
    color: '#fff',
  },
  buttonContainer: {},
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  deleteButton: {
    padding: 10,
  },
  updateButton: {padding: 10},
  todoText: {
    color: '#000',
    textDecorationLine: 'none',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: 'gray',
    fontSize: 15,
  },
  completeButton: {
    marginTop: 3,
    padding: 10,
  },
  tebrikler: {
    fontSize: 18,
    color: 'green',
    marginVertical: 20,
    textAlign: 'center',
  },
});
