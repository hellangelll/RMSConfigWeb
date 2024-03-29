//每秒钟target帧
const FPS = 30;
var x = 0;
var y = 0;
var xDirection = 1;
var yDirection = 1;
var image = new Image();
//建议读者将图片下载到本地加载（经测试，此图片响应头部的Content-Type为application/empty，浏览器无法识别）
image.src = "jsplatformer1-smiley.jpg";
var canvas = null;
var context2D = null;

window.onload = init;
function init() {
	canvas = document.getElementById('canvas');
	context2D = canvas.getContext('2d');
	setInterval(draw, 1000 / FPS);
}

function draw() {
	context2D.clearRect(0, 0, canvas.width, canvas.height);
	context2D.drawImage(image, x, y);
	x += 1 * xDirection;
	y += 1 * yDirection;

	if( x>=450 ) {
		x = 450;
		xDirection = -1;
	}
	else
	if( x<=0 ) {
		x = 0;
		xDirection = 1;
	}
	if( y>=250 ) {
		y = 250;
		yDirection = -1;
	}
	else
	if( y<=0 ) {
		y = 0;
		yDirection = 1;
	}
}
