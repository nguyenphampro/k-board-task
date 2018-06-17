
checkLogin('viewuser')

function __getuser_getLists() {
	var URLID = getParameterByName('id')
	$.ajax({
		url: Global.API_URL + "/user.json?id=" + URLID,
		type: "GET",
		async: true,
		dataType: "json",
		cache: !0,
		beforeSend: function (xhr) {
			xhr.setRequestHeader("Authorization", 'Bearer ' + Cookies.get('Token'));
		},
		error: function (jqXHR, textStatus, errorThrown) {
		},
		complete: function (data) {
			var getContents = JSON.parse(data.responseText)
			// Filter ID
			for (var key in getContents) {
				if (getContents.hasOwnProperty(key)) {
					if (key === URLID) {
						getContents = getContents[key]
					}
				}
			}
			var Email = checkNull(getContents.email), avartar = md5(Email)
			$('#hash').html(avartar)
			$('#id').html(URLID)
			$('#avataruser').attr('src', 'https://s.gravatar.com/avatar/' + avartar + '?s=180')
			for (var key in getContents) {
				if (getContents.hasOwnProperty(key)) {
					var element = getContents[key];
					$('#key-' + key).html(key.charAt(0).toUpperCase() + key.slice(1))
					$('#con-' + key).html(element)
				}
			}
		}
	})
}

$(document).ready(function () {
	__getuser_getLists()
});
