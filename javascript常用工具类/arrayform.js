Class arrayForm {
  /**
    数组去重
  */
   removeDuplicate(arr) {
    return[...(new Set(arr.map(n => JSON.stringify(n))))].map(n => JSON.parse(n))
   }
}
