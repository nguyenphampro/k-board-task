checkLogin(true)

function reFresh(params) {
	$('[data-step="step-' + params + '"]').addClass('on-load')
	setTimeout(() => {
		if (params == 1) {
			__index__getData('step-1', 'P')
		} else if (params == 2) {
			__index__getData('step-2', 'I')
		} else {
			__index__getData('step-3', 'D')
		}
		$('[data-step="step-' + params + '"]').removeClass('on-load')

	}, 1000);
	toastrMsg('Cập nhật danh sách hoàn tất', 'Cập nhật', 2000)
}

function __index__getData(e, go) {
	$.ajax({
		url: Global.API_URL + "/tasks.json",
		type: "GET",
		dataType: "json",
		cache: !0,
		beforeSend: function (xhr) {
			xhr.setRequestHeader("Authorization", 'Bearer ' + Cookies.get('Token'));
		},
		complete: function (data) {
			App.Data = data.responseJSON;
			var filtered = App.Data.filter(function (item) {
				return item.State === go;
			});
			filtered.sort(function compare(a, b) {
				var dateA = new Date(a.CreatedDate);
				var dateB = new Date(b.CreatedDate);
				return dateB - dateA;
			});
			filtered.sort(function compare(a, b) {
				var dateA = new Date(a.order);
				var dateB = new Date(b.order);
				return dateA - dateB;
			});
			var newTemplate = []
			for (const key in filtered) {
				if (filtered.hasOwnProperty(key)) {
					if (filtered[key]) {
						var varsame = filtered[key].State
						var element = filtered[key];
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
								element.Material,
								element.order,
								element.ObjectType))
						}
					}
				}
			}
			$('[data-step="' + e + '"]').html(newTemplate)
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
			$('[data-toggle="tooltip"]').tooltip()
			__main__callAction()
			__main__checkContent()
		},
		error: function (jqXHR, textStatus, errorThrown) { }
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
		}
	})
}


