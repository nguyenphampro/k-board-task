
function reFresh(params) {
	$('[data-step="step-' + params + '"]').html('Đang tải...')
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
							element.CreateID,
							element.workID,
							element.ActivatedTS,
							element.Project,
							element.Est,
							element.Material))
						}
					}
				}
			}
			if (Settings.OneWay || Settings.OneWay === 'true') {
				if (e === 'step-1') {
					var index = 1
					$('[data-step="' + e + '"]').find('li').each(function () {
						if (index <= Settings.ActiveNumberStep1Drag) {
						} else {
							$(this).addClass('disabled')
						}
						index++
					})
				}
			}
			$('[data-step="' + e + '"]').html(newTemplate)
			$('[data-toggle="tooltip"]').tooltip()
			__main__callAction()
		},
		error: function (jqXHR, textStatus, errorThrown) {}
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
			State: checkstatus
		},
		complete: function (data) {
			var val
			val = data.responseJSON;
			// Phần này chưa viết update JSON
		}
	})
}


function __index__sortAble() {
	// Step 1
	$("#k-board-task .sortable[data-step='step-1']").sortable({
		connectWith: (!Settings.OneWay || Settings.OneWay === 'false') ? ".connectedSortable" : "#k-board-task .sortable[data-step='step-2']",
		items: "li:not(.disabled)",
		placeholder: "ui-highlight",
		// handle: ".move",
		start: function (e, ui) {
			ui.placeholder.height(ui.item.outerHeight());
			ui.placeholder.html(ui.item.html());
			ui.placeholder.addClass('list-group-item list-group-item-action');
		},
		update: function (e, ui) {
			__main__checkContent()
		},
		receive: function (e, ui) {
			__index__updateTask(ui.item.attr('id'), $(e.target).attr('data-step'))
		}
	}).disableSelection()
	// Step 2
	$("#k-board-task .sortable[data-step='step-2']").sortable({
		connectWith: (!Settings.OneWay || Settings.OneWay === 'false') ? ".connectedSortable" : "#k-board-task .sortable[data-step='step-3']",
		items: "li:not(.disabled)",
		placeholder: "ui-highlight",
		// handle: ".move",
		start: function (e, ui) {
			ui.placeholder.height(ui.item.outerHeight());
			ui.placeholder.html(ui.item.html());
			ui.placeholder.addClass('list-group-item list-group-item-action');
		},
		update: function (e, ui) {
			__main__checkContent()
		},
		receive: function (e, ui) {
			if ($(this).children().length > Settings.ActiveNumberStep2Drop) {
				$(ui.sender).sortable('cancel');
			} else {
				__index__updateTask(ui.item.attr('id'), $(e.target).attr('data-step'))
				if (Settings.OneWay || Settings.OneWay === 'true') {
					reFresh(1)
				}
			}
		}
	}).disableSelection();
	// Step 3
	$("#k-board-task .sortable[data-step='step-3']").sortable({
		connectWith: (!Settings.OneWay || Settings.OneWay === 'false') ? ".connectedSortable" : "",
		items: "li:not(.disabled)",
		placeholder: "ui-highlight",
		// handle: ".move",
		start: function (e, ui) {
			ui.placeholder.height(ui.item.outerHeight());
			ui.placeholder.html(ui.item.html());
			ui.placeholder.addClass('list-group-item list-group-item-action');
		},
		update: function (e, ui) {
			__main__checkContent()
		},
		receive: function (e, ui) {
			__index__updateTask(ui.item.attr('id'), $(e.target).attr('data-step'))
			if (Settings.OneWay || Settings.OneWay === 'true') {
				reFresh(2)
			}
		}
	}).disableSelection();
	// ALL Step
	if (!Settings.Permission.ActiveDashboard || Settings.Permission.ActiveDashboard === 'false') {
		$(".connectedSortable").sortable('disable')
	}
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
	__main__addForm()
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
			+ '<li class="label1" title="label 1">Thấp</li>'
			+ '<li class="label2" title="label 2">Bình thường</li>'
			+ '<li class="label3" title="label 3">Trung bình</li>'
			+ '<li class="label4" title="label 4">Cao</li></ul></span>')
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
		items: localStorage.getItem('permision_modifytask') === 'true' ? {
			open: {
				name: "Xem chi tiết", icon: "edit", callback: function (itemKey, opt, rootMenu, originalEvent) {
					var newIdg = $(this).attr('id')
					window.location.href = '/gettask?id=' + newIdg
				}},
			sep1: "---------",
			label: { type: "label", customName: "Label", callback: $.noop },
			sep2: "---------",
			delete: { name: "Xóa", icon: "delete" }
		} : {
				open: {
					name: "Xem chi tiết", icon: "edit", callback: function (itemKey, opt, rootMenu, originalEvent) {
						var newIdg = $(this).attr('id')
						window.location.href = '/gettask?id=' + newIdg
					}
				}
		}
	});
});
