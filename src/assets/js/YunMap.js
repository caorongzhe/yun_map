/**
 * 进行配置文件的读取和配置
 * @author CAO
 * @date 2019/8/25 20:45
 */

import YunMap3d from "./YunMap3d";


const YunMap = {
  config : (e)=>{
    let yunDom,is3d,yunMap;

    if (e === undefined) {
      console.error("缺少必要的配置参数，请参考文档进行相关的配置。")
      return null;
    }

    yunDom = document.getElementById(e.yunId);
    if (yunDom === null) {
      console.error("缺少放置地图的容器，请参考文档进行相关的配置。")
      return null;
    }

    // 3D或者2D的切换
    if(e.hasOwnProperty("mold")){
      is3d = (e.mold !== "2d");
    }else{
      is3d = true;
    }

    if (!YunMap.webgl()) {
      console.error("当前浏览器不支持3D配置，请参考文档进行相关的配置。")
      return null;
    }

    if (is3d) {
      yunMap = new YunMap3d(yunDom);
      yunMap.load(e.url,e.mold,e.theme,function () {
        // 加载文字信息
        document.body.appendChild(YunMap.GUI(yunMap));
        YunMap.enlarge();
      });
    }

  },

  /** 界面 */
  GUI : (yunMap)=>{
    // 创建楼层菜单
    let floor = document.createElement('ul');
    let floors = yunMap.mall.json.data.storey;
    let li, text;

    floor.className = 'floorsUI';
    li = document.createElement('li');
    text = document.createTextNode('全部');
    li.appendChild(text);
    li.onclick = function (e) {




      yunMap.scene.remove(yunMap.mall.floor);

      // 删除展示的文字
      let enlarge = document.getElementById('enlarge');
      enlarge.innerHTML = '';

      //清除商店的名称和图标
      yunMap.labelRenderer.clear();

      if (yunMap.mall.floorId > -1) {
        yunMap.scene.add(yunMap.mall.root);
        yunMap.mall.floorId = -1;
        yunMap.mall.floor = null;
        yunMap.camera.position.set(800, 1200, 1800);//设置相机位置
      }
    };
    floor.appendChild(li);

    for (let i = floors.length; i > 0; i--) {
      li = document.createElement('li');
      text = document.createTextNode(i +  "楼");
      li.appendChild(text);
      li.onclick = function () {
        yunMap.showFloorById(i - 1);
      };
      floor.appendChild(li);
    }
    return floor;
  },


// 检测当前浏览器是否支持3D
  webgl : ()=>{
    try {
      return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' );
    } catch( e ) {
      return false;
    }
  },


  enlarge(){
    let div = document.createElement( 'div' );
    div.className = 'enlarge';
    div.id = 'enlarge';
    document.body.appendChild(div);
  }




};
export default YunMap;
