import { useContext, useEffect } from "react";
import RentEquipList from "../components/RentEquip/RentEquipList";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import { RentEquipContext } from "../store/rent-equip-context";

function OfflineRentEquips() {
  const rentEquipsCtx = useContext(RentEquipContext);

  //Used to fetch the equipments from the database
  useEffect(() => {
    if (rentEquipsCtx.rentEquips.length === 0) {
      async function getEquips() {
        await rentEquipsCtx.setRentEquips(true);
      }
      getEquips();
    }
  }, []);

  if (rentEquipsCtx.fetching) {
    return (
      <LoadingOverlay message="Cargando equipos" />
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