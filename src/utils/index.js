/* eslint-disable */
import {isFunction, isArray, isObject, isPlainObject, each} from './lang';

/**
 * 获取url上的参数
 * @example: http://xxx.com/a.do?productCode=P001
 * @Result:  C.getParameter('productCode')  // 'P001'
 * @param  {String} param 参数名称
 * @return {String}       返回参数值
 */
export function getParameter(param) {
    var reg = new RegExp('[&,?,&amp;]' + param + '=([^\\&]*)', 'i');
    var hrefStr = location.search;
    hrefStr = decodeURIComponent(decodeURIComponent(hrefStr));
    var value = reg.exec(hrefStr);
    return value ? value[1] : '';
};

/**
 * 获取URL参数对象
 * @param  {String} [queryString] url地址
 * @return {Object}
 */
export function getQueryMap(queryString) {
    var paramObj = {};
    var paramList;
    var oneQueryMatch;
    /*eslint-disable*/
    var regGlobal = /[\?\&][^\?\&]+=[^\?\&#]+/g;
    var regOne = /[\?\&]([^=\?]+)=([^\?\&#]+)/;
    /*eslint-enable*/
    queryString = queryString || location.href;
    paramList = queryString.match(regGlobal);

    if (!paramList) {
        return paramObj;
    }

    for (var i = 0, len = paramList.length; i < len; i++) {
        oneQueryMatch = paramList[i].match(regOne);
        if (oneQueryMatch === null) {
            continue;
        }
        paramObj[oneQueryMatch[1]] = decodeURIComponent(decodeURIComponent(oneQueryMatch[2]));
    }

    return paramObj;
};

/**
 * 将Object对象拼接到URL参数中
 * @param  {String} url  url地址
 * @param  {Object} data 数据对象
 * @return {String} 新的url
 */
export function urlParam(url, data) {
    if (data) {
        data = params(data);
        if (url.indexOf('?') > -1) {
            url += '&' + data;
        } else if (Object.keys(data).length > 0) {
            url += '?' + data;
        }
    }
    if (url && url.indexOf('?') > -1) {
        var param = [];
        var urlHost = url.split('?')[0];
        var urlData = getQueryMap(url);
        for (var key in urlData) {
            var tmp = '';
            try {
                tmp = decodeURIComponent(urlData[key]);
            } catch (e) {
                tmp = urlData[key];
            }
            param.push(key + '=' + encodeURIComponent(tmp));
        }
        url = urlHost + '?' + param.join('&');
    }
    return url.replace(/(%2F)/ig, '/');
};

function params (obj) {
    var params = [];
    var escape = encodeURIComponent;

    params.add = function(key, value) {
        if (isFunction(value)) {
            value = value();
        }

        if (value === null) {
            value = '';
        }

        this.push(escape(key) + '=' + escape(value));
    };

    serialize(params, obj);

    return params.join('&').replace(/%20/g, '+');
};

function serialize(params, obj, scope) {
    var array = isArray(obj);
    var plain = isPlainObject(obj);
    var hash;

    each(obj, (value, key) => {
        hash = isObject(value) || isArray(value);

        if (scope) {
            key = scope + '[' + (plain || hash ? key : '') + ']';
        }

        if (!scope && array) {
            params.add(value.name, value.value);
        } else if (hash) {
            serialize(params, value, key);
        } else {
            params.add(key, value);
        }
    });
}

/**
 * deparam
 * @see {@link https://github.com/AceMetrix/jquery-deparam|jquery-deparam}
 * @param {String} params
 * @param {Boolean} [coerce] 是否转义值
 * @param {Boolean} [urlDecode] 是否对值进行解码
 * @returns {Object}
 */
export function deparam(params, coerce, urlDecode) {
    let obj = {};
    let coerceTypes = { 'true': !0, 'false': !1, 'null': null };

    // Iterate over all name=value pairs.
    params.replace(/\+/g, ' ').split('&').forEach(function(v) {
        let param = v.split('=');
        let key = decodeURIComponent(param[0]);
        let val;
        let cur = obj;
        let i = 0;

        // If key is more complex than 'foo', like 'a[]' or 'a[b][c]', split it
        // into its component parts.
        let keys = key.split('][');
        let keysLast = keys.length - 1;

        // If the first keys part contains [ and the last ends with ], then []
        // are correctly balanced.
        if (/\[/.test(keys[0]) && /]$/.test(keys[ keysLast ])) {
            // Remove the trailing ] from the last keys part.
            keys[ keysLast ] = keys[ keysLast ].replace(/]$/, '');

            // Split first keys part into two parts on the [ and add them back onto
            // the beginning of the keys array.
            keys = keys.shift().split('[').concat(keys);

            keysLast = keys.length - 1;
        } else {
            // Basic 'foo' style key.
            keysLast = 0;
        }

        // Are we dealing with a name=value pair, or just a name?
        if (param.length === 2) {
            val = urlDecode ? decodeURIComponent(param[1]) : param[1];

            // Coerce values.
            if (coerce) {
                val = val && !isNaN(val) && ((+val + '') === val) ? +val        // number
                    : val === 'undefined' ? undefined         // undefined
                        : coerceTypes[val] !== undefined ? coerceTypes[val] // true, false, null
                            : val;                                                          // string
            }

            if (keysLast) {
                // Complex key, build deep object structure based on a few rules:
                // * The 'cur' pointer starts at the object top-level.
                // * [] = array push (n is set to array length), [n] = array if n is
                //   numeric, otherwise object.
                // * If at the last keys part, set the value.
                // * For each keys part, if the current level is undefined create an
                //   object or array based on the type of the next keys part.
                // * Move the 'cur' pointer to the next level.
                // * Rinse & repeat.
                for (; i <= keysLast; i++) {
                    key = keys[i] === '' ? cur.length : keys[i];
                    cur = cur[key] = i < keysLast
                        ? cur[key] || (keys[i + 1] && isNaN(keys[i + 1]) ? {} : [])
                        : val;
                }
            } else {
                // Simple key, even simpler rules, since only scalars and shallow
                // arrays are allowed.

                if (Object.prototype.toString.call(obj[key]) === '[object Array]') {
                    // val is already an array, so push on the next value.
                    obj[key].push(val);
                } else if ({}.hasOwnProperty.call(obj, key)) {
                    // val isn't an array, but since a second value has been specified,
                    // convert val into an array.
                    obj[key] = [ obj[key], val ];
                } else {
                    // val is a scalar.
                    obj[key] = val;
                }
            }
        } else if (key) {
            // No value was defined, so set something meaningful.
            obj[key] = coerce
                ? undefined
                : '';
        }
    });

    return obj;
}

export function getUserRole(){
  let userInfo = JSON.parse(localStorage.getItem('getUserInfo'))
  /* 如果用户信息不存在，则是游客 */
  if (!userInfo || !userInfo.roleCode) {
    return 'visitor'
  }
  let role = ''
  /* 根据用户信息，设置用户角色 */
  switch (userInfo.roleCode) {
    case 1:
      role = 'boss'
      break
    case 2:
      role = 'storeManager'
      break
    case 4:
      role = 'salesman'
      break
    default:
      role = 'visitor'
      break
  }
  return role
}

/* 内容格式化 */
export function inputMask (content, mask) {
  let value = content
  var result = [] // 分组结果数组
  /* 数组分组方法，每四个分为一组，递归调用 */
  function aryGrouping () {
    if (value.length > mask) {
      result.push(value.substr(0, mask))
      value = value.slice(mask)
      aryGrouping(value.slice(mask))
    } else {
      result.push(value)
      return false
    }
  }
  aryGrouping()
  return result.join(' ')
}
