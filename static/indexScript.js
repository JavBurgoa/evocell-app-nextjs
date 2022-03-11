// unique() function for arrays
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }


////////////////////////////
//// Accordions

// Get all species names
const species = document.getElementsByTagName("tr") // tr tag contain as classnames all speciesNames

var allSpecies = []
for (i = 0; i < species.length; i++){
    allSpecies.push(species[i].className)
}

allSpecies = allSpecies.filter(onlyUnique) // array with all species names
allSpecies.shift() // Eliminate first element of array



//// Add accordion on top of each group of datasets from the same species
for(i = 0; i < allSpecies.length; i++){
    // Create accordion
    const accordion = document.createElement('tr');
    accordion.className = "accordion"
    accordion.visibility = "visible"
    accordion.innerHTML = allSpecies[i]
    accordion.data = allSpecies[i]
    

    // Add function
    

    accordion.addEventListener("click", function() {
        /* Toggle between adding and removing the "active" class,
        to highlight the button that controls the panel */
        this.classList.toggle("active");

        /* Toggle between hiding and showing the table rows with 
        a specific classNme (aka with common species) */
        var rowsToHide = document.getElementsByClassName(accordion.data)

        for (var z = 0; z < rowsToHide.length; z ++) {


            console.log(rowsToHide[z].style.visibility)

            if (rowsToHide[z].style.visibility === "visible"){
                rowsToHide[z].style.visibility = "collapse"
                
            } 
            else { rowsToHide[z].style.visibility = "visible" }

        }    
    });

    // Add tr to top of first appearance of the species row
    var tableRow  = document.getElementsByClassName(allSpecies[i])[0] // first element
    tableRow.parentNode.insertBefore(accordion, tableRow);

    // Hide everything under the accordion
    var rowsToHide = document.getElementsByClassName(accordion.data)
    for (var z = 0; z < rowsToHide.length; z ++) {
        rowsToHide[z].style.visibility = "collapse"
    }


    
 }


// //// Add function to each accordion
// var acc = document.getElementsByClassName("accordion");
// var i;

// for (i = 0; i < acc.length; i++) {
//     acc[i].addEventListener("click", function() {
//         /* Toggle between adding and removing the "active" class,
//         to highlight the button that controls the panel */
//         this.classList.toggle("active");

//         /* Toggle between hiding and showing the table rows with 
//         a specific classNme (aka with common species) */
//         alert(allSpecies)
//         alert([i])
//         var panel = document.getElementsByClassName(allSpecies[i])
//         console.log(panel)

//         for (var i = 0; i < panel.length; i ++) {
//             if (panel[i].style.visibility === "visible"){
//                 panel[i].style.visibility = "collapse"
//             } 
//             else { panel[i].style.visibility = "visible" }
//         }    
//   });
// }