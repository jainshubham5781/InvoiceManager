$(document).ready(function() {
	var counter = 1;
	var addItem = document.getElementById('addItem');
	addItem.onclick = function(){
		var foo = document.getElementById("fooBar");
	
		var element = document.createElement("input");
		element.setAttribute("type", "text");
		//element.setAttribute("value", "qwerty");
		element.setAttribute("placeholder", "itemName");
		element.setAttribute("name", "itemName");
		foo.appendChild(element);

		var element = document.createElement("input");
		element.setAttribute("type", "number");
		element.setAttribute("placeholder", "quantity");
		element.setAttribute("name", "quantity");
		//element.setAttribute("value", 5);
		
		foo.appendChild(element);

		var element = document.createElement("input");
		element.setAttribute("type", "number");
		element.setAttribute("placeholder", "price");
		element.setAttribute("name", "price");
		//element.setAttribute("value", 50);
		
		foo.appendChild(element);

		var element = document.createElement("input");
		element.setAttribute("type", "number");
		element.setAttribute("placeholder", "discount");
		element.setAttribute("name", "discount");
		//element.setAttribute("value", 5);
		
		foo.appendChild(element);

		var element = document.createElement("input");
		element.setAttribute("type", "number");
		element.setAttribute("placeholder", "tax%");
		element.setAttribute("name", "tax");
		//element.setAttribute("value", 5);
		
		foo.appendChild(element);

		var mybr = document.createElement('br');
		foo.appendChild(mybr);
	}
});