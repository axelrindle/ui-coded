new Vue({
  el: '#app',
  methods: {
    triggerFileChoose() {
      this.$refs.fileInput.click();
    }
  }
});
