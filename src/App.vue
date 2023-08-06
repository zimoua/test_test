<template>
  <div id="app">
    <hello-world></hello-world>
    <NumberKeyBoard :show="true" />
  </div>
</template>
<script type="jsx">
import HelloWorld from "./components/HelloWorld.vue";
import { NumberKeyBoard } from "vant/es/number-keyboard";
console.log(NumberKeyBoard);
export default {
  components: {
    HelloWorld,
    NumberKeyBoard,
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 60px 40px;
}
p {
  text-align: left;
}
</style>
