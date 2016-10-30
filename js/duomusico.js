var test;
var lastLanguageRequested;
var ipAdress = "http://5.132.15.212:8002/"
//var ipAdress = "http://pinchofintelligence.com:8002/"

var playListsPerLanguage = {};
playListsPerLanguage["nl"] = "http://open.spotify.com/user/duomusico/playlist/6gHPRlwa6cBTpaeHQfZto1";
playListsPerLanguage["de"] = "http://open.spotify.com/user/duomusico/playlist/062INWA4potWeMuNBT15BJ";
playListsPerLanguage["it"] = "http://open.spotify.com/user/duomusico/playlist/6hmR60p84u3ATQOMbQBILp";
playListsPerLanguage["de"] = "http://open.spotify.com/user/duomusico/playlist/062INWA4potWeMuNBT15BJ";
playListsPerLanguage["pt"] = "http://open.spotify.com/user/duomusico/playlist/1KTzb1CynPdFtdfAmUcLJl";
playListsPerLanguage["fr"] = "http://open.spotify.com/user/duomusico/playlist/06kZTOlIrIU1tzQWKZIGlb";

$(document).ready(function() {
    $("#loadingNotification").hide();
    $("#errorNotification").hide();
    $("#explanation").hide();
});

function clearData() {
    $("#loadingNotification").hide();
    $("#errorNotification").hide();
    a = document.getElementById("test1");
    a.innerHTML = "";
}

function getDivArtistSongRating(nameAndArtist, index, mustDisplayScore) {

    // "<div class=\"col-sm-6 col-md-4\">\
    var toFill = "<div class=\"col-sm-6 col-md-4 myclass\" >\
                    <div class=\"thumbnail\" height: 948px>\
                    <div class=\"caption\">\
                    <h3><span class=\"glyphicon glyphicon-user\" aria-hidden=\"true\"></span>   " + nameAndArtist.Artist + "</h3>\
                    <h3><span class=\"glyphicon glyphicon-music\" aria-hidden=\"true\"></span>  <a href=\""+nameAndArtist.TrackShareURL+"\" target=\"_blank\">" + nameAndArtist.NameSong + "</a></h3>";
    if (mustDisplayScore) {
        toFill += "<h3><span class=\"glyphicon glyphicon-dashboard\" aria-hidden=\"true\"></span>  " + nameAndArtist.Score + " percent</h3>";
    }
    toFill += "      </div>\
                    <div id=\"spotify" + index + "\"><iframe src=\"https://embed.spotify.com/?uri=spotify:track:" + nameAndArtist.SpotifyID + "\" width=\"300\" height=\"380\" frameborder=\"0\" allowtransparency=\"true\"></iframe></div>\
                    </div>\
                    </div>";
    return toFill;

}

function placeResults(results, mustDisplayScore, languageDisplayed) {
    $("#loadingNotification").hide();
    $("#explanation").show();

    for (var index = 0; index < results.length; index++) {
        var nameAndArtist = results[index];
        var toAdd = getDivArtistSongRating(nameAndArtist, index, mustDisplayScore);
        a = document.getElementById("test1");
        a.innerHTML = a.innerHTML + toAdd;
    }
    displayCurrentLanguage(languageDisplayed);


}

function flagServerAdapter(flagServer)
{
    if("sv"==flagServer)
    {
        return "se";
    }
    else if("en"==flagServer)
    {
        return "us";
    }
    else if("da"==flagServer)
    {
        return "dk";
    }
    else
    {
        return flagServer;    
    }
}
function displayCurrentLanguage(languageDisplayed)
{
    var a = document.getElementById("currentLanguageOptions");
    a.innerHTML = "\
    <h1>\
        <div class=\"btn btn-primary btn-lg col-sm-6 col-md-4\" onclick=getRandomSongsInLanguage(\""+languageDisplayed+"\")>\
            <span class=\"label label-primary\"><span class=\"flag-icon flag-icon-"+flagServerAdapter(languageDisplayed)+"\"></span>\
            Random songs</span></div>\
        <a href=\""+playListsPerLanguage[languageDisplayed]+"\" target=\"_blank\">\
        <span class=\"btn btn-primary btn-lg col-sm-6 col-md-4\" >Spotify Playlist</span></a>\
</h1>";
}
function getBestSongsDuolingo() {
    //document.getElementById("loading").style.display = "";
    clearData();
    $("#loadingNotification").show();

    $.ajax({
        type: "GET",
        url: ipAdress+"duolingorecommendation?username=" + document.getElementById("id_of_textbox").value + "&random=false",
        contentType: "application/json; charset=UTF-8",
        dataType: "json",

        success: function(results) {
            test = results;
            placeResults(results.array, true, results.userLearningLanguage);
        },
        error: function(xhr, textStatus, errorThrown) {
            $("#errorNotification").show();
        }
    });
}

function getRandomSongsDuolingo() {
    clearData();
    $("#loadingNotification").show();
    $.ajax({
        type: "GET",
        url: ipAdress+"duolingorecommendation?username=" + document.getElementById("id_of_textbox").value + "&random=true",
        contentType: "application/json; charset=UTF-8",
        dataType: "json",

        success: function(results) {
            console.log(results);
            test = results;

            placeResults(results.array, true, results.userLearningLanguage);
        },
        error: function(xhr, textStatus, errorThrown) {
            $("#errorNotification").show();
        }
    });
}

function getRandomSongsInLanguage(language) {
    console.log("searching songs in language" + language);
    clearData();
    lastLanguageRequested = language;

    $("#loadingNotification").show();
    $.ajax({
        type: "GET",
        url: ipAdress+"randomSong?language=" + language,

        contentType: "application/json; charset=UTF-8",
        dataType: "json",

        success: function(results) {
            test = results;
            placeResults(results.array, false,results.userLearningLanguage);

        },
        error: function(xhr, textStatus, errorThrown) {
            $("#error").html(xhr.responseText);
        }
    });
}
