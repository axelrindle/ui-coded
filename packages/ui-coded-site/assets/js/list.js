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
      total: 0,
      reset: 0
    },
    viewDemoDirectly: false,
    interval: -1,
    resetTimestamp: ''
  },
  computed: {
    viewDemoText() {
      return this.viewDemoDirectly ? 'View demo directly' : 'View Repository';
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
      axios.get('https://api.github.com/repos/axelrindle/ui-coded/contents/packages')
        .then(function (response) {
          self.requests = {
            left: response.headers['x-ratelimit-remaining'],
            total: response.headers['x-ratelimit-limit'],
            reset: response.headers['x-ratelimit-reset']
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
    },

    projectUrl: function (project) {
      const demoBase = 'https://axelrindle.github.io/ui-coded/packages/';
      return this.viewDemoDirectly ? (demoBase + project.name) : project.url;
    },

    addApiToken: function () {
      const def = axios.defaults.headers.common['Authorization'] || '';
      const token = prompt('Enter your Personal Access Token:', def.replace('token ', ''));
      if (token !== null) {
        axios.defaults.headers.common['Authorization'] = 'token ' + token;
        localStorage.setItem('token', token);
        this.fetchProjectList();
      }
    },

    apiButtonText: function () {
      return axios.defaults.headers.common['Authorization'] === undefined ? 'Add API token' : 'Change API token';
    }

  },

  watch: {
    viewDemoDirectly() {
      localStorage.setItem('viewDemoDirectly', this.viewDemoDirectly);
    },

    filter() {
      localStorage.setItem('filter', this.filter);
    }
  },

  mounted() {
    // load state
    const viewDemoDirectly = localStorage.getItem('viewDemoDirectly') === 'true';
    const token = localStorage.getItem('token');
    const filter = localStorage.getItem('filter');
    this.viewDemoDirectly = viewDemoDirectly;
    if (token) axios.defaults.headers.common['Authorization'] = 'token ' + token;
    if (filter) this.filter = filter;

    // load projects
    this.fetchProjectList();
    const self = this;
    this.interval = setInterval(function () {
      const now = moment();
      const future = moment.unix(self.requests.reset);
      const duration = moment.duration(now.diff(future));
      self.resetTimestamp = duration.humanize();
    }, 1000);
  }
});
