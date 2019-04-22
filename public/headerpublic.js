$(document).ready(function () {
    $.ajax({
        type: "get",
        url: "/header",
        success: function (response) {
            var cates = response.cates;
            var series = response.series;
            cates.forEach(element => {
                $('#categoryList').append('<li class="nav-item"><a class="nav-link" href="/category/'+element.id +'">'+element.title+'</a></li>');
            });
            series.forEach(element => {
                $('#seriesList').append('<li class="nav-item"><a class="nav-link" href="/series?series='+element._id+'">'+element._id+'</a></li>');
            });
            console.log(response);
    }
    });
    $('#btnSearch').click(function (e) { 
        window.location.replace("/?search="+$('#inputSearch').val());
    });
});