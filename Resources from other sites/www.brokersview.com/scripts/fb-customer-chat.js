window.fbAsyncInit = function() {
  if (location.pathname.includes('/prohibit')) return
  console.log('fbAsyncInit')
  FB.init({
    xfbml: true,
    version: 'v14.0'
  })
}
;(function(d, s, id) {
  var js
  var fjs = d.getElementsByTagName(s)[0]
  if (d.getElementById(id)) return
  js = d.createElement(s)
  js.id = id
  js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js'
  fjs.parentNode.insertBefore(js, fjs)
})(document, 'script', 'facebook-jssdk')
