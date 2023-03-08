const catchAsync = (func) => {
  return (req, res, next) => {
    func(req, res).catch((error) => next(error));
  };
};

const globalErrorHandler = (err, req, res, next) => {
  console.error(err.stack);

  err.statusCode = err.statusCode || 500;

  return res.status(err.statusCode).json({ message: err.message });
};

module.exports = {
  catchAsync,
  globalErrorHandler,
};
