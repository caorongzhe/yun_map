const Theme = {
  /** 默认的3d主题 */
  getDefault3dTheme : ()=>{
    return {
      name: "test", //在主题名称
      background: "#F2F2F2", // 背景色

      //建筑风格
      building: {
        color: "#000000",
        opacity: 0.1,
        transparent: true,
        depthTest: false
      },

      //地板风格
      floor: {
        color: "#E0E0E0",
        opacity: 1,
        transparent: false
      },

      //选中的房间风格
      selected: "#ffff55",

      // 房间的风格
      room: function (type, category) {
        var roomStyle;
        if(!category) {
          switch (type) {
            case 100: //hollow. u needn't change this color. because i will make a hole on the model in the final version.
              return {
                color: "#F2F2F2",
                opacity: 0.8,
                transparent: true
              }
            case 300: //禁止区域
              return {
                color: "#AAAAAA",
                opacity: 0.7,
                transparent: true
              };
            case 400: //空荡荡的商店
              return {
                color: "#D3D3D3",
                opacity: 0.7,
                transparent: true
              };
            default :
              break;
          }
        }

        switch(category) {
          case 101: //食物
            roomStyle = {
              color: "#1f77b4",
              opacity: 0.7,
              transparent: true
            };
            break;
          case 102: //零售
            roomStyle = {
              color: "#aec7e8",
              opacity: 0.7,
              transparent: true
            };
            break;
          case 103: //化妆品
            roomStyle = {
              color: "#ffbb78",
              opacity: 0.7,
              transparent: true
            };
            break;
          case 104: //主从关系
            roomStyle = {
              color: "#98df8a",
              opacity: 0.7,
              transparent: true
            };
            break;
          case 105: //生活服务
            roomStyle = {
              color: "#bcbd22",
              opacity: 0.7,
              transparent: true
            };
            break;
          case 106: //教育
            return {
              color: "#2ca02c",
              opacity: 0.7,
              transparent: true
            };
            break;
          case 107: //生活方式
            roomStyle = {
              color: "#dbdb8d",
              opacity: 0.7,
              transparent: true
            };
            break;
          case 108: //娱乐
            roomStyle = {
              color: "#EE8A31",
              opacity: 0.7,
              transparent: true
            };
            break;
          case 109: //其他的
            roomStyle = {
              color: "#8c564b",
              opacity: 0.7,
              transparent: true
            };
          default :
            roomStyle = {
              color: "#c49c94",
              opacity: 0.7,
              transparent: true
            };
            break;
        }
        return roomStyle;
      },

      //房间电线的风格
      strokeStyle: {
        color: "#5C4433",
        opacity: 0.5,
        transparent: true,
        linewidth: 2
      },

      fontStyle:{
        color: "#231815",
        fontsize: 40,
        fontface: "Helvetica, MicrosoftYaHei "
      },

      pubPointImg: {
        "11001": '../img/toilet.png',
        "11002": '../img/ATM.png',
        "21001": '../img/stair.png',
        "22006": '../img/entry.png',
        "21002": '../img/escalator.png',
        "21003": '../img/lift.png'
      }
    }
  },

  /** 默认的2d主题 */
  getDefault2dTheme : ()=>{
    return {
      name: "test", //主题名称
      background: "#F2F2F2", //背景颜色

      //建筑材料
      building: {
        color: "#000000",
        opacity: 0.1,
        transparent: true,
        depthTest: false
      },

      //地板上的风格
      floor: {
        color: "#E0E0E0",
        opacity: 1,
        transparent: false
      },

      //选择房间的风格
      selected: "#ffff55",

      //房间的风格
      room: function (type, category) {
        var roomStyle;
        if(!category) {
          switch (type) {

            case 100: //hollow. u needn't change this color. because i will make a hole on the model in the final version.
              return {
                color: "#F2F2F2",
                opacity: 0.8,
                transparent: true
              }
            case 300: //禁止区域
              return {
                color: "#AAAAAA",
                opacity: 0.7,
                transparent: true
              };
            case 400: //空房间
              return {
                color: "#D3D3D3",
                opacity: 0.7,
                transparent: true
              };
            default :
              break;
          }
        }

        switch(category) {
          case 101: //食物
            roomStyle = {
              color: "#1f77b4",
              opacity: 0.7,
              transparent: true
            };
            break;
          case 102: //零售
            roomStyle = {
              color: "#aec7e8",
              opacity: 0.7,
              transparent: true
            };
            break;
          case 103: //化妆品
            roomStyle = {
              color: "#ffbb78",
              opacity: 0.7,
              transparent: true
            };
            break;
          case 104: //父子关系
            roomStyle = {
              color: "#98df8a",
              opacity: 0.7,
              transparent: true
            };
            break;
          case 105: //生活服务
            roomStyle = {
              color: "#bcbd22",
              opacity: 0.7,
              transparent: true
            };
            break;
          case 106: //教育
            return {
              color: "#2ca02c",
              opacity: 0.7,
              transparent: true
            };
            break;
          case 107: //生活方式
            roomStyle = {
              color: "#dbdb8d",
              opacity: 0.7,
              transparent: true
            };
            break;
          case 108: //娱乐
            roomStyle = {
              color: "#EE8A31",
              opacity: 0.7,
              transparent: true
            };
            break;
          case 109: //其他
            roomStyle = {
              color: "#8c564b",
              opacity: 0.7,
              transparent: true
            };
          default :
            roomStyle = {
              color: "#c49c94",
              opacity: 0.7,
              transparent: true
            };
            break;
        }
        return roomStyle;
      },

      //房间线的风格
      strokeStyle: {
        color: "#666666",
        opacity: 0.5,
        transparent: true,
        linewidth: 1
      },

      fontStyle:{
        opacity: 1,
        textAlign: "center",
        textBaseline: "middle",
        color: "#333333",
        fontsize: 13,
        fontface: "'Lantinghei SC', 'Microsoft YaHei', 'Hiragino Sans GB', 'Helvetica Neue', Helvetica, STHeiTi, Arial, sans-serif  "
      },

      pubPointImg: {
        "11001": System.imgPath+"/toilet.png",
        "11002": System.imgPath+"/ATM.png",
        "21001": System.imgPath+"/stair.png",
        "22006": System.imgPath+"/entry.png",
        "21002": System.imgPath+"/escalator.png",
        "21003": System.imgPath+"/lift.png"
      }
    }
  }

};

export default Theme
