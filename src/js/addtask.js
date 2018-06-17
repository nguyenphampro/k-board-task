checkLogin('createtask')

function __addTask_submitForm() {
	if (Settings.Editor && Settings.Editor == true) {
		$('label[for="message"]').hide()
		tinymce.init({
			selector: '#message',
			forced_root_block: 'div',
			height: 100,
			menubar: true,
			theme: 'modern',

			plugins: [
				'advlist autolink lists link image charmap print preview anchor textcolor',
				'searchreplace visualblocks code fullscreen',
				'insertdatetime media table contextmenu paste code help wordcount code'
			],
			toolbar: 'formatselect | bold italic forecolor backcolor  | alignleft aligncenter alignright | bullist numlist removeformat | code'
		});
	}
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
			if (Settings.Editor && Settings.Editor == true) {
				App.txtNewMesage = $('#message').val();
			} else {
				App.txtNewMesage = $('#message').val();
			}
			App.txtNewTitle = $('#text').val();
			App.txtNewSelect = $('#select').val();
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
	var gettime = moment(Date.now()).format('YYYY-MM-DD') + ' ' + moment(Date.now()).format('HH:mm')
	var newData = JSON.stringify({
		ObjectType: Settings.GlobalName,
		ObjectId: md5(txtNewTitle).substring(0, 10) + '-' + md5(gettime).substring(0, 5) + '-' + md5(makeid(5)).substring(0, 5) + '-' + md5(makeid(10)).substring(0, 10) + '-' + md5(makeid(5)).substring(0, 15),
		MetaIndex: parseInt(txtNewSelect),
		Name: txtNewTitle,
		order: 0,
		CreatedDate: gettime,
		MetaDescription: txtNewMesage,
		MetaTextValue: files,
		CreateID: parseInt(localStorage.getItem('CurrentUserID')),
		workID: parseInt(App.workID),
		State: "P",
		ActivatedTS: txtNewDate,
		Project: txtNewProject,
		Material: txtNewMaterial,
		Est: txtNewColor,
		from: App.from,
		to: App.to
	})
	$.ajax({
		url: "/save",
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
			if (data.toString() === 'error') {
				alert('Chỉ hỗ trợ tập tin PDF')
			} else {
				__addTask_createTask(a, b, c, d, data, e, f, g)
				alert('Đã cập nhật task mới!')
				toastrMsg('Cập nhật hoàn tất', 'Cập nhật', 2000)
				$('#addtask')[0].reset();
				$('#customFileLabel').html('')
			}
		},
		error: function () {
			alert('Lỗi khi upload!');
		}
	});
	return false;
}

function buildDemoTask() {
	$('#select').on('change keypress', function (e) {
		$('.list-group-item').removeClass('status-3').removeClass('status-2').removeClass('status-1').removeClass('status-0')
		$('.list-group-item').addClass('status-' + e.target.value)
		$('.list-group-item .pot').removeClass('pot-3').removeClass('pot-2').removeClass('pot-1').removeClass('pot-0')
		$('.list-group-item .pot').addClass('pot-' + e.target.value)
	})
	$('#addtask input, #addtask textarea').each(function () {
		$(this).on('change keypress', function (e) {
			$('[data-' + $(this).attr('id') + ']').html(e.target.value)
		})
	})
	$('.timedemo').attr('data-original-title', moment(Date.now()).format('DD/MM/YYYY') + ' lúc ' + moment(Date.now()).format('HH:mm'))
	$('.timedemo').html(moment(Date.now()).fromNow())
}



$(document).ready(function () {
	__addTask_submitForm()
	buildDemoTask()
	$('#cru').html(localStorage.getItem('CurrentUser'))
	$.ajax({
		url: Global.API_URL + "/user.json",
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
			var iTems = [];
			for (var key in getContents) {
				if (getContents.hasOwnProperty(key)) {
					var element = getContents[key];
					var item = '<option value="' + key + '" data-email="' + element.email + '" data-fullname="' + element.fullname +'">' + element.fullname + ' (' + element.username + ')</option>';
					iTems.push(item)
				}
			}
			$('#asuser').html(iTems).select2({}).on("select2:opening", function (e) {
				App.workID = e.target.value
				App.from = localStorage.getItem('FullName') + ' <' + localStorage.getItem('CurrentEmail') + '>'
				App.to = $(this).find(":selected").data("fullname") + ' <' + $(this).find(":selected").data("email") + '>'
			}).on("change", function (e) {
				App.workID = e.target.value
				App.from = localStorage.getItem('FullName') + ' <' + localStorage.getItem('CurrentEmail') + '>'
				App.to = $(this).find(":selected").data("fullname") + ' <' + $(this).find(":selected").data("email") + '>'
			});
		}
	})
});
