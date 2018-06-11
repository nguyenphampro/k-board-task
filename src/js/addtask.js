function __addTask_submitForm() {
	$("#datepicker").datetimepicker({
		controlType: 'select',
		oneLine: true,
		dateFormat: "yy-mm-dd",
		timeFormat: 'HH:mm'
	});
	$("#customFile").on("change paste keyup", function (e) {
		var fileName = e.target.files[0].name;
		$('#customFileLabel').html(fileName)
	});
	$('form.validator').validator().on('submit', function (e) {
		if (e.isDefaultPrevented()) {
			alert('Vui lòng kiểm tra lại thông tin')
		} else {
			App.txtNewTitle = $('#text').val();
			App.txtNewSelect = $('#select').val();
			App.txtNewMesage = $('#message').val();
			App.txtNewDate = $('#datepicker').val();
			App.txtNewProject = $('#namepro').val();
			App.txtNewColor = $('#color').val();
			App.txtNewMaterial = $('#material').val();
			upLoadPDF(App.txtNewTitle, App.txtNewSelect, App.txtNewMesage, App.txtNewDate, App.txtNewProject, App.txtNewColor, App.txtNewMaterial)
		}
		return false
	})
};

function __addTask_createTask(txtNewTitle, txtNewSelect, txtNewMesage, txtNewDate, files, txtNewProject, txtNewColor, txtNewMaterial) {
	var newData = JSON.stringify({
		ObjectId: null,
		ObjectType: 'cnc.task',
		Name: txtNewTitle,
		MetaIndex: txtNewSelect,
		MetaBitValue: null,
		MetaDescription: txtNewMesage,
		MetaTextValue: files,
		CreatedDate: txtNewDate,
		Properties: {
			JobDetail: {
				Project: txtNewProject,
				Material: txtNewMaterial,
				PaintColor: txtNewColor
			}
		}
	})
	$.ajax({
		url: Global.API_URL + "/etracking/cnctask/save",
		type: "PUT",
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
			var newId = data.responseJSON.ObjectId;
			$.ajax({
				url: Global.API_URL + "/etracking/cnctask/setstate?jobid=" + newId + "&newState=P&returnAllStates=true",
				type: "POST",
				async: true,
				dataType: "json",
				cache: !0,
				contentType: "application/json; charset=utf-8",
				beforeSend: function (xhr) {
					xhr.setRequestHeader("Authorization", 'Bearer ' + localStorage.getItem('Token'));
				},
				complete: function (data) {
				}
			})
		}
	})
}

function upLoadPDF(a, b, c, d, e, f, g) {
	var data = new FormData($('#addtask')[0]);
	$.ajax({
		url: '/upload',
		type: 'POST',
		contentType: false,
		processData: false,
		cache: false,
		data: data,
		success: function (data) {
			__addTask_createTask(a, b, c, d, data, e, f, g)
			alert('Đã cập nhật task mới!')
			$('#addtask')[0].reset();
		},
		error: function () {
			alert('Lỗi khi upload!');
		}
	});
	return false;
}


$(document).ready(function () {
	__addTask_submitForm()
});
