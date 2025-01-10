import { useMutation, useQuery } from '@tanstack/react-query';

import { vehicalendpoints } from '../../../../services/apis';
import axiosInstance from '../../../../services/axios';
import { useSelector } from 'react-redux';

async function fatchVehicleList({token,page = 1,limit = 10}) {
  const params = {
    page,
    limit,
  }
  const { data } = await axiosInstance.get(vehicalendpoints.VEHICLE_lIST, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
}

export function GetVehicleData({token,page=1,limit=10}) {
  return useQuery({
    queryKey: [vehicalendpoints.VEHICLE_lIST,{page,limit}],
    queryFn: () => fatchVehicleList({token,page,limit}),
  });
}
