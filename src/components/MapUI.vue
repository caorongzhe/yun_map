<template>
  <div>
    <div class="menu-top">
      <div class="floors" :id="index._id" v-for="(index,id) in floors" :class="floor._id === index._id ? 'checked' : '' ">
        <div @click="cutFloors" :data="id" style="width: 70px;float: left;">&nbsp;&nbsp;{{index.name}}</div>
         <span @click="removeFloorName(index._id)">✕</span>
      </div>
      <div class="plus" @click="addFloor"><i class="iconfont icon-xinjiangongcheng" style="font-size: 25px;"></i></div>

      <div class="add" :class="floorShow">
        <div @click="addFloor" style="color:#000000;height: 35px;line-height:35px;font-size: 16px;text-align: right;padding-right: 12px;">
          ✕
        </div>
        <input type="text" value="" id="floorName" style="text-align: center;">
        <span>* 新建楼层第一步是需要画出建筑的轮廓图，方便渲染地板，默认是创建好，选中直接画就可以.</span>

        <div><button type="button" @click="addFloorName">保存楼层</button></div>
      </div>
    </div>

<!--    这是左边的编辑器-->
    <div class="menu-letf">
      <div class="button">
        <div class="icon tool-checked"  @click="toolFun" data="share" title="描绘地图"><i class="iconfont icon-huituguanlixinxi"></i></div>
        <div class="icon" @click="toolFun" data="weizhi" title="当前位置"><i class="iconfont icon-weizhi" style="font-size: 21px;"></i></div>
        <div class="icon" title="地基模型"><i class="iconfont icon-icon-test" style="font-size: 21px;"></i></div>
        <div style="border-bottom: solid 1px #B1B0B1;"></div>
        <div class="icon" @click="toolFun" data="floor" title="楼层地板"><i class="iconfont icon-dibandiaodinganzhuang" style="font-size: 23px;"></i></div>
        <div class="icon" @click="toolFun" data="shops" title="店铺列表"><i class="iconfont icon-louceng"></i></div>
        <div class="icon" @click="toolFun" data="public" title="公共区域"><i class="iconfont icon-gonggong" style="font-size: 18px;"></i></div>
        <div class="icon" @click="toolFun" data="path" title="路径绘制"><i class="iconfont icon-lujingfenxi" style="font-size: 22px;"></i></div>
        <div style="border-bottom: solid 1px #B1B0B1;"></div>
        <div class="icon"><i class="iconfont icon-tupian" style="font-size: 21px;"></i><input type="file" @change="getFile" data="map"></div>
        <div class="icon" title="回上一步"><i @click="mapObj.rollback()" class="iconfont icon-fanhui1" style="font-size: 21px;"></i></div>
        <div style="border-bottom: solid 1px #B1B0B1;"></div>
        <div class="icon" @click="clear" title="清空数据"><i class="iconfont icon-jinzhi1" style="font-size: 21px;"></i></div>
      </div>

<!--      商店-->
      <div class="shop" :class="shopShow">
        <div class="head">{{funName}}</div>
        <div style="margin-top: 30px">
          <div class="content" v-for="index in floor.shops" :id="index._id">
            <div @click="funShop($event,index)" style="float: left;width: 130px;">{{index.shopNo}} : {{index.name}}</div>
            <span><i class="iconfont icon-weibiaoti6" style="font-size: 12px;" @click="removeShop(index)"></i>
            </span>
          </div>
        </div>
      </div>

<!--      公用点-->
      <div class="shop" :class="publicShow">
        <div class="head">{{funName}}</div>
        <div style="margin-top: 30px">
          <div class="content" v-for="index in floor.public" :id="index._id">
            <div @click="funPublic($event,index)" style="float: left;width: 130px;">{{index.name}}</div>
            <span><i class="iconfont icon-weibiaoti6" style="font-size: 12px;" @click="removePublic(index)"></i></span>
          </div>
        </div>
      </div>

