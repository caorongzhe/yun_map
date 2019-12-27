/**
 * 3D地图类
 * @author cao
 * @date 2019/8/26 22:54
 */

import * as THREE from "three";
import OrbitControls from 'three-orbitcontrols'
// import {post,get,patch,put} from "../axiostool.js"
import Mall from './Mall'
import {CSS2DObject, CSS2DRenderer} from "./CSS2DObject";

import data from '../data/xxx.json'
import DataFactory from "./DataFactory";


export default class {
  constructor (dom) {
    this.canvasWidth = dom.clientWidth;
    this.canvasHeight = dom.clientHeight;
    this.dom = dom;
    this.is3d = true;
    this.showNames = false;
    this.mall = null;
    let _this = this;
    this.selected = null;

    // TODO dom的监听好像有问题 选中事件颜色发生改变
    window.addEventListener('touchstart', function (event) {
      _this.getIntersects(event);
    }, { passive: false });

    // 选中事件颜色发生改变
    window.addEventListener('click', function (event) {
      _this.getIntersects(event);
    }, false);

    /** 创建场景 */
    this.scene = new THREE.Scene();

    //坐标轴辅助
    //this.scene.add(new THREE.AxesHelper(100));

    //创建相机
    this.camera = new THREE.PerspectiveCamera(60, this.canvasWidth / this.canvasHeight, 0.1, 8000);
    this.camera.lookAt(new THREE.Vector3(0,0,0));//让相机指向原点
    this.camera.position.set(800, 1200, 1800);//设置相机位置

    //渲染器，开启抗锯齿
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setClearColor(0xFFFFFF, 1.0);
    this.renderer.setSize(this.canvasWidth, this.canvasHeight);

    // 标签用
    this.labelRenderer = new CSS2DRenderer();
    //TODO 不知道为什么这里会多出边框，以后用css处理
    this.labelRenderer.setSize(this.canvasWidth * 0.999999, this.canvasHeight);
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = 0;
    // 设置id，方便清空标签
    this.labelRenderer.domElement.id = 'removed' ;

    //轨道控制，把相机放到控制器
    this.controls = new OrbitControls(this.camera, this.labelRenderer.domElement);
    this.controls.target = new THREE.Vector3(0, 0, 0);//控制焦点
    this.controls.autoRotate = false;//将自动旋转关闭
    this.controls.maxPolarAngle = Math.PI/2.5; //  Float 垂直旋转，范围0~Math.PI 默认Math.PI
    this.controls.minPolarAngle = 0; // Float 垂直旋转，范围0~Math.PI 默认0
    this.controls.panSpeed = 0.5; // float 移动的速度，默认1
    this.controls.rotateSpeed  = 0.5; //Float 旋转速度(ORBIT的旋转速度，鼠标左键)，默认1
    //设置相机距离原点的最远距离
    this.controls.minDistance = 800;
    //设置相机距离原点的最远距离
    this.controls.maxDistance = 3000;

    this.clock = new THREE.Clock();//用于更新轨道控制器

    //灯光设置，光色和位置，并添加到场景里面 添加了两个灯光，一个在里面一个在外面
    let light_one = new THREE.DirectionalLight(0xffffff);
    light_one.position.set(-500, 500, -500);
    this.scene.add(light_one);

    let light_two = new THREE.DirectionalLight(0xffffff);
    light_two.position.set(500, 500, 500);
    this.scene.add(light_two);

    // 追加生成的canvas元素到容器元素中
    let canvas = this.renderer.domElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    dom.style.overflow = "hidden";

    let labelCanvas = this.labelRenderer.domElement;
    this.dom.appendChild(canvas);
    this.dom.appendChild(labelCanvas);

    // 刷新加载屏幕内容
    this.animate();
  };


  getIntersects(event) {
    event.preventDefault();
    // 声明 raycaster 和 mouse 变量
    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();

    // 通过鼠标点击位置,计算出 raycaster 所需点的位置,以屏幕为中心点,范围 -1 到 1
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    if (!mouse.x) {
      // 触摸屏幕的获取方式
      mouse.x = (event.touches[ 0 ].pageX /  window.innerWidth) * 2 -1;
      mouse.y = -(event.touches[ 0 ].pageY / window.innerHeight) *2 +1;
    }

    //通过鼠标点击的位置(二维坐标)和当前相机的矩阵计算出射线位置
    raycaster.setFromCamera(mouse, this.camera);

    // 获取与射线相交的对象数组，其中的元素按照距离排序，越近的越靠前
    let intersects = raycaster.intersectObjects(this.scene.children,true);

    if (intersects.length > 0) {
      let selectObject = intersects[0].object;
      this.changeMaterial(selectObject);
    }


    if (intersects.length > 0 && this.mall.floorId > -1) {

      let x = intersects[0].uv.x;
      let y = intersects[0].uv.y;

      console.log('鼠标点击坐标',x,y);
      //this.mall.testXY(x,y);
      this.mall.finding(x,y);

    }



  }

  // 改变对象材质属性
  changeMaterial(object) {
    if ( !object.isSelected || this.selected === object) {
      return ;
    }

    // 保存原来的颜色数据
    object.natureData = {color: object.material.color, transparent: true, opacity: 0.7};

    // 重新设置材质
    let material = new THREE.MeshLambertMaterial({
      color: 0xffcc00,
      transparent: true,
      opacity: 0.7
    });

    if (this.selected != null){
      this.selected.material = new THREE.MeshLambertMaterial(this.selected.natureData);
    }
    // 设置选中的数据
    this.selected = object;
    object.material = material;
  }


/** FPS */
  animate(){
    this.controls.update(this.clock.getDelta())
    requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene,this.camera);

