import { StyleSheet, Text, View, FlatList, RefreshControl } from "react-native";

import RentEquipItem from "./RentEquipItem";
import { useCallback, useEffect, useState } from "react";
import { getRentEquips } from "../../util/https";

function RentEquipList({ rentEquips }) {
  const [rentEqs, setRentEqs] = useState(rentEquips);
  const [refreshing, setRefreshing] = useState(false);

  //Used to fetch the equipments from the database
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    async function getEquips() {
      try {
        const rent = await getRentEquips();
        //console.log("p");
        setRentEqs(rent);
      } catch (error) {
        console.log(error);
      }
      setRefreshing(false);
    }

    getEquips();
  }, []);

  if (!rentEqs || rentEqs.length === 0) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.fallbackText}>No se encontraron equipos registrados</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      data={rentEqs}
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