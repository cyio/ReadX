fis.match('*.jade', {
    rExt: '.html', // from .jade to .html
    parser: fis.plugin('jade', {
        // fis-parser-jade option
    })
});

fis.match('css/*.scss', {
  rExt: '.css',
  parser: fis.plugin('node-sass', {
    // options...
  })
})