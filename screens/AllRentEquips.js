import { useCallback, useContext, useEffect, useState } from "react";
import RentEquipList from "../components/RentEquip/RentEquipList";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import { RentEquipContext } from "../store/rent-equip-context";

function AllRentEquips() {
  const rentEquipsCtx = useContext(RentEquipContext);

  //Used to fetch the equipments from the database
  useEffect(() => {
    async function getEquips() {
      await rentEquipsCtx.setRentEquips('set');
    }
    getEquips();
  }, []);

  if (rentEquipsCtx.fetching) {
    return (
      <LoadingOverlay message="Cargando equipos" />
    );
  }

  return (
    <RentEquipList 
      rentEquips={rentEquipsCtx.rentEquips} 
      getRentEquips={rentEquipsCtx.setRentEquips}
    />
  );
}

export default AllRentEquips;