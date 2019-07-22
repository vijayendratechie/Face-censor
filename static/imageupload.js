function readURL(input)
{
	console.log(input.files);
	if (input.files && input.files[0])
	{
	    var reader = new FileReader();

	    reader.onload = function (e)
	    {
	        $('#pic')
	            .attr('src', e.target.result);
	    };

	    reader.readAsDataURL(input.files[0]);
	}
}
$(document).ready(function()
{
	$("#predict").click(function()
	{
		predict();
	})
});


async function predict()
{
	console.log("Hello");
	await stackml.init({'accessKeyId': 'dca3d99c867b87cc2263f7c07987ccfc'});
	// load face detection model
	const model = await stackml.faceDetection(function callbackLoad()
	{
	    console.log('callback after face detection model is loaded!');
	});

	// make prediction with the image
	model.detect(document.getElementById('pic'),function callbackPredict(err, results)
	{
	    console.log(results);

	    // draw output keypoints in the image
	    model.draw(document.getElementById('canvas'),document.getElementById('pic'), results);
	});	
}