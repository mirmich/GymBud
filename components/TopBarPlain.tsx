import { View, Pressable, StyleSheet } from "react-native";
import { darkMode } from "../model/GlobalStyles";
import { FontAwesome } from '@expo/vector-icons'; 
import StorageService from "../services/storage/StorageService";


export default function TopBarPlain() {


    return (
        <View style={styles.container}>
          <Pressable onPress={() => StorageService.addCategory("Back") }>
            <FontAwesome 
              name="plus" 
              size={24} 
              color={darkMode.fontColor} />
          </Pressable>
          <Pressable onPress={async () => {
            const categories = (await StorageService.listAllCategories());
            console.log(categories);
            } }>
            <FontAwesome 
              name="list" 
              size={24} 
              color={darkMode.fontColor} />
          </Pressable>
        </View>
      );

}

const styles = StyleSheet.create({
    container: {
      backgroundColor: darkMode.accentPurple,
      paddingBottom: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: 32,
      paddingLeft: 16,
      paddingRight: 16
    }
  });