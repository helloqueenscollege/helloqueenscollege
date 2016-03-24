var contributors = (function(window) {

  // API Fetching
  var repoUrl = 'https://api.github.com/repos/helloqueenscollege/helloqueenscollege';
  var contributorsUrl = repoUrl + '/contributors';

  var getRepoDetails = function() {
    return fetch(repoUrl)
      .then(handleNetworkSuccess);
  };

  var getContributorsDetails = function() {
    return fetch(contributorsUrl)
      .then(handleNetworkSuccess);
  };

  var init = function() {
    Promise.all([getRepoDetails(), getContributorsDetails()])
      .then(function(data) {
        var forksCount = data[0].forks;
        var contributors = data[1].map(function(contributor) {
          return {
            login: contributor.login,
            avatar_url: contributor.avatar_url,
            contributions: contributor.contributions,
            html_url: contributor.html_url
          };
        });

        return renderContentHeader(forksCount, contributors.length) +
               renderContributorTitle() +
               renderGallery(contributors);
      })
      .then(function(renderedString) {
        var domNode = window.document.getElementById('contributors');

        domNode.innerHTML = renderedString;
      })
      .catch(handleError);
  };

  function handleNetworkSuccess(res) {
    if (res.ok)
      return res.json();
  }

  function handleError(err) {
    console.log('Something is wrong, ', err);
  }

  // Rendering
  var renderHeadingIcon = function(type, count) {
    var openHeadingTag = "<div class='heading'>";

    var renderedHeading = "<h2 class='icon'><span class='fa fa-" +
                          type + " fa-1x'></span> " +
                          count + "</h2>";

    var closeHeadingTag = "</div>";

    return openHeadingTag + renderedHeading + closeHeadingTag;
  };

  var renderHeading = function(sentence) {
    var openHeadingTag = "<div class='heading'>";
    var renderedHeading = "<h2>" + sentence + "</h2>";
    var closeHeadingTag = "</div>";

    return openHeadingTag + renderedHeading + closeHeadingTag;
  };

  var renderContentHeader = function(forks, pullRequests) {
    var openContentTag = "<div class='content flex-container'>";
    var sentence = forks > pullRequests ? "Need more PRs!" : "Nice PRs!"; 
    var closeContentTag = "</div>";
    
    return openContentTag + 
           renderHeadingIcon('users', forks) +
           renderHeadingIcon('code-fork', pullRequests) +
           renderHeading(sentence) +
           closeContentTag;
  };
  
  var renderContributor = function(contributor) {
    var openContributorTag = "<div class='contributor'>";
    var closeContributorTag = "</div>";
    var contributorAvatar = "<img class='avatar' src='" + 
                        contributor.avatar_url + "' alt='" +
                        contributor.login + "'>";
    var contributorHandle = "<h3 class='handle'><a href='" + 
                            contributor.html_url + "'>@" +
                            contributor.login + 
                            "</a></h3>";

    return openContributorTag + 
           contributorAvatar +
           contributorHandle +
           closeContributorTag;
  };

  var renderContributorTitle = function() {
    return "<h1 class='text-center'>Contributors</h1>";
  };

  var renderGallery = function(contributors) {
    var openGalleryTag = "<div class='gallery'>";
    var closeGalleryTag = "</div>";
    var renderedContributors = contributors.sort(function(contribA, contribB) {
      return contribA.contributions < contribB.contributions;
    }).map(function(contributor) {
      return renderContributor(contributor);
    }).join('');


    return openGalleryTag +
           renderedContributors + 
           closeGalleryTag;
  };

  return {
    init: init
  };

})(window);