<!--      路径-->
      <div class="shop" :class="pathShow">
        <div class="head">{{funName}}</div>
        <div style="margin-top: 30px">
          <div class="content" v-for="index in floor.paths" :id="index._id">
            <div style="float: left;width: 130px;">{{index.name}}</div>
            <span><i class="iconfont icon-weibiaoti6" style="font-size: 12px;" @click="removePath(index)"></i></span>
          </div>
        </div>
      </div>
    </div>
    <div class="menu-right" :style="{right: rightShow + 'px'}">
      <div class="head">
        <span style="float: left;" @click="choiceProperty">
          <i class="iconfont icon-daohangnavigate4" v-if="rightShow > 0" style="font-size: 25px;"></i>
          <i class="iconfont icon-daohangnavigate5" v-else-if="rightShow < 0" style="font-size: 25px;"></i>
        </span>
        属性编辑</div>
      <div style="margin-top: 60px">
        <div class="property" v-if="!isPublic">
          <span>商店编号</span><input type="text" v-model="form.shopNo">
        </div>
        <div class="property">
          <span>商店名称</span><input type="text" v-model="form.name">
        </div>
        <div class="property">
          <span>英文名称</span><input type="text" v-model="form.name_us">
        </div>
        <div class="property">
          <span>商店商标</span><div class="file">上传商店商标<input type="file" data="icon" @change="getFile"></div>
        </div>
        <div class="property" v-if="!isPublic">
          <span>商店图片</span><div class="file">上传商店图片<input type="file" data="picture" @change="getFile"></div>
        </div>
        <div class="property">
          <span>点击展示</span>
          <div class="icon green" v-if="form.isShow">
            <i class="iconfont icon-kaiguan3" style="font-size: 28px;" @click="form.isShow = false"></i>
          </div>
          <div class="icon red" v-else>
            <i class="iconfont icon-kaiguan4" @click="form.isShow = true" style="font-size: 28px;"></i>
          </div>
        </div>
        <div class="property" v-if="!isPublic">
          <span>建筑类型</span>
          <select v-model="form.category" style="font-size: 14px;padding: 2px;">
            <option value="0">空铺</option>
            <option value="1">正常</option>
            <option value="2">推荐</option>
            <option value="3">屏蔽</option>
            <option value="-1">中空</option>
          </select>
        </div>
        <div class="property" v-if="!isPublic">
          <span>模块颜色</span>
          <div class="shopColor" @click="choiceColor" :style="color"></div>
          <div class="checked-color" :class="colorShow">
            <p @click="colorFun" :data="color" class="pp" v-for="(color,index) in colorBox" :style="{'background': color}">
              <b v-if="index === 0">餐</b>
              <b v-if="index === 1">娱</b>
              <b v-if="index === 2">体</b>
              <b v-if="index === 3">宝</b>
              <b v-if="index === 4">服</b>
              <b v-if="index === 5">鞋</b>
              <b v-if="index === 6">文</b>
              <b v-if="index === 7">计</b>
            </p>
          </div>
        </div>
        <div class="property" v-if="!isPublic">
          <span>商店选中</span>
          <div class="icon green" v-if="form.checked">
            <i class="iconfont icon-kaiguan3" style="font-size: 28px;" @click="form.checked = false"></i>
          </div>
          <div class="icon red" v-else>
            <i class="iconfont icon-kaiguan4" style="font-size: 28px;" @click="form.checked = true"></i>
          </div>
        </div>
        <div class="property" v-if="!isPublic">
          <span>商店介绍</span>
          <div style="float: right;margin-right: 18px;margin-top: -15px">
            <textarea rows="5" cols="22" style="resize: none;" v-model="form.remark"></textarea>
          </div>
        </div>
        <br /> <br />
        <div class="property" style="color: #a72525;font-size: 12px;padding-left: 15px;">
          * 地板不用填任何属性直接保存，一定要画地板。
        </div>

        <div class="property" style="text-align: center;">
          <button type="button" @click="editor" v-if="!isPublic">修改</button> &nbsp;&nbsp; <button type="button" @click="submit">增加</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import DataFactory from "../assets/js/DataFactory";
  import MapEditor from "../assets/js/MapEditor";
  export default {
      data() {
        return {
          mapObj : null,
          floors : [],
          floor : {
            "map" : "",
            "floor" : [],
            "public" : [],
            "shops" : [],
            "paths" : []
          },
          isEditor : false,   // 商店是否能编辑
          isPubEditor : false, // 公共区是否能编辑
          isFloor : false, // 添加地板
          isShop : false, // 添加商店
          isPublic : false,  // 添加公用点
          isPath : false,
          pathShow: 'hidden',
          shopShow: 'hidden',
          publicShow: 'hidden',
          funName: '',
          colorBox: ['#ffffff','#e9e7ef','#f0f0f4','#e9f1f6','#f0fcff','#e3f9fd','#d6ecf0','#fffbf0','#f2ecde','#fcefe8','#fff2df','#f3f9f1','#e0eee8','#e0f0e9','#c0ebd7','#bbcdc5','#c2ccd0','#bacac6','#808080','#75878a','#88ada6','#6b6882','#725e82','#3d3b4f','#392f41','#75664d','#5d513c','#665757','#493131','#312520','#161823','#000000','#eaff56','#fff143','#faff72','#ffa631','#ffa400','#fa8c35','#ff8c31','#ff8936','#ff7500','#ffb61e','#ffc773','#ffc64b','#f2be45','#f0c239','#e9bb1d','#d9b611','#eacd76','#eedeb0','#d3b17d','#e29c45','#a78e44','#c89b40','#ae7000','#ca6924','#b25d25','#b35c44','#9b4400','#9c5333','#a88462','#896c39','#827100','#6e511e','#7c4b00','#955539','#845a33','#bce672','#c9dd22','#bddd22','#afdd22','#a3d900','#9ed900','#9ed048','#96ce54','#00bc12','#0eb83a','#0eb83a','#0aa344','#16a951','#21a675','#057748','#0c8918','#00e500','#40de5a','#00e079','#00e09e','#3de1ad','#2add9c','#2edfa3','#7fecad','#a4e2c6','#7bcfa6','#1bd1a5','#48c0a3','#549688','#789262','#758a99','#50616d','#424c50','#41555d','#ff461f','#ff2d51','#f36838','#ed5736','#ff4777','#f00056','#ffb3a7','#f47983','#db5a6b','#c93756','#f9906f','#f05654','#ff2121','#f20c00','#8c4356','#c83c23','#9d2933','#ff4c00','#ff4e20','#f35336','#dc3023','#ff3300','#cb3a56','#a98175','#b36d61','#ef7a82','#ff0097','#c32136','#be002f','#c91f37','#bf242a','#c3272b','#9d2933','#60281e','#622a1d','#70f3ff','#44cef6','#3eede7','#1685a9','#177cb0','#065279','#003472','#4b5cc4','#a1afc9','#2e4e7e','#3b2e7e','#4a4266','#426666','#425066','#574266','#8d4bbb','#815463','#815476','#4c221b','#003371','#56004f','#801dae','#4c8dae','#b0a4e3','#cca4e3','#edd1d8','#e4c6d0'],
          color: 'background: #000000;',
          colorShow: 'hidden',
          rightShow: '1',
          floorShow: 'hidden',
          form : {
            "_id" : -1,
            "shopNo" : "",
            "name" : "",
            "name_us" : "",
            "icon" : "",
            "picture" : "",
            "isShow" : true,
            "category" : 1,
            "color" : "",
            "checked" : true,
            "remark" : "",
            "outline" : []
          }
        };
      },
      methods: {
        cutFloors(e){
          let es = document.getElementsByClassName('floors');
          for (let i = 0; i < es.length ; i++) {
            es[i].className = es[i].className.replace('checked', '');
          }
          let data = e.target.getAttribute('data');
          document.getElementById(data).className += ' checked';
          let json = DataFactory.getLocalStorage('building');
          let floors = json.data.storey;

          for (let j = 0; j < floors.length; j++) {
            if (floors[j]._id == data){
              this.floor = this.floors[j];
            }
          }

          // 渲染画的线
          this.drawing();

          // 编辑数据还原
          DataFactory.putLocalStorage('xy',[]);

          // 加载背景图片
          let size = window.innerWidth * 0.7;
          let i = 'background-image: url(' +  this.floor.map + ');background-size: ' + size + 'px;';
          document.body.setAttribute('style',i);
        },
        addFloor(){
          if (this.floorShow === ''){
            this.floorShow = 'hidden';
          } else {
            this.floorShow = '';
          }
        },
        toolFun(e){
          // 还原所有的设置
          this.pathShow = 'hidden';
          this. shopShow = 'hidden';
          this. publicShow = 'hidden';
          this.isFloor = false;
          this.isShop = false;
          this.isPath = false;
          this.isPublic = false;
          this.isEditor = false;
          this.mapObj.isPublic = false;

          // 工具选择
          this.shopshow = 'hidden';
          let icons = document.getElementsByClassName('icon');
          for (let i = 0; i < icons.length ; i++) {
            let icon = icons[i];
            icon.className =icon.className.replace('tool-checked', '');
          }
          e.currentTarget.className += ' tool-checked';
          let data = e.currentTarget.getAttribute('data');
          if ('share' === data) {
            //描绘地图
            console.log("描绘地图");
          }else if('floor' === data){
            this.isFloor = true;
            let floor = this.floor.floor;
          }else if('shops' === data){
            this.shopShow = 'show';
            this.isShop = true;
            this.funName = '店铺列表';
            console.log(this.funName);
          }else if('public' === data){
            this.publicShow = 'show';
            this.isPublic = true;
            this.mapObj.isPublic = true;
            this.funName = '公共区域';
            console.log(this.funName);
          }else if('path' === data){
            this.pathShow = 'show';
            this.funName = '路径列表';
            this.isPath = true;

            //路径绘制
            console.log("路径绘制");
          }else if('weizhi' === data){
            //当前位置
            console.log("当前位置");
          }
        },
        choiceColor(){
          if(this.colorShow === ''){
            this.colorShow = 'hidden';
          }else {
            this.colorShow = '';
          }
        },
        choiceProperty(){
          if (this.rightShow > 0){
            this.rightShow = -255;
          } else {
            this.rightShow = 1;
          }
        },
        colorFun(e){
          this.color = e.currentTarget.getAttribute('style');
          this.form.color = e.currentTarget.getAttribute('data');
          this.colorShow = 'hidden';
        },
        addFloorName(){
          let json = DataFactory.getLocalStorage('building');
          let floors = json.data.storey;

          // 新建一个楼层信息
          let floor = {
            "_id" : floors.length > 0 ? (floors[floors.length - 1]._id + 1 ) : 0 ,
            "name" : document.getElementById('floorName').value,
            "tier" : floors.length > 0 ? (floors[floors.length - 1]._id + 2 ) : 1,
            "map" : "",
            "floor" : [],
            "public" : [],
            "shops" : [],
            "paths" : []
          };
          this.floor = floor;
          this.floors = floors;
          floors.push(floor);
          DataFactory.putLocalStorage('building',json);
          this.addFloor();
          document.getElementById('floorName').value = '';

          // 渲染画的线
          this.drawing();
          // 编辑数据还原
          DataFactory.putLocalStorage('xy',[]);

          // 加载背景图片
          let size = window.innerWidth * 0.7;
          let i = 'background-image: url(' +  this.floor.map + ');background-size: ' + size + 'px;';
          document.body.setAttribute('style',i);





        },
        removeFloorName(id){
          let json = DataFactory.getLocalStorage('building');
          let floors = json.data.storey;
          for (let i = 0; i < floors.length; i++) {
            if (floors[i]._id === id) {
              floors.splice(i,1);
            }
          }
          this.floors = floors;

          if (floors.length > 0){
            this.floor = floors[floors.length - 1];
          }else {
            // 当删除所有楼层的时候，重置一下数据。
            this.floor = { "map" : "", "floor" : [],"public" : [],"shops" : [], "paths" : []}
          }

          // 渲染画的线
          this.drawing();
          DataFactory.putLocalStorage('building',json);
          // 编辑数据还原
          DataFactory.putLocalStorage('xy',[]);

          // 加载背景图片
          let size = window.innerWidth * 0.7;
          let i = 'background-image: url(' +  this.floor.map + ');background-size: ' + size + 'px;';
          document.body.setAttribute('style',i);
        },

        // 商铺处理
        funShop(t,obj){
          let divs = document.getElementsByClassName('content');
          for (let i = 0; i < divs.length; i++) {
            divs[i].style.background = '';
          }
          this.isEditor = true;
          this.form = JSON.parse(JSON.stringify(obj));
          document.getElementById(obj._id).style.background = '#7fecad'
        },

        removeShop(obj){
          let txt = '确定要删除“' + obj.name + '”吗？';
          if (confirm(txt)) {
            for (let i = 0; i < this.floor.shops.length; i++) {
              if (this.floor.shops[i]._id === obj._id) {
                this.floor.shops.splice(i,1);
              }
            }
            this.save();
          }
        },
        // 公用部分处理
        funPublic(t,obj){
          let txt = '确定要删除“' + obj.name + '”吗？';
          if (confirm(txt)) {
            for (let i = 0; i < this.floor.public.length; i++) {
              if (this.floor.public[i]._id === obj._id) {
                this.floor.public.splice(i,1);
              }
            }
            this.save();
          }
        },
        removePublic(obj){
          let txt = '确定要删除“' + obj.name + '”吗？';
          if (confirm(txt)) {
            for (let i = 0; i < this.floor.public.length; i++) {
              if (this.floor.public[i]._id === obj._id) {
                this.floor.public.splice(i,1);
              }
            }
            this.save();
          }
        },
        removePath(obj){
          let txt = '确定要删除“' + obj.name + '”吗？';
          if (confirm(txt)) {
            for (let i = 0; i < this.floor.paths.length; i++) {
              if (this.floor.paths[i]._id === obj._id) {
                this.floor.paths.splice(i,1);
              }
            }
            this.save();
          }
        },


        submit(){
          if (this.isFloor) {
            this.floor.floor = DataFactory.getLocalStorage('xy');
            this.save();
          }
          if (this.isShop) {
            this.form._id = this.floor.shops.length > 0 ? this.floor.shops[this.floor.shops.length - 1]._id + 1 : 0 ;
            this.form.outline = DataFactory.getLocalStorage('xy');
            this.floor.shops.push(JSON.parse(JSON.stringify(this.form)));
            this.save();
          }
          if (this.isPublic) {
            let o = {
              "_id" : this.floor.public.length ? this.floor.public[this.floor.public.length - 1]._id + 1 : 0,
              "name" : this.form.name,
              "name_us" : this.form.name_us,
              "icon" : this.form.icon,
              "coord" : DataFactory.getLocalStorage('xy').length > 0 ? DataFactory.getLocalStorage('xy')[0] : [],
              "isShow" :  this.form.isShow
            };
            this.floor.public.push(JSON.parse(JSON.stringify(o)));
            this.save();
          }

          if (this.isPath ){
            let path = {
              "_id" : this.floor.paths.length ? this.floor.paths[this.floor.paths.length - 1]._id + 1 : 0,
              "name" : this.form.name,
              "name_us" : this.form.name_us,
              "outline" : DataFactory.getLocalStorage('xy'),
              "isShow" :  this.form.isShow
            };
            this.floor.paths.push(JSON.parse(JSON.stringify(path)));
            this.save();
          }

          this.form = { "_id" : -1,"shopNo" : "","name" : "","name_us" : "","icon" : "","picture" : "",
                    "isShow" : true, "category" : 1,"color" : "", "checked" : true,"remark" : "","outline" : []
          }
        },

          // 编辑
        editor(){
          if (this.isEditor){
            for (let i = 0; i < this.floor.shops.length; i++) {
              if (this.floor.shops[i]._id === this.form._id){
                this.floor.shops[i] = this.form;
              }
            }
            this.save();
          }

          this.isEditor = false;
          let divs = document.getElementsByClassName('content');
          for (let i = 0; i < divs.length; i++) {
            divs[i].style.background = '';
          }
          this.form = { "_id" : -1,"shopNo" : "","name" : "","name_us" : "","icon" : "","picture" : "",
            "isShow" : true, "category" : 1,"color" : "", "checked" : true,"remark" : "","outline" : []
          }
        },
          // 获取图片
        getFile (e) {
          let _this = this;
          let files = e.target.files[0];
          // 看支持不支持FileReader
          if (!e || !window.FileReader) return ;
          let reader = new FileReader();
          // 格式转换
          reader.readAsDataURL(files); // 这里是最关键的一步，转换就在这里
          reader.onloadend = function () {
            let type = e.target.getAttribute('data');
            let result = this.result;

            if ('map' === type){
              _this.floor.map = result;
              let size = window.innerWidth * 0.7;
              let i = 'background-image: url(' +  this.result + ');background-size: ' + size + 'px;';
              document.body.setAttribute('style',i);
              _this.save();
            } else if ('icon' === type){
              _this.form.icon = result;
            } else if ('picture' === type){
              _this.form.picture = result;
            }
          }
        },
        // 渲染画好的图形

        // todo 渲染没做好，应该分开，用一个总的对象包裹小的对象，在编辑里面循环吧，  公共部分没有渲染

        drawing(){
          this.mapObj.refreshModel(this.floor);
        },
        // 随时保存指定楼层信息数据，更新全部楼层数据
        save(){
          let json = DataFactory.getLocalStorage('building');
          let floors = json.data.storey;

          // 以地板为整个建筑的模型吧
          json.data.outline = this.floor.floor;

          for (let i = 0; i < floors.length; i++) {
            if (floors[i]._id === this.floor._id) {
              floors[i] = JSON.parse(JSON.stringify(this.floor));
            }
          }
          DataFactory.putLocalStorage('building',json);
          DataFactory.putLocalStorage('xy',[]);
          this.floors = floors;
          this.drawing();
          this.mapObj.restore();
        },
        clear(){
          DataFactory.removeLocalStorage('building');
          DataFactory.putLocalStorage('xy',[]);
          this.create();
        },

        create(){
          // 初始化地图
          let building = {
            "data" : {
              "name" : "故宫博物院",
              "address" : "北京市东城区景山前街4号",
              "remark" : "",
              "outline": [],
              "storey": []
            }
          };
          DataFactory.putLocalStorage('xy',[]);
          if (DataFactory.getLocalStorage('building') === null || DataFactory.getLocalStorage('building') === '') {
            DataFactory.putLocalStorage('building',building);
            this.floors = [];
          }else {
            this.floors = DataFactory.getLocalStorage('building').data.storey;
            let floor = this.floors[this.floors.length - 1];
            if (floor !== undefined) {
              this.floor = floor;
              let size = window.innerWidth * 0.7;
              let i = 'background-image: url(' +  this.floor.map + ');background-size: ' + size + 'px;';
              document.body.setAttribute('style',i);
              this.drawing();
            }
          }
        },
        mapEditor(dom){
          //todo 把模型加载写在了子类，为了方便调用生成画的模型
          this.mapObj = new MapEditor(dom);
          this.create();
        }
      },
      mounted () {



      }
    }
