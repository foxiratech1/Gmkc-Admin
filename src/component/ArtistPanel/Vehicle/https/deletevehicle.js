import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicalendpoints } from '../../../../services/apis';
import toast from 'react-hot-toast';
import axiosInstance from '../../../../services/axios';


async function vehicleDelete({id,token}) {
  return axiosInstance.delete(vehicalendpoints.DELETE_VEHICLE + `/${id}`, 
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

const DeleteVehicle = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: vehicleDelete,

    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [vehicalendpoints.VEHICLE_lIST],
        refetchType:'all'
      })
      queryClient.refetchQueries([vehicalendpoints.VEHICLE_lIST])
      
      toast.success(res.data.message);
    },
    onError: (res) => {
      toast.error(res.response.data.message);
    },
  });
};

export default DeleteVehicle;
