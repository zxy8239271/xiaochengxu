var HTTP_URL = 'https://cgb-api.27aichi.com';
module.exports = {
  loginUrl: HTTP_URL + '/wap/wxxcx/login',//登陆
  wxloginInitUrl: HTTP_URL + '/api/wxlogin/init',//登陆初始化
  getLoginInfoUrl: HTTP_URL + '/wap/wxxcx/getLoginInfo',//登录信息
  regionUrl: HTTP_URL + '/api/region/index',//省市县
  orderinfoUrl: HTTP_URL + '/wap/orderinfo/snum',//首页卖家订单状态及数量
  bullOrderUrl: HTTP_URL + '/wap/orderinfo/bnum',//首页买家订单状态及数量
  orderinfoListUrl: HTTP_URL + '/wap/orderinfo/index',//订单------订单列表
  orderDetailUrl: HTTP_URL + '/wap/orderinfo/info',//订单------订单列表详情  
  orderproductDetailUrl: HTTP_URL + '/wap/orderproduct/info',//订单------订单里某个产品里的详情  
  orderPrepareUrl: HTTP_URL + '/wap/orderinfo/prepare',//卖家---发货操作
  takingOrderUrl: HTTP_URL + '/wap/orderinfo/taking',//卖家---1整单接单，2整单拒单
  DisagreeUrl: HTTP_URL + '/wap/orderreturn/disagree',//卖家---拒绝退货
  rejectingUrl: HTTP_URL + '/wap/orderreturn/rejecting',//卖家---同意退货
  rejectedUrl: HTTP_URL + '/wap/orderreturn/rejected',//卖家--退货完成
  orderPartTakingUrl: HTTP_URL + '/wap/orderinfo/parttaking',//卖家---部分接單  
  orderAgainUrl: HTTP_URL + '/wap/orderinfo/openagain',//买家--在来一单
  orderApproveUrl: HTTP_URL + '/wap/orderinfo/confirm',//买家----订单审核操作
  orderCancelUrl: HTTP_URL + '/wap/orderinfo/cancel',//买家----订单取消操作
  orderReturnUrl: HTTP_URL + '/wap/orderreturn/index',//售后
  orderReceiveAllUrl: HTTP_URL + '/wap/orderinfo/receiveAll',//买家---确认收货
  orderReceiveSec: HTTP_URL + '/wap/orderinfo/receiveSec',//买家---逐个确认收货
  oneGoodsRejectUrl: HTTP_URL + '/wap/orderreturn/reject',//买家---退货
  orderreturnUrl: HTTP_URL + '/wap/orderreturn/info',//退货
  cancelReturnUrl: HTTP_URL+'/wap/orderreturn/cancelReturn',//买家--取消退货
  productinfoPlevelUrl: HTTP_URL + '/wap/productinfo/getPlevel',//去采购的左侧分类列表
  productinfoListUrl: HTTP_URL + '/wap/productinfo/index',//去采购的右侧列表
  shopCarAddUrl: HTTP_URL + '/wap/shopCar/add',//菜单--加入购物车
  shopCarListUrl: HTTP_URL + '/wap/shopcar/index',//购物车--列表
  shopCarDelUrl: HTTP_URL + '/wap/shopCar/del',//购物车--删除
  shopCarUpdateUrl: HTTP_URL + '/wap/shopcar/update',//购物车--数量的更新
  shopCarUpdateSupplierUrl: HTTP_URL + '/wap/shopcar/updateSupplier',//购物车供应商的更改
  productOfferUrl: HTTP_URL + '/wap/productoffer/index',//购物车--某个产品更改供应商产品报价
  createOrderUrl: HTTP_URL + '/wap/orderproduct/create',// 购物车---下单
  getAddressUrl: HTTP_URL +'/wap/orderinfo/getAddress',//下单地址的拉取
  productInfoUrl: HTTP_URL + '/wap/productinfo/info',//产品详情
  productAddUrl: HTTP_URL + '/wap/productinfo/add',//产品添加
  productAddOfferUrl: HTTP_URL + '/wap/productoffer/addSupplier',//添加供应商报价
  supplierListUrl: HTTP_URL + '/wap/supplier/index',//供应商----列表
  productofferDelUrl: HTTP_URL + '/wap/productoffer/del',//删除某个商品下的供应商
  supplierStopUrl: HTTP_URL + '/wap/supplier/stop',//供应商----暂停合作
  supplierInfoUrl: HTTP_URL + '/wap/supplier/info',//供应商----详情
  supplierDelUrl: HTTP_URL + '/wap/supplier/delete',//供应商----暂停合作
  changeSupplierUrl: HTTP_URL + '/wap/productoffer/defaultSupplier',//更换默认供应商  
  myHomeUrl: HTTP_URL + '/wap/my/index', //我的
  myStaffListsUrl: HTTP_URL + "/wap/staff/index", //我的----员工列表 
  myInformationUrl: HTTP_URL + "/wap/my/info", //我的----个人信息
  myStaffDetailUrl: HTTP_URL + "/wap/staff/info",  //我的----员工详情页
  myStaffDetailDelUrl: HTTP_URL + "/wap/staff/delete", //我的----员工详情页删除
  myStaffDetailStopUrl: HTTP_URL + "/wap/staff/stop", //我的----员工详情页设为离职
  myInformationSaveAddressUrl: HTTP_URL + "/wap/my/save", //我的----个人信息----保存地址
  myInformationChooseUnitUrl: HTTP_URL + "/wap/my/staff", //我的----我工作的单位
  myInformationChangeUnitUrl: HTTP_URL + "/wap/my/changeStaff", //我的----切换工作单位
  myInformationCreateShopUrl: HTTP_URL + "/wap/my/openStore", //我的----我工作的单位----创建一个店铺
  myInformationMyClientUrl: HTTP_URL + "/wap/supplier/list", //我的----我的客户
  myInformationMyClientDetailUrl: HTTP_URL + "/wap/supplier/storeInfo", //我的--客户详情
  myInformationMyClientDetailStopUrl: HTTP_URL + "/wap/supplier/stop", //我的--客户详情暂停合作与恢复合作
  myInformationMyClientDetailDelUrl: HTTP_URL + "/wap/supplier/del", //我的-客户详情删除
  aclsListUrl: HTTP_URL + '/wap/acls/index',//角色列表展示
  getAclsUrl: HTTP_URL + '/wap/acls/getAcls',//权限----获取员工所拥有权限列表
  serviceAclsUrl: HTTP_URL + '/wap/acls/serviceAcls',//权限---维护设置员工权限
  editAclsUrl: HTTP_URL +'/wap/acls/editAcls',//权限--编辑
  messageListUrl: HTTP_URL + '/wap/message/index',//消息列表
  getUnitUrl: HTTP_URL + "/api/unit/index",//商品详情----获取产品单位
  addGoodsUrl: HTTP_URL + "/wap/productinfo/add",  //商品详情----添加产品
  changeGoodsUrl: HTTP_URL + "/wap/productinfo/update",  //商品详情----修改产品
  delGoodsUrl: HTTP_URL + "/wap/productinfo/del",  //商品详情----删除商品
  goodsIsDownChange: HTTP_URL + "/wap/productinfo/setDown", //商品列表----产品上架和下架
  // myqrCodeUrl: HTTP_URL + '/wap/my/myqr',//我的邀请码
  myqrCodeUrl: HTTP_URL + '/wap/my/myXcxQr',
  messageListUrl: HTTP_URL + '/wap/message/index',//消息列表
  getUnitUrl: HTTP_URL + "/api/unit/index",//获取产品单位
  getShopDetail: HTTP_URL + "/wap/my/staffinfo", //获得店铺的详情
  inviteInfoUrl: HTTP_URL +'/wap/scan/inviteInfo',//邀请人信息
  doBindSupplierUrl: HTTP_URL + '/wap/scan/doBindSupplier',//邀请供应商
  doBindStaffUrl: HTTP_URL + '/wap/scan/doBindStaff',//要赢成为员工
  doBindShopUrl: HTTP_URL + '/wap/scan/doBindShop',//邀请成为客户
  sendCode: HTTP_URL + "/wap/passport/sendCode", //获取手机验证码
  checkCode: HTTP_URL + "/wap/passport/checkCode",//验证验证码
  myCompanyUrl: HTTP_URL + '/wap/staff/myCompany',//我的公司---邀请页
  openCompany: HTTP_URL + "/wap/my/openCompany", //创建一个店铺
  uploadImg: HTTP_URL + "/wap/my/imgUpload", //创建一个店铺----发送图片
  changeShopInfo: HTTP_URL + "/wap/my/saveCompany", //修改店铺信息
  userSaveUrl: HTTP_URL + '/wap/user/save',//用户信息补充
  messageReadUrl: HTTP_URL + '/wap/message/read',//修改消息状态
  supplierEndUrl: HTTP_URL + '/wap/supplier/end',//客户详情里的暂停合作/恢复合作


}