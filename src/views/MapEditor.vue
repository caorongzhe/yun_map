<template>
  <div>
    <v-mapui ref="m"></v-mapui>
    <div id="MapEditor" style="width: 100%; height: 100%; top:0px; left: 0px; position: absolute"></div>
  </div>
</template>

<script>
  import MapEditor from "../assets/js/MapEditor";
  import VMapui from '../components/MapUI';

  export default {
    name: "MapEditor",
    data () {
      return {
        vuele: ''
      }
    },
    components: {
      VMapui
    },
    methods: {

    },
    mounted () {
      let x = window.innerWidth;
      let y = window.innerHeight
      let dom = document.getElementById('MapEditor');

      // if (x < 1500 || y < 900){
      //   document.body.innerHTML = '<h1>屏幕分辨率太小，不适合画图.</h1>'
      //   return;
      // }



      console.log(this.$refs)
      this.$refs.m.mapEditor(dom);








    }
  }
</script>


<style scoped>

</style>