</script>

<style scoped>
  .menu-top{
    position: fixed;
    left: 0;
    top: 0;
    height: 32px;
    font-size: 12px;
    width: 100%;
    z-index: 99;
    color: white;
    text-align: center;
    background: #E2E2E3;
    /*border-bottom: solid 1px #B1B0B1;*/
  }
  .menu-top .add{
    position: fixed;
    left: 27%;
    top: 30%;
    height: 320px;
    background: #fff;
    width: 600px;
  }

  .menu-top .add input{
    font-size: 25px;
    width: 180px;
    border: none;
    outline: none;
    border-bottom: solid 1px;
    margin-top: 50px;
  }

  .menu-top .add span{
    color: red;
    padding: 50px;
    font-size: 14px;
  }

  .menu-top .add  button{
    background-color: #4CAF50; /* Green */
    border: none;
    color: white;
    padding: 10px 25px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
  }

  .menu-top .floors{
    min-width: 90px;
    height: 25px;
    line-height: 25px;
    border: solid 1px #B1B0B1;
    background: #E2E2E3;
    border-radius: 5px;
    float: left;
    margin-left: 5px;
    margin-top: 2px;
    color: #000;
  }

  .menu-top span{
    float: right;
    margin-right: 10px;
  }

  .menu-top .plus{
    float: right;
    height: 25px;
    line-height: 25px;
    color: #0aa344;
    border-radius: 5px;
    margin-right: 5px;
    margin-top: 3px;
    width: 30px;
    font-size: 25px;
  }

  .checked{
    background: #53514F !important;
    color: #fff !important;
  }

  .menu-letf{
    position: fixed;
    left: 0;
    top: 10%;
    height: 700px;
    font-size: 12px;
    min-width: 50px;
    z-index: 999;
    color: white;
    text-align: center;
  }

  .menu-letf .button{
    color: #000;
    height: 100%;
    width: 35px;
    background: #53514F;
    float: left;
  }

  .menu-letf .button .icon{
    width: 25px;
    height: 25px;
    color: white;
    padding: 1px;
    margin-left: 3px;
    line-height: 26px;
    border-radius: 10%;
    margin-bottom: 15px;
    margin-top: 15px;
  }

  .tool-checked{
    color: black !important;
    background: white !important;
  }

  .menu-letf .shop{
    color: black;
    float: left;
    background: #EFEBE9;
    width: 162px;
    height: 100%;
    margin-left: 1px;
    overflow-x:auto;
    border: solid 1px #B1B0B1;
  }

  .shop::-webkit-scrollbar {
    display: none;/*隐藏滚动条*/
  }


  .menu-letf .shop .head{
    height: 30px;
    width: 162px;
    background: #D4D2D0;
    line-height: 30px;
    border-bottom: solid 1px #B1B0B1;
    position:fixed;
  }

  .menu-letf .shop .content{
    font-size: 14px;
    height: 40px;
    width: 100%;
    background: #fff;
    line-height: 40px;
    margin: 2px 0 2px 0;
  }

  .menu-letf .shop .content span{
    float: right;
    padding-right: 15px;
  }

  .menu-right{
    position: fixed;
    top: 10%;
    background-color: white;
    height: 700px;
    width: 280px;
    z-index: 999;
    border: solid 1px #B1B0B1;
    font-size: 14px;
  }

  .menu-right .head{
    height: 30px;
    width: 280px;
    background: #D4D2D0;
    line-height: 30px;
    border-bottom: solid 1px #B1B0B1;
    position:fixed;
    text-align: center;
  }

  .menu-right input{
    width: 180px;
    border: none;
    outline: none;
    border-bottom: solid 1px;
  }

  .menu-right .property{
    margin: 25px 0;
  }

  .menu-right .property span{
    padding-left: 20px;
    padding-right: 10px;
  }

  .menu-right .property .icon{
    float: right;
    padding-right: 150px;
  }

  .menu-right .property .shopColor{
    padding: 10px;
    float: right;
    margin-right: 150px;
    border-radius: 5px;
  }

  .menu-right .property .pp{
    padding: 10px;
    float: left;
    margin: 5px;
    border-radius: 5px;
  }

  .checked-color{
    position:fixed;
    padding: 10px;
    background-color: #ffffff;
    top: 380px;
    width: 360px;
    right: 180px;
    border: solid 2px #B1B0B1;
    border-radius: 5px;
  }




  .red{
    color: #a72525;
  }
  .green{
    color: green;
  }







  .icon input{
    position: fixed;
    font-size: 10px;
    left: 0;
    opacity: 0;
    filter: alpha(opacity=0);
    cursor: pointer;
    width: 35px;
  }

  .file {
    padding: 4px 10px;
    height: 15px;
    line-height: 15px;
    position: relative;
    cursor: pointer;
    color: #888;
    background: #fafafa;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
    display: inline-block;
    float: right;
    margin-right: 80px;
  }
  .file input {
    position: absolute;
    font-size: 10px;
    right: 0;
    top: 0;
    opacity: 0;
    filter: alpha(opacity=0);
    cursor: pointer
  }
  .file:hover {
    color: #444;
    background: #eee;
    border-color: #ccc;
    text-decoration: none
  }





</style>
