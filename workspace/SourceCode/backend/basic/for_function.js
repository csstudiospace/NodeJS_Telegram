//========================================================
for(var i=0; i<5; i++)
	console.log(i);






//========================================================
var a=[9,8,7,6,5];
for(var i=0; i<a.length; i++)
	console.log("a["+i+"]:"+a[i]);





//========================================================
var b=["H","e","l","l","o"];
b.forEach(function(value, key){
	console.log(key+":"+value);
});




//========================================================
var j="hello world js javascript";
var k = j.split(" ");
//in here, k includes [ 'hello', 'world', 'js', 'javascript' ]
for(var i=0; i<k.length; i++)
	console.log(k[i]);





//========================================================
function testfunc(x){
	return x+5;
}

var c = testfunc(5);
var d = testfunc("10");
console.log("c:"+c);    //c:10 , 數字
console.log("d:"+d);    //d:105 , 字串



//========================================================
function testfunc2(x, callback){
	callback(x+5);
}

testfunc2(5, function(e){
	console.log("e:"+e); //e:10 , 數字
});
testfunc2("10", function(f){
	console.log("f:"+f); //f:105 , 字串
});




//========================================================
async function wait_moment(){
	for(var i=0; i<100000; i++){}
}
async function testfunc3_wait(x, callback){
	await wait_moment();
	callback(x+5);
}
function testfunc4(x, callback){
	callback(x+5);
}

testfunc3_wait(5, function(g){
	console.log("g:"+g); //g:10 , 數字
});

testfunc4("10", function(h){
	console.log("h:"+h); //h:105 , 字串
});

