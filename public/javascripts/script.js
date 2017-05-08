var eventHandlers = {
	init: function(){
		$("#submit-button").on("click", function(){
			$(".error-message").hide();
		});
	}
};

function s2ab(s) {
	if(typeof ArrayBuffer !== 'undefined') {
		var buf = new ArrayBuffer(s.length);
		var view = new Uint8Array(buf);
		for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
		return buf;
	} else {
		var buf = new Array(s.length);
		for (var i=0; i!=s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
		return buf;
	}
}

function export_table_to_excel(id, filename) {
	var wb = XLSX.utils.table_to_book(document.getElementById(id), {sheet:"Product Reviews"});
	console.log(wb.Sheets['Product Reviews']);

	var wscols = [
	    {wch: 20},
	    {wch: 70},
	    {wch: 20},
	    {wch: 20}
	];

	wb.Sheets['Product Reviews']['!cols'] = wscols;

	var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST:true, type: 'binary'});
	var fname = filename + '.xlsx';

	try {
		saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), fname);
	} catch(e) { 
		if(typeof console != 'undefined') console.log(e, wbout); 
	}

	return wbout;
}

$(document).ready( function(){
	eventHandlers.init();
});