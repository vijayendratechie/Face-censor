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
	$("#predict").click(function()
	{
		predict();
		//drawcanvas();
	})
});

function drawcanvas(results)
{
	console.log(JSON.stringify(results));
	
	var canvas = document.getElementById('canvas');
	
	
	var pic = document.getElementById('pic');
	var width = pic.naturalWidth;
	var height = pic.naturalHeight;

	canvas.width = width;
	canvas.height = height;
	
	var ctx = canvas.getContext("2d");

	var emoji = document.getElementById('emoji'); 
	ctx.drawImage(pic, 0, 0,width,height);
	
	for(let i=0;i<results.length;i++)
	{
		var coord = results[i].box;
		//ctx.drawImage(emoji, coord.x,coord.y,coord.width,coord.height);	
		//ctx.fillRect(coord.x,coord.y,coord.width,coord.height);
		var str = String.fromCodePoint(0x1F604)
		ctx.strokeText(str,coord.x,coord.y,coord.width);
	}
}

async function predict()
{
	
	await stackml.init({'accessKeyId': 'dca3d99c867b87cc2263f7c07987ccfc'});
	// load face detection model
	const model = await stackml.faceDetection(function callbackLoad()
	{
	    console.log('callback after face detection model is loaded!');
	});

	// make prediction with the image
	model.detect(document.getElementById('pic'),function callbackPredict(err, results)
	{
	    console.log("Hello");
	    //console.log(JSON.stringify(results));
	   
	    // draw output keypoints in the image
	    //model.draw(document.getElementById('canvas'),document.getElementById('pic'), results);
		drawcanvas(results.outputs);
	});	
}

