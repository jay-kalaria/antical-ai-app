import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

export default function ChatScreen() {
    return (
        <View style={styles.container}>
            <Ionicons name="mic" size={64} color={Colors.primary} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.white,
    },
});
