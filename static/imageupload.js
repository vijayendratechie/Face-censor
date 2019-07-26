
function readURL(input)
{
	//console.log(input.files);
	if (input.files && input.files[0])
	{
	    var reader = new FileReader();

	    reader.onload = function (e)
	    {
	    	$('<div id="cover"><div id="spinner" class="spinner-grow text-light"></div></div>').insertAfter(".container");
	    	xcoord.length = 0;
	    	$('#pic').attr('src', e.target.result);  
	    	$("#msg").html("<b>Uploaded image</b>");      
	    	$(".canvas").remove();
	    	$("#pic").css("display","block");	    	
	    	$("#censor").attr("disabled",false);
	    	$("#expressioncensor").attr("disabled",false);
	    
	    	//to get window height after resizing    	   	

	    };

	    reader.readAsDataURL(input.files[0]);
	}
}


function setwindowheight()
{
	var windowheight = $(window).height();	
	var bodyheight = $("body").height();
	console.log("resized windowheight : "+$(window).height());
	if(windowheight > bodyheight)
	{
		$("#cover").height($(window).height());	
	}
	else
	{
		$("#cover").height($("body").height());	
	}
}


$(document).ready(function()
{
	console.log("original window height"+$("body").height())
	var emojisobj = { angry : document.getElementById("angry") ,
				   happy : 	document.getElementById("happy") ,
				   laugh : 	document.getElementById("laugh") ,
				   sad : 	document.getElementById("sad") ,
				   suprise : 	document.getElementById("suprise") ,
				   allother : 	document.getElementById("allother") 
				};

	//console.log(JSON.stringify(emojis));

	$("#censor").click(function()
	{	
		setwindowheight();
		$("#cover").fadeIn(100);
		facepredict();
		//drawcanvas();
	})

	$("#expressioncensor").click(function()
	{	
		setwindowheight();
		$("#cover").fadeIn(100);
		expressionpredict(emojisobj);
		//drawcanvas();
	})

	/*$("#btn1").click(function()
	{	
		//alert("hello");
		$('#exampleModal').modal("show")
	})*/

});

function drawimg(canvas,ctx)
{
	
	$("#canvas").css("display","block");
	var pic = document.getElementById('pic');
	var width = pic.naturalWidth;
	var height = pic.naturalHeight;

	canvas.width = width;
	canvas.height = height;

	ctx.drawImage(pic, 0, 0,width,height);
	//$("#pic").hide();
	$("#pic").css("display","none");
}

function userselect(value)
{
	//console.log("value is :"+value);
	var resultsdata = $("#resultdata").val();
	var	resultsobj = JSON.parse(resultsdata);

	if(value == 'all')
	{		
		$("#canvas").attr("title","");
		allfaces(resultsobj);
	}
	else if(value == "selected")
	{
		xcoord.length=0;
		$("#canvas").attr("title","Click on faces to censor");
		$('[data-toggle="tooltip"]').tooltip();
		selectedfaces(resultsobj);	
	}
}

function allfaces(results)
{
	var emoji = document.getElementById('happy'); 

	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext("2d");
	
	
	for(let i=0;i<results.length;i++)
	{
		let coord = results[i].box;
		ctx.drawImage(emoji, coord.x,coord.y,coord.width,coord.height);	
		//ctx.fillRect(coord.x,coord.y,coord.width,coord.height);
		//var str = String.fromCodePoint(0x1F604)
		//ctx.strokeText(str,coord.x,coord.y,coord.width);
	}

	$("#msg").html("<b>Faces censored: </b>");
}