    if (this.mall != null && this.mall.navigation.length > 0){
      this.mall.scrollPath();
    }

    let m = Math.pow(this.camera.position.x,2) + Math.pow(this.camera.position.z,2);
    let x = Math.ceil(Math.sqrt(m));
    let n = Math.pow(x,2) + Math.pow(this.camera.position.y,2);
    let xyz = Math.ceil(Math.sqrt(n));

    if (this.mall !== null && this.mall.floor !== null && (this.mall.Refresh === 0 || xyz*2 !== this.mall.Refresh)){
      if (xyz*2 < this.mall.Refresh){
        this.mall.Refresh = 0;
      }

      let d  =  document.getElementsByClassName("label");
      this.mall.Refresh += xyz;
      for (let i = 0; i < d.length; i++) {
        let dom = d[i];
        let m = dom.getAttribute('data');
        dom.className = 'label hidden';
        if (xyz <= 650){
          dom.className = 'label show';
        }
        if (xyz > 650 && xyz < 850 && m > 1500){
          dom.className = 'label show';
        }
        if (xyz >= 850 && xyz < 900 && m > 1800 ){
          dom.className = 'label show';
        }
        if (xyz >= 900 && xyz < 1000 && m > 2000){
          dom.className = 'label show';
        }
        if (xyz >= 1000 && xyz < 1500 && m >= 2500){
          dom.className = 'label show';
        }
        if (xyz >= 1000 && xyz < 2500 && m >= 20000){
          dom.className = 'label show';
        }
      }
    }

    if (this.showNames){
      this.renderer.clear();
      this.renderer.render(this.scene,this.camera);
      this.camera.position.set(500, 700, 1000);//设置相机位置
      this.showNames = false;
    }

    this.labelRenderer.render( this.scene,this.camera );
  };

  load(url,mold,theme,callback){


    //从缓存中获取数据
    /*let json = DataFactory.getLocalStorage('building');
    if (json === undefined || json.data.outline.length === 0){
      // 从文件读取JSON数据
      json = data;
    }*/

    let json = data;

        // 楼层模型
    this.mall = new Mall();
    this.mall.is3d = this.is3d;

    // 解析模型
    this.mall.parseModel(json,mold,theme);

    this.scene.add(this.mall.root);
    // 用回调，等加载完毕后在创建界面的按钮
    callback(this);


    // 调用接口
    // get(url).then((res)=>{
    //   let json = res.data;
    //
    //   console.log(json)
    //
    //   // 楼层模型
    //   this.mall = new Mall();
    //   this.mall.is3d = this.is3d;
    //
    //   // 解析模型
    //   this.mall.parseModel(json,mold,theme);
    //
    //   this.scene.add(this.mall.root);
    //   // 用回调，等加载完毕后在创建界面的按钮
    //   callback(this);
    // });
  };

  /** 显示指定楼层 */
  showFloorById(floorId){
    this.showNames = true;
    if (this.mall.floor === null) {
      this.scene.remove(this.mall.root);
    } else {
      this.scene.remove(this.mall.floor);
    }
    this.mall.showNames = true;
    this.mall.floorId = floorId;
    this.mall.floor = this.mall.createFloor(floorId);
    this.mall.floor.position.y = 0;
    this.scene.add(this.mall.floor);
    // 清空标签
    this.labelRenderer.clear();
  };






















  /** 测试用的模型 */


  test(){








    //创建一个平面
    let planeGeo = new THREE.PlaneGeometry(200,200,10,10);//创建平面
    let planeMat = new THREE.MeshLambertMaterial({  //创建材料
      color:0xff888888,
      wireframe:false
    });
    let planeMesh = new THREE.Mesh(planeGeo, planeMat);//创建网格模型
    planeMesh.position.set(0, 0, -20);//设置平面的坐标
    planeMesh.rotation.x = -0.5 * Math.PI;//将平面绕X轴逆时针旋转90度
    //将平面添加到场景中
    this.scene.add(planeMesh)


    //创建一个立方体
    let cubeGeo = new THREE.CubeGeometry(20, 20, 20, 5, 5, 5);//创建立方体
    let cubeMat = new THREE.MeshLambertMaterial({//创建材料
      color:0x003300,
      wireframe:false
    });
    let cubeMesh = new THREE.Mesh(cubeGeo, cubeMat);//创建立方体网格模型
    cubeMesh.position.set(20, 10, 0);//设置立方体的坐标
    this.scene.add(cubeMesh);//将立方体添加到场景中

    //创建一个球
    let sphereGeo = new THREE.SphereGeometry(16, 40, 40);//创建球体
    let sphereMat = new THREE.MeshLambertMaterial({//创建材料
      color:0x0000FF,
      wireframe:false
    });
    let sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);//创建球体网格模型
    sphereMesh.position.set(-25, 16, 0);//设置球的坐标
    this.scene.add(sphereMesh);//将球体添加到场景







    //创建圆柱体
    let cylinderGeo = new THREE.CylinderGeometry(15, 15 ,40 ,40 ,40);
    let cylinderMat = new THREE.MeshLambertMaterial({//创建材料
      color:0xFF6600,
      wireframe:false
    });
    //创建圆柱体网格模型
    let cylinderMesh = new THREE.Mesh(cylinderGeo, cylinderMat);
    cylinderMesh.position.set(0, 20, -40);//设置圆柱坐标
    this.scene.add(cylinderMesh);//向场景添加圆柱体



    let moonDiv = document.createElement( 'div' );
    moonDiv.className = 'label';
    moonDiv.textContent = 'Moon';

    let moonLabel = new CSS2DObject( moonDiv );
    moonLabel.position.set( 0, 0.27, 0 );
    cylinderMesh.add( moonLabel );





  };

}
