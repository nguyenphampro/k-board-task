
function __user_addNew() {
	$('form.validator').validator().on('submit', function (e) {
		if (e.isDefaultPrevented()) {
			alert('Vui lòng kiểm tra lại thông tin')
		} else {
			var newData = JSON.stringify({
				username: $('#username').val(),
				password: $('#password').val(),
				email: $('#email').val(),
				fullname: $('#fullname').val(),
				dashboard: $('#dashboard').prop("checked"),
				createtask: $('#createtask').prop("checked"),
				deltassk: $('#deltassk').prop("checked"),
				modifytask: $('#modifytask').prop("checked"),
				adduser: $('#adduser').prop("checked"),
				userlist: $('#userlist').prop("checked"),
				settings: $('#settings').prop("checked")
			})
			$.ajax({
				url: "/adduser",
				type: "POST",
				async: true,
				dataType: "json",
				cache: !0,
				data: newData,
				contentType: "application/json; charset=utf-8",
				beforeSend: function (xhr) {
					xhr.setRequestHeader("Authorization", 'Bearer ' + localStorage.getItem('Token'));
				},
				error: function (jqXHR, textStatus, errorThrown) {
				},
				complete: function (data) {
					alert('Đã cập nhật thành viên mới!')
					$('#adduser')[0].reset();
				}
			})
		}
		return false
	})
}

$(document).ready(function () {
	__user_addNew()
});
