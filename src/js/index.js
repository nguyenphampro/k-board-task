if (localStorage.getItem('Token') && localStorage.getItem('Token').length > 0) {
} else {
	window.location.href = '/login'
}

function reFresh(params) {
	$('[data-step="step-' + params + '"]').html('Loading...')
	setTimeout(() => {
		if (params == 1) {
			__index__getData('step-1', 'P')
		} else if (params == 2) {
			__index__getData('step-2', 'I')
		} else {
			__index__getData('step-3', 'D')
		}
	}, 1000);
}

function __index__getData(e, go) {
	$.ajax({
		url: Global.API_URL + "/tasks.json",
		type: "GET",
		dataType: "json",
		cache: !0,
		beforeSend: function (xhr) {
			xhr.setRequestHeader("Authorization", 'Bearer ' + localStorage.getItem('Token'));
		},
		complete: function (data) {
			App.Data = data.responseJSON;
			var newTemplate = []
			for (const key in App.Data) {
				if (App.Data.hasOwnProperty(key)) {
					if (App.Data[key]) {
						var varsame = App.Data[key].State
						var element = App.Data[key];
						if (varsame === go) {
							newTemplate.push(App.__template(
							element.ObjectId,
							element.MetaIndex,
							element.Name,
							element.CreatedDate,
							element.MetaDescription,
							element.MetaTextValue,
							getUserName(element.CreateID),
							getUserName(element.workID),
							element.ActivatedTS,
							element.Project,
							element.Material,
							element.PaintColor))
						}
					}
				}
			}
			$('[data-step="' + e + '"]').html(newTemplate)
			$('[data-toggle="tooltip"]').tooltip()
			__index__callAction()
		},
		error: function (jqXHR, textStatus, errorThrown) {}
	})
}

console.log(getUserName(1))

function getUserName(params) {
	var URLID = params
	var newval = ''
	return $.ajax({
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
					if (parseInt(key) == URLID) {
						getContents = getContents[key]
					}
				}
			}
			newval = checkNull(getContents.fullname)
			// return newval
		}
	})
}

function __index__updateTask(id, i) {
	var checkstatus = ''
	if (i === 'step-1') {
		checkstatus = 'P'
	} else if (i === 'step-2') {
		checkstatus = 'I'
	} else {
		checkstatus = 'D'
	}
	$.ajax({
		url: "/update",
		type: "POST",
		dataType: "json",
		cache: !0,
		data: {
			id: id,
			status: checkstatus
		},
		complete: function (data) {
			var val
			val = data.responseJSON;
			// Phần này chưa viết update JSON
		}
	})
}

function __index__callAction() {
	$("#k-board-task .sortable .pdf").each(function () {
		$(this).click(function () {
			var title = $(this).parents('.content').find('h3').html()
			var pdf = $(this).attr('data-files')
			$('#pdfModal .modal-title').html(title)
			$('#pdfModal .modal-body').html('<iframe></iframe>')
			$('#pdfModal .modal-body iframe').attr('src', Global.URLPath + '/pdfjs/web/viewer.html?files=/files/' + pdf)
			setTimeout(() => {
				var height = $('#pdfModal .modal-body').height()
				$('#pdfModal .modal-body iframe').css({
					'height': height + 'px'
				})
				$('#pdfModal .modal-body').css({
					'height': height + 'px'
				})
			}, 1000);

		})
	})
}

function initIframe() {
	$('#pdfModal .modal-body iframe').contents().find('#viewerContainer .page:first-child .canvasWrapper').append('<div class="hidebarcode"></div>')
}


function __index__sortAble() {
	$("#k-board-task .sortable").sortable({
		connectWith: ".connectedSortable",
		placeholder: "ui-highlight",
		// handle: ".move",
		start: function (e, ui) {
			ui.placeholder.height(ui.item.outerHeight());
			ui.placeholder.html(ui.item.html());
			ui.placeholder.addClass('list-group-item list-group-item-action');
		},
		update: function (e, ui) {
			__index__checkContent()
		},
		receive: function (e, ui) {
			__index__updateTask(ui.item.attr('id'), $(e.target).attr('data-step'))
		}
	}).disableSelection();
}

function __index__addForm() {
	__index__checkContent()
	$('#pdfModal').on('hidden.bs.modal', function (e) {
		$('#pdfModal .modal-body').html('Đang tải...')
	})
	$('#activecode').click(function () {
		$('#pdfModal .modal-body iframe').contents().find('#viewerContainer .canvasWrapper .hidebarcode').remove()
	})
}

function __index__checkContent() {
	$("#k-board-task .sortable").each(function () {
		if ($(this).html().length > 0) {
			$(this).removeClass('active')
		} else {
			$(this).addClass('active')
		}
	})
}

function __index__onResize() {
	setTimeout(() => {
		var height = $('#pdfModal .modal-body').height()
		$('#pdfModal .modal-body iframe').css({
			'height': height + 'px'
		})
		$('#pdfModal .modal-body').css({
			'height': height + 'px'
		})
		initIframe()
	}, 1000);
}

$(document).ready(function () {
	__index__getData('step-1', 'P')
	__index__getData('step-2', 'I')
	__index__getData('step-3', 'D')
	__index__sortAble()
	__index__addForm()
});

$(window).resize(function () {
	__index__onResize()
})

$(function () {
	/**************************************************
     * Custom Command Handler
     **************************************************/
	$.contextMenu.types.label = function (item, opt, root) {
		$('<span>Độ ưu tiên<ul>'
			+ '<li class="label1" title="label 1">label 1</li>'
			+ '<li class="label2" title="label 2">label 2</li>'
			+ '<li class="label3" title="label 3">label 3</li>'
			+ '<li class="label4" title="label 4">label 4</li></ul></span>')
			.appendTo(this)
			.on('click', 'li', function () {
				console.log('Clicked on ' + $(this).text());
				root.$menu.trigger('contextmenu:hide');
			});

		this.addClass('labels').on('contextmenu:focus', function (e) {
		}).on('contextmenu:blur', function (e) {
		}).on('keydown', function (e) {
		});
	};
	$.contextMenu({
		selector: '.list-group-item-action',
		callback: function (itemKey, opt, rootMenu, originalEvent) {
			var el = $(this)
			var newId = $(this).attr('id')
			if (confirm("Bạn có chắc chắn xóa task này?")) {
				$.ajax({
					url: "/delete",
					type: "POST",
					async: true,
					dataType: "json",
					cache: !0,
					data: {
						id: newId
					},
					contentType: "application/json; charset=utf-8",
					beforeSend: function (xhr) {
						xhr.setRequestHeader("Authorization", 'Bearer ' + localStorage.getItem('Token'));
					},
					complete: function (data) {
						$(el).remove()
					}
				})
			} else {
				return false
			}
		},
		items: {
			open: {
				name: "Xem chi tiết", icon: "edit", callback: function (itemKey, opt, rootMenu, originalEvent) {
					var newIdg = $(this).attr('id')
					window.location.href = '/gettask?id=' + newIdg
				}},
			sep1: "---------",
			label: { type: "label", customName: "Label", callback: $.noop },
			sep2: "---------",
			delete: { name: "Xóa", icon: "delete" }
		}
	});
});
