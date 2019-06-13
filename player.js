var stepped = 0, chunks = 0, rows = 0;
var start, end;
var parser;
var pauseChecked = false;
var printStepChecked = false;
var filename = ''

$(function()
{
	$('#submit-parse').click(function()
	{
		stepped = 0;
		chunks = 0;
		rows = 0;

		var txt = $('#input').val();
		var localChunkSize = $('#localChunkSize').val();
		var remoteChunkSize = $('#remoteChunkSize').val();
		var files = $('#files')[0].files;
		var config = buildConfig();

		// NOTE: Chunk size does not get reset if changed and then set back to empty/default value
		if (localChunkSize)
			Papa.LocalChunkSize = localChunkSize;
		if (remoteChunkSize)
			Papa.RemoteChunkSize = remoteChunkSize;

		pauseChecked = $('#step-pause').prop('checked');
		printStepChecked = $('#print-steps').prop('checked');


		if (files.length > 0)
		{
			if (!$('#stream').prop('checked') && !$('#chunk').prop('checked'))
			{
				for (var i = 0; i < files.length; i++)
				{
					if (files[i].size > 1024 * 1024 * 10)
					{
						alert("A file you've selected is larger than 10 MB; please choose to stream or chunk the input to prevent the browser from crashing.");
						return;
					}
				}
			}

			start = performance.now();

			$('#files').parse({
				config: config,
				before: function(file, inputElem)
				{
					console.log("Parsing file:", file['name']);
					filename = file['name']
				},
				complete: function()
				{
					console.log("Done with all files.");
				}
			});
		}
		else
		{
			start = performance.now();
			var results = Papa.parse(txt, config);
			console.log("Synchronous parse resultsss:", results['data']);
			console.log("donex")
		}
	});

	$('#submit-unparse').click(function()
	{
		var input = $('#input').val();
		var delim = $('#delimiter').val();
		var header = $('#header').prop('checked');

		var results = Papa.unparse(input, {
			delimiter: delim,
			header: header,
		});

		console.log("Unparse complete!");
		console.log("--------------------------------------");
		console.log(results);
		console.log("--------------------------------------");
	});

	$('#insert-tab').click(function()
	{
		$('#delimiter').val('\t');
	});
});



function buildConfig()
{
	return {
		delimiter: $('#delimiter').val(),
		newline: getLineEnding(),
		header: $('#header').prop('checked'),
		dynamicTyping: $('#dynamicTyping').prop('checked'),
		preview: parseInt($('#preview').val() || 0),
		step: $('#stream').prop('checked') ? stepFn : undefined,
		encoding: $('#encoding').val(),
		worker: $('#worker').prop('checked'),
		comments: $('#comments').val(),
		complete: completeFn,
		error: errorFn,
		download: $('#download').prop('checked'),
		fastMode: $('#fastmode').prop('checked'),
		skipEmptyLines: $('#skipEmptyLines').prop('checked'),
		chunk: $('#chunk').prop('checked') ? chunkFn : undefined,
		beforeFirstChunk: undefined,
	};

	function getLineEnding()
	{
		if ($('#newline-n').is(':checked'))
			return "\n";
		else if ($('#newline-r').is(':checked'))
			return "\r";
		else if ($('#newline-rn').is(':checked'))
			return "\r\n";
		else
			return "";
	}
}

function stepFn(results, parserHandle)
{
	stepped++;
	rows += results.data.length;

	parser = parserHandle;

	if (pauseChecked)
	{
		console.log(results, results.data[0]);
		parserHandle.pause();
		return;
	}

	if (printStepChecked)
		console.log(results, results.data[0]);
}

function chunkFn(results, streamer, file)
{
	if (!results)
		return;
	chunks++;
	rows += results.data.length;

	parser = streamer;

	if (printStepChecked)
		console.log("Chunk data:", results.data.length, results);

	if (pauseChecked)
	{
		console.log("Pausing; " + results.data.length + " rows in chunk; file:", file);
		streamer.pause();
		return;
	}
}

function errorFn(error, file)
{
	console.log("ERROR:", error, file);
}



