import { useEffect, useState } from "react";
import RentEquipList from "../components/RentEquip/RentEquipList";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import { getRentEquips } from "../util/https";

function AllRentEquips() {
  const [rentEquips, setRentEquips] = useState();
  const [isFetching, setIsFetching] = useState(true);

  //Used to fetch the equipments from the database
  useEffect(() => {
    async function getEquips() {
      try {
        const rent = await getRentEquips();
        setRentEquips(rent);
      } catch (error) {
        console.log(error);
      }
      setIsFetching(false);
    }

    getEquips();
  }, []);

  if (isFetching) {
    //console.log('cargando');
    return (
      <LoadingOverlay message="Cargando equipos" />
    );
  }
  
  return (
    <RentEquipList rentEquips={rentEquips} />
  );
}

export default AllRentEquips;