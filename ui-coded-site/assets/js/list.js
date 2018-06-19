// GitHub API Authentication
let token = findGetParameter("token");
if (token) {
  axios.defaults.headers.common['Authorization'] = "token " + token;
}

const app = new Vue({

  // root element
  el: '#app',

  // plain data
  data: {
    projects: [],
    loading: false,
    filter: '',
    requests: {
      left: 0,
      total: 0
    }
  },

  methods: {

    // Transforms and filters a response to only hold the data we need
    transformResponse: function (response) {
      const hidden = ["project-boilerplate", "ui-coded-site"];
      return response
        .filter(function (el) {
          return el.type === 'dir' && hidden.indexOf(el.name) === -1;
        })
        .map(function (el) {
          return {
            name: el.name,
            url: el.html_url
          }
        });
    },

    // fetch a list of repository contents
    fetchProjectList: function () {
      this.loading = true;
      axios.get('https://api.github.com/repos/axelrindle/ui-coded/contents/')
        .then(function (response) {
          app.requests = {
            left: response.headers['x-ratelimit-remaining'],
            total: response.headers['x-ratelimit-limit']
          }
          app.loading = false;
          app.projects = app.transformResponse(response.data);
        })
        .catch(function (error) {
          app.loading = false;
          alert(error);
        });
    },

    projectsFiltered: function () {
      return this.projects.filter(function (el) {
        return el.name.indexOf(app.filter) !== -1;
      });
    }

  }
});

// initial fetch
app.fetchProjectList();
