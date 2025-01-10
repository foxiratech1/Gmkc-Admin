import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicalendpoints } from '../../../../services/apis';
import toast from 'react-hot-toast';
import axiosInstance from '../../../../services/axios';


async function vehicleData(formData) {
    const token =  formData.get('token')
  return axiosInstance.post(vehicalendpoints.ADD_VEHICLE,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

const postVehicleData = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: vehicleData,

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

export default postVehicleData;
