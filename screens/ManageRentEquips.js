import { useLayoutEffect, useContext } from "react";

import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";
import RentEquipForm from "../components/RentEquip/RentEquipForm";
import { RentEquipContext } from "../store/rent-equip-context";

function ManageRentEquips({ navigation, route }) {
  const rentEquipsCtx = useContext(RentEquipContext);
  //Data of the equipment selected
  const equipData = route.params?.equipData;
  const imageEquipUri = equipData ? equipData.imagen : '';
  const rentEquipId = equipData ? equipData.id : '';
  //To know if the action needs to be create or update
  const isEditing = !!equipData;

  //Return to the index not longer used but works as an example of reset.
  //function goBackToIndex() {
  //  navigation.reset({
  //    index: 1, 
  //    routes: [
  //      {
  //        name: 'AllRentEquips'
  //      }
  //    ]
  //  });
  //}
//

  //Put the title depending if is editing or creating
  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Actualizar equipo' : 'Añadir equipo'
    });
  }, [navigation, isEditing]);

  if (rentEquipsCtx.error && !rentEquipsCtx.submitting) {
    return <ErrorOverlay message={rentEquipsCtx.error} onConfirm={rentEquipsCtx.errorHandler} />;
  }

  if (rentEquipsCtx.submitting) {
    return <LoadingOverlay message="Guardando cambios" />;
  }

  return (
    <RentEquipForm
      equipData={equipData}
      saveHandler={rentEquipsCtx.saveRentEquipData}
      deleteHandler={rentEquipsCtx.deleteEquip.bind(this, rentEquipId, imageEquipUri)}
      isEditing={isEditing}
    />
  );
}

export default ManageRentEquips;