function completeFn()
{
	end = performance.now();
	if (!$('#stream').prop('checked')
			&& !$('#chunk').prop('checked')
			&& arguments[0]
			&& arguments[0].data)
		rows = arguments[0].data.length;

	// console.log("Finished input (async). Time:", end-start, arguments[0]['data']);
	//console.log("Finished input (async). Time:", arguments[0]['data']);
	//console.log("Rows:", rows, "Stepped:", stepped, "Chunks:", chunks);
	var dataset = []
	dataset = arguments[0]['data']
	console.log(dataset)





var excel = $JExcel.new("Calibri light 10 #333333");			// Default font
			
			// excel.set is the main function to generate content:
			// 		We can use parameter notation excel.set(sheetValue,columnValue,rowValue,cellValue,styleValue) 
			// 		Or object notation excel.set({sheet:sheetValue,column:columnValue,row:rowValue,value:cellValue,style:styleValue })
			// 		null or 0 are used as default values for undefined entries		
			
			excel.set( {sheet:0,value:"Sheet1" } );
			
			var evenRow=excel.addStyle ( { 																	// Style for even ROWS
				border: "none,none,none,thin #333333"});													// Borders are LEFT,RIGHT,TOP,BOTTOM. Check $JExcel.borderStyles for a list of valid border styles

			var oddRow=excel.addStyle ( { 																	// Style for odd ROWS
				fill: "#ECECEC" , 																			// Background color, plain #RRGGBB, there is a helper $JExcel.rgbToHex(r,g,b)
				border: "none,none,none,thin #333333"}); 
			
			
			// for (var i=1;i<50;i++) excel.set({row:i,style: i%2==0 ? evenRow: oddRow  });					// Set style for the first 50 rows
			// excel.set({row:3,value: 30  });																	// We want ROW 3 to be EXTRA TALL
 
			var headers=dataset[0];							// This array holds the HEADERS text
			var formatHeader=excel.addStyle ( { 															// Format for headers
					border: "none,none,none,thin #333333", 													// 		Border for header
					font: "Calibri 12 #0000AA B"}); 														// 		Font for headers

			for (var i=0;i<headers.length;i++){																// Loop all the haders
				excel.set(0,i,0,headers[i],formatHeader);													// Set CELL with header text, using header format
				excel.set(0,i,undefined,"auto");															// Set COLUMN width to auto (according to the standard this is only valid for numeric columns)
			}
			
			
			// Now let's write some data
			var initDate = new Date(2000, 0, 1);
			var endDate = new Date(2016, 0, 1);
			var dateStyle = excel.addStyle ( { 																// Format for date cells
					align: "R",																				// 		aligned to the RIGHT
					format: "yyyy.mm.dd hh:mm:ss", 															// 		using DATE mask, Check $JExcel.formats for built-in formats or provide your own 
					font: "#00AA00"}); 																		// 		in color green
			
			for (var i=1;i<dataset.length;i++){			

																			// we will fill the 50 rows
				excel.set(0,0,i,"This is line "+i);

				for (var ii=0;ii<dataset[i].length;ii++){	
					excel.set(0,ii,i,dataset[i][ii]);			
				}



																												// Some other text
				}

			// excel.set(0,1,undefined,30);																	// Set COLUMN 1 to 30 chars width
			// excel.set(0,3,undefined,30);																	// Set COLUMN 3 to 20 chars width
			// excel.set(0,4,undefined,20, excel.addStyle( {align:"R"}));										// Align column 4 to the right
			// excel.set(0,1,3,undefined,excel.addStyle( {align:"L T"}));										// Align cell 1-3  to LEFT-TOP
			// excel.set(0,2,3,undefined,excel.addStyle( {align:"C C"}));										// Align cell 2-3  to CENTER-CENTER
			// excel.set(0,3,3,undefined,excel.addStyle( {align:"R B"}));										// Align cell 3-3  to RIGHT-BOTTOM
			
			var filenamedl = filename.substr(0, filename.length-4);
		    excel.generate(filenamedl+".xlsx");






}



function randomDate(start, end) {
			var d= new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
			return d;
}
