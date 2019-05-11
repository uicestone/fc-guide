import Vue from "vue";
import {
  Button,
  ButtonGroup,
  Carousel,
  CarouselItem,
  Card,
  Table,
  TableColumn,
  Col,
  Row,
  Form,
  FormItem,
  Input,
  Select,
  Option,
  DatePicker,
  Radio,
  RadioGroup,
  Calendar
} from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import VueResource from "vue-resource";
import App from "./App.vue";

[
  Button,
  ButtonGroup,
  Carousel,
  CarouselItem,
  Card,
  Table,
  TableColumn,
  Col,
  Row,
  Form,
  FormItem,
  Input,
  Select,
  Option,
  DatePicker,
  Radio,
  RadioGroup,
  Calendar
].forEach(c => Vue.use(c));
Vue.use(VueResource);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
