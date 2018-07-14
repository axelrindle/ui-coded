/*global findGetParameter, axios, Vue*/

// GitHub API Authentication
let token = findGetParameter("token");
if (token) {
  axios.defaults.headers.common['Authorization'] = "token " + token;
}

new Vue({

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
      const hidden = ['ui-coded-site'];
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
      const self = this;
      axios.get('https://api.github.com/repos/axelrindle/ui-coded/contents/packages/')
        .then(function (response) {
          self.requests = {
            left: response.headers['x-ratelimit-remaining'],
            total: response.headers['x-ratelimit-limit']
          }
          self.loading = false;
          self.projects = self.transformResponse(response.data);
        })
        .catch(function (error) {
          self.loading = false;
          alert(error);
        });
    },

    projectsFiltered: function () {
      const self = this;
      return this.projects.filter(function (el) {
        return el.name.indexOf(self.filter) !== -1;
      });
    }

  },

  mounted() {
    this.fetchProjectList();
  }
});
