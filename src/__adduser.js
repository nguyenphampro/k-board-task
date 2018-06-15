function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (ck) {pug_html = pug_html + "\u003Csection\u003E";
if ((ck.permision_adduser === 'true')) {
pug_html = pug_html + "\u003Carticle class=\"container mt-5\"\u003E\u003Cdiv class=\"row\"\u003E\u003Cdiv class=\"col-lg-8 offset-lg-2\"\u003E\u003Cform class=\"box card validator border-primary\" id=\"adduserfrm\" role=\"validator\"\u003E\u003Cdiv class=\"card-header bg-primary text-white\" ripple=\"ripple\"\u003E\u003Ch2 class=\"h5 mb-0\"\u003EThêm thành viên\u003C\u002Fh2\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"card-body p-3\"\u003E\u003Cdiv class=\"row\"\u003E\u003Cdiv class=\"col-lg\"\u003E\u003Cdiv class=\"form-label-group mb-4\"\u003E\u003Cinput class=\"form-control\" id=\"username\" type=\"text\" placeholder=\"Tài khoản\" required=\"required\"\u002F\u003E\u003Clabel for=\"username\"\u003ETài khoản\u003C\u002Flabel\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"col-lg\"\u003E\u003Cdiv class=\"form-label-group mb-4\"\u003E\u003Cinput class=\"form-control\" id=\"password\" type=\"password\" placeholder=\"Mật khẩu\" required=\"required\"\u002F\u003E\u003Clabel for=\"password\"\u003EMật khẩu\u003C\u002Flabel\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"row\"\u003E\u003Cdiv class=\"col-lg\"\u003E\u003Cdiv class=\"form-label-group mb-4\"\u003E\u003Cinput class=\"form-control\" id=\"email\" type=\"text\" placeholder=\"Email\" required=\"required\"\u002F\u003E\u003Clabel for=\"email\"\u003EEmail\u003C\u002Flabel\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"col-lg\"\u003E\u003Cdiv class=\"form-label-group mb-4\"\u003E\u003Cinput class=\"form-control\" id=\"fullname\" type=\"text\" placeholder=\"Họ và tên\" required=\"required\"\u002F\u003E\u003Clabel for=\"fullname\"\u003EHọ và tên\u003C\u002Flabel\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"row\"\u003E\u003Cdiv class=\"col-lg\"\u003E\u003Cdiv class=\"checkbox switcher mb-4\"\u003E\u003Clabel class=\"mb-0 mt-1\" for=\"dashboard\"\u003E\u003Cinput type=\"checkbox\" id=\"dashboard\"\u002F\u003E\u003Cspan\u003E\u003Csmall\u003E\u003C\u002Fsmall\u003E\u003C\u002Fspan\u003E\u003Cspan\u003ECho tùy chỉnh dashboard\u003C\u002Fspan\u003E\u003C\u002Flabel\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"col-lg\"\u003E\u003Cdiv class=\"checkbox switcher mb-4\"\u003E\u003Clabel class=\"mb-0 mt-1\" for=\"createtask\"\u003E\u003Cinput type=\"checkbox\" id=\"createtask\"\u002F\u003E\u003Cspan\u003E\u003Csmall\u003E\u003C\u002Fsmall\u003E\u003C\u002Fspan\u003E\u003Cspan\u003ECho tạo task\u003C\u002Fspan\u003E\u003C\u002Flabel\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"row\"\u003E\u003Cdiv class=\"col-lg\"\u003E\u003Cdiv class=\"checkbox switcher mb-4\"\u003E\u003Clabel class=\"mb-0 mt-1\" for=\"deltassk\"\u003E\u003Cinput type=\"checkbox\" id=\"deltassk\"\u002F\u003E\u003Cspan\u003E\u003Csmall\u003E\u003C\u002Fsmall\u003E\u003C\u002Fspan\u003E\u003Cspan\u003ECho xóa task\u003C\u002Fspan\u003E\u003C\u002Flabel\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"col-lg\"\u003E\u003Cdiv class=\"checkbox switcher mb-4\"\u003E\u003Clabel class=\"mb-0 mt-1\" for=\"modifytask\"\u003E\u003Cinput type=\"checkbox\" id=\"modifytask\"\u002F\u003E\u003Cspan\u003E\u003Csmall\u003E\u003C\u002Fsmall\u003E\u003C\u002Fspan\u003E\u003Cspan\u003ECho chỉnh sửa task\u003C\u002Fspan\u003E\u003C\u002Flabel\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"row\"\u003E\u003Cdiv class=\"col-lg\"\u003E\u003Cdiv class=\"checkbox switcher mb-4\"\u003E\u003Clabel class=\"mb-0 mt-1\" for=\"adduser\"\u003E\u003Cinput type=\"checkbox\" id=\"adduser\"\u002F\u003E\u003Cspan\u003E\u003Csmall\u003E\u003C\u002Fsmall\u003E\u003C\u002Fspan\u003E\u003Cspan\u003ECho thêm thành viên\u003C\u002Fspan\u003E\u003C\u002Flabel\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"col-lg\"\u003E\u003Cdiv class=\"checkbox switcher mb-4\"\u003E\u003Clabel class=\"mb-0 mt-1\" for=\"userlist\"\u003E\u003Cinput type=\"checkbox\" id=\"userlist\"\u002F\u003E\u003Cspan\u003E\u003Csmall\u003E\u003C\u002Fsmall\u003E\u003C\u002Fspan\u003E\u003Cspan\u003ECho xem danh sách thành viên\u003C\u002Fspan\u003E\u003C\u002Flabel\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"row\"\u003E\u003Cdiv class=\"col-lg\"\u003E\u003Cdiv class=\"checkbox switcher mb-4\"\u003E\u003Clabel class=\"mb-0 mt-1\" for=\"settings\"\u003E\u003Cinput type=\"checkbox\" id=\"settings\"\u002F\u003E\u003Cspan\u003E\u003Csmall\u003E\u003C\u002Fsmall\u003E\u003C\u002Fspan\u003E\u003Cspan\u003ECho tùy chỉnh hệ thống\u003C\u002Fspan\u003E\u003C\u002Flabel\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"col-lg\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"row\"\u003E\u003Cdiv class=\"col text-right\"\u003E\u003Cbutton class=\"add-button btn btn-primary\" type=\"submit\" name=\"btnAddNew\" ripple=\"ripple\"\u003EThêm mới\u003Ci class=\"fa fa-save ml-2\"\u003E\u003C\u002Fi\u003E\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fform\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Farticle\u003E";
}
pug_html = pug_html + "\u003C\u002Fsection\u003E";}.call(this,"ck" in locals_for_with?locals_for_with.ck:typeof ck!=="undefined"?ck:undefined));;document.write(UqLbOLMtre);;