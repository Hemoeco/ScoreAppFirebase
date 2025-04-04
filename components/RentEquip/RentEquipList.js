import { StyleSheet, Text, View, FlatList, RefreshControl } from "react-native";

import RentEquipItem from "./RentEquipItem";
import { useCallback, useContext, useState } from "react";
import { RentEquipContext } from "../../store/rent-equip-context";
import Button from "../UI/Button";
import { AuthContext } from "../../store/auth-context";

function RentEquipList({ rentEquips, local }) {
  const [refreshing, setRefreshing] = useState(false);
  const rentEquipsCtx = useContext(RentEquipContext);
  const authCtx = useContext(AuthContext);

  //Used to fetch the equipments from the database
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    async function getEquips() {
      try {
        await rentEquipsCtx.setRentEquips('refresh');
      } catch (error) {
        console.log(error);
      }
      setRefreshing(false);
    }
    getEquips();
  }, []);

  //This evits renderize the list of equipments if the the user is refreshing
  if (refreshing) {
    return;
  }

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
      refreshControl={!local && <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />}
      ListHeaderComponent={local && authCtx.isConnected && rentEquips.find(
        (equip) => equip.disponibleOffline && equip.actualizadoOffline) &&
        <View style={styles.buttonContainer}>
          <Button
            onPress={rentEquipsCtx.syncData}
            icon="sync"
            size={19}
          >
            Sincronizar registros
          </Button>
        </View>
      }
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
  },
  buttonContainer: {
    alignItems: 'center',
    width: '100%',
    marginTop: 3,
    //marginLeft: 4
  }
});