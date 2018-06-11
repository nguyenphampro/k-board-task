
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
			var Email = checkNull(data.responseJSON.Email),
				FullName = checkNull(data.responseJSON.FullName),
				UserName = checkNull(data.responseJSON.UserName),
				PhoneNumber = checkNull(data.responseJSON.PhoneNumber),
				avartar = md5(Email)
			$('#Email').html(Email)
			$('#FullName').html(FullName)
			$('#UserName').html(UserName)
			$('#PhoneNumber').html(PhoneNumber)
			$('#avataruser').attr('src', 'https://www.gravatar.com/avatar/' + avartar + '?s=250')
		}
	})
}

$(document).ready(function () {
	__getuser_getLists()
});
