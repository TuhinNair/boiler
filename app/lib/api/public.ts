import sendRequestAndGetResponse from './sendRequestAndGetResponse';

const BASE_PATH = '/api/v1/public';

export const getUser = (options = {}) => {
  return sendRequestAndGetResponse(`${BASE_PATH}/get-user`, { ...{ method: 'GET' }, ...options });
};
