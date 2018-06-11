function __login__postData(u,p) {
	$.ajax({
		url: Global.API_URL + "/oauth/token",
		type: "POST",
		async: true,
		dataType: "text",
		cache: !0,
		data: "grant_type=password&username=" + u + "&password=" + p + "",
		complete: function (data) {
			var getToken = JSON.parse(data.responseText)
			if (getToken.access_token && getToken.access_token.length>0) {
				localStorage.Token = getToken.access_token
				window.location.href = '/'
			}
		}
	})
}

$(document).ready(function () {
	$('form.validator').validator().on('submit', function (e) {
		if (e.isDefaultPrevented()) {
			alert('Vui lòng kiểm tra lại thông tin')
		} else {
			var u = $('#Username').val()
			var p = $('#Password').val()
			__login__postData(u,p)
		}
		return false
	})
});
