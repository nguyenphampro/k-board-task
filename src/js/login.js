function __login__postData(u,p) {
	$.ajax({
		url: Global.API_URL + "/user.json",
		type: "GET",
		async: true,
		dataType: "text",
		cache: !0,
		data: "username=" + u + "&password=" + p + "",
		complete: function (data) {
			var getToken = JSON.parse(data.responseText)
			var ready = false
			for (const key in getToken) {
				if (getToken.hasOwnProperty(key)) {
					var element = getToken[key];
					if (getToken[key].username === u && getToken[key].password === p) {
						localStorage.Token = md5(getToken)
						ready = true
					}
				}
			}
			if(!ready) {
				alert('Vui lòng kiểm tra lại thông tin')
			} else {
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
