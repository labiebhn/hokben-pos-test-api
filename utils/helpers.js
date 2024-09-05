exports.setResponse = (code, message, data) => {
  const SUCCESS_STATUS = [200, 201, 202, 203, 204, 205, 206, 207, 208, 226];
  let payload = {};
  payload.meta = {
    code,
    message,
    success: SUCCESS_STATUS.includes(code),
  };
  payload.data = data || {};
  return payload;
};
