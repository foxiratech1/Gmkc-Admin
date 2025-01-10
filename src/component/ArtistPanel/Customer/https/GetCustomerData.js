import { useMutation, useQuery } from '@tanstack/react-query';

import { customerendpoints } from '../../../../services/apis';
import axiosInstance from '../../../../services/axios';
import { useSelector } from 'react-redux';

async function fatchCustomerList({token,page=1,limit=10}) {
   const params = {
    page,
    limit,
   }
  const { data } = await axiosInstance.get(customerendpoints.CUSTOMER_LIST, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
}

export function GetCustomerData({token,page=1,limit=10}) {
  return useQuery({
    queryKey: [customerendpoints.CUSTOMER_LIST,{page,limit}],
    queryFn: () => fatchCustomerList({token,page,limit}),
  });
}
