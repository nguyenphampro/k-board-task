
function __delTask() {
	var URLID = getParameterByName('id')
	if (confirm("Bạn có chắc chắn xóa task này?")) {
		$.ajax({
			url: Global.API_URL + "/tasks.json?id=" + URLID,
			type: "GET",
			async: true,
			dataType: "json",
			cache: !0,
			contentType: "application/json; charset=utf-8",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", 'Bearer ' + localStorage.getItem('Token'));
			},
			complete: function (data) {
				var getContents = JSON.parse(data.responseText)
				// Filter ID
				for (var key in getContents) {
					if (getContents.hasOwnProperty(key)) {
						var element = getContents[key].ObjectId;
						if (element === URLID) {
							getContents = getContents[key]
						}
					}
				}
				console.log(getContents)
				// Phần này chưa viết xóa JSON
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
		url: Global.API_URL + "/tasks.json?id=" + URLID,
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
					if (element === URLID) {
						getContents = getContents[key]
					}
				}
			}
			var col = 'secondary'
			if (getContents.MetaIndex == 1) {
				col = 'primary'
			} else if (getContents.MetaIndex == 2) {
				col = 'success'
			} else if (getContents.MetaIndex == 3) {
				col = 'danger'
			}
			$('.taskdetails .card').addClass('border-' + col)
			$('.taskdetails .card-header').addClass('bg-' + col)
			for (const key in getContents) {
				if (getContents.hasOwnProperty(key)) {
					var element = getContents[key];
					if (key.toLowerCase() === 'createddate' || key.toLowerCase() === 'activatedts') {
						$('#data-' + key.toLowerCase()).html(moment(checkNull(element)).format('DD/MM/YYYY') + ' lúc ' + moment(checkNull(element)).format('HH:MM'))
					} else {
						$('#data-' + key.toLowerCase()).html(checkNull(element))
					}
					$('#key-' + key.toLowerCase()).html(checkNull(key))
				}
			}
			var colp = '<span class="badge badge-light p-1">Không hiệu lực</span>'
			if (getContents.State === 'P') {
				colp = '<span class="badge badge-secondary p-1">Nhiệm vụ</span>'
			} else if (getContents.State === 'I') {
				colp = '<span class="badge badge-info p-1">Đang thực thi</span>'
			} else if (getContents.State === 'D') {
				colp = '<span class="badge badge-success p-1">Hoàn thành</span>'
			}
			$('#jobstates-state').html(colp)
			$('#pdffiles').attr('href', '/files/' + getContents.MetaTextValue)
		}
	})
}

$(document).ready(function () {
	__gettask_getLists()
});
