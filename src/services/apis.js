const BASE_URL = import.meta.env.VITE_APP_BASE_URL

export const authendpoints = {
    SIGNIN_API: BASE_URL + "/api/admin/login",
    FORGET_PASSWORD_OTP: BASE_URL + "/api/admin/forgot-password-otp",
    VALID_OTP: BASE_URL + "/api/admin/validate-otp",
    RESET_PASSWORD: BASE_URL + "/api/admin/reset-password",
}

export const vehicalendpoints = {
    ADD_VEHICLE: BASE_URL + "/api/admin/vehical-post",
    VEHICLE_lIST: BASE_URL + '/api/admin/all-vehical-list',
    UPDTAE_VEHICLE: BASE_URL + '/api/admin/vehical-update',
    DELETE_VEHICLE: BASE_URL + '/api/admin/vehical-delete',
}
export const customerendpoints = {
    CUSTOMER_LIST: BASE_URL + '/api/admin/customer-list'
}
export const allinquiryendpoinds = {
    INQUIRY_LIST: BASE_URL + '/api/admin/all-inqurues'
}
export const requestendpoints = {
    REQUEST_LIST: BASE_URL + '/api/admin/all-request-quote-list'
}
export const shipmentendpoints = {
    ALL_SHIPMENT_LIST: BASE_URL + '/api/admin/all-shipment-quote-list',
    SINGLE_SHIPMENT_DETAIL: BASE_URL + '/api/admin/single-shipment-detail',
    SHIPMENT_DELIVERY_DETAIL:BASE_URL + '/api/admin/shipment-delivery-detail',
    DELETE_SHIPMENT:BASE_URL + '/api/admin/shipment-delete',
    UPDATE_SHIPMENT_STOP: BASE_URL + '/api/admin/shipment-detail-update',
}

export const faqendpoints = {
    POST_FAQ: BASE_URL + '/api/admin/create-faq',
    FAQ_LIST: BASE_URL + '/api/admin/faq-list',
    DELETE_FAQ : BASE_URL + '/api/admin/delete-faq',
    EDIT_FAQ : BASE_URL + '/api/admin/update-faq',
    SINGLE_FAQ : BASE_URL + '/api/admin/single-faq-detail',
}
export const userendpoints = {
    USER_LIST: BASE_URL + '/api/admin/user-list',
}