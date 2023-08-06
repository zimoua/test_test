<template>
  <div class="hello">
    <input v-model="value" />
    <NumberKeyBoard
      v-if="false"
      :numberMap="map"
      v-model="value"
      :show="false"
    ></NumberKeyBoard>
  </div>
</template>

<script>
//import  NumberKeyBoard  from "vant/e";
import NumberKeyBoard from "./NumberKeyBoard.jsx";
import "vant/lib/number-keyboard/style";
export default {
  name: "HelloWorld",
  data() {
    return {
      map: [
        { key: "key0", url: "url0" },
        { key: "key1", url: "url1" },
        { key: "key2", url: "url2" },
        { key: "key3", url: "url3" },
        { key: "key4", url: "url4" },
        { key: "key5", url: "url5" },
        { key: "key6", url: "url6" },
        { key: "key7", url: "url7" },
        { key: "key8", url: "url8" },
        { key: "key9", url: "url9" },
      ],
      value: 0,
    };
  },
  components: {
    NumberKeyBoard,

    //NumberKeyBoard,
  },
  props: {
    msg: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
