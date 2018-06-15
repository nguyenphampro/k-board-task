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
						Cookies.set('Token', md5(getToken), Settings.Cookies);
						localStorage.CurrentUser = u
						Cookies.set('CurrentUser', u, Settings.Cookies);
						localStorage.CurrentUserID = key
						Cookies.set('CurrentUserID', key, Settings.Cookies);
						for (var keyloged in getToken[key].permision) {
							if (getToken[key].permision.hasOwnProperty(keyloged)) {
								var element = getToken[key].permision[keyloged];
								localStorage.setItem('permision_'+keyloged, element);
								Cookies.set('permision_' + keyloged, element, Settings.Cookies);
							}
						}
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
