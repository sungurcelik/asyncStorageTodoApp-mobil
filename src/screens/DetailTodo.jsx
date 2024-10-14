import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {SaveAdd} from 'iconsax-react-native';
import {getItem, setItem} from '../utils/asyncStorage';
import {useNavigation} from '@react-navigation/native';

const DetailTodo = ({route}) => {
  const navigation = useNavigation();
  const {todo} = route.params;
  const [note, setNote] = useState('');

  useEffect(() => {
    const loadNote = async () => {
      const storedNote = await getItem(todo?.id);
      if (storedNote) {
        setNote(storedNote);
      }
    };
    loadNote();
  }, [todo?.id]);

  const saveNote = async () => {
    try {
      await setItem(todo?.id, note).then(() => {
        navigation.goBack();
      });
    } catch (error) {
      console.log('Sıkıntı çıktı', error);
    }
  };

  return (
    <LinearGradient
      colors={['#fef3c7', '#f472b6', '#7c3aed']}
      style={styles.container}>
      <SafeAreaView>
        <View style={styles.titleView}>
          <Text style={styles.title}>{todo?.text}</Text>
        </View>
        <View style={styles.todoContent}>
          <TextInput
            placeholder="Birkaç Not Yazabilirsiniz..."
            style={styles.todoText}
            multiline={true}
            value={note}
            onChangeText={setNote}
          />
        </View>
        <View style={styles.saveIcon}>
          <TouchableOpacity onPress={saveNote}>
            <SaveAdd size="55" color="#ff8a65" variant="Broken" />
          </TouchableOpacity>
          <Text
            style={{
              color: '#ff8a65',
              fontSize: 18,
              fontWeight: 'bold',
              marginTop: 15,
            }}>
            Kaydet ve Çık
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default DetailTodo;

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleView: {
    marginTop: width * 0.2,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  todoContent: {
    alignSelf: 'center',
    backgroundColor: 'transparent',
    marginTop: 50,
    width: width * 0.85,
    height: width * 0.9,
    borderRadius: 25,
    padding: 25,
  },
  todoText: {
    fontSize: 17,
    height: 400,
  },
  saveIcon: {
    alignItems: 'center',
    marginTop: 55,
    justifyContent: 'center',
  },
});
