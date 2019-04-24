$(document).ready(function () {
    $.ajax({
        type: "get",
        url: "/header",
        success: function (response) {
            var cates = response.cates;
            var series = response.series;
            cates.forEach(element => {
                $('#categoryList').append('<li class="nav-item"><a class="nav-link" style="font-size: 1.2em; width: 300px; line-height: 2em" href="/category/'+element.id +'">'+element.title+'</a></li>');
            });
            series.forEach(element => {
                $('#seriesList').append('<li class="nav-item"><a class="nav-link" style="font-size: 1.2em; width: 300px; line-height: 2em" href="/series?series='+element._id+'">'+element._id+'</a></li>');
            });
            //console.log(response);
    }
    });

    $.ajax({
        type:"get",
        url: "/banner",
        success: function(rs){
            var quote = rs.quote;
            $('#quoteBanner').text(quote.s);
            $('#authorBanner').text(quote.a)
        }

    });
    
    $('#btnSearch').click(function (e) { 
        window.location.replace("/?search="+$('#inputSearch').val());
    });
});