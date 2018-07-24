// $('.box textarea').keyup(function() {
//     var value = $(this).val().replace(/\n/g, '<br/>');
//     $(".box p").html(value);
// });

function previewEmail()
{
	var subject = $('#emailSubject').val();
	var body = $('#emailBody').val().replace(/\n/g, '<br/>');
	var footer = $('#emailFooter').val().replace(/\n/g, '<br/>');
	$('#preview-emailSubject').html(subject);
	$('#preview-emailBody').html(body);
	$('#preview-emailFooter').html(footer);
}