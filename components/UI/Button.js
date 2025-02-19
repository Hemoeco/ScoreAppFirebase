import { Text, StyleSheet, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../consts/colors";

function Button({ onPress, children, icon, size, color }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
    >
      <Text style={styles.text}>{children}</Text>
      <Ionicons name={icon} size={size} color={color} />
    </Pressable>
  );
}

export default Button;

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    margin: 4,
    backgroundColor: Colors.accent500,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: 'black',
    shadowOpacity: 0.15,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 2,
    borderRadius: 4 //For border corners
  },
  pressed: {
    opacity: 0.7
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    color: 'black',
    paddingHorizontal: 7 
  }
});