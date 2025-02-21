import { StyleSheet, Text, View, FlatList, RefreshControl } from "react-native";

import RentEquipItem from "./RentEquipItem";
import { useCallback, useState } from "react";

function RentEquipList({ rentEquips, getRentEquips }) {
  const [refreshing, setRefreshing] = useState(false);

  //Used to fetch the equipments from the database
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    async function getEquips() {
      try {
        await getRentEquips('refresh');
      } catch (error) {
        console.log(error);
      }
      setRefreshing(false);
    }

    getEquips();
  }, []);


  if (!rentEquips || rentEquips.length === 0) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.fallbackText}>No se encontraron equipos registrados</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      data={rentEquips}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <RentEquipItem rentEquip={item} />}
      refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} />}
    />
  );
}

export default RentEquipList;

const styles = StyleSheet.create({
  list: {
    margin: 10
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  fallbackText: {
    fontSize: 16,
    color: 'black'
  }
});