import {
  __export,
  __publicField
} from "./chunk-7U33LM2Z.js";

// ../../../../../../Users/youren/Desktop/Project/Braving_Aotai_Trail/node_modules/wot-design-uni/components/wd-toast/index.ts
import { inject, provide, ref } from "vue";

// ../../../../../../Users/youren/Desktop/Project/Braving_Aotai_Trail/node_modules/wot-design-uni/components/common/util.ts
var util_exports = {};
__export(util_exports, {
  addUnit: () => addUnit,
  buildUrlWithParams: () => buildUrlWithParams,
  camelCase: () => camelCase,
  checkNumRange: () => checkNumRange,
  checkPixelRange: () => checkPixelRange,
  closest: () => closest,
  context: () => context,
  debounce: () => debounce,
  deepAssign: () => deepAssign,
  deepClone: () => deepClone,
  deepMerge: () => deepMerge,
  defaultDisplayFormat: () => defaultDisplayFormat,
  defaultFunction: () => defaultFunction,
  easingFn: () => easingFn,
  getPropByPath: () => getPropByPath,
  getRect: () => getRect,
  getType: () => getType,
  gradient: () => gradient,
  hasFields: () => hasFields,
  hexToRgb: () => hexToRgb,
  isArray: () => isArray,
  isBase64Image: () => isBase64Image,
  isBoolean: () => isBoolean,
  isDate: () => isDate,
  isDef: () => isDef,
  isEmptyObj: () => isEmptyObj,
  isEqual: () => isEqual,
  isFunction: () => isFunction,
  isH5: () => isH5,
  isImageUrl: () => isImageUrl,
  isNotUndefined: () => isNotUndefined,
  isNumber: () => isNumber,
  isObj: () => isObj,
  isOdd: () => isOdd,
  isPromise: () => isPromise,
  isString: () => isString,
  isUndefined: () => isUndefined,
  isVideoUrl: () => isVideoUrl,
  kebabCase: () => kebabCase,
  objToStyle: () => objToStyle,
  omitBy: () => omitBy,
  padZero: () => padZero,
  pause: () => pause,
  range: () => range,
  requestAnimationFrame: () => requestAnimationFrame2,
  rgbToHex: () => rgbToHex,
  throttle: () => throttle,
  uuid: () => uuid
});

// ../../../../../../Users/youren/Desktop/Project/Braving_Aotai_Trail/node_modules/wot-design-uni/components/common/AbortablePromise.ts
var AbortablePromise = class {
  constructor(executor) {
    __publicField(this, "promise");
    __publicField(this, "_reject", null);
    this.promise = new Promise((resolve, reject) => {
      executor(resolve, reject);
      this._reject = reject;
    });
  }
  // 提供abort方法来中止Promise
  abort(error) {
    if (this._reject) {
      this._reject(error);
    }
  }
  then(onfulfilled, onrejected) {
    return this.promise.then(onfulfilled, onrejected);
  }
  catch(onrejected) {
    return this.promise.catch(onrejected);
  }
};

