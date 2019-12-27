import * as THREE from "three";
import DataFactory from "./DataFactory";


// TODO 公共部分没有显示BUG ， 需要画出整个建筑的轮廓， 做建筑模型


export default class {
  constructor(dom) {
    this.canvasWidth = dom.clientWidth;
    this.canvasHeight = dom.clientHeight;
    // 产生的点，如果为空，则认为新的线
    this.shapePoints = [];
    this.line = new THREE.Object3D();
    this.line._name = 'compile';
    // 公共点的球面积大一点
    this.isPublic = false;

    let _this = this;

    dom.addEventListener('click', function (event) {
      let mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 1800 - 900;
      mouse.y = -(event.clientY / window.innerHeight) * 1800 + 900 - 0.01;
      mouse.x *= ((window.innerWidth / window.innerHeight) - 0.01);
      _this.createPoint( mouse.x,mouse.y);

  }, false);
    /** 创建场景 */
    this.scene = new THREE.Scene();

    //坐标轴辅助
    //this.scene.add(new THREE.AxesHelper(100));

    //创建相机
    this.camera = new THREE.PerspectiveCamera(60, this.canvasWidth / this.canvasHeight, 0.1, 8000);
    this.camera.lookAt(new THREE.Vector3(0,0,0));//让相机指向原点
    this.camera.position.z = 1550;
    this.scene.add(this.camera);

    //灯光设置，光色和位置，并添加到场景里面 添加了两个灯光，一个在里面一个在外面
    let light = new THREE.AmbientLight(0xffffff);
    this.scene.add(light);

    //渲染器，开启抗锯齿
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setClearAlpha(0.1);
    // this.renderer.setClearColor(0xFFFACD, 1.0);
    this.renderer.setSize(this.canvasWidth, this.canvasHeight);

    dom.appendChild(this.renderer.domElement);
    this.render ();
  }

  render (){
    //不停帧循环调用
    requestAnimationFrame(this.render.bind(this))
    // 场景和相机放进渲染器
    this.renderer.render(this.scene,this.camera)
  };

  /** 每次都通过鼠标添加一个点 */
  createPoint(x,y){
    let xy = DataFactory.getLocalStorage('xy');

    if (xy.length === 0){
      this.shapePoints = [];
      this.line = new THREE.Object3D();
      this.line._name = 'compile';
    }
    xy.push([x,y]);

    let point = new THREE.Vector2(x, y);
    if (this.shapePoints.length > 0){
      let lastPoint = this.shapePoints[this.shapePoints.length - 1];
      //没有重复就添加到数组
      if (point.x !== lastPoint.x || point.y !== lastPoint.y){
        this.shapePoints.push(point);
      }
    } else {
      this.shapePoints.push(point);
    }
    let pointsGeometry = new THREE.Geometry().setFromPoints(this.shapePoints);
    // 线条
    let config = {
        color: "#fd0028",
        opacity: 5,
        transparent: true,
        linewidth: 1
      };
    let line = new THREE.Line(pointsGeometry, new THREE.LineBasicMaterial(config));
    line.position.set(0, 0, 0.5);
    this.mark(x,y,line);
    this.line.add(line);
    this.scene.add(this.line);
    DataFactory.putLocalStorage('xy',xy);
  }

  // 加点模型
  mark(x,y,line){
    //创建一个球
    let sphereGeo;
    if (this.isPublic){
      sphereGeo = new THREE.SphereGeometry(10, 10, 0);//创建公共点球体
    }else {
      sphereGeo = new THREE.SphereGeometry(4, 4, 0);//创建球体
    }

    let sphereMat = new THREE.MeshLambertMaterial({//创建材料
      color:0xFF7F24,
      wireframe:false
    });
    let sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);//创建球体网格模型
    sphereMesh.position.set(x, y, 0);//设置球的坐标
    line.add(sphereMesh);
  };

  // 重新刷新模型
  refreshModel(floor){
    this.sceneClear();
    let obj = new THREE.Object3D();
    obj._name = 'drawing';

    //渲染地板
    if (floor.floor.length > 0){
      let line = this.creatModel(floor.floor);
      obj.add(line);
    }

    //渲染商店
    if (floor.shops.length > 0){
      for (let i = 0; i < floor.shops.length; i++) {
        let line = this.creatModel(floor.shops[i].outline);
        obj.add(line);
      }
    }

    //渲染路径
    if (floor.paths.length > 0){
      for (let i = 0; i < floor.paths.length; i++) {
        let path = floor.paths[i];
        let line = this.creatModel(path.outline);
        for (let j = 0; j < path.outline.length ; j++) {
          this.mark(path.outline[j][0],path.outline[j][1],line);
        }
        obj.add(line);
      }
    }

    //渲染公共点
    if (floor.public.length > 0){
      for (let i = 0; i < floor.public.length; i++) {

        if (floor.public[i].coord.length === 0 ){
          return;
        }

        let sphereGeo = new THREE.SphereGeometry(10, 10, 0);//创建公共点球体
        let sphereMat = new THREE.MeshLambertMaterial({//创建材料
          color:0x3d3b4f,
          wireframe:false
        });
        let sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);//创建球体网格模型
        sphereMesh.position.set(floor.public[i].coord[0], floor.public[i].coord[1], 0);//设置球的坐标
        obj.add(sphereMesh);
      }
    }
    this.scene.add(obj);
  };

  // 创建绘画的模型
  creatModel(xy){
    let points = [];
    //处理向量
    for (let j = 0; j < xy.length; j++) {
      let point = new THREE.Vector2(xy[j][0], xy[j][1]);
      points.push(point);
    }
    let pointsGeometry = new THREE.Geometry().setFromPoints(points);
    // 线条
    let config = {
      color: "#161823",
      opacity: 5,
      transparent: true,
      linewidth: 1
    };
    // 生成线
    let line = new THREE.Line(pointsGeometry, new THREE.LineBasicMaterial(config));
    line.position.set(0, 0, 0.5);
    return line;
  }

  /** 删除原来的模型*/
  sceneClear(){
    for (let i = 2; i < this.scene.children.length;) {
      if (this.scene.children[i]._name === 'drawing' || this.scene.children[i]._name === 'compile'){
        this.scene.remove(this.scene.children[i]);
      }
    }
  };

  // 回退
  rollback(){
    for (let i = 2; i < this.scene.children.length; i++) {
      if (this.scene.children[i]._name === 'compile'){
        let lines = this.scene.children[i].children;
        lines.splice(lines.length - 1,1);
        let xy = DataFactory.getLocalStorage('xy');
        xy.splice(xy.length - 1,1);
        this.shapePoints.splice(this.shapePoints.length - 1,1);
        DataFactory.putLocalStorage('xy',xy);
      }
    }
  };

  restore(){
    for (let i = 2; i < this.scene.children.length; i++) {
      if (this.scene.children[i]._name === 'compile') {
        let lines = this.scene.children[i].children;
        lines.splice(0,lines.length);
        let xy = DataFactory.getLocalStorage('xy');
        xy.splice(0,xy.length);
        this.shapePoints.splice(0,this.shapePoints.length);
        DataFactory.putLocalStorage('xy',xy);
      }
    }
  };








}
