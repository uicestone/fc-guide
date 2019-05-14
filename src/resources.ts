import VueResource from "vue-resource";
import Vue from "vue";

Vue.use(VueResource);

export const Config = (<any>Vue).resource("config{/key}", null, {
  update: { method: "PATCH" }
});

export const Booking = (<any>Vue).resource("booking{/id}", null, {
  update: { method: "PATCH" },
  checkAvailability: { url: "booking-availability{/month}" }
});
