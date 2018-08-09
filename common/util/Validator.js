// 表单验证

// 校验规则
let strategies = {
  isNonEmpty: function (value, errorMsg) { // 空验证
    if ( value == '' ) {
      return errorMsg
    }
  },
  minLength: function (value, length, errorMsg) { // 最小长度验证
    if ( value.length < length ) {
      return errorMsg
    }
  },
  maxLength: function (value, length, errorMsg) { // 最大长度验证
    if ( value.length > length ) {
      return errorMsg
    }
  },
  isMobile: function (value, errorMsg) {
    if ( !/^(13|14|15|17|18)[0-9]{9}$/.test(value) ) { // 手机号验证
      return errorMsg
    }
  },
  isPostCode: function (value, errorMsg) {
    if ( !/^[0-9][0-9]{5}$/.test(value) ) { // 邮编验证
      return errorMsg
    }
  }
}

// Validator
let Validator = function () {
  this.cache = [] // 保存校验规则；
}

Validator.prototype.add = function (value, rule, errorMsg) {
  let ary = rule.split( ':' )
  this.cache.push(function() {
    let strategy = ary.shift()
    ary.unshift( value )
    ary.push( errorMsg )
    return strategies[strategy].apply( value, ary )
  })
}

Validator.prototype.start = function () {
  for (let i = 0, validatorFunc; validatorFunc = this.cache[i++];) {
    let msg = validatorFunc()
    if (msg) {
      return msg
    }
  }
}

export {
  Validator
}
