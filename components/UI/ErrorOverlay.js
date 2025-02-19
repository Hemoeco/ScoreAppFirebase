import { View, StyleSheet, Text } from "react-native";
//Quit the buttom or commented it?
import Button from "./Button";

function ErrorOverlay({message, onConfirm}) {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, styles.title]}>¡Ocurrió un error!</Text>
      <Text style={styles.text}>{message}</Text>
      <Button onPress={onConfirm}>Okay</Button>
    </View>
  );
}

export default ErrorOverlay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'white'
  },
  text: {
    color: 'black',
    textAlign: 'center',
    marginBottom: 8
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});