function formatError(err) {
  return {
    status: err.status || 500,
    message: err.message,
  };
}

module.exports = formatError;
