# yun-map 这是一个室内三维地图展示项目

## 

项目分为两个部分：

​	1、编辑地图，

​	2、三维地图展示



```
 安装依赖 npm install
```



```
 启动服务 npm run serve
```



```
 打包部署 npm run build
```


实时预览编辑出来的地图需要修改：YunMap3d.js

```
引入了 import data from '../data/xxx.json' 去掉
```

修改： load 函数
```
放开下面代码
  //从缓存中获取数据
  /*let json = DataFactory.getLocalStorage('building');
  if (json === undefined || json.data.outline.length === 0){
    // 从文件读取JSON数据
    json = data;
  }*/
```

```
注释掉：let json = data;
```



