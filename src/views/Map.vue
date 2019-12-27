<template>
    <div>
    <div id="indoor3d" style="width: 100%; height: 100%; top:0px; left: 0px; position: absolute"></div>
  </div>
</template>

<script>
import YunMap from '../assets/js/YunMap.js';
import Theme from '../assets/js/Theme'
import DataFactory from "../assets/js/DataFactory";



export default {
  data () {
    return {
      vuele: '',
      scene: '',
      camera: '',
      controls: ''
    }
  },
  methods: {

  },
  mounted () {
    let params = {
      yunId : 'indoor3d',
      mold : '3d',  //  2d"或者" 3d"。" 3d"作为默认值。 但 final 结果取决于你的设备。 如果它不支持 WebGL，它将显示 2d 映射，即使你设置了" 3d"。
      url : '/api/map',
      theme : Theme.getDefault3dTheme(),
      movable : true
    };

    // 新建map对象
    let map = YunMap.config(params);

  }
}
</script>

<style scoped>
  @import "../assets/css/yun3D.css"; /*地图样式*/
</style>