function __index__sortAble() {
	// Step 1
	$("#k-board-task .sortable[data-step='step-1']").sortable({
		connectWith: (!Settings.OneWay || Settings.OneWay == false) ? ".connectedSortable" : "#k-board-task .sortable[data-step='step-2']",
		items: "li:not(.disabled)",
		placeholder: "ui-highlight",
		// handle: ".move",
		start: function (e, ui) {
			ui.placeholder.height(ui.item.outerHeight());
			ui.placeholder.html(ui.item.html());
			ui.placeholder.addClass('list-group-item list-group-item-action');
			__main__checkContent()
		},
		update: function (e, ui) {
			__main__checkContent()
			__main__updateOrder($(e.target).attr('data-step'))
		},
		receive: function (e, ui) {
			__index__updateTask(ui.item.attr('id'), $(e.target).attr('data-step'))
			__main__checkContent()
			__main__updateOrder($(e.target).attr('data-step'))
		},
		stop: function (e, ui) {
			toastrMsg('Cập nhật danh sách hoàn tất', 'Cập nhật', 2000)
		}
	}).disableSelection()
	// Step 2
	$("#k-board-task .sortable[data-step='step-2']").sortable({
		connectWith: (!Settings.OneWay || Settings.OneWay == false) ? ".connectedSortable" : "#k-board-task .sortable[data-step='step-3']",
		items: "li:not(.disabled)",
		placeholder: "ui-highlight",
		// handle: ".move",
		start: function (e, ui) {
			ui.placeholder.height(ui.item.outerHeight());
			ui.placeholder.html(ui.item.html());
			ui.placeholder.addClass('list-group-item list-group-item-action');
			__main__checkContent()
		},
		update: function (e, ui) {
			__main__checkContent()
			__main__updateOrder($(e.target).attr('data-step'))
		},
		receive: function (e, ui) {
			if ($(this).children().length > Settings.ActiveNumberStep2Drop) {
				$(ui.sender).sortable('cancel');
			} else {
				__index__updateTask(ui.item.attr('id'), $(e.target).attr('data-step'))
				if (Settings.OneWay || Settings.OneWay == true) {
					reFresh(1)
				}
			}
			__main__checkContent()
			__main__updateOrder($(e.target).attr('data-step'))
		},
		stop: function (e, ui) {
			toastrMsg('Cập nhật danh sách hoàn tất', 'Cập nhật', 2000)
		}
	}).disableSelection();
	// Step 3
	$("#k-board-task .sortable[data-step='step-3']").sortable({
		connectWith: (!Settings.OneWay || Settings.OneWay == false) ? ".connectedSortable" : "",
		items: "li:not(.disabled)",
		placeholder: "ui-highlight",
		// handle: ".move",
		start: function (e, ui) {
			ui.placeholder.height(ui.item.outerHeight());
			ui.placeholder.html(ui.item.html());
			ui.placeholder.addClass('list-group-item list-group-item-action');
			__main__checkContent()
		},
		update: function (e, ui) {
			__main__checkContent()
			__main__updateOrder($(e.target).attr('data-step'))
		},
		receive: function (e, ui) {
			__index__updateTask(ui.item.attr('id'), $(e.target).attr('data-step'))
			if (Settings.OneWay || Settings.OneWay == true) {
				reFresh(2)
			}
			__main__checkContent()
			__main__updateOrder($(e.target).attr('data-step'))
		},
		stop: function (e, ui) {
			toastrMsg('Cập nhật danh sách hoàn tất', 'Cập nhật', 2000)
		}
	}).disableSelection();
	// ALL Step
	if (!Settings.Permission.ActiveDashboard || Settings.Permission.ActiveDashboard == false) {
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

function doArchive(newIdg) {
	if (confirm("Bạn có chắc chắn lưu trữ task này?")) {
		$.ajax({
			url: "/archive",
			type: "POST",
			dataType: "json",
			cache: !0,
			data: {
				id: newIdg,
				State: 'N'
			},
			complete: function (data) {
				$('#' + newIdg).remove()
			}
		})
	} else {
		return false
	}
}

function moveTask(e) {
	var getFather = $(e).parents('ul').attr('data-step')
	var getChild = $(e).parents('li')
	var getID = $(e).parents('li').attr('id')
	if (confirm("Bạn có chắc chắn di dời task này?")) {
		if (Settings.Permission.MoveTask) {
			if (getFather === 'step-1') {
				if ($('[data-step="step-2"]').children().length >= Settings.ActiveNumberStep2Drop) {
					alert('Đã vượt quá giới hạn của nhiệm vụ')
				} else {
					$(getChild).clone().prependTo('[data-step="step-2"]');
					$(getChild).remove()
					__index__updateTask(getID, 'step-2')
					__main__checkContent()
					__main__updateOrder('step-1')
					__main__updateOrder('step-2')
					reFresh(1)
				}
			} else if (getFather === 'step-2') {
				$(getChild).clone().prependTo('[data-step="step-3"]');
				$(getChild).remove()
				__index__updateTask(getID, 'step-3')
				__main__checkContent()
				__main__updateOrder('step-2')
				__main__updateOrder('step-3')
				reFresh(2)
			}
		} else {
			alert('Bạn không có quyền di chuyển nhiệm vụ!')
		}
	} else {
		return false
	}
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
			+ '<li class="label1" data-val="0">Thấp</li>'
			+ '<li class="label2" data-val="1">Bình thường</li>'
			+ '<li class="label3" data-val="2">Trung bình</li>'
			+ '<li class="label4" data-val="3">Cao</li></ul></span>')
			.appendTo(this)
			.on('click', 'li', function () {
				var re = $(root.$trigger[0]).parents('.list-group').attr('data-step')
				if (Settings.Permission.ModifyTask) {
					$.ajax({
						url: "/modify",
						type: "POST",
						dataType: "json",
						cache: !0,
						data: {
							id: $(root.$trigger[0]).attr('id'),
							MetaIndex: $(this).attr('data-val')
						},
						complete: function (data) {
							if (re === 'step-1') {
								reFresh(1)
							} else if (re === 'step-2') {
								reFresh(2)
							} else {
								reFresh(3)
							}
						}
					})
					root.$menu.trigger('contextmenu:hide');
				} else {
					alert('Bạn không có quyền tùy chỉnh nhiệm vụ!')
				}
			});

		this.addClass('labels').on('contextmenu:focus', function (e) {
		}).on('contextmenu:blur', function (e) {
		}).on('keydown', function (e) {
		});
	};
	$.contextMenu({
		selector: '.list-group-item-action',
		events: {
			show: function (options) {
				var e = $($(options)[0].$trigger[0]).attr('id')
				var m = $('#' + e).parents('ul').attr('data-step')
				$(options.$menu).addClass(m)
			},
			hide: function (options) {
				var e = $($(options)[0].$trigger[0]).attr('id')
				var m = $('#' + e).parents('ul').attr('data-step')
				$(options.$menu).removeClass(m)
			}
		},
		callback: function (itemKey, opt, rootMenu, originalEvent) {
			var el = $(this)
			var newId = $(this).attr('id')
			if (Settings.Permission.DeleteTask) {
				if (confirm("Bạn có chắc chắn xóa task này?")) {
					$.ajax({
						url: "/delete",
						type: "POST",
						dataType: "json",
						cache: !0,
						data: {
							id: newId
						},
						beforeSend: function (xhr) {
							xhr.setRequestHeader("Authorization", 'Bearer ' + Cookies.get('Token'));
						},
						complete: function (data) {
							$(el).remove()
						}
					})
				} else {
					return false
				}
			} else {
				alert('Bạn không có quyền xóa nhiệm vụ!')
			}
		},
		items: {
			open: {
				name: "Xem chi tiết", icon: "edit", callback: function (itemKey, opt, rootMenu, originalEvent) {
					var newIdg = $(this).attr('id')
					if (Settings.Permission.ViewTask) {
						window.location.href = '/gettask?id=' + newIdg
					} else {
						alert('Bạn không có quyền xem nhiệm vụ!')
					}
				}
			},
			label: { type: "label", className: "position-item", customName: "Label", callback: $.noop },
			archive: {
				name: "Lưu lại", icon: "copy", className: "archive-item", callback: function (itemKey, opt, rootMenu, originalEvent) {
					var newIdg = $(this).attr('id')
					if (Settings.Permission.ArchiveTask) {
						doArchive(newIdg)
					} else {
						alert('Bạn không có quyền lưu trữ nhiệm vụ!')
					}
				}
			},
			delete: { name: "Xóa", icon: "delete", className: "archive-item" }
		}
	});
});
