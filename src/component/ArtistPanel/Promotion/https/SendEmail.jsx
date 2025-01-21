import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axiosInstance from "../../../../services/axios";
import { promotionEmailSendApi } from "../../../../services/apis";

async function sendEmails(faqSaveData) {
  const token = faqSaveData.token;
  return axiosInstance.post(
    promotionEmailSendApi.ADMIN_EMAIL_SEND,
    faqSaveData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
export const SendEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendEmails,

    onSuccess: (res) => {
      toast.success(res.data.message);
    },

    onError: (res) => {
      toast.error(res?.response?.data?.message);
    },
  });
};
