// // cors ----------
// const ALLOW_ORIGINS = [
//   'https://nodeusers-dev-xzxj.2.us-1.fl0.io',
//   'http://localhost:3000'
// ]
export function cors (req, res, next) {
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Access-Control-Allow-Origin', '*')
  // if (ALLOW_ORIGINS.includes(req.headers.origin)) {
  //   res.header('Access-Control-Allow-Origin', req.headers.origin)
  // }
  next()
}
