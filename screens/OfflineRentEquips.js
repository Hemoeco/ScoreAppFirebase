import { useContext, useEffect } from "react";
import RentEquipList from "../components/RentEquip/RentEquipList";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import { RentEquipContext } from "../store/rent-equip-context";

function OfflineRentEquips() {
  const rentEquipsCtx = useContext(RentEquipContext);
  //const authCtx = useContext(AuthContext);

  //Used to fetch the equipments from the database
  //useEffect(() => {
  //  async function getEquips() {
  //    await rentEquipsCtx.setRentEquips();
  //  }
  //  getEquips();
  //}, []);

  if (rentEquipsCtx.fetching) {
    return (
      <LoadingOverlay message="Cargando equipos" />
    );
  }

  if (rentEquipsCtx.synchronizing) {
    return (
      <LoadingOverlay message="Sincronizando equipos" />
    );
  }

  return (
    <RentEquipList
      rentEquips={rentEquipsCtx.rentEquips.filter((equip) => equip.disponibleOffline)}
      local
    />
  );
}

export default OfflineRentEquips;