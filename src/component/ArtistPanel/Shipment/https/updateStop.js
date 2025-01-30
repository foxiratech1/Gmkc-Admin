import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axiosInstance from "../../../../services/axios";
import { shipmentendpoints } from "../../../../services/apis";

async function Updatestop({ updatedData, userId, token }) {
  console.log(userId, "hhhhh");
  // const token = updatedData.token
  // const id = updatedData.id
  return axiosInstance.put(
    shipmentendpoints.UPDATE_SHIPMENT_STOP + `/${userId}`,
    updatedData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
export const EditShipmentStop = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: Updatestop,

    onSuccess: (res, variable) => {
      console.log(variable, "variable");
      console.log(res, "resdddddddddd");
      queryClient.invalidateQueries({
        queryKey: [shipmentendpoints.SHIPMENT_DELEVERY_DETAIL],
        refetchType: "all",
      });
      queryClient.refetchQueries([shipmentendpoints.SHIPMENT_DELEVERY_DETAIL]);
      toast.success(res?.data?.message);
    },

    onError: (res) => {
      toast.error(res?.response?.data?.message);
    },
  });
};
