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

$(".cancelRequest").on('click', function() {
   var id = $(this).attr('id');
   
   cancelRequest(id, this);
});


function returnBook(id) {
    $.ajax({
        url: "/api/trade/" + id + "/return",
        type: 'POST'
    })
    .error(function(err) {
        console.log(err);
    })
    .done(function() {
        location.reload();
    });
}

function deleteBook(id) {
    $.ajax({
        url : "/",
        type: 'DELETE',
        dataType : 'json',
        data: { _id : id }
    })
    .error(function(err) {
        console.log(err);
    })
    .done(function() {
        location.reload();
    });
}

function cancelRequest(id, element) {
    $.ajax({
        url : "/api/request/" + id,
        type : "DELETE"
    })
    .error(function(err) {
        console.log(err);
    })
    .done(function() {
        location.reload();
    });
}