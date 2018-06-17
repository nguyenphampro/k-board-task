checkLogin('adduser')

if (md5(localStorage.getItem('CurrentUser') + localStorage.getItem('CurrentEmail')) === Cookies.get('Token')) {
	if (getParameterByName('id') === localStorage.getItem('CurrentUserID') || localStorage.getItem('CurrentUserID') === '1') {
		$('.waitforpermission-sec').removeClass('waitforpermission-sec')
	} else {
		window.location.href = '/nopermission'
	}
} else {
	window.location.href = '/nopermission'
}

var oldPaswToEdit = null

function __edituser_getLists() {
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
			oldPaswToEdit = getContents.password
			$('#username').val(getContents.username).prop('disabled', true);
			$('#email').val(getContents.email).prop('disabled', true);
			$('#fullname').val(getContents.fullname)
			for (var key in getContents.permision) {
				if (getContents.permision.hasOwnProperty(key)) {
					var element = getContents.permision[key];
					if (!element || element == false || element === 'false') {
						$('#' + key).prop("checked", false)
					} else {
						$('#' + key).prop("checked", true)
					}
				}
			}
		}
	})
}

function __user_editNew() {
	var URLID = getParameterByName('id')
	$('form.validator').validator().on('submit', function (e) {
		if (e.isDefaultPrevented()) {
			alert('Vui lòng kiểm tra lại thông tin')
		} else {
			var newData = JSON.stringify({
				id: URLID,
				username: $('#username').val(),
				password: ($('#password').val() && $('#password').val().length>0) ? md5($('#password').val()) : oldPaswToEdit,
				email: $('#email').val(),
				fullname: $('#fullname').val(),
				permision: {
					dashboard: $('#dashboard').prop("checked"),
					createtask: $('#createtask').prop("checked"),
					deltassk: $('#deltassk').prop("checked"),
					modifytask: $('#modifytask').prop("checked"),
					adduser: $('#adduser').prop("checked"),
					userlist: $('#userlist').prop("checked"),
					settings: $('#settings').prop("checked"),
					archivetask: $('#archivetask').prop("checked"),
					viewtask: $('#viewtask').prop("checked"),
					movetask: $('#movetask').prop("checked"),
					viewuser: $('#viewuser').prop("checked")
				},
				settings: {
					editor: Settings.Editor,
					pagesize: Settings.pageSize,
					activenumberstep1drag: Settings.ActiveNumberStep1Drag,
					activenumberstep2drop: Settings.ActiveNumberStep2Drop,
					oneway: Settings.OneWay
				}
			})
			$.ajax({
				url: "/edit",
				type: "POST",
				async: true,
				dataType: "json",
				cache: !0,
				data: newData,
				contentType: "application/json; charset=utf-8",
				beforeSend: function (xhr) {
					xhr.setRequestHeader("Authorization", 'Bearer ' + Cookies.get('Token'));
				},
				error: function (jqXHR, textStatus, errorThrown) {
				},
				complete: function (data) {
					if (data.responseText === 'error'){
						alert('Có lỗi xảy ra')
					} else {
						toastrMsg('Cập nhật hoàn tất', 'Cập nhật', 2000)
					}
				}
			})
		}
		return false
	})
}

$(document).ready(function () {
	__edituser_getLists()
	__user_editNew()
});
