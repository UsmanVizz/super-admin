export const environment = {
  production: false,
  // baseURL: 'http://localhost:3001',
  baseURL: 'https://dev-backend.hamaravenue.com',
  // baseURL: 'http://dev-backend.hamaravenue.com',
  // baseURL: "https://backendapi-hallmanagement.updatemedaily.com",
  // signupApi: '/api/auth/signup',
  loginApi: '/auth/admin/login',
  forGotPasswordApi: '/auth/admin/forgot-password',
  verifyOtpApi: '/auth/admin/verify-otp',
  verifyAccount: '/auth/admin/verify-account',
  reSendOtpApi: '/auth/admin/resend-otp',
  resetPasswordApi: '/auth/admin/reset-password',
  updatePasswordApi: '/api/admin/profile/update_password',
  updateProfileImg:
    'https://dev-backend.hamaravenue.com/api/hall/profile/update_image?fileType=images',

  imageUrl:
    'https://dev-backend.hamaravenue.com/api/hall/menu_category/upload-images?fileType=images',
  thumbnailUrl:
    'https://dev-backend.hamaravenue.com/api/hall/menu_category/upload-images?fileType=thumbnail',
  userManagementImag:
    'https://dev-backend.hamaravenue.com/api/hall/user_management/upload-images',
  getAllUsersApi: '/api/hall/user_management/user_management',
};