// ../../../../../../Users/youren/Desktop/Project/Braving_Aotai_Trail/node_modules/wot-design-uni/components/common/util.ts
function uuid() {
  return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
}
function s4() {
  return Math.floor((1 + Math.random()) * 65536).toString(16).substring(1);
}
function addUnit(num) {
  return Number.isNaN(Number(num)) ? `${num}` : `${num}px`;
}
function isObj(value) {
  return Object.prototype.toString.call(value) === "[object Object]" || typeof value === "object";
}
function getType(target) {
  const typeStr = Object.prototype.toString.call(target);
  const match = typeStr.match(/\[object (\w+)\]/);
  const type = match && match.length ? match[1].toLowerCase() : "";
  return type;
}
var defaultDisplayFormat = function(items, kv) {
  const labelKey = (kv == null ? void 0 : kv.labelKey) || "value";
  if (Array.isArray(items)) {
    return items.map((item) => item[labelKey]).join(", ");
  } else {
    return items[labelKey];
  }
};
var defaultFunction = (value) => value;
var isDef = (value) => value !== void 0 && value !== null;
var checkNumRange = (num, label = "value") => {
  if (num < 0) {
    throw new Error(`${label} shouldn't be less than zero`);
  }
};
var checkPixelRange = (num, label = "value") => {
  if (num <= 0) {
    throw new Error(`${label} should be greater than zero`);
  }
};
function rgbToHex(r, g, b) {
  const hex = (r << 16 | g << 8 | b).toString(16);
  const paddedHex = "#" + "0".repeat(Math.max(0, 6 - hex.length)) + hex;
  return paddedHex;
}
function hexToRgb(hex) {
  const rgb = [];
  for (let i = 1; i < 7; i += 2) {
    rgb.push(parseInt("0x" + hex.slice(i, i + 2), 16));
  }
  return rgb;
}
var gradient = (startColor, endColor, step = 2) => {
  const sColor = hexToRgb(startColor);
  const eColor = hexToRgb(endColor);
  const rStep = (eColor[0] - sColor[0]) / step;
  const gStep = (eColor[1] - sColor[1]) / step;
  const bStep = (eColor[2] - sColor[2]) / step;
  const gradientColorArr = [];
  for (let i = 0; i < step; i++) {
    gradientColorArr.push(
      rgbToHex(parseInt(String(rStep * i + sColor[0])), parseInt(String(gStep * i + sColor[1])), parseInt(String(bStep * i + sColor[2])))
    );
  }
  return gradientColorArr;
};
var range = (num, min, max) => {
  return Math.min(Math.max(num, min), max);
};
var isEqual = (value1, value2) => {
  if (value1 === value2) {
    return true;
  }
  if (!Array.isArray(value1) || !Array.isArray(value2)) {
    return false;
  }
  if (value1.length !== value2.length) {
    return false;
  }
  for (let i = 0; i < value1.length; ++i) {
    if (value1[i] !== value2[i]) {
      return false;
    }
  }
  return true;
};
var padZero = (number, length = 2) => {
  let numStr = number.toString();
  while (numStr.length < length) {
    numStr = "0" + numStr;
  }
  return numStr;
};
var context = {
  id: 1e3
};
function getRect(selector, all, scope, useFields) {
  return new Promise((resolve, reject) => {
    let query = null;
    if (scope) {
      query = uni.createSelectorQuery().in(scope);
    } else {
      query = uni.createSelectorQuery();
    }
    const method = all ? "selectAll" : "select";
    const callback = (rect) => {
      if (all && isArray(rect) && rect.length > 0) {
        resolve(rect);
      } else if (!all && rect) {
        resolve(rect);
      } else {
        reject(new Error("No nodes found"));
      }
    };
    if (useFields) {
      query[method](selector).fields({ size: true, node: true }, callback).exec();
    } else {
      query[method](selector).boundingClientRect(callback).exec();
    }
  });
}
function kebabCase(word) {
  const newWord = word.replace(/[A-Z]/g, function(match) {
    return "-" + match;
  }).toLowerCase();
  return newWord;
}
function camelCase(word) {
  return word.replace(/-(\w)/g, (_, c) => c.toUpperCase());
}
function isArray(value) {
  if (typeof Array.isArray === "function") {
    return Array.isArray(value);
  }
  return Object.prototype.toString.call(value) === "[object Array]";
}
function isFunction(value) {
  return getType(value) === "function" || getType(value) === "asyncfunction";
}
function isString(value) {
  return getType(value) === "string";
}
function isNumber(value) {
  return getType(value) === "number";
}
function isPromise(value) {
  if (isObj(value) && isDef(value)) {
    return isFunction(value.then) && isFunction(value.catch);
  }
  return false;
}
function isBoolean(value) {
  return typeof value === "boolean";
}
function isUndefined(value) {
  return typeof value === "undefined";
}
function isNotUndefined(value) {
  return !isUndefined(value);
}
function isOdd(value) {
  if (typeof value !== "number") {
    throw new Error("输入必须为数字");
  }
  return value % 2 === 1;
}
function isBase64Image(url) {
  return /^data:image\/(png|jpg|jpeg|gif|bmp);base64,/.test(url);
}
function objToStyle(styles) {
  if (isArray(styles)) {
    const result = styles.filter(function(item) {
      return item != null && item !== "";
    }).map(function(item) {
      return objToStyle(item);
    }).join(";");
    return result ? result.endsWith(";") ? result : result + ";" : "";
  }
  if (isString(styles)) {
    return styles ? styles.endsWith(";") ? styles : styles + ";" : "";
  }
  if (isObj(styles)) {
    const result = Object.keys(styles).filter(function(key) {
      return styles[key] != null && styles[key] !== "";
    }).map(function(key) {
      return [kebabCase(key), styles[key]].join(":");
    }).join(";");
    return result ? result.endsWith(";") ? result : result + ";" : "";
  }
  return "";
}
function hasFields(obj) {
  if (!isObj(obj) || obj === null) {
    return false;
  }
  return Object.keys(obj).length > 0;
}
function isEmptyObj(obj) {
  return !hasFields(obj);
}
var requestAnimationFrame2 = (cb = () => {
}) => {
  return new AbortablePromise((resolve) => {
    const timer2 = setInterval(() => {
      clearInterval(timer2);
      resolve(true);
      cb();
    }, 1e3 / 30);
  });
};
var pause = (ms = 1e3 / 30) => {
  return new AbortablePromise((resolve) => {
    const timer2 = setTimeout(() => {
      clearTimeout(timer2);
      resolve(true);
    }, ms);
  });
};
function deepClone(obj, cache = /* @__PURE__ */ new Map()) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (isDate(obj)) {
    return new Date(obj.getTime());
  }
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }
  if (obj instanceof Error) {
    const errorCopy = new Error(obj.message);
    errorCopy.stack = obj.stack;
    return errorCopy;
  }
  if (cache.has(obj)) {
    return cache.get(obj);
  }
  const copy = Array.isArray(obj) ? [] : {};
  cache.set(obj, copy);
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      copy[key] = deepClone(obj[key], cache);
    }
  }
  return copy;
}
function deepMerge(target, source) {
  target = deepClone(target);
  if (typeof target !== "object" || typeof source !== "object") {
    throw new Error("Both target and source must be objects.");
  }
  for (const prop in source) {
    if (!source.hasOwnProperty(prop))
      continue;
    target[prop] = source[prop];
  }
  return target;
}
function deepAssign(target, source) {
  Object.keys(source).forEach((key) => {
    const targetValue = target[key];
    const newObjValue = source[key];
    if (isObj(targetValue) && isObj(newObjValue)) {
      deepAssign(targetValue, newObjValue);
    } else {
      target[key] = newObjValue;
    }
  });
  return target;
}
function buildUrlWithParams(baseUrl, params) {
  const queryString = Object.entries(params).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join("&");
  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}${queryString}`;
}
function debounce(func, wait, options = {}) {
  let timeoutId = null;
  let lastArgs;
  let lastThis;
  let result;
  const leading = isDef(options.leading) ? options.leading : false;
  const trailing = isDef(options.trailing) ? options.trailing : true;
  function invokeFunc() {
    if (lastArgs !== void 0) {
      result = func.apply(lastThis, lastArgs);
      lastArgs = void 0;
    }
  }
  function startTimer() {
    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (trailing) {
        invokeFunc();
      }
    }, wait);
  }
  function cancelTimer() {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  }
  function debounced(...args) {
    lastArgs = args;
    lastThis = this;
    if (timeoutId === null) {
      if (leading) {
        invokeFunc();
      }
      startTimer();
    } else if (trailing) {
      cancelTimer();
      startTimer();
    }
    return result;
  }
  return debounced;
}
function throttle(func, wait) {
  let timeout = null;
  let previous = 0;
  const throttled = function(...args) {
    const now = Date.now();
    const remaining = wait - (now - previous);
    if (remaining <= 0) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(this, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;
        func.apply(this, args);
      }, remaining);
    }
  };
  return throttled;
}
var getPropByPath = (obj, path) => {
  const keys = path.split(".");
  try {
    return keys.reduce((acc, key) => acc !== void 0 && acc !== null ? acc[key] : void 0, obj);
  } catch (error) {
    return void 0;
  }
};
var isDate = (val) => Object.prototype.toString.call(val) === "[object Date]" && !Number.isNaN(val.getTime());
function isVideoUrl(url) {
  const videoRegex = /\.(ogm|webm|ogv|asx|m4v|mp4|mpg|mpeg|dat|asf|avi|rm|rmvb|mov|wmv|flv|mkv|video)(?=$|[?#])/i;
  return videoRegex.test(url);
}
function isImageUrl(url) {
  const imageRegex = /\.(xbm|tif|pjp|apng|svgz|jpeg|jpg|heif|ico|tiff|heic|pjpeg|avif|gif|png|svg|webp|jfif|bmp|dpg|image)(?=$|[?#])/i;
  return imageRegex.test(url);
}
var isH5 = (() => {
  let isH52 = false;
  isH52 = true;
  return isH52;
})();
function omitBy(obj, predicate) {
  const newObj = deepClone(obj);
  Object.keys(newObj).forEach((key) => predicate(newObj[key], key) && delete newObj[key]);
  return newObj;
}
function easingFn(t = 0, b = 0, c = 0, d = 0) {
  return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
}
function closest(arr, target) {
  return arr.reduce((prev, curr) => Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev);
}

// ../../../../../../Users/youren/Desktop/Project/Braving_Aotai_Trail/node_modules/wot-design-uni/components/wd-toast/index.ts
var toastDefaultOptionKey = "__TOAST_OPTION__";
var defaultOptions = {
  duration: 2e3,
  show: false
};
var None = Symbol("None");
function useToast(selector = "") {
  const toastOptionKey = getToastOptionKey(selector);
  const toastOption = inject(toastOptionKey, ref(None));
  if (toastOption.value === None) {
    toastOption.value = defaultOptions;
    provide(toastOptionKey, toastOption);
  }
  let timer2 = null;
  const createMethod = (toastOptions) => {
    return (options) => {
      return show(deepMerge(toastOptions, typeof options === "string" ? { msg: options } : options));
    };
  };
  const show = (option) => {
    const options = deepMerge(defaultOptions, typeof option === "string" ? { msg: option } : option);
    toastOption.value = deepMerge(options, {
      show: true
    });
    timer2 && clearTimeout(timer2);
    if (toastOption.value.duration && toastOption.value.duration > 0) {
      timer2 = setTimeout(() => {
        timer2 && clearTimeout(timer2);
        close();
      }, options.duration);
    }
  };
  const loading = createMethod({
    iconName: "loading",
    duration: 0,
    cover: true
  });
  const success = createMethod({
    iconName: "success",
    duration: 1500
  });
  const error = createMethod({ iconName: "error" });
  const warning = createMethod({ iconName: "warning" });
  const info = createMethod({ iconName: "info" });
  const close = () => {
    toastOption.value = { show: false };
  };
  return {
    show,
    loading,
    success,
    error,
    warning,
    info,
    close
  };
}
var getToastOptionKey = (selector) => {
  return selector ? `${toastDefaultOptionKey}${selector}` : toastDefaultOptionKey;
};

// ../../../../../../Users/youren/Desktop/Project/Braving_Aotai_Trail/node_modules/wot-design-uni/components/wd-message-box/index.ts
import { inject as inject2, provide as provide2, ref as ref2 } from "vue";
var messageDefaultOptionKey = "__MESSAGE_OPTION__";
var None2 = Symbol("None");
var defaultOptions2 = {
  title: "",
  showCancelButton: false,
  show: false,
  closeOnClickModal: true,
  msg: "",
  type: "alert",
  inputType: "text",
  inputValue: "",
  showErr: false,
  zIndex: 99,
  lazyRender: true,
  inputError: ""
};
function useMessage(selector = "") {
  const messageOptionKey = selector ? messageDefaultOptionKey + selector : messageDefaultOptionKey;
  const messageOption = inject2(messageOptionKey, ref2(None2));
  if (messageOption.value === None2) {
    messageOption.value = defaultOptions2;
    provide2(messageOptionKey, messageOption);
  }
  const createMethod = (type) => {
    return (options) => {
      const messageOptions = deepMerge({ type }, typeof options === "string" ? { title: options } : options);
      if (messageOptions.type === "confirm" || messageOptions.type === "prompt") {
        messageOptions.showCancelButton = true;
      } else {
        messageOptions.showCancelButton = false;
      }
      return show(messageOptions);
    };
  };
  const show = (option) => {
    return new Promise((resolve, reject) => {
      const options = deepMerge(defaultOptions2, typeof option === "string" ? { title: option } : option);
      messageOption.value = deepMerge(options, {
        show: true,
        success: (res) => {
          close();
          resolve(res);
        },
        fail: (res) => {
          close();
          reject(res);
        }
      });
    });
  };
  const alert = createMethod("alert");
  const confirm = createMethod("confirm");
  const prompt = createMethod("prompt");
  const close = () => {
    if (messageOption.value !== None2) {
      messageOption.value.show = false;
    }
  };
  return {
    show,
    alert,
    confirm,
    prompt,
    close
  };
}

// ../../../../../../Users/youren/Desktop/Project/Braving_Aotai_Trail/node_modules/wot-design-uni/components/composables/useCell.ts
import { computed as computed2 } from "vue";

// ../../../../../../Users/youren/Desktop/Project/Braving_Aotai_Trail/node_modules/wot-design-uni/components/composables/useParent.ts
import {
  ref as ref3,
  inject as inject3,
  computed,
  onUnmounted,
  getCurrentInstance
} from "vue";
function useParent(key) {
  const parent = inject3(key, null);
  if (parent) {
    const instance = getCurrentInstance();
    const { link, unlink, internalChildren } = parent;
    link(instance);
    onUnmounted(() => unlink(instance));
    const index = computed(() => internalChildren.indexOf(instance));
    return {
      parent,
      index
    };
  }
  return {
    parent: null,
    index: ref3(-1)
  };
}

// ../../../../../../Users/youren/Desktop/Project/Braving_Aotai_Trail/node_modules/wot-design-uni/components/common/props.ts
var makeBooleanProp = (defaultVal) => ({
  type: Boolean,
  default: defaultVal
});
var makeStringProp = (defaultVal) => ({
  type: String,
  default: defaultVal
});
var baseProps = {
  /**
   * 自定义根节点样式
   */
  customStyle: makeStringProp(""),
  /**
   * 自定义根节点样式类
   */
  customClass: makeStringProp("")
};

// ../../../../../../Users/youren/Desktop/Project/Braving_Aotai_Trail/node_modules/wot-design-uni/components/wd-cell-group/types.ts
var CELL_GROUP_KEY = Symbol("wd-cell-group");
var cellGroupProps = {
  ...baseProps,
  /**
   * 分组标题
   */
  title: String,
  /**
   * 分组右侧内容
   */
  value: String,
  /**
   * 分组启用插槽
   */
  useSlot: makeBooleanProp(false),
  /**
   * 是否展示边框线
   */
  border: makeBooleanProp(false)
};

// ../../../../../../Users/youren/Desktop/Project/Braving_Aotai_Trail/node_modules/wot-design-uni/components/composables/useCell.ts
function useCell() {
  const { parent: cellGroup, index } = useParent(CELL_GROUP_KEY);
  const border = computed2(() => {
    return cellGroup && cellGroup.props.border && index.value;
  });
  return { border };
}

// ../../../../../../Users/youren/Desktop/Project/Braving_Aotai_Trail/node_modules/wot-design-uni/components/composables/useChildren.ts
import {
  provide as provide3,
  reactive,
  getCurrentInstance as getCurrentInstance2
} from "vue";
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
function flattenVNodes(children) {
  const result = [];
  const traverse = (children2) => {
    if (Array.isArray(children2)) {
      children2.forEach((child) => {
        var _a;
        if (isVNode(child)) {
          result.push(child);
          if ((_a = child.component) == null ? void 0 : _a.subTree) {
            result.push(child.component.subTree);
            traverse(child.component.subTree.children);
          }
          if (child.children) {
            traverse(child.children);
          }
        }
      });
    }
  };
  traverse(children);
  return result;
}
var findVNodeIndex = (vnodes, vnode) => {
  const index = vnodes.indexOf(vnode);
  if (index === -1) {
    return vnodes.findIndex((item) => vnode.key !== void 0 && vnode.key !== null && item.type === vnode.type && item.key === vnode.key);
  }
  return index;
};
function sortChildren(parent, publicChildren, internalChildren) {
  const vnodes = parent && parent.subTree && parent.subTree.children ? flattenVNodes(parent.subTree.children) : [];
  internalChildren.sort((a, b) => findVNodeIndex(vnodes, a.vnode) - findVNodeIndex(vnodes, b.vnode));
  const orderedPublicChildren = internalChildren.map((item) => item.proxy);
  publicChildren.sort((a, b) => {
    const indexA = orderedPublicChildren.indexOf(a);
    const indexB = orderedPublicChildren.indexOf(b);
    return indexA - indexB;
  });
}
function useChildren(key) {
  const publicChildren = reactive([]);
  const internalChildren = reactive([]);
  const parent = getCurrentInstance2();
  const linkChildren = (value) => {
    const link = (child) => {
      if (child.proxy) {
        internalChildren.push(child);
        publicChildren.push(child.proxy);
        sortChildren(parent, publicChildren, internalChildren);
      }
    };
    const unlink = (child) => {
      const index = internalChildren.indexOf(child);
      publicChildren.splice(index, 1);
      internalChildren.splice(index, 1);
    };
    provide3(
      key,
      Object.assign(
        {
          link,
          unlink,
          children: publicChildren,
          internalChildren
        },
        value
      )
    );
  };
  return {
    children: publicChildren,
    linkChildren
  };
}

// ../../../../../../Users/youren/Desktop/Project/Braving_Aotai_Trail/node_modules/wot-design-uni/components/composables/useCountDown.ts
import { ref as ref5, computed as computed3, onBeforeUnmount } from "vue";

// ../../../../../../Users/youren/Desktop/Project/Braving_Aotai_Trail/node_modules/wot-design-uni/components/composables/useRaf.ts
import { ref as ref4, onUnmounted as onUnmounted2 } from "vue";
function useRaf(callback) {
  const requestRef = ref4(null);
  const start = () => {
    const handle = (time) => {
      callback(time);
    };
    if (isH5) {
      requestRef.value = requestAnimationFrame(handle);
    } else {
      requestRef.value = setTimeout(() => handle(Date.now()), 1e3 / 30);
    }
  };
  const cancel = () => {
    if (isH5 && isNumber(requestRef.value)) {
      cancelAnimationFrame(requestRef.value);
    } else if (isDef(requestRef.value)) {
      clearTimeout(requestRef.value);
    }
  };
  onUnmounted2(() => {
    cancel();
  });
  return { start, cancel };
}

// ../../../../../../Users/youren/Desktop/Project/Braving_Aotai_Trail/node_modules/wot-design-uni/components/composables/useCountDown.ts
var SECOND = 1e3;
var MINUTE = 60 * SECOND;
var HOUR = 60 * MINUTE;
var DAY = 24 * HOUR;
function parseTime(time) {
  const days = Math.floor(time / DAY);
  const hours = Math.floor(time % DAY / HOUR);
  const minutes = Math.floor(time % HOUR / MINUTE);
  const seconds = Math.floor(time % MINUTE / SECOND);
  const milliseconds = Math.floor(time % SECOND);
  return {
    total: time,
    days,
    hours,
    minutes,
    seconds,
    milliseconds
  };
}
function isSameSecond(time1, time2) {
  return Math.floor(time1 / 1e3) === Math.floor(time2 / 1e3);
}
function useCountDown(options) {
  let endTime;
  let counting;
  const { start: startRaf, cancel: cancelRaf } = useRaf(tick);
  const remain = ref5(options.time);
  const current = computed3(() => parseTime(remain.value));
  const pause2 = () => {
    counting = false;
    cancelRaf();
  };
  const getCurrentRemain = () => Math.max(endTime - Date.now(), 0);
  const setRemain = (value) => {
    remain.value = value;
    isDef(options.onChange) && options.onChange(current.value);
    if (value === 0) {
      pause2();
      isDef(options.onFinish) && options.onFinish();
    }
  };
  const microTick = () => {
    if (counting) {
      setRemain(getCurrentRemain());
      if (remain.value > 0) {
        startRaf();
      }
    }
  };
  const macroTick = () => {
    if (counting) {
      const remainRemain = getCurrentRemain();
      if (!isSameSecond(remainRemain, remain.value) || remainRemain === 0) {
        setRemain(remainRemain);
      }
      if (remain.value > 0) {
        startRaf();
      }
    }
  };
  function tick() {
    if (options.millisecond) {
      microTick();
    } else {
      macroTick();
    }
  }
  const start = () => {
    if (!counting) {
      endTime = Date.now() + remain.value;
      counting = true;
      startRaf();
    }
  };
  const reset = (totalTime = options.time) => {
    pause2();
    remain.value = totalTime;
  };
  onBeforeUnmount(pause2);
  return {
    start,
    pause: pause2,
    reset,
    current
  };
}

// ../../../../../../Users/youren/Desktop/Project/Braving_Aotai_Trail/node_modules/wot-design-uni/components/composables/useLockScroll.ts
import { onBeforeUnmount as onBeforeUnmount2, onDeactivated, ref as ref6, watch } from "vue";
function useLockScroll(shouldLock) {
  const scrollLockCount = ref6(0);
  const lock = () => {
    if (scrollLockCount.value === 0) {
      document.getElementsByTagName("body")[0].style.overflow = "hidden";
    }
    scrollLockCount.value++;
  };
  const unlock = () => {
    if (scrollLockCount.value > 0) {
      scrollLockCount.value--;
      if (scrollLockCount.value === 0) {
        document.getElementsByTagName("body")[0].style.overflow = "";
      }
    }
  };
  const destroy = () => {
    shouldLock() && unlock();
  };
  watch(shouldLock, (value) => {
    value ? lock() : unlock();
  });
  onDeactivated(destroy);
  onBeforeUnmount2(destroy);
  return {
    lock,
    unlock
  };
}

// ../../../../../../Users/youren/Desktop/Project/Braving_Aotai_Trail/node_modules/wot-design-uni/components/composables/usePopover.ts
import { getCurrentInstance as getCurrentInstance3, ref as ref7 } from "vue";
function usePopover(visibleArrow = true) {
  const { proxy } = getCurrentInstance3();
  const popStyle = ref7("");
  const arrowStyle = ref7("");
  const showStyle = ref7("");
  const arrowClass = ref7("");
  const popWidth = ref7(0);
  const popHeight = ref7(0);
  const left = ref7(0);
  const bottom = ref7(0);
  const width = ref7(0);
  const height = ref7(0);
  const top = ref7(0);
  function noop() {
  }
  function init(placement, visibleArrow2, selector) {
    if (visibleArrow2) {
      const arrowClassArr = [
        `wd-${selector}__arrow`,
        placement === "bottom" || placement === "bottom-start" || placement === "bottom-end" ? `wd-${selector}__arrow-up` : "",
        placement === "left" || placement === "left-start" || placement === "left-end" ? `wd-${selector}__arrow-right` : "",
        placement === "right" || placement === "right-start" || placement === "right-end" ? `wd-${selector}__arrow-left` : "",
        placement === "top" || placement === "top-start" || placement === "top-end" ? `wd-${selector}__arrow-down` : ""
      ];
      arrowClass.value = arrowClassArr.join(" ");
    }
    getRect("#target", false, proxy).then((rect) => {
      if (!rect)
        return;
      left.value = rect.left;
      bottom.value = rect.bottom;
      width.value = rect.width;
      height.value = rect.height;
      top.value = rect.top;
    });
    getRect("#pos", false, proxy).then((rect) => {
      if (!rect)
        return;
      popWidth.value = rect.width;
      popHeight.value = rect.height;
    });
  }
  function control(placement, offset) {
    const arrowSize = visibleArrow ? 9 : 0;
    const verticalX = width.value / 2;
    const verticalY = arrowSize + height.value + 5;
    const horizontalX = width.value + arrowSize + 5;
    const horizontalY = height.value / 2;
    let offsetX = 0;
    let offsetY = 0;
    if (Array.isArray(offset)) {
      offsetX = (verticalX - 17 > 0 ? 0 : verticalX - 25) + offset[0];
      offsetY = (horizontalY - 17 > 0 ? 0 : horizontalY - 25) + (offset[1] ? offset[1] : offset[0]);
    } else if (isObj(offset)) {
      offsetX = (verticalX - 17 > 0 ? 0 : verticalX - 25) + offset.x;
      offsetY = (horizontalY - 17 > 0 ? 0 : horizontalY - 25) + offset.y;
    } else {
      offsetX = (verticalX - 17 > 0 ? 0 : verticalX - 25) + offset;
      offsetY = (horizontalY - 17 > 0 ? 0 : horizontalY - 25) + offset;
    }
    const placements = /* @__PURE__ */ new Map([
      // 上
      ["top", [`left: ${verticalX}px; bottom: ${verticalY}px; transform: translateX(-50%);`, "left: 50%;"]],
      [
        "top-start",
        [
          `left: ${offsetX}px; bottom: ${verticalY}px;`,
          `left: ${(popWidth.value >= width.value ? width.value / 2 : popWidth.value - 25) - offsetX}px;`
        ]
      ],
      [
        "top-end",
        [
          `right: ${offsetX}px; bottom: ${verticalY}px;`,
          `right: ${(popWidth.value >= width.value ? width.value / 2 : popWidth.value - 25) - offsetX}px; transform: translateX(50%);`
        ]
      ],
      // 下
      ["bottom", [`left: ${verticalX}px; top: ${verticalY}px; transform: translateX(-50%);`, "left: 50%;"]],
      [
        "bottom-start",
        [`left: ${offsetX}px; top: ${verticalY}px;`, `left: ${(popWidth.value >= width.value ? width.value / 2 : popWidth.value - 25) - offsetX}px;`]
      ],
      [
        "bottom-end",
        [
          `right: ${offsetX}px; top: ${verticalY}px;`,
          `right: ${(popWidth.value >= width.value ? width.value / 2 : popWidth.value - 25) - offsetX}px; transform: translateX(50%);`
        ]
      ],
      // 左
      ["left", [`right: ${horizontalX}px; top: ${horizontalY}px; transform: translateY(-50%);`, "top: 50%"]],
      [
        "left-start",
        [
          `right: ${horizontalX}px; top: ${offsetY}px;`,
          `top: ${(popHeight.value >= height.value ? height.value / 2 : popHeight.value - 20) - offsetY}px;`
        ]
      ],
      [
        "left-end",
        [
          `right: ${horizontalX}px; bottom: ${offsetY}px;`,
          `bottom: ${(popHeight.value >= height.value ? height.value / 2 : popHeight.value - 20) - offsetY}px; transform: translateY(50%);`
        ]
      ],
      // 右
      ["right", [`left: ${horizontalX}px; top: ${horizontalY}px; transform: translateY(-50%);`, "top: 50%"]],
      [
        "right-start",
        [
          `left: ${horizontalX}px; top: ${offsetY}px;`,
          `top: ${(popHeight.value >= height.value ? height.value / 2 : popHeight.value - 20) - offsetY}px;`
        ]
      ],
      [
        "right-end",
        [
          `left: ${horizontalX}px; bottom: ${offsetY}px;`,
          `bottom: ${(popHeight.value >= height.value ? height.value / 2 : popHeight.value - 20) - offsetY}px; transform: translateY(50%);`
        ]
      ]
    ]);
    popStyle.value = placements.get(placement)[0];
    arrowStyle.value = placements.get(placement)[1];
  }
  return { popStyle, arrowStyle, showStyle, arrowClass, init, control, noop };
}

// ../../../../../../Users/youren/Desktop/Project/Braving_Aotai_Trail/node_modules/wot-design-uni/components/composables/useQueue.ts
import { provide as provide4, ref as ref8 } from "vue";
var queueKey = "__QUEUE_KEY__";
function useQueue() {
  const queue2 = ref8([]);
  function pushToQueue2(comp) {
    queue2.value.push(comp);
  }
  function removeFromQueue2(comp) {
    queue2.value = queue2.value.filter((item) => {
      return item.$.uid !== comp.$.uid;
    });
  }
  function closeOther2(comp) {
    queue2.value.forEach((item) => {
      if (item.$.uid !== comp.$.uid) {
        item.$.exposed.close();
      }
    });
  }
  function closeOutside2() {
    queue2.value.forEach((item) => {
      item.$.exposed.close();
    });
  }
  provide4(queueKey, {
    queue: queue2,
    pushToQueue: pushToQueue2,
    removeFromQueue: removeFromQueue2,
    closeOther: closeOther2,
    closeOutside: closeOutside2
  });
  return {
    closeOther: closeOther2,
    closeOutside: closeOutside2
  };
}

// ../../../../../../Users/youren/Desktop/Project/Braving_Aotai_Trail/node_modules/wot-design-uni/components/composables/useTouch.ts
import { ref as ref9 } from "vue";
function useTouch() {
  const direction = ref9("");
  const deltaX = ref9(0);
  const deltaY = ref9(0);
  const offsetX = ref9(0);
  const offsetY = ref9(0);
  const startX = ref9(0);
  const startY = ref9(0);
  function touchStart(event) {
    const touch = event.touches[0];
    direction.value = "";
    deltaX.value = 0;
    deltaY.value = 0;
    offsetX.value = 0;
    offsetY.value = 0;
    startX.value = touch.clientX;
    startY.value = touch.clientY;
  }
  function touchMove(event) {
    const touch = event.touches[0];
    deltaX.value = touch.clientX - startX.value;
    deltaY.value = touch.clientY - startY.value;
    offsetX.value = Math.abs(deltaX.value);
    offsetY.value = Math.abs(deltaY.value);
    direction.value = offsetX.value > offsetY.value ? "horizontal" : offsetX.value < offsetY.value ? "vertical" : "";
  }
  return {
    touchStart,
    touchMove,
    direction,
    deltaX,
    deltaY,
    offsetX,
    offsetY,
    startX,
    startY
  };
}

// ../../../../../../Users/youren/Desktop/Project/Braving_Aotai_Trail/node_modules/wot-design-uni/locale/index.ts
import { reactive as reactive2, ref as ref10 } from "vue";

// ../../../../../../Users/youren/Desktop/Project/Braving_Aotai_Trail/node_modules/wot-design-uni/locale/lang/zh-CN.ts
var zh_CN_default = {
  calendar: {
    placeholder: "请选择",
    title: "选择日期",
    day: "日",
    week: "周",
    month: "月",
    confirm: "确定",
    startTime: "开始时间",
    endTime: "结束时间",
    to: "至",
    timeFormat: "YY年MM月DD日 HH:mm:ss",
    dateFormat: "YYYY年MM月DD日",
    weekFormat: (year, week) => `${year} 第 ${week} 周`,
    startWeek: "开始周",
    endWeek: "结束周",
    startMonth: "开始月",
    endMonth: "结束月",
    monthFormat: "YYYY年MM月"
  },
  calendarView: {
    startTime: "开始",
    endTime: "结束",
    weeks: {
      sun: "日",
      mon: "一",
      tue: "二",
      wed: "三",
      thu: "四",
      fri: "五",
      sat: "六"
    },
    rangePrompt: (maxRange) => `选择天数不能超过${maxRange}天`,
    rangePromptWeek: (maxRange) => `选择周数不能超过${maxRange}周`,
    rangePromptMonth: (maxRange) => `选择月份不能超过${maxRange}个月`,
    monthTitle: "YYYY年M月",
    yearTitle: "YYYY年",
    month: "M月",
    hour: (value) => `${value}时`,
    minute: (value) => `${value}分`,
    second: (value) => `${value}秒`
  },
  collapse: {
    expand: "展开",
    retract: "收起"
  },
  colPicker: {
    title: "请选择",
    placeholder: "请选择",
    select: "请选择"
  },
  datetimePicker: {
    start: "开始时间",
    end: "结束时间",
    to: "至",
    placeholder: "请选择",
    confirm: "完成",
    cancel: "取消"
  },
  loadmore: {
    loading: "正在努力加载中...",
    finished: "已加载完毕",
    error: "加载失败",
    retry: "点击重试"
  },
  messageBox: {
    inputPlaceholder: "请输入",
    confirm: "确定",
    cancel: "取消",
    inputNoValidate: "输入的数据不合法"
  },
  numberKeyboard: {
    confirm: "完成"
  },
  pagination: {
    prev: "上一页",
    next: "下一页",
    page: (value) => `当前页：${value}`,
    total: (total) => `当前数据：${total}条`,
    size: (size) => `分页大小：${size}`
  },
  picker: {
    cancel: "取消",
    done: "完成",
    placeholder: "请选择"
  },
  imgCropper: {
    confirm: "完成",
    cancel: "取消"
  },
  search: {
    search: "搜索",
    cancel: "取消"
  },
  steps: {
    wait: "未开始",
    finished: "已完成",
    process: "进行中",
    failed: "失败"
  },
  tabs: {
    all: "全部"
  },
  upload: {
    error: "上传失败"
  },
  input: {
    placeholder: "请输入..."
  },
  selectPicker: {
    title: "请选择",
    placeholder: "请选择",
    select: "请选择",
    confirm: "确认",
    filterPlaceholder: "搜索"
  },
  tag: {
    placeholder: "请输入",
    add: "新增标签"
  },
  textarea: {
    placeholder: "请输入..."
  },
  tableCol: {
    indexLabel: "序号"
  },
  signature: {
    confirmText: "确认",
    clearText: "清空",
    revokeText: "撤销",
    restoreText: "恢复"
  }
};

// ../../../../../../Users/youren/Desktop/Project/Braving_Aotai_Trail/node_modules/wot-design-uni/locale/index.ts
var lang = ref10("zh-CN");
var messages = reactive2({
  "zh-CN": zh_CN_default
});
var Locale = {
  messages() {
    return messages[lang.value];
  },
  use(newLang, newMessage) {
    lang.value = newLang;
    if (newMessage) {
      this.add({ [newLang]: newMessage });
    }
  },
  add(newMessages = {}) {
    deepAssign(messages, newMessages);
  }
};
var useCurrentLang = () => lang;
var locale_default = Locale;

// ../../../../../../Users/youren/Desktop/Project/Braving_Aotai_Trail/node_modules/wot-design-uni/components/composables/useTranslate.ts
var useTranslate = (name) => {
  const prefix = name ? camelCase(name) + "." : "";
  const translate = (key, ...args) => {
    const currentMessages = locale_default.messages();
    const message = getPropByPath(currentMessages, prefix + key);
    return isFunction(message) ? message(...args) : isDef(message) ? message : `${prefix}${key}`;
  };
  return { translate };
};

// ../../../../../../Users/youren/Desktop/Project/Braving_Aotai_Trail/node_modules/wot-design-uni/components/composables/useUpload.ts
var UPLOAD_STATUS = {
  PENDING: "pending",
  LOADING: "loading",
  SUCCESS: "success",
  FAIL: "fail"
};
function useUpload() {
  let currentTask = null;
  const abort = (task) => {
    if (task) {
      task.abort();
    } else if (currentTask) {
      currentTask.abort();
      currentTask = null;
    }
  };
  const defaultUpload = (file, formData, options) => {
    if (options.abortPrevious) {
      abort();
    }
    const uploadTask = uni.uploadFile({
      url: options.action,
      header: options.header,
      name: options.name,
      fileName: options.name,
      fileType: options.fileType,
      formData,
      filePath: file.url,
      success(res) {
        if (res.statusCode === options.statusCode) {
          options.onSuccess(res, file, formData);
        } else {
          options.onError({ ...res, errMsg: res.errMsg || "" }, file, formData);
        }
      },
      fail(err) {
        options.onError(err, file, formData);
      }
    });
    currentTask = uploadTask;
    uploadTask.onProgressUpdate((res) => {
      options.onProgress(res, file);
    });
    return uploadTask;
  };
  const startUpload = (file, options) => {
    const {
      uploadMethod,
      formData = {},
      action,
      name = "file",
      header = {},
      fileType = "image",
      statusCode = 200,
      statusKey = "status",
      abortPrevious = false
    } = options;
    file[statusKey] = UPLOAD_STATUS.LOADING;
    const uploadOptions = {
      action,
      header,
      name,
      fileName: name,
      fileType,
      statusCode,
      abortPrevious,
      onSuccess: (res, file2, formData2) => {
        var _a;
        file2[statusKey] = UPLOAD_STATUS.SUCCESS;
        currentTask = null;
        (_a = options.onSuccess) == null ? void 0 : _a.call(options, res, file2, formData2);
      },
      onError: (error, file2, formData2) => {
        var _a;
        file2[statusKey] = UPLOAD_STATUS.FAIL;
        file2.error = error.errMsg;
        currentTask = null;
        (_a = options.onError) == null ? void 0 : _a.call(options, error, file2, formData2);
      },
      onProgress: (res, file2) => {
        var _a;
        file2.percent = res.progress;
        (_a = options.onProgress) == null ? void 0 : _a.call(options, res, file2);
      }
    };
    if (isFunction(uploadMethod)) {
      return uploadMethod(file, formData, uploadOptions);
    } else {
      return defaultUpload(file, formData, uploadOptions);
    }
  };
  function formatImage(res) {
    if (isArray(res.tempFiles)) {
      return res.tempFiles.map((item) => ({
        path: item.path || "",
        name: item.name || "",
        size: item.size,
        type: "image",
        thumb: item.path || ""
      }));
    }
    return [
      {
        path: res.tempFiles.path || "",
        name: res.tempFiles.name || "",
        size: res.tempFiles.size,
        type: "image",
        thumb: res.tempFiles.path || ""
      }
    ];
  }
  function formatVideo(res) {
    return [
      {
        path: res.tempFilePath || res.filePath || "",
        name: res.name || "",
        size: res.size,
        type: "video",
        thumb: res.thumbTempFilePath || "",
        duration: res.duration
      }
    ];
  }
  function formatMedia(res) {
    return res.tempFiles.map((item) => ({
      type: item.fileType,
      path: item.tempFilePath,
      thumb: item.fileType === "video" ? item.thumbTempFilePath : item.tempFilePath,
      size: item.size,
      duration: item.duration
    }));
  }
  function chooseFile({
    multiple,
    sizeType,
    sourceType,
    maxCount,
    accept,
    compressed,
    maxDuration,
    camera,
    extension
  }) {
    return new Promise((resolve, reject) => {
      switch (accept) {
        case "image":
          uni.chooseImage({
            count: multiple ? maxCount : 1,
            sizeType,
            sourceType,
            extension,
            success: (res) => resolve(formatImage(res)),
            fail: reject
          });
          break;
        case "video":
          uni.chooseVideo({
            sourceType,
            compressed,
            maxDuration,
            camera,
            extension,
            success: (res) => resolve(formatVideo(res)),
            fail: reject
          });
          break;
        case "all":
          uni.chooseFile({
            count: multiple ? maxCount : 1,
            type: accept,
            extension,
            success: (res) => resolve(res.tempFiles),
            fail: reject
          });
          break;
        default:
          uni.chooseImage({
            count: multiple ? maxCount : 1,
            sizeType,
            sourceType,
            extension,
            success: (res) => resolve(formatImage(res)),
            fail: reject
          });
          break;
      }
    });
  }
  return {
    startUpload,
    abort,
    UPLOAD_STATUS,
    chooseFile
  };
}

// ../../../../../../Users/youren/Desktop/Project/Braving_Aotai_Trail/node_modules/wot-design-uni/components/wd-notify/index.ts
import { inject as inject4, provide as provide5, ref as ref11 } from "vue";
var timer;
var currentOptions = getDefaultOptions();
var notifyDefaultOptionKey = "__NOTIFY_OPTION__";
var None3 = Symbol("None");
var setNotifyDefaultOptions = (options) => {
  currentOptions = deepMerge(currentOptions, options);
};
var resetNotifyDefaultOptions = () => {
  currentOptions = getDefaultOptions();
};
var useNotify = (selector = "") => {
  const notifyOptionKey = getNotifyOptionKey(selector);
  const notifyOption = inject4(notifyOptionKey, ref11(None3));
  if (notifyOption.value === None3) {
    notifyOption.value = currentOptions;
    provide5(notifyOptionKey, notifyOption);
  }
  const showNotify = (option) => {
    const options = deepMerge(currentOptions, isString(option) ? { message: option } : option);
    notifyOption.value = deepMerge(options, { visible: true });
    if (notifyOption.value.duration && notifyOption.value.duration > 0) {
      timer && clearTimeout(timer);
      timer = setTimeout(() => closeNotify(), options.duration);
    }
  };
  const closeNotify = () => {
    timer && clearTimeout(timer);
    if (notifyOption.value !== None3) {
      notifyOption.value.visible = false;
    }
  };
  return {
    showNotify,
    closeNotify
  };
};
var getNotifyOptionKey = (selector) => {
  return selector ? `${notifyDefaultOptionKey}${selector}` : notifyDefaultOptionKey;
};
function getDefaultOptions() {
  return {
    type: "danger",
    color: void 0,
    zIndex: 99,
    message: "",
    duration: 3e3,
    position: "top",
    safeHeight: void 0,
    background: void 0,
    onClick: void 0,
    onClosed: void 0,
    onOpened: void 0
  };
}

// ../../../../../../Users/youren/Desktop/Project/Braving_Aotai_Trail/node_modules/wot-design-uni/dayjs/constant.js
var SECONDS_A_MINUTE = 60;
var SECONDS_A_HOUR = SECONDS_A_MINUTE * 60;
var SECONDS_A_DAY = SECONDS_A_HOUR * 24;
var SECONDS_A_WEEK = SECONDS_A_DAY * 7;
var MILLISECONDS_A_SECOND = 1e3;
var MILLISECONDS_A_MINUTE = SECONDS_A_MINUTE * MILLISECONDS_A_SECOND;
var MILLISECONDS_A_HOUR = SECONDS_A_HOUR * MILLISECONDS_A_SECOND;
var MILLISECONDS_A_DAY = SECONDS_A_DAY * MILLISECONDS_A_SECOND;
var MILLISECONDS_A_WEEK = SECONDS_A_WEEK * MILLISECONDS_A_SECOND;
var MS = "millisecond";
var S = "second";
var MIN = "minute";
var H = "hour";
var D = "day";
var W = "week";
var M = "month";
var Q = "quarter";
var Y = "year";
var DATE = "date";
var FORMAT_DEFAULT = "YYYY-MM-DDTHH:mm:ssZ";
var INVALID_DATE_STRING = "Invalid Date";
var REGEX_PARSE = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/;
var REGEX_FORMAT = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g;

// ../../../../../../Users/youren/Desktop/Project/Braving_Aotai_Trail/node_modules/wot-design-uni/dayjs/locale/en.js
var en_default = {
  name: "en",
  weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
  months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
  ordinal: function ordinal(n) {
    var s = ["th", "st", "nd", "rd"];
    var v = n % 100;
    return "[" + n + (s[(v - 20) % 10] || s[v] || s[0]) + "]";
  }
};

// ../../../../../../Users/youren/Desktop/Project/Braving_Aotai_Trail/node_modules/wot-design-uni/dayjs/utils.js
var padStart = function padStart2(string, length, pad) {
  var s = String(string);
  if (!s || s.length >= length)
    return string;
  return "" + Array(length + 1 - s.length).join(pad) + string;
};
var padZoneStr = function padZoneStr2(instance) {
  var negMinutes = -instance.utcOffset();
  var minutes = Math.abs(negMinutes);
  var hourOffset = Math.floor(minutes / 60);
  var minuteOffset = minutes % 60;
  return (negMinutes <= 0 ? "+" : "-") + padStart(hourOffset, 2, "0") + ":" + padStart(minuteOffset, 2, "0");
};
var monthDiff = function monthDiff2(a, b) {
  if (a.date() < b.date())
    return -monthDiff2(b, a);
  var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month());
  var anchor = a.clone().add(wholeMonthDiff, M);
  var c = b - anchor < 0;
  var anchor2 = a.clone().add(wholeMonthDiff + (c ? -1 : 1), M);
  return +(-(wholeMonthDiff + (b - anchor) / (c ? anchor - anchor2 : anchor2 - anchor)) || 0);
};
var absFloor = function absFloor2(n) {
  return n < 0 ? Math.ceil(n) || 0 : Math.floor(n);
};
var prettyUnit = function prettyUnit2(u) {
  var special = {
    M,
    y: Y,
    w: W,
    d: D,
    D: DATE,
    h: H,
    m: MIN,
    s: S,
    ms: MS,
    Q
  };
  return special[u] || String(u || "").toLowerCase().replace(/s$/, "");
};
var isUndefined2 = function isUndefined3(s) {
  return s === void 0;
};
var utils_default = {
  s: padStart,
  z: padZoneStr,
  m: monthDiff,
  a: absFloor,
  p: prettyUnit,
  u: isUndefined2
};

// ../../../../../../Users/youren/Desktop/Project/Braving_Aotai_Trail/node_modules/wot-design-uni/dayjs/index.js
var L = "en";
var Ls = {};
Ls[L] = en_default;
var IS_DAYJS = "$isDayjsObject";
var isDayjs = function isDayjs2(d) {
  return d instanceof Dayjs || !!(d && d[IS_DAYJS]);
};
var parseLocale = function parseLocale2(preset, object, isLocal) {
  var l;
  if (!preset)
    return L;
  if (typeof preset === "string") {
    var presetLower = preset.toLowerCase();
    if (Ls[presetLower]) {
      l = presetLower;
    }
    if (object) {
      Ls[presetLower] = object;
      l = presetLower;
    }
    var presetSplit = preset.split("-");
    if (!l && presetSplit.length > 1) {
      return parseLocale2(presetSplit[0]);
    }
  } else {
    var name = preset.name;
    Ls[name] = preset;
    l = name;
  }
  if (!isLocal && l)
    L = l;
  return l || !isLocal && L;
};
var dayjs = function dayjs2(date, c) {
  if (isDayjs(date)) {
    return date.clone();
  }
  var cfg = typeof c === "object" ? c : {};
  cfg.date = date;
  cfg.args = arguments;
  return new Dayjs(cfg);
};
var wrapper = function wrapper2(date, instance) {
  return dayjs(date, {
    locale: instance.$L,
    utc: instance.$u,
    x: instance.$x,
    $offset: instance.$offset
    // todo: refactor; do not use this.$offset in you code
  });
};
var Utils = utils_default;
Utils.l = parseLocale;
Utils.i = isDayjs;
Utils.w = wrapper;
var parseDate = function parseDate2(cfg) {
  var date = cfg.date, utc = cfg.utc;
  if (date === null)
    return /* @__PURE__ */ new Date(NaN);
  if (Utils.u(date))
    return /* @__PURE__ */ new Date();
  if (date instanceof Date)
    return new Date(date);
  if (typeof date === "string" && !/Z$/i.test(date)) {
    var d = date.match(REGEX_PARSE);
    if (d) {
      var m = d[2] - 1 || 0;
      var ms = (d[7] || "0").substring(0, 3);
      if (utc) {
        return new Date(Date.UTC(d[1], m, d[3] || 1, d[4] || 0, d[5] || 0, d[6] || 0, ms));
      }
      return new Date(d[1], m, d[3] || 1, d[4] || 0, d[5] || 0, d[6] || 0, ms);
    }
  }
  return new Date(date);
};
var Dayjs = function() {
  function Dayjs2(cfg) {
    this.$L = parseLocale(cfg.locale, null, true);
    this.parse(cfg);
    this.$x = this.$x || cfg.x || {};
    this[IS_DAYJS] = true;
  }
  var _proto = Dayjs2.prototype;
  _proto.parse = function parse(cfg) {
    this.$d = parseDate(cfg);
    this.init();
  };
  _proto.init = function init() {
    var $d = this.$d;
    this.$y = $d.getFullYear();
    this.$M = $d.getMonth();
    this.$D = $d.getDate();
    this.$W = $d.getDay();
    this.$H = $d.getHours();
    this.$m = $d.getMinutes();
    this.$s = $d.getSeconds();
    this.$ms = $d.getMilliseconds();
  };
  _proto.$utils = function $utils() {
    return Utils;
  };
  _proto.isValid = function isValid() {
    return !(this.$d.toString() === INVALID_DATE_STRING);
  };
  _proto.isSame = function isSame(that, units) {
    var other = dayjs(that);
    return this.startOf(units) <= other && other <= this.endOf(units);
  };
  _proto.isAfter = function isAfter(that, units) {
    return dayjs(that) < this.startOf(units);
  };
  _proto.isBefore = function isBefore(that, units) {
    return this.endOf(units) < dayjs(that);
  };
  _proto.$g = function $g(input, get, set) {
    if (Utils.u(input))
      return this[get];
    return this.set(set, input);
  };
  _proto.unix = function unix() {
    return Math.floor(this.valueOf() / 1e3);
  };
  _proto.valueOf = function valueOf() {
    return this.$d.getTime();
  };
  _proto.startOf = function startOf(units, _startOf) {
    var _this = this;
    var isStartOf = !Utils.u(_startOf) ? _startOf : true;
    var unit = Utils.p(units);
    var instanceFactory = function instanceFactory2(d, m) {
      var ins = Utils.w(_this.$u ? Date.UTC(_this.$y, m, d) : new Date(_this.$y, m, d), _this);
      return isStartOf ? ins : ins.endOf(D);
    };
    var instanceFactorySet = function instanceFactorySet2(method, slice) {
      var argumentStart = [0, 0, 0, 0];
      var argumentEnd = [23, 59, 59, 999];
      return Utils.w(_this.toDate()[method].apply(
        // eslint-disable-line prefer-spread
        _this.toDate("s"),
        (isStartOf ? argumentStart : argumentEnd).slice(slice)
      ), _this);
    };
    var $W = this.$W, $M = this.$M, $D = this.$D;
    var utcPad = "set" + (this.$u ? "UTC" : "");
    switch (unit) {
      case Y:
        return isStartOf ? instanceFactory(1, 0) : instanceFactory(31, 11);
      case M:
        return isStartOf ? instanceFactory(1, $M) : instanceFactory(0, $M + 1);
      case W: {
        var weekStart = this.$locale().weekStart || 0;
        var gap = ($W < weekStart ? $W + 7 : $W) - weekStart;
        return instanceFactory(isStartOf ? $D - gap : $D + (6 - gap), $M);
      }
      case D:
      case DATE:
        return instanceFactorySet(utcPad + "Hours", 0);
      case H:
        return instanceFactorySet(utcPad + "Minutes", 1);
      case MIN:
        return instanceFactorySet(utcPad + "Seconds", 2);
      case S:
        return instanceFactorySet(utcPad + "Milliseconds", 3);
      default:
        return this.clone();
    }
  };
  _proto.endOf = function endOf(arg) {
    return this.startOf(arg, false);
  };
  _proto.$set = function $set(units, _int) {
    var _C$D$C$DATE$C$M$C$Y$C;
    var unit = Utils.p(units);
    var utcPad = "set" + (this.$u ? "UTC" : "");
    var name = (_C$D$C$DATE$C$M$C$Y$C = {}, _C$D$C$DATE$C$M$C$Y$C[D] = utcPad + "Date", _C$D$C$DATE$C$M$C$Y$C[DATE] = utcPad + "Date", _C$D$C$DATE$C$M$C$Y$C[M] = utcPad + "Month", _C$D$C$DATE$C$M$C$Y$C[Y] = utcPad + "FullYear", _C$D$C$DATE$C$M$C$Y$C[H] = utcPad + "Hours", _C$D$C$DATE$C$M$C$Y$C[MIN] = utcPad + "Minutes", _C$D$C$DATE$C$M$C$Y$C[S] = utcPad + "Seconds", _C$D$C$DATE$C$M$C$Y$C[MS] = utcPad + "Milliseconds", _C$D$C$DATE$C$M$C$Y$C)[unit];
    var arg = unit === D ? this.$D + (_int - this.$W) : _int;
    if (unit === M || unit === Y) {
      var date = this.clone().set(DATE, 1);
      date.$d[name](arg);
      date.init();
      this.$d = date.set(DATE, Math.min(this.$D, date.daysInMonth())).$d;
    } else if (name)
      this.$d[name](arg);
    this.init();
    return this;
  };
  _proto.set = function set(string, _int2) {
    return this.clone().$set(string, _int2);
  };
  _proto.get = function get(unit) {
    return this[Utils.p(unit)]();
  };
  _proto.add = function add(number, units) {
    var _this2 = this, _C$MIN$C$H$C$S$unit;
    number = Number(number);
    var unit = Utils.p(units);
    var instanceFactorySet = function instanceFactorySet2(n) {
      var d = dayjs(_this2);
      return Utils.w(d.date(d.date() + Math.round(n * number)), _this2);
    };
    if (unit === M) {
      return this.set(M, this.$M + number);
    }
    if (unit === Y) {
      return this.set(Y, this.$y + number);
    }
    if (unit === D) {
      return instanceFactorySet(1);
    }
    if (unit === W) {
      return instanceFactorySet(7);
    }
    var step = (_C$MIN$C$H$C$S$unit = {}, _C$MIN$C$H$C$S$unit[MIN] = MILLISECONDS_A_MINUTE, _C$MIN$C$H$C$S$unit[H] = MILLISECONDS_A_HOUR, _C$MIN$C$H$C$S$unit[S] = MILLISECONDS_A_SECOND, _C$MIN$C$H$C$S$unit)[unit] || 1;
    var nextTimeStamp = this.$d.getTime() + number * step;
    return Utils.w(nextTimeStamp, this);
  };
  _proto.subtract = function subtract(number, string) {
    return this.add(number * -1, string);
  };
  _proto.format = function format(formatStr) {
    var _this3 = this;
    var locale = this.$locale();
    if (!this.isValid())
      return locale.invalidDate || INVALID_DATE_STRING;
    var str = formatStr || FORMAT_DEFAULT;
    var zoneStr = Utils.z(this);
    var $H = this.$H, $m = this.$m, $M = this.$M;
    var weekdays = locale.weekdays, months = locale.months, meridiem = locale.meridiem;
    var getShort = function getShort2(arr, index, full, length) {
      return arr && (arr[index] || arr(_this3, str)) || full[index].slice(0, length);
    };
    var get$H = function get$H2(num) {
      return Utils.s($H % 12 || 12, num, "0");
    };
    var meridiemFunc = meridiem || function(hour, minute, isLowercase) {
      var m = hour < 12 ? "AM" : "PM";
      return isLowercase ? m.toLowerCase() : m;
    };
    var matches = function matches2(match) {
      switch (match) {
        case "YY":
          return String(_this3.$y).slice(-2);
        case "YYYY":
          return Utils.s(_this3.$y, 4, "0");
        case "M":
          return $M + 1;
        case "MM":
          return Utils.s($M + 1, 2, "0");
        case "MMM":
          return getShort(locale.monthsShort, $M, months, 3);
        case "MMMM":
          return getShort(months, $M);
        case "D":
          return _this3.$D;
        case "DD":
          return Utils.s(_this3.$D, 2, "0");
        case "d":
          return String(_this3.$W);
        case "dd":
          return getShort(locale.weekdaysMin, _this3.$W, weekdays, 2);
        case "ddd":
          return getShort(locale.weekdaysShort, _this3.$W, weekdays, 3);
        case "dddd":
          return weekdays[_this3.$W];
        case "H":
          return String($H);
        case "HH":
          return Utils.s($H, 2, "0");
        case "h":
          return get$H(1);
        case "hh":
          return get$H(2);
        case "a":
          return meridiemFunc($H, $m, true);
        case "A":
          return meridiemFunc($H, $m, false);
        case "m":
          return String($m);
        case "mm":
          return Utils.s($m, 2, "0");
        case "s":
          return String(_this3.$s);
        case "ss":
          return Utils.s(_this3.$s, 2, "0");
        case "SSS":
          return Utils.s(_this3.$ms, 3, "0");
        case "Z":
          return zoneStr;
        default:
          break;
      }
      return null;
    };
    return str.replace(REGEX_FORMAT, function(match, $1) {
      return $1 || matches(match) || zoneStr.replace(":", "");
    });
  };
  _proto.utcOffset = function utcOffset() {
    return -Math.round(this.$d.getTimezoneOffset() / 15) * 15;
  };
  _proto.diff = function diff(input, units, _float) {
    var _this4 = this;
    var unit = Utils.p(units);
    var that = dayjs(input);
    var zoneDelta = (that.utcOffset() - this.utcOffset()) * MILLISECONDS_A_MINUTE;
    var diff2 = this - that;
    var getMonth = function getMonth2() {
      return Utils.m(_this4, that);
    };
    var result;
    switch (unit) {
      case Y:
        result = getMonth() / 12;
        break;
      case M:
        result = getMonth();
        break;
      case Q:
        result = getMonth() / 3;
        break;
      case W:
        result = (diff2 - zoneDelta) / MILLISECONDS_A_WEEK;
        break;
      case D:
        result = (diff2 - zoneDelta) / MILLISECONDS_A_DAY;
        break;
      case H:
        result = diff2 / MILLISECONDS_A_HOUR;
        break;
      case MIN:
        result = diff2 / MILLISECONDS_A_MINUTE;
        break;
      case S:
        result = diff2 / MILLISECONDS_A_SECOND;
        break;
      default:
        result = diff2;
        break;
    }
    return _float ? result : Utils.a(result);
  };
  _proto.daysInMonth = function daysInMonth() {
    return this.endOf(M).$D;
  };
  _proto.$locale = function $locale() {
    return Ls[this.$L];
  };
  _proto.locale = function locale(preset, object) {
    if (!preset)
      return this.$L;
    var that = this.clone();
    var nextLocaleName = parseLocale(preset, object, true);
    if (nextLocaleName)
      that.$L = nextLocaleName;
    return that;
  };
  _proto.clone = function clone() {
    return Utils.w(this.$d, this);
  };
  _proto.toDate = function toDate() {
    return new Date(this.valueOf());
  };
  _proto.toJSON = function toJSON() {
    return this.isValid() ? this.toISOString() : null;
  };
  _proto.toISOString = function toISOString() {
    return this.$d.toISOString();
  };
  _proto.toString = function toString() {
    return this.$d.toUTCString();
  };
  return Dayjs2;
}();
var proto = Dayjs.prototype;
dayjs.prototype = proto;
[["$ms", MS], ["$s", S], ["$m", MIN], ["$H", H], ["$W", D], ["$M", M], ["$y", Y], ["$D", DATE]].forEach(function(g) {
  proto[g[1]] = function(input) {
    return this.$g(input, g[0], g[1]);
  };
});
dayjs.extend = function(plugin, option) {
  if (!plugin.$i) {
    plugin(option, Dayjs, dayjs);
    plugin.$i = true;
  }
  return dayjs;
};
dayjs.locale = parseLocale;
dayjs.isDayjs = isDayjs;
dayjs.unix = function(timestamp) {
  return dayjs(timestamp * 1e3);
};
dayjs.en = Ls[L];
dayjs.Ls = Ls;
dayjs.p = {};
var dayjs_default = dayjs;

// ../../../../../../Users/youren/Desktop/Project/Braving_Aotai_Trail/node_modules/wot-design-uni/components/common/clickoutside.ts
var clickoutside_exports = {};
__export(clickoutside_exports, {
  closeOther: () => closeOther,
  closeOutside: () => closeOutside,
  pushToQueue: () => pushToQueue,
  removeFromQueue: () => removeFromQueue
});
var queue = [];
function pushToQueue(comp) {
  queue.push(comp);
}
function removeFromQueue(comp) {
  queue = queue.filter((item) => {
    return item.$.uid !== comp.$.uid;
  });
}
function closeOther(comp) {
  queue.forEach((item) => {
    if (item.$.uid !== comp.$.uid) {
      item.$.exposed.close();
    }
  });
}
function closeOutside() {
  queue.forEach((item) => {
    item.$.exposed.close();
  });
}
export {
  util_exports as CommonUtil,
  Locale,
  clickoutside_exports as clickOut,
  dayjs_default as dayjs,
  flattenVNodes,
  getNotifyOptionKey,
  resetNotifyDefaultOptions,
  setNotifyDefaultOptions,
  sortChildren,
  useCell,
  useChildren,
  useCountDown,
  useCurrentLang,
  useLockScroll,
  useMessage,
  useNotify,
  useParent,
  usePopover,
  useQueue,
  useRaf,
  useToast,
  useTouch,
  useTranslate,
  useUpload
};
//# sourceMappingURL=wot-design-uni.js.map
