const notFound = (req, res, next)=>{
  const error = new Error(`Not Found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next)=>{
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; //500: unable to fulfill request
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : null,
  })
};

module.exports = {notFound, errorHandler};