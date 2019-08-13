// Collapser cd44

;(function() {
	var toggler = document.querySelectorAll('.cd44-collapser_button');
	var i;

	for (i = 0; i < toggler.length; i++) {
		toggler[i].addEventListener("click", function() {
		    this.classList.toggle("show");
		    var panel = this.nextElementSibling;
		    if (panel.style.maxHeight){
		      panel.style.maxHeight = null;
		    } else {
		      panel.style.maxHeight = panel.scrollHeight + 60 + "px"; // we add 60px due to vertical padding of the inner container on large viewports (3rem)
		    }
	  	});
	}
})()