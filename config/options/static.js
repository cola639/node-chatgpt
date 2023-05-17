const options = {
  dotfiles: 'ignore', //allow, deny, ignore
  etag: true,
  extensions: ['htm', 'html'],
  index: false, //to disable directory indexing
  maxAge: '7d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    //add this header to all static responses
    res.set('x-timestamp', Date.now())
  }
}

module.exports = {
  options
}
