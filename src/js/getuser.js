
function __getuser_getLists() {
	var URLID = getParameterByName('id')
	$.ajax({
		url: Global.API_URL + "/user.json?id=" + URLID,
		type: "GET",
		async: true,
		dataType: "json",
		cache: !0,
		beforeSend: function (xhr) {
			xhr.setRequestHeader("Authorization", 'Bearer ' + localStorage.getItem('Token'));
		},
		error: function (jqXHR, textStatus, errorThrown) {
		},
		complete: function (data) {
			var getContents = JSON.parse(data.responseText)
			// Filter ID
			for (var key in getContents) {
				if (getContents.hasOwnProperty(key)) {
					var element = getContents[key].ObjectId;
					if (key === URLID) {
						getContents = getContents[key]
					}
				}
			}
			var Email = checkNull(getContents.email),
				FullName = checkNull(getContents.fullname),
				UserName = checkNull(getContents.username),
				avartar = md5(Email)
			$('#Email').html(Email)
			$('#FullName').html(FullName)
			$('#UserName').html(UserName)
			$('#avataruser').attr('src', 'https://www.gravatar.com/avatar/' + avartar + '?s=250')
		}
	})
}

$(document).ready(function () {
	__getuser_getLists()
});
