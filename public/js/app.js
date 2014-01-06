_Putify = {

	scope  : null,
	$scope : null,

	$ : function(sel){
		return this.$scope.find(sel);
	},

	initiate : function(){

		this.setScope();
		this.bindEvents();  
	},

	bindEvents : function(){
		this.$('*')
			.click(this.click.bind(this))
			.mouseover(this.mouseover.bind(this))
			.mouseout(this.mouseout.bind(this));

		$('#share-purified').click(this.goNext.bind(this));
			
	},

	setScope : function(){
		this.scope  = window.frames[0].document;
		this.$scope = $(this.scope);
	},

	mouseover : function(e){
		e.preventDefault();
		$(e.target).addClass('purify-outline');
	},
	mouseout : function(e){
		e.preventDefault();
		$(e.target).removeClass('purify-outline');
	},
	click : function(e){
		e.preventDefault();
		$(e.target).toggleClass('purified');

		console.log(this.getXPaths(e.target));
	},

	goNext : function(){

		var data = {
			url : $('#url').val(), 
			items : this.getPXpaths()
		}

		$.post('/share', data, function(data){
			if(data && data.id){
				window.location.href = '/share/' + data.id;
			}
			console.log(data);
		}, 'json')

	},
	getPXpaths : function(){
		
		var doms = this.$scope.find('.purified') ;
		return _.map(doms, this.getXPaths.bind(this));
	},

	getXPaths : function(dom){
    
		function hasUniquId (dom){
			return dom.id && dom.id.length;
		}

		function getMyQuery(dom){

			if(dom.nodeName.toLowerCase() == 'body'){
				return 'body';
			}

			if(hasUniquId (dom)) {
				return '#' + dom.id;
			}				

			var i = getPositionInSiblings(dom);

			return ( i === false) ? 
				getMyQuery(dom.parentNode) + ' ' + dom.tagName : 
					getMyQuery(dom.parentNode) + ' ' + dom.tagName + ':eq(' + i + ')';

		}

		function getPositionInSiblings(dom){

			var tagName = dom.tagName.toLowerCase() , 
				childs  = $(dom.parentNode).find(tagName),
				tmpKlss = 'tmpKlss_' + Math.random().toString().replace('.','') ;

			$(dom).addClass(tmpKlss);
				
			for(var i = 0; i< childs.size(); i++){
					
				var tmpOb = childs[i];
					
				if($(tmpOb).hasClass(tmpKlss)){
					$(tmpOb).removeClass(tmpKlss);
					return i;
				}
			}

			return false;
		}

		return getMyQuery(dom);
	}

}

$(window).ready(function(){
	
	var $doc = $(document), hg = $doc.height(), wd = $doc.width(); 
	var $proxy = $('#proxy-frame') , pos = $proxy.position(); 
	
	$proxy.width(wd).height(hg - pos.top);
});
