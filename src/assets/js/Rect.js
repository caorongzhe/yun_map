/**
 * 获取边界矩形
 *               ↑
 *               | maxX
 *               |
 *               |        · br
 *               |
 *               |
 *               |             maxY
 *---------------------------------→
 * minX          |
 *               |
 *               |
 *     · tl      |
 *               |
 *               | minY
 * @author CAO
 * @date 2019/8/25 0:21
 */

export default class {

  /** 获取点的边界矩形 */
  constructor (minX,minY,maxX,maxY) {
    this.tl = [minX || 0, minY || 0];
    this.br = [maxX || 0, maxY || 0];
  };

  /** 判断数据是否存在异常 */
  isCollide(rect){
    return !(rect.br[0] < this.tl[0] || rect.tl[0] > this.br[0] ||
      rect.br[1] < this.tl[1] || rect.tl[1] > this.br[1]);
  };

  /** 得到边界矩形 */
  getBoundingRect(points){

    // 存在一个点，就不需要进行处理了
    if (points.length > 2) {
      let minX = 9999999;
      let minY = 9999999;
      let maxX = -9999999;
      let maxY = -9999999;

      //找到坐标中两个最边缘的点
      for (let i = 0; i < points.length - 1; i ++) {

        if (points[i][0] > maxX) {
          maxX = points[i][0];
        }
        if (points[i][0] < minX) {
          minX = points[i][0];
        }
        if (points[i][1]> maxY) {
          maxY = points[i][1];
        }
        if (points[i][1] < minY) {
          minY = points[i][1];
        }
        this.tl = [minX, minY];
        this.br = [maxX, maxY];
      }
    }
  };











}
