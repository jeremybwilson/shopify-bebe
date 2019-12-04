$(document).ready(function(){
    let order_string = $('#product-details--wrapper .size-chart--order').val();
    let order_array = order_string.split(";");
    var swatch_order = [];
    $(".size .swatch-element-list input").each(function() { 
      swatch_order.push($(this).val().split("(")[0]);
    });
    for( let i=0; i<order_array.length; i++ ) {
        if(jQuery.inArray(order_array[i], swatch_order) == -1) {
            order_array.splice(i, 1);
        }
    }
    console.log(swatch_order);
    console.log(order_array);
    debugger;
    $(".size .swatch-element-list input").each(function(index) { 
        if( swatch_order[index] != order_array[index] ) {
            $('.size .swatch-element-list').find('input').each(function(index){
                var i = $(this).val().split("(")[0];
                console.log(i);
            });
            // if($('.size .swatch-element-list').find('input').val().split("(")[0] == order_array[index]) {
            //     var temp = $(this).find('input').val().split("(")[0];
            // }
        
        }
        // let context = ".size .swatch-element-list .size-swatch-";
        // $(context).insertAfter(".size .swatch-element-list input");
    });
       
});

// $('.size .swatch-element-list').find('input').each(function(){
//     var i = $(this).val().split("(")[0];
// });