var xcoord = [];
function selectedfaces(results)
{
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext("2d");

	var rect = canvas.getBoundingClientRect();
	
	xcoord.length = 0;
	
	$("#canvas").click(function(event)
	{		
		//console.log("hi");
		//make changes for y coord

		//console.log("xcoord as soon as canvas is clicked :"+ JSON.stringify(xcoord));

		var x = event.clientX - rect.left;
		var y = event.clientY - rect.top ;
		
				
		for(let i=0;i<results.length;i++)
		{
			let coord = results[i].box;		
			if((x >= coord.x && x <= (coord.x+coord.width)) && (y>=coord.y && y<=(coord.y+coord.height)))
			{
				xcoord.push(coord);
			}
		}

		//console.log("xcoord araay is :"+ JSON.stringify(xcoord));
		var temp = new Set(xcoord)
    	xcoord = Array.from(temp);
    	//console.log("selectedfaces after applying set : "+JSON.stringify(xcoord));


    	var emoji = document.getElementById('happy');
 		
		/*if(xcoord.length == 0)
		{
			
		}*/
		if(xcoord.length !=0)
		{
			for(let i=0;i<xcoord.length;i++)
			{
				let coord = xcoord[i];
				ctx.drawImage(emoji, coord.x,coord.y,coord.width,coord.height);	
				//ctx.fillRect(coord.x,coord.y,coord.width,coord.height);
				//var str = String.fromCodePoint(0x1F604)
				//ctx.strokeText(str,coord.x,coord.y,coord.width);
			}
			$("#msg").html("<b>Faces censored: </b>");	
		}
		else
		{
			alert("No face selected");
		}
    })   
}

function drawfacecanvas(results)
{
	//console.log(JSON.stringify(results));	

	$(".canvas").remove();
	$('<canvas id="canvas" class="center canvas" style="margin: 0 auto; display: none;border:1px solid black;" data-toggle="tooltip" ></canvas>').insertAfter("#pic");
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext("2d");

	drawimg(canvas,ctx);
	$("#cover").fadeOut(100);

	if(results.length > 1)
	{
		//alert("\nmultiple faces . click on faces which are to be censored");
				
		$('#exampleModal').modal("show");
		$("#resultdata").val(JSON.stringify(results));		
	}
	else
	{
		allfaces(results);			
	}	
}

async function facepredict()
{
	
	await stackml.init({'accessKeyId': 'dca3d99c867b87cc2263f7c07987ccfc'});
	
	// load face detection model
	const model = await stackml.faceDetection(function callbackLoad()
	{
	    console.log('callback after face detection model is loaded!');
	});

	// make prediction with the image
	model.detect(document.getElementById('pic'),function callbackPredict(err, faceresults)
	{
	    
	    //console.log("Face censor : " + JSON.stringify(faceresults.outputs.length));
	   
		drawfacecanvas(faceresults.outputs);
	});	
}

//Expression preditct

function drawexpressioncanvas(results,emojisobj)
{
	//console.log("Expressions results : " + JSON.stringify(emojisobj));

	$(".canvas").remove();
	$('<canvas id="canvas" class="center canvas" style="margin: 0 auto; display: none;border:1px solid black;" data-toggle="tooltip" ></canvas>').insertAfter("#pic");
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext("2d");

	drawimg(canvas,ctx);
	
	$("#cover").fadeOut(100);
	for(let i=0;i<results.length;i++)
	{
		let coord = results[i].detection.box;
		let personexpressions = results[i].expressions;
		let tempprobability = 0;
		let tempexpression;
		for(let j=0;j<personexpressions.length;j++)
		{
			if(personexpressions[j].probability >= tempprobability)
			{
				tempprobability = personexpressions[j].probability;
				tempexpression = personexpressions[j].expression;
			}
		}

		//console.log("tempexpression is : "+ tempexpression);
		if(emojisobj.hasOwnProperty(tempexpression))
		{
			//console.log("emoji found in my object");
			//emoji = emojisobj.tempexpression;
			ctx.drawImage(emojisobj[tempexpression], coord.x,coord.y,coord.width,coord.height);	
			$("#msg").html("<b>Faces censored depending on expressions: </b>");
		}
		else
		{
			//console.log("emoji not found in my object");
			//emoji = emojisobj.allother;
			ctx.drawImage(emojisobj.allother, coord.x,coord.y,coord.width,coord.height);
			$("#msg").html("<b>Faces censored depending on expressions: </b>");	
		}

		//console.log("coord is "+JSON.stringify(coord));		
	}
}

async function expressionpredict(emojisobj)
{
	await stackml.init({'accessKeyId': 'dca3d99c867b87cc2263f7c07987ccfc'});

	const model = await stackml.faceExpression(function callbackLoad()
	{
	    console.log('callback after face expression model is loaded!');
	});

	// make prediction with the image
	model.detect(document.getElementById('pic'), function callbackPredict(err, expressionresults)
	{
	    //console.log("Expressions are : " + JSON.stringify(expressionresults));
	    drawexpressioncanvas(expressionresults.outputs,emojisobj);
	});	
}