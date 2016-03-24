var contributors = (function(window) {

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

        console.log(forksCount, contributors);
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

  return {
    init: init
  };
})(window);
