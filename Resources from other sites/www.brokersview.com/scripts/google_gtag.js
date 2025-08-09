(function(w, d, s, l, i) {
  w[l] = w[l] || []
  if (!w.gtag) {
    w.gtag = function() {
      console.log(arguments)
      w[l].push(arguments)
    }
  }
  var f = d.getElementsByTagName(s)[0]
  var j = d.createElement(s)
  var dl = l !== 'dataLayer' ? '&l=' + l : ''
  j.async = true
  j.src = 'https://www.googletagmanager.com/gtag/js?id=' + i + dl
  f.parentNode.insertBefore(j, f)
})(window, document, 'script', 'dataLayer', 'G-RJFFYHYTMR')
gtag('js', new Date())
gtag('config', 'G-RJFFYHYTMR')
