function movieLi(title, year) {
  return $('<li><b>' + title + '</b> (<i>' + year + '</i>)</li>');
}

$(document).ready( function () {

  $('#search-form').on('submit', function (event) {
    event.preventDefault();
    var resultsContainer = $('#search-results');
    var query = $('#search-query').val();
    var timer;

    $.ajax({
      url: "http://www.omdbapi.com/",
      method: "get",
      data: { "s": query },
      dataType: 'jsonp',
      beforeSend: function () {
        // $('form input, form select').prop("disabled", true);
        resultsContainer.empty();
        timer = setTimeout(function () { $('.ajax-loader').slideDown("fast"); }, 500);
      },
      complete: function () {
        // allowSubmit = true;
        // $('form input, form select').prop("disabled", false);
        clearTimeout(timer);
        $('.ajax-loader').slideUp("fast");
      },
      success: function (results){

        /* "results" contains the key "Search" which is an array of movies,
             each of which is the following object:
           Title: "To Wong Foo Thanks for Everything, Julie Newmar"
           Type: "movie"
           Year: "1995"
           imdbID: "tt0114682"

           Unless of course there are no results, which means you get this:
           results: {Response: "False", Error: "Movie not found!"}
        */

        if (!!results.Error && results.Error === "Movie not found!") {
          resultsContainer.append($('<li>Sorry, there are no results.</li>'));
        }
        else if (!!results.Search) {
          var searchResults = results.Search;
          for (var i = 0; i < searchResults.length; i += 1) {
            resultsContainer.append(movieLi(searchResults[i].Title, searchResults[i].Year));
          }
        }
        else {
          throw $.ajax.error;
        }

        // var list = $('#todo');
        // var entry = $('<li data-id="' + todo.id + '"></li>');
        // var checkbox = $('<span class="item_checkbox"><input type="checkbox"></span>');
        // var name = $('<span class="item_name"> ' + todo.name + '</span>');
        // var time = $('<time class="timeago item_due_at" datetime="' + todo.due_at + '">' +
        //            moment(todo.due_at).calendar() + '</time>');

        // time.timeago();
        // var deleteButton = $('<span class="item_delete"><a href="/todo_items/' + todo.id +
        //                    '" data-method="delete" data-confirm="Are you sure?" rel="nofollow">');
        // entry.append(checkbox, name, time, deleteButton);
        // entry.appendTo(list);
        // input.val('');
        // input.focus();
      },
      error: function () {
        clearTimeout(timer);
        $('.ajax-loader').slideUp("fast");

        $('.error').slideDown();
        setTimeout(function () { $('.error').slideUp(); }, 4000);
      }
    });
  });
});