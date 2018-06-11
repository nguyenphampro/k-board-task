
function __delTask() {
	var URLID = getParameterByName('id')
	if (confirm("Bạn có chắc chắn xóa task này?")) {
		$.ajax({
			url: Global.API_URL + "/etracking/cnctask/setstate?jobid=" + URLID + "&newState=N&returnAllStates=true",
			type: "POST",
			async: true,
			dataType: "json",
			cache: !0,
			contentType: "application/json; charset=utf-8",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", 'Bearer ' + localStorage.getItem('Token'));
			},
			complete: function (data) {
				window.location.href = '/'
			}
		})
	} else {
		return false
	}
}

function __gettask_getLists() {
	var URLID = getParameterByName('id')
	$.ajax({
		url: Global.API_URL + "/etracking/cnctask/getjob?jobid=" + URLID,
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
			var col = 'secondary'
			if (data.responseJSON.MetaIndex == 1) {
				col = 'primary'
			} else if (data.responseJSON.MetaIndex == 2) {
				col = 'success'
			} else if (data.responseJSON.MetaIndex == 3) {
				col = 'danger'
			}
			$('.taskdetails .card').addClass('border-' + col)
			$('.taskdetails .card-header').addClass('bg-' + col)
			for (const key in data.responseJSON) {
				if (data.responseJSON.hasOwnProperty(key)) {
					var element = data.responseJSON[key];
					if (key.toLowerCase() === 'createddate') {
						$('#data-' + key.toLowerCase()).html(moment(checkNull(element)).format('DD/MM/YYYY') + ' lúc ' + moment(checkNull(element)).format('HH:MM'))
					} else {
						$('#data-' + key.toLowerCase()).html(checkNull(element))
					}
					$('#key-' + key.toLowerCase()).html(checkNull(key))
				}
			}
			for (const key in data.responseJSON.Properties.JobDetail) {
				if (data.responseJSON.Properties.JobDetail.hasOwnProperty(key)) {
					var element = data.responseJSON.Properties.JobDetail[key];
					$('#data-jobdetail-' + key.toLowerCase()).html(checkNull(element))
					$('#key-jobdetail-' + key.toLowerCase()).html(checkNull(key))
				}
			}
			for (const key in data.responseJSON.Properties.JobStates[0]) {
				if (data.responseJSON.Properties.JobStates[0].hasOwnProperty(key)) {
					var element = data.responseJSON.Properties.JobStates[0][key];
					if (key.toLowerCase() === 'activatedts') {
						$('#data-jobstates-' + key.toLowerCase()).html(moment(checkNull(element)).format('DD/MM/YYYY') + ' lúc ' + moment(checkNull(element)).format('HH:MM'))
					} else {
						$('#data-jobstates-' + key.toLowerCase()).html(checkNull(element))
					}
					$('#key-jobstates-' + key.toLowerCase()).html(checkNull(key))
				}
			}
			var colp = '<span class="badge badge-light p-1">Không hiệu lực</span>'
			if (data.responseJSON.Properties.JobStates[0].State === 'P') {
				colp = '<span class="badge badge-secondary p-1">Nhiệm vụ</span>'
			} else if (data.responseJSON.Properties.JobStates[0].State === 'I') {
				colp = '<span class="badge badge-info p-1">Đang thực thi</span>'
			} else if (data.responseJSON.Properties.JobStates[0].State === 'D') {
				colp = '<span class="badge badge-success p-1">Hoàn thành</span>'
			}
			$('#jobstates-state').html(colp)
			$('#pdffiles').attr('href', '/files/' + data.responseJSON.MetaTextValue)
		}
	})
}

$(document).ready(function () {
	__gettask_getLists()
});
