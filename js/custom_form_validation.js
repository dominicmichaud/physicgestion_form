$.settings = {
	validate_sections: $('.validate-0 .required, .validate-5 .required, .validate-8 .required, .validate-9'),
	slide: '.carousel-item',
	send_btn: $('.submit-form-btn'),
	msg: $('.processs-msg')
};

$(function () {
	//Input fields on change remove error message if any
	$($.settings.validate_sections).on('change', function () {
		//Check for blanks
		if ($(this).val() == "") {
			$(this).removeClass('valid');
			$(this).addClass('invalid');
		}
		else {
			$(this).removeClass('invalid');
			$(this).addClass('valid');
		}

		//Validate email address
		if ($(this).attr('type') === 'email') {
			if (isValidEmailAddress($(this).val())) {
				$(this).removeClass('invalid');
				$(this).addClass('valid');
			}
			else {
				$(this).removeClass('valid');
				$(this).addClass('invalid');
			}
		}
	});

	//Send form values with emailJS
	$('.subscribe-form').on('submit', function (e) {
		console.log('submitted');
		e.preventDefault();

		//setup emailJS configs
		var service_id = "default_service";
		var template_id = "gym_inscription";

		//Disable button and enable user visual feedback
		$.settings.send_btn.addClass('sending');
		$.settings.send_btn.prop('disabled', true)

		//Call EmailJS services        
		emailjs.sendForm(service_id, template_id, '#subscribe_form')
			.then(function (data) {
				//On success, show message and and enable user visual feedback
				// console.log('success');
				$.settings.send_btn.find('.btn-message').html('succès!');
				$.settings.msg.html("Merci! Votre demande d'inscription à été envoyée avec succès.<br>Nous vous contacterons dans les meilleurs délais.").addClass('show');
				$.settings.send_btn.removeClass('sending').addClass('send-success');
			}, function (data) {
				if (data.status === 400) {
					//On error, show message and and enable user visual feedback
					//console.log('failed');
					$.settings.send_btn.find('.btn-message').html('erreur');
					$.settings.msg.html("Désolé, une erreur est survenue lors de l'envoi.<br>Veuillez rafraîchir votre navigateur et réessayer.<br>Si le problème persiste, veuillez contacter l'administrateur du&nbsp;site.").addClass('show');
					$.settings.send_btn.removeClass('sending').addClass('send-failed');
				}
			});

		return false;
	});
});

//Email regex
function isValidEmailAddress(emailAddress) {
	var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
	return pattern.test(emailAddress);
}