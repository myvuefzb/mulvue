let mixin ={
  filters:{
    replaceIdNumStar(value){
      let reg=/(?<=[\d]{6})\d(?=[\dXx]{4})/g;
      if(value){
        return value.replace(reg,'*');
      }else{
        return value;
      }
    }
  }
};
export default mixin;
