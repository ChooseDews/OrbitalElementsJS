import vue from "vue/dist/vue.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import mainApp from "./app.vue";
var app = new vue({
  el: "#app",
  components: { mainApp }
});
