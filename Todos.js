import React from 'react'
import firebase from 'react-native-firebase'
import { FlatList, View, Text, TextInput, Button } from 'react-native'
import Todo from './Todo'

class Todos extends React.Component {
  constructor() {
    super();
    this.ref = firebase.firestore().collection('todos');
    this.state = {
      textInput: '',
      todos: [],
    };
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate)
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const todos = [];
    querySnapshot.forEach((doc) => {
      const { title, complete } = doc.data();
      todos.push({
        key: doc.id,
        doc, // DocumentSnapshot
        title,
        complete,
      });
    });
    this.setState({
      todos,
   });
  }

  updateTextInput = (e) => {
    this.setState({
      textInput: e.target.value
    });
  }

  addTodo = () => {
    this.ref.add({
      title: this.state.textInput,
      complete: false
    });
    this.setState({
      textInput: '',
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={this.state.todos}
          renderItem={({ item }) => <Todo {...item} />}
        />
        <TextInput
            placeholder={'Add TODO'}
            value={this.state.textInput}
            onChangeText={this.updateTextInput}
        />
        <Button
            title={'Add TODO'}
            disabled={!this.state.textInput.length}
            onPress={this.addTodo}
        />
    </View>
    )
  }
}

export default Todos;
