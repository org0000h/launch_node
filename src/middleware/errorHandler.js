function formatError(err) {
  return {
    status: err.status,
    message: err.message,
  };
}

module.exports = formatError;
