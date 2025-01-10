import { useMutation, useQuery } from '@tanstack/react-query';


import axiosInstance from '../../../../services/axios';
import { userendpoints } from '../../../../services/apis';


async function fatchCustomerList({token,page=1,limit=10}) {
   const params = {
    page,
    limit,
   }
  const { data } = await axiosInstance.get(userendpoints.USER_LIST, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
}

export function GetUserData({token,page=1,limit=10}) {
  return useQuery({
    queryKey: [userendpoints.USER_LIST,{page,limit}],
    queryFn: () => fatchCustomerList({token,page,limit}),
  });
}
