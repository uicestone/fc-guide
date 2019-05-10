import Vue from "vue";
import {
  Button,
  Select,
  Carousel,
  CarouselItem,
  Card,
  Table,
  TableColumn,
  Col,
  Row
} from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";

Vue.use(Button, Select);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Card);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Col);
Vue.use(Row);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
