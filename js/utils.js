//封装找出元素的子元素
function elemChildren(node){
  //使用類陣列
  var temp = {
      'length': 0,
      'push':Array.prototype.push,
      'splice':Array.prototype.splice
  },
   len = node.childNodes.length;
   for(var i = 0; i < len; i++){
       var childItem = node.childNodes[i];
       if(childItem.nodeType === 1){
         //   temp[temp['length']] = childItem;
         //   temp['length']++;
         temp.push(childItem);
       }
   }
   return temp;
 }
//封装查看scroll bar的距離
 function getScrollOffset(){
     if(window.pageXOffset){
       return {
         left:window.pageXOffset,
         top:window.pageYOffset,
       }
     }else {
         return {
             left:document.body.scrollLeft + document.documentElement.scrollLeft,
             top:document.body.scrollTop + document.documentElement.scrollTop,
         }
     }
 }
// 封装查看具有父級定位元素到可視區域窗口的距離
function getElemDocPosition(el){
    var parent = el.offsetParent,
        offsetLeft = el.offsetLeft,
        offsetTop = el.offsetTop;
        while(parent){
            offsetLeft += parent.offsetLeft;
            offsetTop += parent.offsetTop;
            parent = parent.offsetParent;
        }
        return {
            left:offsetLeft,
            top:offsetTop,
        }
}
//封裝取消冒泡並兼容IE
   function cancelBuddle(e){
     var e = e || window.event;
     if(e.stopPropagation){
       e.stopPropagation();
     }else{
       e.cancelBuddle = true;
     }
   }

//封装阻止默認事件兼容性
function preventDefaultEvent(e){
  var e  = e || window.event;
  if(e.preventDefault){
    e.preventDefault();
  }else {
    e.returnValue = false ;
  }
}
//封裝註冊/绑定事件處理函数及兼容版本
    function addEvent(el, type, fn){
      if(el.addEventListener){
          el.addEventListener(type, fn, false);
      }else if(el.attachEvent){
          el.attachEvent('on' + type, function(){
              fn.call(el);
          })
      }else {
          el['on' + type]= fn;
      }
    }
//封装取消注册事件/移除事件處理處理函数兼容
  function removeEvent(el,type,fn){
        if(el.addEventListener){
            el.removeEventListener(type, fn, false);
        }else if(el.attachEvent){
            el.detachEvent('on' + type, function(){
                fn.call(el);
            })
        }else {
            el['on' + type]= null;
        }
    } 

//封装瀏覽器可視區域的尺寸(窗口的寬高)怪異模式和標準模式並兼容IE9及IE8
function getViewportSize(){
  if(window.innerWidth){ //正常
    return {
      width: window.innerWidth, //包括scroll bar
      height: window.innerHeight
    }
  }else{
    if(document.compatMode === 'BackCompat'){
      return {
        width:document.body.clientWidth, //包括scroll bar
        height:document.body.clientHeight
      }
    }else {
      return {
        width:document.documentElement.clientWidth, //不包括
        height:document.documentElement.clientHeight
      }
    }
  }
}
//封装查看元素屬性(寬高)兼容IE9及IE8
function getStyles(elem, prop){
  if(window.getComputedStyle){
      if(prop){
          return parseInt(window.getComputedStyle(elem, null)[prop]); //null 是為放偽元素而存在的
      }else {
          return window.getComputedStyle(elem, null);
      }
    }else {
        if(prop){
            return parseInt(elem.styleCurrent[prop]);
        }else {
            return elem.styleCurrent;
        }
    }
 }
//封装監測整個html文檔的大小
/* 
*scrollWidth = window.innerWidth + window.pageXoffset;
*/ 
   function getScrollSize(){
     if(document.body.scrollWidth){
         return {
           width: document.body.scrollWidth,
         height: document.body.scrollHeight,
         }
     }else {
       return {
         width:document.documentElement.scrollWidth,
         height:document.documentElement.scrollHeight,
       }
     }
   }

//封装尋找元素父節點的方法
function elemParent(node, n){
  var type = typeof(n);
  if(type === 'undefined'){
     return node.parentNode;
  }else if(n < 0 || type !== 'number'){
    return undefined;
  }
  while(n){
     node = node.parentNode;
     n--;
  }
  return node;
}
// 封装滑鼠位置座標pageX/Y兼容性
function pagePos(e){
var sLeft = getScrollOffset().left,
   sTop = getScrollOffset().top,
   cLeft = document.documentElement.clientLeft || 0,
   cTop = document.documentElement.clientTop || 0 ;

   return {
     X:e.clientX + sLeft - cLeft,
     Y:e.clientY + sTop - cTop,
   }
}
// 封裝取消冒泡(兼容性)
function cancelBubble(e){
	var e = e || window.event;
	if(e.stopPropagation){
		e.stopPropagation();
	}else{
		e.cancelBubble = true;
	}
}

//判斷點是否在一個三角形内
var pointInTriangle = (function(){
 function vec(a, b){
     return {
         x: b.x - a.x,
         y: b.y - a.y
     }
   }
   
   function vecProduct(v1, v2){
    return v1.x * v2.y - v2.x * v1.y;
   }
   function sameSymbols(a, b){
       return (a ^ b) >= 0;
   }
 return  function (opt){
       var PA = vec(opt.curPos, opt.lastPos),
           PB = vec(opt.curPos, opt.topLeft),
           PC = vec(opt.curPos, opt.bottomLeft),
           R1 = vecProduct(PA, PB),
           R2 = vecProduct(PB, PC),
           R3 = vecProduct(PC, PA);
   
       return sameSymbols(R1, R2) && sameSymbols(R2, R3);
   
   }
})();