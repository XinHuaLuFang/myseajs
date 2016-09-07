define(function(require, exports, module) {
/**
 * 自定应分页计算组件
 * @author dingyf
 * @param {Object} opts Several options
 */
(function($){
	/**
	 * 扩展String方法
	 */
	$.extend(String.prototype, {
		isPositiveInteger:function(){
			return (new RegExp(/^[1-9]\d*$/).test(this));
		},
		trim:function(){
			return this.replace(/(^\s*)|(\s*$)|\r|\n/g, "");
		},
		replaceAll:function(os, ns){
			return this.replace(new RegExp(os,"gm"),ns);
		}
	});
	
	$.fn.extend({
		pagination: function(opts,template){
			
			var setting = {
				first$:"li.j-first", prev$:"li.j-prev", next$:"li.j-next", last$:"li.j-last", nums$:"li.j-num>a", jumpto$:"li.jumpto",
				pageNumFrag:'<li class="#liClass#"><a href="javascript:;">#pageNum#</a></li>'
			};
			return this.each(function(){
				var $this = $(this);
				var pc = new Pagination(opts);
				var interval = pc.getInterval();
	
				var pageNumFrag = '';
				for (var i=interval.start; i<interval.end;i++){
					pageNumFrag += setting.pageNumFrag.replaceAll("#pageNum#", i).replaceAll("#liClass#", i==pc.getCurrentPage() ? 'selected j-num' : 'j-num');
				}
				$this.html(template.replaceAll("#pageNumFrag#", pageNumFrag).replaceAll("#currentPage#", pc.getCurrentPage())).find("li").hoverClass();
	
				var $first = $this.find(setting.first$);
				var $prev = $this.find(setting.prev$);
				var $next = $this.find(setting.next$);
				var $last = $this.find(setting.last$);
				
				if (pc.hasPrev()){
					$first.add($prev).find(">span").hide();
					_bindEvent($prev, pc.getCurrentPage()-1, pc.rel(),pc.customFun());
					_bindEvent($first, 1, pc.rel(),pc.customFun());
				} else {
					$first.add($prev).addClass("disabled").find(">a").hide();
				}
				
				if (pc.hasNext()) {
					$next.add($last).find(">span").hide();
					_bindEvent($next, pc.getCurrentPage()+1, pc.rel(),pc.customFun());
					_bindEvent($last, pc.numPages(),pc.rel(),pc.customFun());
				} else {
					$next.add($last).addClass("disabled").find(">a").hide();
				}
	
				$this.find(setting.nums$).each(function(i){
					_bindEvent($(this), i+interval.start, pc.rel(), pc.customFun());
				});
				$this.find(setting.jumpto$).each(function(){
					var $this = $(this);
					var $inputBox = $this.find(":text");
					var $button = $this.find(":button");
					$button.click(function(event){
						var pageNum = $inputBox.val();
						if (pageNum && pageNum.isPositiveInteger()) {
							furnace.pageBreak({pageNum:pageNum}, pc.rel(),pc.customFun());
						}
					});
					$inputBox.keyup(function(event){
						if (event.keyCode == 13) $button.click();
					});
				});
			});
			
			function _bindEvent(jTarget, pageNum, rel,customFun){
				jTarget.bind("click", {pageNum:pageNum}, function(event){
					furnace.pageBreak({pageNum:event.data.pageNum},rel,customFun);
					event.preventDefault();
				});
			}
		}
	});
	
	var Pagination = function(opts) {
		this.opts = $.extend({
			targetType:"navTab",	// navTab, dialog
			totalCount:0,
			numPerPage:10,
			pageNumShown:10,
			currentPage:1,
			callback:function(){return false;}
		}, opts);
	}
	
	$.extend(Pagination.prototype, {
		rel:function(){return this.opts.rel},
		customFun:function(){return this.opts.customFun},
		numPages:function() {
			return Math.ceil(this.opts.totalCount/this.opts.numPerPage);
		},
		getInterval:function(){
			var ne_half = Math.ceil(this.opts.pageNumShown/2);
			var np = this.numPages();
			var upper_limit = np - this.opts.pageNumShown;
			var start = this.getCurrentPage() > ne_half ? Math.max( Math.min(this.getCurrentPage() - ne_half, upper_limit), 0 ) : 0;
			var end = this.getCurrentPage() > ne_half ? Math.min(this.getCurrentPage()+ne_half, np) : Math.min(this.opts.pageNumShown, np);
			return {start:start+1, end:end+1};
		},
		getCurrentPage:function(){
			var currentPage = parseInt(this.opts.currentPage);
			if (isNaN(currentPage)) return 1;
			return currentPage;
		},
		hasPrev:function(){
			return this.getCurrentPage() > 1;
		},
		hasNext:function(){
			return this.getCurrentPage() < this.numPages();
		}
	});
})(jQuery);

});