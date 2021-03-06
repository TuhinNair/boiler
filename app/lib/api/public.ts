import sendRequestAndGetResponse from './sendRequestAndGetResponse';

const BASE_PATH = '/api/v1/public';

export const getUserApiMethod = (options = {}) => {
  return sendRequestAndGetResponse(`${BASE_PATH}/get-user`, { ...{ method: 'GET' }, ...options });
};

export const getUserBySlugApiMethod = (slug) =>
  sendRequestAndGetResponse(`${BASE_PATH}/get-user-by-slug`, {
    body: JSON.stringify({ slug }),
  });

export const updateProfileApiMethod = (data) =>
  sendRequestAndGetResponse(`${BASE_PATH}/user/update-profile`, {
    body: JSON.stringify(data),
  });

export const emailLoginLinkApiMethod = ({ email }: { email: string }) => {
  sendRequestAndGetResponse(`/auth/email-login-link`, {
    body: JSON.stringify({ user: email }),
  });
};
