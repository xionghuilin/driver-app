(function (window) {
  'use strict'
  window.goodvan.module
  /**
   * 是否切割字符中单词:true/false
   * characters:19:false
  * */
  .filter('characters', function(){
    return function (input, chars, breakOnWord) {
      if (isNaN(chars)) return input;
      if (chars <= 0) return '';
      if (input && input.length > chars) {
        input = input.substring(0, chars);

        if (!breakOnWord) {
          var lastspace = input.lastIndexOf(' ');
          //get last space
          if (lastspace !== -1) {
            input = input.substr(0, lastspace);
          }
        }else{
          while(input.charAt(input.length-1) === ' '){
            input = input.substr(0, input.length -1);
          }
        }
        return input + '…';
      }
      return input;
    };
  })

  .filter('splitcharacters', function() {
    return function (input, chars) {
      if (isNaN(chars)) return input;
      if (chars <= 0) return '';
      if (input && input.length > chars) {

        var prefix = input.substring(0, chars/2);
        var postfix = input.substring(input.length-chars/2, input.length);
        return prefix + '...' + postfix;
      }
      return input;
    };
  })

  /**
   *英文单词个数，单词过滤
   * words:16
  * */
  .filter('words', function () {
    return function (input, words) {
      if (isNaN(words)) return input;
      if (words <= 0) return '';
      if (input) {
        var inputWords = input.split(/\s+/);
        if (inputWords.length > words) {
          input = inputWords.slice(0, words).join(' ') + '…';
        }
      }
      return input;
    };
  })

  .filter('timer', function () {
	  return function (start){
		 var a = new Date(start.replace(/-/g,'/'));
		 var dates = a.getDate();
		 var month = a.getMonth() + 1;
		 if(month < 10){
		 		month = '0' + month;
		 }
		 if(dates < 10){
		 		dates = '0'+a.getDate();
		 }
	   var time1 = a.getFullYear()+'.'+month+'.'+ dates;

	   return time1;
	  }
  })
  /*
   * 字符截断 过滤函数，超出用...代替
   * 用法 | chekeLength:true:28:'...'
   */
     .filter('chekeLength', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';
            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }
            return value + (tail || ' …');
        };
    });
})(window);

