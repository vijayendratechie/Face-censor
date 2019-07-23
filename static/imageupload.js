function readURL(input)
{
	//console.log(input.files);
	if (input.files && input.files[0])
	{
	    var reader = new FileReader();

	    reader.onload = function (e)
	    {
	        $('#pic').attr('src', e.target.result);        

	    };

	    reader.readAsDataURL(input.files[0]);
	}
}
$(document).ready(function()
{
	
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
		facepredict();
		//drawcanvas();
	})

	$("#expressioncensor").click(function()
	{	
		expressionpredict(emojisobj);
		//drawcanvas();
	})

});

function drawfacecanvas(results)
{
	console.log(JSON.stringify(results));
	
	var canvas = document.getElementById('canvas');
	
	
	var pic = document.getElementById('pic');
	var width = pic.naturalWidth;
	var height = pic.naturalHeight;

	canvas.width = width;
	canvas.height = height;
	
	var ctx = canvas.getContext("2d");

	var emoji = document.getElementById('happy'); 
	ctx.drawImage(pic, 0, 0,width,height);
	
	for(let i=0;i<results.length;i++)
	{
		let coord = results[i].box;
		ctx.drawImage(emoji, coord.x,coord.y,coord.width,coord.height);	
		//ctx.fillRect(coord.x,coord.y,coord.width,coord.height);
		//var str = String.fromCodePoint(0x1F604)
		//ctx.strokeText(str,coord.x,coord.y,coord.width);
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
	    
	    //console.log("Face censor : " + JSON.stringify(faceresults));
	   
		drawfacecanvas(faceresults.outputs);
	});	
}

function drawexpressioncanvas(results,emojisobj)
{
	console.log("Expressions results : " + JSON.stringify(emojisobj));
	
	var canvas = document.getElementById('canvas');
	var emoji;
	
	var pic = document.getElementById('pic');
	var width = pic.naturalWidth;
	var height = pic.naturalHeight;

	canvas.width = width;
	canvas.height = height;
	
	var ctx = canvas.getContext("2d"); 
	ctx.drawImage(pic, 0, 0,width,height);
	//ctx.drawImage(emojisobj.angry, 0, 0,50,50);

	
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

		console.log("tempexpression is : "+ tempexpression);
		if(emojisobj.hasOwnProperty(tempexpression))
		{
			console.log("emoji found in my object");
			//emoji = emojisobj.tempexpression;
			ctx.drawImage(emojisobj[tempexpression], coord.x,coord.y,coord.width,coord.height);	
		}
		else
		{
			console.log("emoji not found in my object");
			//emoji = emojisobj.allother;
			ctx.drawImage(emojisobj.allother, coord.x,coord.y,coord.width,coord.height);	
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