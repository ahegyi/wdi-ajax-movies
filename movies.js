function movieLi(title, year, id) {
  return $('<li class="result" data-id="' + id + '"><b>' + title + '</b> (<i>' + year + '</i>)</li>');
}

// added on click of #search-results as delegate to li.result
function displayMovie() {
  var imdbID = $(this).attr("data-id");
  var resultsContainer = $('#search-results');
  var movieDetailContainer = $('#movie-detail');
  var timer;

  $.ajax({
    url: "http://www.omdbapi.com/",
    method: "get",
    data: { "i": imdbID },
    dataType: 'jsonp',
    beforeSend: function () {
      resultsContainer.empty();
      movieDetailContainer.empty();
      resultsContainer.addClass("hidden");
      timer = setTimeout(function () { $('.ajax-loader').slideDown("fast"); }, 500);
    },
    complete: function () {
      clearTimeout(timer);
      $('.ajax-loader').slideUp("fast");
    },
    success: function (result) {
      /*
        Results is an array of the following objects:

        Actors: "Stuart Turner, Garth Jennings, Matt Harradine, Mark Hilder"
        Director: "Garth Jennings"
        Genre: "Short, Action"
        Plot: "N/A"
        Poster: "N/A"
        Rated: "N/A"
        Released: "N/A"
        Response: "True"
        Runtime: "10 min"
        Title: "Aron"
        Type: "movie"
        Writer: "Garth Jennings"
        Year: "2008"
        imdbID: "tt1543203"
        imdbRating: "5.6"
        imdbVotes: "9"
      */

      var movieTitle = $('<h2 class="movie-title">' + result.Title +
                      ' (<i>' + result.Year + '</i>)</h2>');

      console.log(result);

      movieDetailContainer.removeClass("hidden");
      movieDetailContainer.append(movieTitle);

//       <h2 class="movie-title"><%= @result["Title"] %> (<%= @result["Year"] %>)</h2>

// <div class="movie-details">

//   <div class="poster">
//     <% if @result["Poster"] == "N/A" || @result["Poster"].nil? %>
//     <%= image_tag "noposter.png", {:alt => "No poster available", :title => "No poster available"} %>
//     <% else %>
//     <img src="<%= @result["Poster"] %>" alt="Movie poster for <%= @result["Title"] %>" title="Movie poster for <%= @result["Title"] %>">
//     <% end %>
//   </div>

//   <div class="information">
//     <blockquote>
//       <p>
//       <%= @result["Plot"] == "N/A" ? "No description available." : @result["Plot"] %>
//       </p>
//     </blockquote>
//     <dl >
//       <dt>
//         Rating
//       </dt>
//       <dd>
//         <%= @result["Rated"] %>
//       </dd>
//       <dt>
//         Runtime
//       </dt>
//       <dd>
//         <%= @result["Runtime"] %>
//       </dd>
//       <dt>
//         Genre
//       </dt>
//       <dd>
//         <%= @result["Genre"] %>
//       </dd>
//       <dt>
//         IMDB Rating
//       </dt>
//       <dd>
//         <%= @result["imdbRating"] %> (<%= @result["imdbVotes"] %> votes)
//       </dd>

//       <dt>
//         Rotten Tomatoes Rating
//       </dt>
//       <dd>
//         <%= @result["tomatoRating"] %> (<%= @result["tomatoReviews"] %> reviews)
//       </dd>
//       <dt>
//         Actor<%= @actors.length > 1 ? "s" : "" %>
//       </dt>
//       <dd>
//         <ul class="unstyled">
//           <% @actors.each do |actor| %>
//             <li><%= actor %></li>
//           <% end %>
//         </ul>
//       </dd>
//       <dt>
//         Director<%= @directors.length > 1 ? "s" : "" %>
//       </dt>
//       <dd>
//         <ul class="unstyled">
//           <% @directors.each do |director| %>
//             <li><%= director %></li>
//           <% end %>
//         </ul>
//       </dd>
//     </dl>
//   </div>
// </div>
    },
    error: function (jqXHR, textStatus) {
      clearTimeout(timer);
      $('.ajax-loader').slideUp("fast");

      $('.error').slideDown();
      setTimeout(function () { $('.error').slideUp(); }, 4000);

      if (textStatus == 'timeout') {
        alert('Failed from timeout');
      }

    },
    timeout: 3000 // 3 second timeout
  });
}

$(document).ready( function () {

  // attach click event via delegate
  $('#search-results').on("click", "li.result", displayMovie);

  $('#search-form').on('submit', function (event) {
    event.preventDefault();
    var resultsContainer = $('#search-results');
    var movieDetailContainer = $('#movie-detail');
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
        movieDetailContainer.empty();
        movieDetailContainer.addClass("hidden");

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
          resultsContainer.removeClass("hidden");
          resultsContainer.append($('<li>Sorry, there are no results.</li>'));
        }
        else if (!!results.Search) {
          resultsContainer.removeClass("hidden");
          var searchResults = results.Search;
          for (var i = 0; i < searchResults.length; i += 1) {
            resultsContainer.append(movieLi(searchResults[i].Title,
                                            searchResults[i].Year,
                                            searchResults[i].imdbID));
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
      error: function (jqXHR, textStatus) {
        clearTimeout(timer);
        $('.ajax-loader').slideUp("fast");

        $('.error').slideDown();
        setTimeout(function () { $('.error').slideUp(); }, 4000);

        if (textStatus == 'timeout') {
          alert('Failed from timeout');
        }

      },
      timeout: 3000 // 3 second timeout
    });
  });
});