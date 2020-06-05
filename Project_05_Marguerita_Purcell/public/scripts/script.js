window.onload = function(){
};


$(document).ready(function(){

    $(".fa-star").click(function(){
        if($(this).hasClass("fivestar")){
            $(this).addClass("checked");
            $(".fourstar").addClass("checked");
            $(".threestar").addClass("checked");
            $(".twostar").addClass("checked");
            $(".onestar").addClass("checked");
        }
        
        if($(this).hasClass("fourstar")){
            $(".fivestar").removeClass("checked");
            $(".fourstar").addClass("checked");
            $(".threestar").addClass("checked");
            $(".twostar").addClass("checked");
            $(".onestar").addClass("checked");
        }
        
        if($(this).hasClass("threestar")){
            $(".fivestar").removeClass("checked");
            $(".fourstar").removeClass("checked");
            $(".threestar").addClass("checked");
            $(".twostar").addClass("checked");
            $(".onestar").addClass("checked");
        }
        
        if($(this).hasClass("twostar")){
            $(".fivestar").removeClass("checked");
            $(".fourstar").removeClass("checked");
            $(".threestar").removeClass("checked");
            $(".twostar").addClass("checked");
            $(".onestar").addClass("checked");
        }
        
        if($(this).hasClass("onestar")){
            $(".fivestar").removeClass("checked");
            $(".fourstar").removeClass("checked");
            $(".threestar").removeClass("checked");
            $(".twostar").removeClass("checked");
            $(".onestar").addClass("checked");
        }
    });

    $(".submitRating").click(function(){
        var rating = 5;

        if($(".fivestar").hasClass("checked")){
            rating=5;
        }
        else if($(".fourstar").hasClass("checked")){
            rating=4;
        }
        else if($(".threestar").hasClass("checked")){
            rating=3;
        }
        else if($(".twostar").hasClass("checked")){
            rating=2;
        }
        else if($(".onestar").hasClass("checked")){
            rating=1;
        }

        var url = $(location).attr('href'),
        parts = url.split("/"),
        movidID = parts[parts.length-1];

        $.post("/userRating", {starRating: rating, movieId: movidID}, function(result){
            location.reload();
          });
    });

    $("#genre").change(function(){
        var sel = $(this).val();
                window.location.href = "/g/"+sel;
    });

    $("#searchMovieBtn").click(function(){
        var title = $("#searchMovie").val();
        $.post("/moviebytitle", {title: title}, function(result){
            if(result != "Get Search Results"){
                window.location.href = "/movie/" + result;
            }
            else{
                window.location.href = "/"+title;
            }
        });
    });

    $(".searchDiv").hover(function(){
        $("#searchMovie").show();
    });

    $("#searchMovieBtn").hover(function(){
        $("#searchMovie").show();
    });

    $("#searchMovie").hover(function(){
        $("#searchMovie").show();
    });

    $(".searchDiv").mouseleave(function(){
        $("#searchMovie").hide();
    });
        
});

