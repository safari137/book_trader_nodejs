$('.delete').on('click', function() {
    deleteBook($(this).attr('id')); 
});

$(".returnBook").on('click', function() {
   returnBook($(this).attr('id')); 
});

$(".open-close").on('click', function() {
   $(this).parents('.top').children(".collapsible").toggleClass('collapsed');
   var currentText = $(this).text();
   
   if (currentText === '+')
        $(this).text('-');
    else
        $(this).text('+');
});


function returnBook(id) {
    $.ajax({
        url: "/api/trade/" + id + "/return",
        type: 'POST',
        success: function() {
            console.log('success');
        }
    })
    .error(function(err) {
        console.log('error');
        console.log(err);
    })
    .done(function() {
        console.log("returned");
    });
}

function deleteBook(id) {
    console.log('starting delete...');
    $.ajax({
        url : "/",
        type: 'DELETE',
        dataType : 'json',
        data: { _id : id },
        success : function() {
            console.log('success');
        }
    })
    .error(function(err) {
        console.log(err);
    })
    .done(function() {
        alert('deleted');
    });
}