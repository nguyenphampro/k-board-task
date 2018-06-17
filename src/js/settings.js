checkLogin('settings')

$(document).ready(function () {
	for (var key in Settings) {
		if (Settings.hasOwnProperty(key)) {
			var element = Settings[key];
			if (key === 'OneWay' || key === 'Editor') {
				if (!element || element == false || element === 'false') {
					$('#'+key).prop("checked", false)
				} else {
					$('#'+key).prop("checked", true)
				}
			} else {
				$('#'+key).val(element)
			}
		}
	}
	$('.cppicker').colorpicker();
	$('#settingspage input').each(function(){
		$(this).on('change', function(e){
			if($(this).attr('type') === 'number') {
				Settings[$(this).attr('id')] = parseInt(e.target.value)
			} else if($(this).attr('type') === 'checkbox') {
				Settings[$(this).attr('id')] = $(this).prop("checked")
			} else if($(this).attr('type') === 'text') {
				Settings[$(this).attr('id')] = e.target.value
			}
			$.ajax({
				url: "/control",
				type: "POST",
				dataType: "json",
				cache: !0,
				data: {
					id: localStorage.getItem('CurrentUserID') ,
					settings: {
						editor: Settings.Editor,
						pagesize: Settings.pageSize,
						activenumberstep1drag: Settings.ActiveNumberStep1Drag,
						activenumberstep2drop: Settings.ActiveNumberStep2Drop,
						oneway: Settings.OneWay
					}
				},
				complete: function (data) {
					toastrMsg('Cập nhật hoàn tất', 'Cập nhật', 2000)
				}
			})
		})
	})
});
