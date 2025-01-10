import { useMutation, useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../../services/axios';
import { allinquiryendpoinds } from '../../../../services/apis';


async function fatchInquiryList({token,limit = 8, page = 1}) {
   const params = {
    limit,
    page,
   }
  const { data } = await axiosInstance.get(allinquiryendpoinds.INQUIRY_LIST, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
}

export function GetInquiryData({token,limit = 8, page = 1}) {
  return useQuery({
    queryKey: [allinquiryendpoinds.INQUIRY_LIST,{limit,page}],
    queryFn: () => fatchInquiryList({token,limit, page}),
  });
}
