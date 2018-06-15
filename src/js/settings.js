$(document).ready(function () {
	for (var key in Settings) {
		if (Settings.hasOwnProperty(key)) {
			var element = Settings[key];
			if(key === 'OneWay') {
				if(!element || element === 'false') {
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
				localStorage.setItem($(this).attr('id'), e.target.value);
				Cookies.set($(this).attr('id'), e.target.value, Settings.Cookies);
			} else if($(this).attr('type') === 'checkbox') {
				localStorage.setItem($(this).attr('id'), $(this).prop("checked"));
				Cookies.set($(this).attr('id'), $(this).prop("checked"), Settings.Cookies);
			} else if($(this).attr('type') === 'text') {
				localStorage.setItem($(this).attr('id'), e.target.value);
				Cookies.set($(this).attr('id'), e.target.value, Settings.Cookies);
			}
		})
	})
});
