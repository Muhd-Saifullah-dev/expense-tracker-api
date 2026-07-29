class Responses {
  generic_response = (status, success, data = null, error = null) => ({
    status: {
      code: status,
      success,
    },
    data,
    message: error,
  });

  ok_response = (data = null, message = null) => ({
    status: {
      code: 200,
      success: true,
    },
    data,
    error: null,
    message,
  });

  create_success_response = (
    data = null,
    message = "successfully created",
  ) => ({
    status: {
      code: 201,
      success: true,
    },
    data,
    error: null,
    message,
  });

  update_success_response = (
    data = null,
    message = "successfully updated",
  ) => ({
    status: {
      code: 200,
      success: true,
    },
    data,
    error: null,
    message,
  });

  delete_success_response = (
    data = null,
    message = "successfully deleted",
  ) => ({
    status: {
      code: 200,
      success: true,
    },
    data,
    error: null,
    message,
  });
  bad_request_error = (error = null, data = null) => ({
    status: {
      code: 400,
      success: false,
    },
    data,
    message: error,
  });
  not_found_error = (error = null) => ({
    status: {
      code: 404,
      success: false,
    },
    data: null,
    message: error,
  });

  unauthorized_error = (error = null) => ({
    status: {
      code: 401,
      succcess: false,
    },
    data: null,
    message: error,
  });
  forbidden_response = (error = null) => ({
    status: {
      code: 401,
      success: false,
    },
    data: null,
    message: error,
  });
  session_expired_response = (error = null) => ({
    status: {
      code: 401,
      succcess: false,
    },
    data: null,
    message: error,
  });
  server_error_response = (error = null) => ({
    status: {
      code: 500,
      success: false,
    },
    data: null,
    message: error,
  });

  generic_error = (code, error = null) => ({
    status: {
      code: code,
      success: false,
    },
    data: null,
    message: error,
  });
}

module.exports = Responses;
