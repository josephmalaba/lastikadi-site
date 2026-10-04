//region block: polyfills
if (typeof Math.imul === 'undefined') {
  Math.imul = function imul(a, b) {
    return (a & 4.29490176E9) * (b & 65535) + (a & 65535) * (b | 0) | 0;
  };
}
if (typeof ArrayBuffer.isView === 'undefined') {
  ArrayBuffer.isView = function (a) {
    return a != null && a.__proto__ != null && a.__proto__.__proto__ === Int8Array.prototype.__proto__;
  };
}
if (typeof Array.prototype.fill === 'undefined') {
  // Polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill#Polyfill
  Object.defineProperty(Array.prototype, 'fill', {value: function (value) {
    // Steps 1-2.
    if (this == null) {
      throw new TypeError('this is null or not defined');
    }
    var O = Object(this); // Steps 3-5.
    var len = O.length >>> 0; // Steps 6-7.
    var start = arguments[1];
    var relativeStart = start >> 0; // Step 8.
    var k = relativeStart < 0 ? Math.max(len + relativeStart, 0) : Math.min(relativeStart, len); // Steps 9-10.
    var end = arguments[2];
    var relativeEnd = end === undefined ? len : end >> 0; // Step 11.
    var finalValue = relativeEnd < 0 ? Math.max(len + relativeEnd, 0) : Math.min(relativeEnd, len); // Step 12.
    while (k < finalValue) {
      O[k] = value;
      k++;
    }
    ; // Step 13.
    return O;
  }});
}
[Int8Array, Int16Array, Uint16Array, Int32Array, Float32Array, Float64Array].forEach(function (TypedArray) {
  if (typeof TypedArray.prototype.fill === 'undefined') {
    Object.defineProperty(TypedArray.prototype, 'fill', {value: Array.prototype.fill});
  }
});
if (typeof Math.clz32 === 'undefined') {
  Math.clz32 = function (log, LN2) {
    return function (x) {
      var asUint = x >>> 0;
      if (asUint === 0) {
        return 32;
      }
      return 31 - (log(asUint) / LN2 | 0) | 0; // the "| 0" acts like math.floor
    };
  }(Math.log, Math.LN2);
}
//endregion
(function (_) {
  'use strict';
  //region block: imports
  var imul = Math.imul;
  var isView = ArrayBuffer.isView;
  var clz32 = Math.clz32;
  //endregion
  //region block: pre-declaration
  initMetadataForInterface(CharSequence, 'CharSequence');
  initMetadataForInterface(Comparable, 'Comparable');
  initMetadataForClass(Number_0, 'Number');
  initMetadataForObject(Unit, 'Unit');
  initMetadataForClass(Char, 'Char', VOID, VOID, [Comparable]);
  initMetadataForInterface(Collection, 'Collection');
  initMetadataForInterface(KtList, 'List', VOID, VOID, [Collection]);
  initMetadataForInterface(Entry, 'Entry');
  initMetadataForInterface(KtMap, 'Map');
  initMetadataForInterface(KtSet, 'Set', VOID, VOID, [Collection]);
  initMetadataForCompanion(Companion);
  initMetadataForClass(Long, 'Long', VOID, Number_0, [Number_0, Comparable]);
  initMetadataForInterface(FunctionAdapter, 'FunctionAdapter');
  initMetadataForClass(arrayIterator$1);
  initMetadataForObject(Digit, 'Digit');
  initMetadataForInterface(Comparator, 'Comparator');
  initMetadataForClass(AbstractCollection, 'AbstractCollection', VOID, VOID, [Collection]);
  initMetadataForClass(AbstractMutableCollection, 'AbstractMutableCollection', VOID, AbstractCollection, [AbstractCollection, Collection]);
  initMetadataForClass(IteratorImpl, 'IteratorImpl');
  initMetadataForClass(AbstractMutableList, 'AbstractMutableList', VOID, AbstractMutableCollection, [AbstractMutableCollection, KtList, Collection]);
  initMetadataForClass(AbstractMap, 'AbstractMap', VOID, VOID, [KtMap]);
  initMetadataForClass(AbstractMutableMap, 'AbstractMutableMap', VOID, AbstractMap, [AbstractMap, KtMap]);
  initMetadataForClass(AbstractMutableSet, 'AbstractMutableSet', VOID, AbstractMutableCollection, [AbstractMutableCollection, Collection, KtSet]);
  initMetadataForCompanion(Companion_0);
  initMetadataForClass(ArrayList, 'ArrayList', ArrayList_init_$Create$, AbstractMutableList, [AbstractMutableList, KtList, Collection]);
  initMetadataForClass(HashMap, 'HashMap', HashMap_init_$Create$, AbstractMutableMap, [AbstractMutableMap, KtMap]);
  initMetadataForClass(HashMapEntrySetBase, 'HashMapEntrySetBase', VOID, AbstractMutableSet, [Collection, KtSet, AbstractMutableSet]);
  initMetadataForClass(HashMapEntrySet, 'HashMapEntrySet', VOID, HashMapEntrySetBase);
  initMetadataForClass(HashSet, 'HashSet', HashSet_init_$Create$, AbstractMutableSet, [AbstractMutableSet, Collection, KtSet]);
  initMetadataForCompanion(Companion_1);
  initMetadataForClass(Itr, 'Itr');
  initMetadataForClass(KeysItr, 'KeysItr', VOID, Itr);
  initMetadataForClass(EntriesItr, 'EntriesItr', VOID, Itr);
  initMetadataForClass(EntryRef, 'EntryRef', VOID, VOID, [Entry]);
  function containsAllEntries(m) {
    var tmp$ret$0;
    $l$block_0: {
      // Inline function 'kotlin.collections.all' call
      var tmp;
      if (isInterface(m, Collection)) {
        tmp = m.p();
      } else {
        tmp = false;
      }
      if (tmp) {
        tmp$ret$0 = true;
        break $l$block_0;
      }
      var tmp0_iterator = m.g();
      while (tmp0_iterator.h()) {
        var element = tmp0_iterator.i();
        // Inline function 'kotlin.collections.InternalMap.containsAllEntries.<anonymous>' call
        // Inline function 'kotlin.js.unsafeCast' call
        // Inline function 'kotlin.js.asDynamic' call
        var entry = element;
        var tmp_0;
        if (!(entry == null) ? isInterface(entry, Entry) : false) {
          tmp_0 = this.b5(entry);
        } else {
          tmp_0 = false;
        }
        if (!tmp_0) {
          tmp$ret$0 = false;
          break $l$block_0;
        }
      }
      tmp$ret$0 = true;
    }
    return tmp$ret$0;
  }
  initMetadataForInterface(InternalMap, 'InternalMap');
  initMetadataForClass(InternalHashMap, 'InternalHashMap', InternalHashMap_init_$Create$, VOID, [InternalMap]);
  initMetadataForClass(LinkedHashMap, 'LinkedHashMap', LinkedHashMap_init_$Create$, HashMap, [HashMap, KtMap]);
  initMetadataForClass(LinkedHashSet, 'LinkedHashSet', LinkedHashSet_init_$Create$, HashSet, [HashSet, Collection, KtSet]);
  initMetadataForClass(Exception, 'Exception', Exception_init_$Create$, Error);
  initMetadataForClass(RuntimeException, 'RuntimeException', RuntimeException_init_$Create$, Exception);
  initMetadataForClass(IllegalArgumentException, 'IllegalArgumentException', IllegalArgumentException_init_$Create$, RuntimeException);
  initMetadataForClass(IndexOutOfBoundsException, 'IndexOutOfBoundsException', IndexOutOfBoundsException_init_$Create$, RuntimeException);
  initMetadataForClass(IllegalStateException, 'IllegalStateException', IllegalStateException_init_$Create$, RuntimeException);
  initMetadataForClass(UnsupportedOperationException, 'UnsupportedOperationException', UnsupportedOperationException_init_$Create$, RuntimeException);
  initMetadataForClass(NoSuchElementException, 'NoSuchElementException', NoSuchElementException_init_$Create$, RuntimeException);
  initMetadataForClass(NumberFormatException, 'NumberFormatException', NumberFormatException_init_$Create$, IllegalArgumentException);
  initMetadataForClass(ArithmeticException, 'ArithmeticException', ArithmeticException_init_$Create$, RuntimeException);
  initMetadataForClass(ConcurrentModificationException, 'ConcurrentModificationException', ConcurrentModificationException_init_$Create$, RuntimeException);
  initMetadataForClass(NullPointerException, 'NullPointerException', NullPointerException_init_$Create$, RuntimeException);
  initMetadataForClass(NoWhenBranchMatchedException, 'NoWhenBranchMatchedException', NoWhenBranchMatchedException_init_$Create$, RuntimeException);
  initMetadataForClass(ClassCastException, 'ClassCastException', ClassCastException_init_$Create$, RuntimeException);
  initMetadataForInterface(KClass, 'KClass');
  initMetadataForClass(KClassImpl, 'KClassImpl', VOID, VOID, [KClass]);
  initMetadataForObject(NothingKClassImpl, 'NothingKClassImpl', VOID, KClassImpl);
  initMetadataForClass(ErrorKClass, 'ErrorKClass', ErrorKClass, VOID, [KClass]);
  initMetadataForClass(PrimitiveKClassImpl, 'PrimitiveKClassImpl', VOID, KClassImpl);
  initMetadataForClass(SimpleKClassImpl, 'SimpleKClassImpl', VOID, KClassImpl);
  initMetadataForInterface(KProperty1, 'KProperty1');
  initMetadataForObject(PrimitiveClasses, 'PrimitiveClasses');
  initMetadataForClass(StringBuilder, 'StringBuilder', StringBuilder_init_$Create$_0, VOID, [CharSequence]);
  initMetadataForClass(sam$kotlin_Comparator$0, 'sam$kotlin_Comparator$0', VOID, VOID, [Comparator, FunctionAdapter]);
  initMetadataForCompanion(Companion_2);
  initMetadataForCompanion(Companion_3);
  initMetadataForCompanion(Companion_4);
  initMetadataForCompanion(Companion_5);
  initMetadataForClass(ArrayDeque, 'ArrayDeque', ArrayDeque_init_$Create$, AbstractMutableList);
  initMetadataForObject(EmptyList, 'EmptyList', VOID, VOID, [KtList]);
  initMetadataForObject(EmptyIterator, 'EmptyIterator');
  initMetadataForClass(ArrayAsCollection, 'ArrayAsCollection', VOID, VOID, [Collection]);
  initMetadataForObject(EmptyMap, 'EmptyMap', VOID, VOID, [KtMap]);
  initMetadataForObject(EmptySet, 'EmptySet', VOID, VOID, [KtSet]);
  initMetadataForClass(UnsafeLazyImpl, 'UnsafeLazyImpl');
  initMetadataForObject(UNINITIALIZED_VALUE, 'UNINITIALIZED_VALUE');
  initMetadataForClass(Pair, 'Pair');
  //endregion
  function CharSequence() {
  }
  function Comparable() {
  }
  function Number_0() {
  }
  function Unit() {
  }
  protoOf(Unit).toString = function () {
    return 'kotlin.Unit';
  };
  var Unit_instance;
  function Unit_getInstance() {
    return Unit_instance;
  }
  function indexOf(_this__u8e3s4, element) {
    if (element == null) {
      var inductionVariable = 0;
      var last = _this__u8e3s4.length - 1 | 0;
      if (inductionVariable <= last)
        do {
          var index = inductionVariable;
          inductionVariable = inductionVariable + 1 | 0;
          if (_this__u8e3s4[index] == null) {
            return index;
          }
        }
         while (inductionVariable <= last);
    } else {
      var inductionVariable_0 = 0;
      var last_0 = _this__u8e3s4.length - 1 | 0;
      if (inductionVariable_0 <= last_0)
        do {
          var index_0 = inductionVariable_0;
          inductionVariable_0 = inductionVariable_0 + 1 | 0;
          if (equals(element, _this__u8e3s4[index_0])) {
            return index_0;
          }
        }
         while (inductionVariable_0 <= last_0);
    }
    return -1;
  }
  function get_lastIndex(_this__u8e3s4) {
    return _this__u8e3s4.length - 1 | 0;
  }
  function joinToString(_this__u8e3s4, separator, prefix, postfix, limit, truncated, transform) {
    separator = separator === VOID ? ', ' : separator;
    prefix = prefix === VOID ? '' : prefix;
    postfix = postfix === VOID ? '' : postfix;
    limit = limit === VOID ? -1 : limit;
    truncated = truncated === VOID ? '...' : truncated;
    transform = transform === VOID ? null : transform;
    return joinTo(_this__u8e3s4, StringBuilder_init_$Create$_0(), separator, prefix, postfix, limit, truncated, transform).toString();
  }
  function toCollection(_this__u8e3s4, destination) {
    var inductionVariable = 0;
    var last = _this__u8e3s4.length;
    while (inductionVariable < last) {
      var item = _this__u8e3s4[inductionVariable];
      inductionVariable = inductionVariable + 1 | 0;
      destination.e(item);
    }
    return destination;
  }
  function contains(_this__u8e3s4, element) {
    return indexOf(_this__u8e3s4, element) >= 0;
  }
  function joinTo(_this__u8e3s4, buffer, separator, prefix, postfix, limit, truncated, transform) {
    separator = separator === VOID ? ', ' : separator;
    prefix = prefix === VOID ? '' : prefix;
    postfix = postfix === VOID ? '' : postfix;
    limit = limit === VOID ? -1 : limit;
    truncated = truncated === VOID ? '...' : truncated;
    transform = transform === VOID ? null : transform;
    buffer.f(prefix);
    var count = 0;
    var inductionVariable = 0;
    var last = _this__u8e3s4.length;
    $l$loop: while (inductionVariable < last) {
      var element = _this__u8e3s4[inductionVariable];
      inductionVariable = inductionVariable + 1 | 0;
      count = count + 1 | 0;
      if (count > 1) {
        buffer.f(separator);
      }
      if (limit < 0 || count <= limit) {
        appendElement(buffer, element, transform);
      } else
        break $l$loop;
    }
    if (limit >= 0 && count > limit) {
      buffer.f(truncated);
    }
    buffer.f(postfix);
    return buffer;
  }
  function joinToString_0(_this__u8e3s4, separator, prefix, postfix, limit, truncated, transform) {
    separator = separator === VOID ? ', ' : separator;
    prefix = prefix === VOID ? '' : prefix;
    postfix = postfix === VOID ? '' : postfix;
    limit = limit === VOID ? -1 : limit;
    truncated = truncated === VOID ? '...' : truncated;
    transform = transform === VOID ? null : transform;
    return joinTo_0(_this__u8e3s4, StringBuilder_init_$Create$_0(), separator, prefix, postfix, limit, truncated, transform).toString();
  }
  function joinTo_0(_this__u8e3s4, buffer, separator, prefix, postfix, limit, truncated, transform) {
    separator = separator === VOID ? ', ' : separator;
    prefix = prefix === VOID ? '' : prefix;
    postfix = postfix === VOID ? '' : postfix;
    limit = limit === VOID ? -1 : limit;
    truncated = truncated === VOID ? '...' : truncated;
    transform = transform === VOID ? null : transform;
    buffer.f(prefix);
    var count = 0;
    var tmp0_iterator = _this__u8e3s4.g();
    $l$loop: while (tmp0_iterator.h()) {
      var element = tmp0_iterator.i();
      count = count + 1 | 0;
      if (count > 1) {
        buffer.f(separator);
      }
      if (limit < 0 || count <= limit) {
        appendElement(buffer, element, transform);
      } else
        break $l$loop;
    }
    if (limit >= 0 && count > limit) {
      buffer.f(truncated);
    }
    buffer.f(postfix);
    return buffer;
  }
  function plus(_this__u8e3s4, elements) {
    if (isInterface(elements, Collection)) {
      var result = ArrayList_init_$Create$_0(_this__u8e3s4.j() + elements.j() | 0);
      result.n(_this__u8e3s4);
      result.n(elements);
      return result;
    } else {
      var result_0 = ArrayList_init_$Create$_1(_this__u8e3s4);
      addAll(result_0, elements);
      return result_0;
    }
  }
  function toSet(_this__u8e3s4) {
    if (isInterface(_this__u8e3s4, Collection)) {
      var tmp;
      switch (_this__u8e3s4.j()) {
        case 0:
          tmp = emptySet();
          break;
        case 1:
          var tmp_0;
          if (isInterface(_this__u8e3s4, KtList)) {
            tmp_0 = _this__u8e3s4.o(0);
          } else {
            tmp_0 = _this__u8e3s4.g().i();
          }

          tmp = setOf(tmp_0);
          break;
        default:
          tmp = toCollection_0(_this__u8e3s4, LinkedHashSet_init_$Create$_0(mapCapacity(_this__u8e3s4.j())));
          break;
      }
      return tmp;
    }
    return optimizeReadOnlySet(toCollection_0(_this__u8e3s4, LinkedHashSet_init_$Create$()));
  }
  function toCollection_0(_this__u8e3s4, destination) {
    var tmp0_iterator = _this__u8e3s4.g();
    while (tmp0_iterator.h()) {
      var item = tmp0_iterator.i();
      destination.e(item);
    }
    return destination;
  }
  function toList(_this__u8e3s4) {
    if (isInterface(_this__u8e3s4, Collection)) {
      var tmp;
      switch (_this__u8e3s4.j()) {
        case 0:
          tmp = emptyList();
          break;
        case 1:
          var tmp_0;
          if (isInterface(_this__u8e3s4, KtList)) {
            tmp_0 = _this__u8e3s4.o(0);
          } else {
            tmp_0 = _this__u8e3s4.g().i();
          }

          tmp = listOf(tmp_0);
          break;
        default:
          tmp = toMutableList(_this__u8e3s4);
          break;
      }
      return tmp;
    }
    return optimizeReadOnlyList(toMutableList_0(_this__u8e3s4));
  }
  function sortedWith(_this__u8e3s4, comparator) {
    if (isInterface(_this__u8e3s4, Collection)) {
      if (_this__u8e3s4.j() <= 1)
        return toList(_this__u8e3s4);
      // Inline function 'kotlin.apply' call
      // Inline function 'kotlin.collections.toTypedArray' call
      var tmp = copyToArray(_this__u8e3s4);
      var this_0 = isArray(tmp) ? tmp : THROW_CCE();
      // Inline function 'kotlin.contracts.contract' call
      // Inline function 'kotlin.collections.sortedWith.<anonymous>' call
      sortWith(this_0, comparator);
      return asList(this_0);
    }
    // Inline function 'kotlin.apply' call
    var this_1 = toMutableList_0(_this__u8e3s4);
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'kotlin.collections.sortedWith.<anonymous>' call
    sortWith_0(this_1, comparator);
    return this_1;
  }
  function toMutableList(_this__u8e3s4) {
    return ArrayList_init_$Create$_1(_this__u8e3s4);
  }
  function toMutableList_0(_this__u8e3s4) {
    if (isInterface(_this__u8e3s4, Collection))
      return toMutableList(_this__u8e3s4);
    return toCollection_0(_this__u8e3s4, ArrayList_init_$Create$());
  }
  function coerceAtMost(_this__u8e3s4, maximumValue) {
    return _this__u8e3s4 > maximumValue ? maximumValue : _this__u8e3s4;
  }
  function coerceAtLeast(_this__u8e3s4, minimumValue) {
    return _this__u8e3s4 < minimumValue ? minimumValue : _this__u8e3s4;
  }
  function _Char___init__impl__6a9atx(value) {
    return value;
  }
  function _get_value__a43j40($this) {
    return $this;
  }
  function _Char___init__impl__6a9atx_0(code) {
    // Inline function 'kotlin.UShort.toInt' call
    var tmp$ret$0 = _UShort___get_data__impl__g0245(code) & 65535;
    return _Char___init__impl__6a9atx(tmp$ret$0);
  }
  function Char__compareTo_impl_ypi4mb($this, other) {
    return _get_value__a43j40($this) - _get_value__a43j40(other) | 0;
  }
  function Char__minus_impl_a2frrh($this, other) {
    return _get_value__a43j40($this) - _get_value__a43j40(other) | 0;
  }
  function Char__toInt_impl_vasixd($this) {
    return _get_value__a43j40($this);
  }
  function toString($this) {
    // Inline function 'kotlin.js.unsafeCast' call
    return String.fromCharCode(_get_value__a43j40($this));
  }
  function Char() {
  }
  function KtList() {
  }
  function Collection() {
  }
  function Entry() {
  }
  function KtMap() {
  }
  function KtSet() {
  }
  function toString_0(_this__u8e3s4) {
    var tmp1_elvis_lhs = _this__u8e3s4 == null ? null : toString_1(_this__u8e3s4);
    return tmp1_elvis_lhs == null ? 'null' : tmp1_elvis_lhs;
  }
  function Companion() {
    Companion_instance = this;
    this.y_1 = new Long(0, -2147483648);
    this.z_1 = new Long(-1, 2147483647);
    this.a1_1 = 8;
    this.b1_1 = 64;
  }
  var Companion_instance;
  function Companion_getInstance() {
    if (Companion_instance == null)
      new Companion();
    return Companion_instance;
  }
  function Long(low, high) {
    Companion_getInstance();
    Number_0.call(this);
    this.c1_1 = low;
    this.d1_1 = high;
  }
  protoOf(Long).e1 = function (other) {
    return compare(this, other);
  };
  protoOf(Long).d = function (other) {
    return this.e1(other instanceof Long ? other : THROW_CCE());
  };
  protoOf(Long).f1 = function (other) {
    return add(this, other);
  };
  protoOf(Long).g1 = function (other) {
    return multiply(this, other);
  };
  protoOf(Long).h1 = function (other) {
    return divide(this, other);
  };
  protoOf(Long).i1 = function (other) {
    return modulo(this, other);
  };
  protoOf(Long).j1 = function () {
    return this.k1().f1(new Long(1, 0));
  };
  protoOf(Long).l1 = function (bitCount) {
    return shiftLeft(this, bitCount);
  };
  protoOf(Long).m1 = function (bitCount) {
    return shiftRightUnsigned(this, bitCount);
  };
  protoOf(Long).n1 = function (other) {
    return new Long(this.c1_1 & other.c1_1, this.d1_1 & other.d1_1);
  };
  protoOf(Long).o1 = function (other) {
    return new Long(this.c1_1 ^ other.c1_1, this.d1_1 ^ other.d1_1);
  };
  protoOf(Long).k1 = function () {
    return new Long(~this.c1_1, ~this.d1_1);
  };
  protoOf(Long).p1 = function () {
    return this.c1_1;
  };
  protoOf(Long).q1 = function () {
    return toNumber(this);
  };
  protoOf(Long).toString = function () {
    return toStringImpl(this, 10);
  };
  protoOf(Long).equals = function (other) {
    var tmp;
    if (other instanceof Long) {
      tmp = equalsLong(this, other);
    } else {
      tmp = false;
    }
    return tmp;
  };
  protoOf(Long).hashCode = function () {
    return hashCode_0(this);
  };
  protoOf(Long).valueOf = function () {
    return this.q1();
  };
  function implement(interfaces) {
    var maxSize = 1;
    var masks = [];
    var inductionVariable = 0;
    var last = interfaces.length;
    while (inductionVariable < last) {
      var i = interfaces[inductionVariable];
      inductionVariable = inductionVariable + 1 | 0;
      var currentSize = maxSize;
      var tmp1_elvis_lhs = i.prototype.$imask$;
      var imask = tmp1_elvis_lhs == null ? i.$imask$ : tmp1_elvis_lhs;
      if (!(imask == null)) {
        masks.push(imask);
        currentSize = imask.length;
      }
      var iid = i.$metadata$.iid;
      var tmp;
      if (iid == null) {
        tmp = null;
      } else {
        // Inline function 'kotlin.let' call
        // Inline function 'kotlin.contracts.contract' call
        // Inline function 'kotlin.js.implement.<anonymous>' call
        tmp = bitMaskWith(iid);
      }
      var iidImask = tmp;
      if (!(iidImask == null)) {
        masks.push(iidImask);
        currentSize = Math.max(currentSize, iidImask.length);
      }
      if (currentSize > maxSize) {
        maxSize = currentSize;
      }
    }
    return compositeBitMask(maxSize, masks);
  }
  function bitMaskWith(activeBit) {
    var numberIndex = activeBit >> 5;
    var intArray = new Int32Array(numberIndex + 1 | 0);
    var positionInNumber = activeBit & 31;
    var numberWithSettledBit = 1 << positionInNumber;
    intArray[numberIndex] = intArray[numberIndex] | numberWithSettledBit;
    return intArray;
  }
  function compositeBitMask(capacity, masks) {
    var tmp = 0;
    var tmp_0 = new Int32Array(capacity);
    while (tmp < capacity) {
      var tmp_1 = tmp;
      var result = 0;
      var inductionVariable = 0;
      var last = masks.length;
      while (inductionVariable < last) {
        var mask = masks[inductionVariable];
        inductionVariable = inductionVariable + 1 | 0;
        if (tmp_1 < mask.length) {
          result = result | mask[tmp_1];
        }
      }
      tmp_0[tmp_1] = result;
      tmp = tmp + 1 | 0;
    }
    return tmp_0;
  }
  function isBitSet(_this__u8e3s4, possibleActiveBit) {
    var numberIndex = possibleActiveBit >> 5;
    if (numberIndex > _this__u8e3s4.length)
      return false;
    var positionInNumber = possibleActiveBit & 31;
    var numberWithSettledBit = 1 << positionInNumber;
    return !((_this__u8e3s4[numberIndex] & numberWithSettledBit) === 0);
  }
  function FunctionAdapter() {
  }
  function fillArrayVal(array, initValue) {
    var inductionVariable = 0;
    var last = array.length - 1 | 0;
    if (inductionVariable <= last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        array[i] = initValue;
      }
       while (!(i === last));
    return array;
  }
  function arrayIterator(array) {
    return new arrayIterator$1(array);
  }
  function charArray(size) {
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'withType' call
    var type = 'CharArray';
    var array = new Uint16Array(size);
    array.$type$ = type;
    return array;
  }
  function arrayIterator$1($array) {
    this.t1_1 = $array;
    this.s1_1 = 0;
  }
  protoOf(arrayIterator$1).h = function () {
    return !(this.s1_1 === this.t1_1.length);
  };
  protoOf(arrayIterator$1).i = function () {
    var tmp;
    if (!(this.s1_1 === this.t1_1.length)) {
      var tmp1 = this.s1_1;
      this.s1_1 = tmp1 + 1 | 0;
      tmp = this.t1_1[tmp1];
    } else {
      throw NoSuchElementException_init_$Create$_0('' + this.s1_1);
    }
    return tmp;
  };
  function get_buf() {
    _init_properties_bitUtils_kt__nfcg4k();
    return buf;
  }
  var buf;
  function get_bufFloat64() {
    _init_properties_bitUtils_kt__nfcg4k();
    return bufFloat64;
  }
  var bufFloat64;
  var bufFloat32;
  function get_bufInt32() {
    _init_properties_bitUtils_kt__nfcg4k();
    return bufInt32;
  }
  var bufInt32;
  function get_lowIndex() {
    _init_properties_bitUtils_kt__nfcg4k();
    return lowIndex;
  }
  var lowIndex;
  function get_highIndex() {
    _init_properties_bitUtils_kt__nfcg4k();
    return highIndex;
  }
  var highIndex;
  function getNumberHashCode(obj) {
    _init_properties_bitUtils_kt__nfcg4k();
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.jsBitwiseOr' call
    // Inline function 'kotlin.js.asDynamic' call
    if ((obj | 0) === obj) {
      return numberToInt(obj);
    }
    get_bufFloat64()[0] = obj;
    return imul(get_bufInt32()[get_highIndex()], 31) + get_bufInt32()[get_lowIndex()] | 0;
  }
  var properties_initialized_bitUtils_kt_i2bo3e;
  function _init_properties_bitUtils_kt__nfcg4k() {
    if (!properties_initialized_bitUtils_kt_i2bo3e) {
      properties_initialized_bitUtils_kt_i2bo3e = true;
      buf = new ArrayBuffer(8);
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      bufFloat64 = new Float64Array(get_buf());
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      bufFloat32 = new Float32Array(get_buf());
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      bufInt32 = new Int32Array(get_buf());
      // Inline function 'kotlin.run' call
      // Inline function 'kotlin.contracts.contract' call
      // Inline function 'kotlin.js.lowIndex.<anonymous>' call
      get_bufFloat64()[0] = -1.0;
      lowIndex = !(get_bufInt32()[0] === 0) ? 1 : 0;
      highIndex = 1 - get_lowIndex() | 0;
    }
  }
  function charSequenceGet(a, index) {
    var tmp;
    if (isString(a)) {
      // Inline function 'kotlin.Char' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var code = a.charCodeAt(index);
      var tmp_0;
      // Inline function 'kotlin.code' call
      var this_0 = _Char___init__impl__6a9atx(0);
      if (code < Char__toInt_impl_vasixd(this_0)) {
        tmp_0 = true;
      } else {
        // Inline function 'kotlin.code' call
        var this_1 = _Char___init__impl__6a9atx(65535);
        tmp_0 = code > Char__toInt_impl_vasixd(this_1);
      }
      if (tmp_0) {
        throw IllegalArgumentException_init_$Create$_0('Invalid Char code: ' + code);
      }
      tmp = numberToChar(code);
    } else {
      tmp = a.b(index);
    }
    return tmp;
  }
  function isString(a) {
    return typeof a === 'string';
  }
  function charSequenceLength(a) {
    var tmp;
    if (isString(a)) {
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      tmp = a.length;
    } else {
      tmp = a.a();
    }
    return tmp;
  }
  function charSequenceSubSequence(a, startIndex, endIndex) {
    var tmp;
    if (isString(a)) {
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      tmp = a.substring(startIndex, endIndex);
    } else {
      tmp = a.c(startIndex, endIndex);
    }
    return tmp;
  }
  function arrayToString(array) {
    return joinToString(array, ', ', '[', ']', VOID, VOID, arrayToString$lambda);
  }
  function arrayToString$lambda(it) {
    return toString_1(it);
  }
  function compareTo(a, b) {
    var tmp;
    switch (typeof a) {
      case 'number':
        var tmp_0;
        if (typeof b === 'number') {
          tmp_0 = doubleCompareTo(a, b);
        } else {
          if (b instanceof Long) {
            tmp_0 = doubleCompareTo(a, b.q1());
          } else {
            tmp_0 = primitiveCompareTo(a, b);
          }
        }

        tmp = tmp_0;
        break;
      case 'string':
      case 'boolean':
        tmp = primitiveCompareTo(a, b);
        break;
      default:
        tmp = compareToDoNotIntrinsicify(a, b);
        break;
    }
    return tmp;
  }
  function doubleCompareTo(a, b) {
    var tmp;
    if (a < b) {
      tmp = -1;
    } else if (a > b) {
      tmp = 1;
    } else if (a === b) {
      var tmp_0;
      if (a !== 0) {
        tmp_0 = 0;
      } else {
        // Inline function 'kotlin.js.asDynamic' call
        var ia = 1 / a;
        var tmp_1;
        // Inline function 'kotlin.js.asDynamic' call
        if (ia === 1 / b) {
          tmp_1 = 0;
        } else {
          if (ia < 0) {
            tmp_1 = -1;
          } else {
            tmp_1 = 1;
          }
        }
        tmp_0 = tmp_1;
      }
      tmp = tmp_0;
    } else if (a !== a) {
      tmp = b !== b ? 0 : 1;
    } else {
      tmp = -1;
    }
    return tmp;
  }
  function primitiveCompareTo(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
  }
  function compareToDoNotIntrinsicify(a, b) {
    return a.d(b);
  }
  function getObjectHashCode(obj) {
    // Inline function 'kotlin.js.jsIn' call
    if (!('kotlinHashCodeValue$' in obj)) {
      var hash = calculateRandomHash();
      var descriptor = new Object();
      descriptor.value = hash;
      descriptor.enumerable = false;
      Object.defineProperty(obj, 'kotlinHashCodeValue$', descriptor);
    }
    // Inline function 'kotlin.js.unsafeCast' call
    return obj['kotlinHashCodeValue$'];
  }
  function calculateRandomHash() {
    // Inline function 'kotlin.js.jsBitwiseOr' call
    return Math.random() * 4.294967296E9 | 0;
  }
  function objectCreate(proto) {
    proto = proto === VOID ? null : proto;
    return Object.create(proto);
  }
  function defineProp(obj, name, getter, setter) {
    return Object.defineProperty(obj, name, {configurable: true, get: getter, set: setter});
  }
  function toString_1(o) {
    var tmp;
    if (o == null) {
      tmp = 'null';
    } else if (isArrayish(o)) {
      tmp = '[...]';
    } else if (!(typeof o.toString === 'function')) {
      tmp = anyToString(o);
    } else {
      // Inline function 'kotlin.js.unsafeCast' call
      tmp = o.toString();
    }
    return tmp;
  }
  function anyToString(o) {
    return Object.prototype.toString.call(o);
  }
  function hashCode(obj) {
    if (obj == null)
      return 0;
    var typeOf = typeof obj;
    var tmp;
    switch (typeOf) {
      case 'object':
        tmp = 'function' === typeof obj.hashCode ? obj.hashCode() : getObjectHashCode(obj);
        break;
      case 'function':
        tmp = getObjectHashCode(obj);
        break;
      case 'number':
        tmp = getNumberHashCode(obj);
        break;
      case 'boolean':
        // Inline function 'kotlin.js.unsafeCast' call

        tmp = getBooleanHashCode(obj);
        break;
      case 'string':
        tmp = getStringHashCode(String(obj));
        break;
      case 'bigint':
        tmp = getBigIntHashCode(obj);
        break;
      case 'symbol':
        tmp = getSymbolHashCode(obj);
        break;
      default:
        tmp = function () {
          throw new Error('Unexpected typeof `' + typeOf + '`');
        }();
        break;
    }
    return tmp;
  }
  function getBooleanHashCode(value) {
    return value ? 1231 : 1237;
  }
  function getStringHashCode(str) {
    var hash = 0;
    var length = str.length;
    var inductionVariable = 0;
    var last = length - 1 | 0;
    if (inductionVariable <= last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        // Inline function 'kotlin.js.asDynamic' call
        var code = str.charCodeAt(i);
        hash = imul(hash, 31) + code | 0;
      }
       while (!(i === last));
    return hash;
  }
  function getBigIntHashCode(value) {
    var shiftNumber = BigInt(32);
    var MASK = BigInt(4.294967295E9);
    var bigNumber = value < 0 ? -value : value;
    var hashCode = 0;
    var signum = value < 0 ? -1 : 1;
    while (bigNumber != 0) {
      // Inline function 'kotlin.js.unsafeCast' call
      var chunk = Number(bigNumber & MASK);
      hashCode = imul(31, hashCode) + chunk | 0;
      bigNumber = bigNumber >> shiftNumber;
    }
    return imul(hashCode, signum);
  }
  function getSymbolHashCode(value) {
    var hashCodeMap = symbolIsSharable(value) ? getSymbolMap() : getSymbolWeakMap();
    var cachedHashCode = hashCodeMap.get(value);
    if (cachedHashCode !== VOID)
      return cachedHashCode;
    var hash = calculateRandomHash();
    hashCodeMap.set(value, hash);
    return hash;
  }
  function symbolIsSharable(symbol) {
    return Symbol.keyFor(symbol) != VOID;
  }
  function getSymbolMap() {
    if (symbolMap === VOID) {
      symbolMap = new Map();
    }
    return symbolMap;
  }
  function getSymbolWeakMap() {
    if (symbolWeakMap === VOID) {
      symbolWeakMap = new WeakMap();
    }
    return symbolWeakMap;
  }
  var symbolMap;
  var symbolWeakMap;
  function equals(obj1, obj2) {
    if (obj1 == null) {
      return obj2 == null;
    }
    if (obj2 == null) {
      return false;
    }
    if (typeof obj1 === 'object' && typeof obj1.equals === 'function') {
      return obj1.equals(obj2);
    }
    if (obj1 !== obj1) {
      return obj2 !== obj2;
    }
    if (typeof obj1 === 'number' && typeof obj2 === 'number') {
      var tmp;
      if (obj1 === obj2) {
        var tmp_0;
        if (obj1 !== 0) {
          tmp_0 = true;
        } else {
          // Inline function 'kotlin.js.asDynamic' call
          var tmp_1 = 1 / obj1;
          // Inline function 'kotlin.js.asDynamic' call
          tmp_0 = tmp_1 === 1 / obj2;
        }
        tmp = tmp_0;
      } else {
        tmp = false;
      }
      return tmp;
    }
    return obj1 === obj2;
  }
  function unboxIntrinsic(x) {
    var message = 'Should be lowered';
    throw IllegalStateException_init_$Create$_0(toString_1(message));
  }
  function captureStack(instance, constructorFunction) {
    if (Error.captureStackTrace != null) {
      Error.captureStackTrace(instance, constructorFunction);
    } else {
      // Inline function 'kotlin.js.asDynamic' call
      instance.stack = (new Error()).stack;
    }
  }
  function protoOf(constructor) {
    return constructor.prototype;
  }
  function extendThrowable(this_, message, cause) {
    Error.call(this_);
    setPropertiesToThrowableInstance(this_, message, cause);
  }
  function setPropertiesToThrowableInstance(this_, message, cause) {
    var errorInfo = calculateErrorInfo(Object.getPrototypeOf(this_));
    if ((errorInfo & 1) === 0) {
      var tmp;
      if (message == null) {
        var tmp_0;
        if (!(message === null)) {
          var tmp1_elvis_lhs = cause == null ? null : cause.toString();
          tmp_0 = tmp1_elvis_lhs == null ? VOID : tmp1_elvis_lhs;
        } else {
          tmp_0 = VOID;
        }
        tmp = tmp_0;
      } else {
        tmp = message;
      }
      this_.message = tmp;
    }
    if ((errorInfo & 2) === 0) {
      this_.cause = cause;
    }
    this_.name = Object.getPrototypeOf(this_).constructor.name;
  }
  function ensureNotNull(v) {
    var tmp;
    if (v == null) {
      THROW_NPE();
    } else {
      tmp = v;
    }
    return tmp;
  }
  function THROW_NPE() {
    throw NullPointerException_init_$Create$();
  }
  function noWhenBranchMatchedException() {
    throw NoWhenBranchMatchedException_init_$Create$();
  }
  function THROW_CCE() {
    throw ClassCastException_init_$Create$();
  }
  function get_ZERO() {
    _init_properties_longJs_kt__elc2w5();
    return ZERO;
  }
  var ZERO;
  function get_ONE() {
    _init_properties_longJs_kt__elc2w5();
    return ONE;
  }
  var ONE;
  function get_NEG_ONE() {
    _init_properties_longJs_kt__elc2w5();
    return NEG_ONE;
  }
  var NEG_ONE;
  function get_MAX_VALUE() {
    _init_properties_longJs_kt__elc2w5();
    return MAX_VALUE;
  }
  var MAX_VALUE;
  function get_MIN_VALUE() {
    _init_properties_longJs_kt__elc2w5();
    return MIN_VALUE;
  }
  var MIN_VALUE;
  function get_TWO_PWR_24_() {
    _init_properties_longJs_kt__elc2w5();
    return TWO_PWR_24_;
  }
  var TWO_PWR_24_;
  function compare(_this__u8e3s4, other) {
    _init_properties_longJs_kt__elc2w5();
    if (equalsLong(_this__u8e3s4, other)) {
      return 0;
    }
    var thisNeg = isNegative(_this__u8e3s4);
    var otherNeg = isNegative(other);
    return thisNeg && !otherNeg ? -1 : !thisNeg && otherNeg ? 1 : isNegative(subtract(_this__u8e3s4, other)) ? -1 : 1;
  }
  function add(_this__u8e3s4, other) {
    _init_properties_longJs_kt__elc2w5();
    var a48 = _this__u8e3s4.d1_1 >>> 16 | 0;
    var a32 = _this__u8e3s4.d1_1 & 65535;
    var a16 = _this__u8e3s4.c1_1 >>> 16 | 0;
    var a00 = _this__u8e3s4.c1_1 & 65535;
    var b48 = other.d1_1 >>> 16 | 0;
    var b32 = other.d1_1 & 65535;
    var b16 = other.c1_1 >>> 16 | 0;
    var b00 = other.c1_1 & 65535;
    var c48 = 0;
    var c32 = 0;
    var c16 = 0;
    var c00 = 0;
    c00 = c00 + (a00 + b00 | 0) | 0;
    c16 = c16 + (c00 >>> 16 | 0) | 0;
    c00 = c00 & 65535;
    c16 = c16 + (a16 + b16 | 0) | 0;
    c32 = c32 + (c16 >>> 16 | 0) | 0;
    c16 = c16 & 65535;
    c32 = c32 + (a32 + b32 | 0) | 0;
    c48 = c48 + (c32 >>> 16 | 0) | 0;
    c32 = c32 & 65535;
    c48 = c48 + (a48 + b48 | 0) | 0;
    c48 = c48 & 65535;
    return new Long(c16 << 16 | c00, c48 << 16 | c32);
  }
  function subtract(_this__u8e3s4, other) {
    _init_properties_longJs_kt__elc2w5();
    return add(_this__u8e3s4, other.j1());
  }
  function multiply(_this__u8e3s4, other) {
    _init_properties_longJs_kt__elc2w5();
    if (isZero(_this__u8e3s4)) {
      return get_ZERO();
    } else if (isZero(other)) {
      return get_ZERO();
    }
    if (equalsLong(_this__u8e3s4, get_MIN_VALUE())) {
      return isOdd(other) ? get_MIN_VALUE() : get_ZERO();
    } else if (equalsLong(other, get_MIN_VALUE())) {
      return isOdd(_this__u8e3s4) ? get_MIN_VALUE() : get_ZERO();
    }
    if (isNegative(_this__u8e3s4)) {
      var tmp;
      if (isNegative(other)) {
        tmp = multiply(negate(_this__u8e3s4), negate(other));
      } else {
        tmp = negate(multiply(negate(_this__u8e3s4), other));
      }
      return tmp;
    } else if (isNegative(other)) {
      return negate(multiply(_this__u8e3s4, negate(other)));
    }
    if (lessThan(_this__u8e3s4, get_TWO_PWR_24_()) && lessThan(other, get_TWO_PWR_24_())) {
      return fromNumber(toNumber(_this__u8e3s4) * toNumber(other));
    }
    var a48 = _this__u8e3s4.d1_1 >>> 16 | 0;
    var a32 = _this__u8e3s4.d1_1 & 65535;
    var a16 = _this__u8e3s4.c1_1 >>> 16 | 0;
    var a00 = _this__u8e3s4.c1_1 & 65535;
    var b48 = other.d1_1 >>> 16 | 0;
    var b32 = other.d1_1 & 65535;
    var b16 = other.c1_1 >>> 16 | 0;
    var b00 = other.c1_1 & 65535;
    var c48 = 0;
    var c32 = 0;
    var c16 = 0;
    var c00 = 0;
    c00 = c00 + imul(a00, b00) | 0;
    c16 = c16 + (c00 >>> 16 | 0) | 0;
    c00 = c00 & 65535;
    c16 = c16 + imul(a16, b00) | 0;
    c32 = c32 + (c16 >>> 16 | 0) | 0;
    c16 = c16 & 65535;
    c16 = c16 + imul(a00, b16) | 0;
    c32 = c32 + (c16 >>> 16 | 0) | 0;
    c16 = c16 & 65535;
    c32 = c32 + imul(a32, b00) | 0;
    c48 = c48 + (c32 >>> 16 | 0) | 0;
    c32 = c32 & 65535;
    c32 = c32 + imul(a16, b16) | 0;
    c48 = c48 + (c32 >>> 16 | 0) | 0;
    c32 = c32 & 65535;
    c32 = c32 + imul(a00, b32) | 0;
    c48 = c48 + (c32 >>> 16 | 0) | 0;
    c32 = c32 & 65535;
    c48 = c48 + (((imul(a48, b00) + imul(a32, b16) | 0) + imul(a16, b32) | 0) + imul(a00, b48) | 0) | 0;
    c48 = c48 & 65535;
    return new Long(c16 << 16 | c00, c48 << 16 | c32);
  }
  function divide(_this__u8e3s4, other) {
    _init_properties_longJs_kt__elc2w5();
    if (isZero(other)) {
      throw Exception_init_$Create$_0('division by zero');
    } else if (isZero(_this__u8e3s4)) {
      return get_ZERO();
    }
    if (equalsLong(_this__u8e3s4, get_MIN_VALUE())) {
      if (equalsLong(other, get_ONE()) || equalsLong(other, get_NEG_ONE())) {
        return get_MIN_VALUE();
      } else if (equalsLong(other, get_MIN_VALUE())) {
        return get_ONE();
      } else {
        var halfThis = shiftRight(_this__u8e3s4, 1);
        var approx = shiftLeft(halfThis.h1(other), 1);
        if (equalsLong(approx, get_ZERO())) {
          return isNegative(other) ? get_ONE() : get_NEG_ONE();
        } else {
          var rem = subtract(_this__u8e3s4, multiply(other, approx));
          return add(approx, rem.h1(other));
        }
      }
    } else if (equalsLong(other, get_MIN_VALUE())) {
      return get_ZERO();
    }
    if (isNegative(_this__u8e3s4)) {
      var tmp;
      if (isNegative(other)) {
        tmp = negate(_this__u8e3s4).h1(negate(other));
      } else {
        tmp = negate(negate(_this__u8e3s4).h1(other));
      }
      return tmp;
    } else if (isNegative(other)) {
      return negate(_this__u8e3s4.h1(negate(other)));
    }
    var res = get_ZERO();
    var rem_0 = _this__u8e3s4;
    while (greaterThanOrEqual(rem_0, other)) {
      var approxDouble = toNumber(rem_0) / toNumber(other);
      var approx2 = Math.max(1.0, Math.floor(approxDouble));
      var log2 = Math.ceil(Math.log(approx2) / Math.LN2);
      var delta = log2 <= 48 ? 1.0 : Math.pow(2.0, log2 - 48);
      var approxRes = fromNumber(approx2);
      var approxRem = multiply(approxRes, other);
      while (isNegative(approxRem) || greaterThan(approxRem, rem_0)) {
        approx2 = approx2 - delta;
        approxRes = fromNumber(approx2);
        approxRem = multiply(approxRes, other);
      }
      if (isZero(approxRes)) {
        approxRes = get_ONE();
      }
      res = add(res, approxRes);
      rem_0 = subtract(rem_0, approxRem);
    }
    return res;
  }
  function modulo(_this__u8e3s4, other) {
    _init_properties_longJs_kt__elc2w5();
    return subtract(_this__u8e3s4, multiply(_this__u8e3s4.h1(other), other));
  }
  function shiftLeft(_this__u8e3s4, numBits) {
    _init_properties_longJs_kt__elc2w5();
    var numBits_0 = numBits & 63;
    if (numBits_0 === 0) {
      return _this__u8e3s4;
    } else {
      if (numBits_0 < 32) {
        return new Long(_this__u8e3s4.c1_1 << numBits_0, _this__u8e3s4.d1_1 << numBits_0 | (_this__u8e3s4.c1_1 >>> (32 - numBits_0 | 0) | 0));
      } else {
        return new Long(0, _this__u8e3s4.c1_1 << (numBits_0 - 32 | 0));
      }
    }
  }
  function shiftRight(_this__u8e3s4, numBits) {
    _init_properties_longJs_kt__elc2w5();
    var numBits_0 = numBits & 63;
    if (numBits_0 === 0) {
      return _this__u8e3s4;
    } else {
      if (numBits_0 < 32) {
        return new Long(_this__u8e3s4.c1_1 >>> numBits_0 | 0 | _this__u8e3s4.d1_1 << (32 - numBits_0 | 0), _this__u8e3s4.d1_1 >> numBits_0);
      } else {
        return new Long(_this__u8e3s4.d1_1 >> (numBits_0 - 32 | 0), _this__u8e3s4.d1_1 >= 0 ? 0 : -1);
      }
    }
  }
  function shiftRightUnsigned(_this__u8e3s4, numBits) {
    _init_properties_longJs_kt__elc2w5();
    var numBits_0 = numBits & 63;
    if (numBits_0 === 0) {
      return _this__u8e3s4;
    } else {
      if (numBits_0 < 32) {
        return new Long(_this__u8e3s4.c1_1 >>> numBits_0 | 0 | _this__u8e3s4.d1_1 << (32 - numBits_0 | 0), _this__u8e3s4.d1_1 >>> numBits_0 | 0);
      } else {
        var tmp;
        if (numBits_0 === 32) {
          tmp = new Long(_this__u8e3s4.d1_1, 0);
        } else {
          tmp = new Long(_this__u8e3s4.d1_1 >>> (numBits_0 - 32 | 0) | 0, 0);
        }
        return tmp;
      }
    }
  }
  function toNumber(_this__u8e3s4) {
    _init_properties_longJs_kt__elc2w5();
    return _this__u8e3s4.d1_1 * 4.294967296E9 + getLowBitsUnsigned(_this__u8e3s4);
  }
  function toStringImpl(_this__u8e3s4, radix) {
    _init_properties_longJs_kt__elc2w5();
    if (radix < 2 || 36 < radix) {
      throw Exception_init_$Create$_0('radix out of range: ' + radix);
    }
    if (isZero(_this__u8e3s4)) {
      return '0';
    }
    if (isNegative(_this__u8e3s4)) {
      if (equalsLong(_this__u8e3s4, get_MIN_VALUE())) {
        var radixLong = fromInt(radix);
        var div = _this__u8e3s4.h1(radixLong);
        var rem = subtract(multiply(div, radixLong), _this__u8e3s4).p1();
        var tmp = toStringImpl(div, radix);
        // Inline function 'kotlin.js.unsafeCast' call
        // Inline function 'kotlin.js.asDynamic' call
        return tmp + rem.toString(radix);
      } else {
        return '-' + toStringImpl(negate(_this__u8e3s4), radix);
      }
    }
    var digitsPerTime = radix === 2 ? 31 : radix <= 10 ? 9 : radix <= 21 ? 7 : radix <= 35 ? 6 : 5;
    var radixToPower = fromNumber(Math.pow(radix, digitsPerTime));
    var rem_0 = _this__u8e3s4;
    var result = '';
    while (true) {
      var remDiv = rem_0.h1(radixToPower);
      var intval = subtract(rem_0, multiply(remDiv, radixToPower)).p1();
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var digits = intval.toString(radix);
      rem_0 = remDiv;
      if (isZero(rem_0)) {
        return digits + result;
      } else {
        while (digits.length < digitsPerTime) {
          digits = '0' + digits;
        }
        result = digits + result;
      }
    }
  }
  function equalsLong(_this__u8e3s4, other) {
    _init_properties_longJs_kt__elc2w5();
    return _this__u8e3s4.d1_1 === other.d1_1 && _this__u8e3s4.c1_1 === other.c1_1;
  }
  function hashCode_0(l) {
    _init_properties_longJs_kt__elc2w5();
    return l.c1_1 ^ l.d1_1;
  }
  function fromInt(value) {
    _init_properties_longJs_kt__elc2w5();
    return new Long(value, value < 0 ? -1 : 0);
  }
  function isNegative(_this__u8e3s4) {
    _init_properties_longJs_kt__elc2w5();
    return _this__u8e3s4.d1_1 < 0;
  }
  function isZero(_this__u8e3s4) {
    _init_properties_longJs_kt__elc2w5();
    return _this__u8e3s4.d1_1 === 0 && _this__u8e3s4.c1_1 === 0;
  }
  function isOdd(_this__u8e3s4) {
    _init_properties_longJs_kt__elc2w5();
    return (_this__u8e3s4.c1_1 & 1) === 1;
  }
  function negate(_this__u8e3s4) {
    _init_properties_longJs_kt__elc2w5();
    return _this__u8e3s4.j1();
  }
  function lessThan(_this__u8e3s4, other) {
    _init_properties_longJs_kt__elc2w5();
    return compare(_this__u8e3s4, other) < 0;
  }
  function fromNumber(value) {
    _init_properties_longJs_kt__elc2w5();
    if (isNaN_0(value)) {
      return get_ZERO();
    } else if (value <= -9.223372036854776E18) {
      return get_MIN_VALUE();
    } else if (value + 1 >= 9.223372036854776E18) {
      return get_MAX_VALUE();
    } else if (value < 0) {
      return negate(fromNumber(-value));
    } else {
      var twoPwr32 = 4.294967296E9;
      // Inline function 'kotlin.js.jsBitwiseOr' call
      var tmp = value % twoPwr32 | 0;
      // Inline function 'kotlin.js.jsBitwiseOr' call
      var tmp$ret$1 = value / twoPwr32 | 0;
      return new Long(tmp, tmp$ret$1);
    }
  }
  function greaterThan(_this__u8e3s4, other) {
    _init_properties_longJs_kt__elc2w5();
    return compare(_this__u8e3s4, other) > 0;
  }
  function greaterThanOrEqual(_this__u8e3s4, other) {
    _init_properties_longJs_kt__elc2w5();
    return compare(_this__u8e3s4, other) >= 0;
  }
  function getLowBitsUnsigned(_this__u8e3s4) {
    _init_properties_longJs_kt__elc2w5();
    return _this__u8e3s4.c1_1 >= 0 ? _this__u8e3s4.c1_1 : 4.294967296E9 + _this__u8e3s4.c1_1;
  }
  var properties_initialized_longJs_kt_4syf89;
  function _init_properties_longJs_kt__elc2w5() {
    if (!properties_initialized_longJs_kt_4syf89) {
      properties_initialized_longJs_kt_4syf89 = true;
      ZERO = fromInt(0);
      ONE = fromInt(1);
      NEG_ONE = fromInt(-1);
      MAX_VALUE = new Long(-1, 2147483647);
      MIN_VALUE = new Long(0, -2147483648);
      TWO_PWR_24_ = fromInt(16777216);
    }
  }
  function createMetadata(kind, name, defaultConstructor, associatedObjectKey, associatedObjects, suspendArity) {
    var undef = VOID;
    var iid = kind === 'interface' ? generateInterfaceId() : VOID;
    return {kind: kind, simpleName: name, associatedObjectKey: associatedObjectKey, associatedObjects: associatedObjects, suspendArity: suspendArity, $kClass$: undef, defaultConstructor: defaultConstructor, iid: iid};
  }
  function generateInterfaceId() {
    if (globalInterfaceId === VOID) {
      globalInterfaceId = 0;
    }
    // Inline function 'kotlin.js.unsafeCast' call
    globalInterfaceId = globalInterfaceId + 1 | 0;
    // Inline function 'kotlin.js.unsafeCast' call
    return globalInterfaceId;
  }
  var globalInterfaceId;
  function initMetadataFor(kind, ctor, name, defaultConstructor, parent, interfaces, suspendArity, associatedObjectKey, associatedObjects) {
    if (!(parent == null)) {
      ctor.prototype = Object.create(parent.prototype);
      ctor.prototype.constructor = ctor;
    }
    var metadata = createMetadata(kind, name, defaultConstructor, associatedObjectKey, associatedObjects, suspendArity);
    ctor.$metadata$ = metadata;
    if (!(interfaces == null)) {
      var receiver = !equals(metadata.iid, VOID) ? ctor : ctor.prototype;
      receiver.$imask$ = implement(interfaces);
    }
  }
  function initMetadataForClass(ctor, name, defaultConstructor, parent, interfaces, suspendArity, associatedObjectKey, associatedObjects) {
    var kind = 'class';
    initMetadataFor(kind, ctor, name, defaultConstructor, parent, interfaces, suspendArity, associatedObjectKey, associatedObjects);
  }
  function initMetadataForObject(ctor, name, defaultConstructor, parent, interfaces, suspendArity, associatedObjectKey, associatedObjects) {
    var kind = 'object';
    initMetadataFor(kind, ctor, name, defaultConstructor, parent, interfaces, suspendArity, associatedObjectKey, associatedObjects);
  }
  function initMetadataForInterface(ctor, name, defaultConstructor, parent, interfaces, suspendArity, associatedObjectKey, associatedObjects) {
    var kind = 'interface';
    initMetadataFor(kind, ctor, name, defaultConstructor, parent, interfaces, suspendArity, associatedObjectKey, associatedObjects);
  }
  function initMetadataForLambda(ctor, parent, interfaces, suspendArity) {
    initMetadataForClass(ctor, 'Lambda', VOID, parent, interfaces, suspendArity, VOID, VOID);
  }
  function initMetadataForCoroutine(ctor, parent, interfaces, suspendArity) {
    initMetadataForClass(ctor, 'Coroutine', VOID, parent, interfaces, suspendArity, VOID, VOID);
  }
  function initMetadataForFunctionReference(ctor, parent, interfaces, suspendArity) {
    initMetadataForClass(ctor, 'FunctionReference', VOID, parent, interfaces, suspendArity, VOID, VOID);
  }
  function initMetadataForCompanion(ctor, parent, interfaces, suspendArity) {
    initMetadataForObject(ctor, 'Companion', VOID, parent, interfaces, suspendArity, VOID, VOID);
  }
  function classMeta(name, defaultConstructor, associatedObjectKey, associatedObjects, suspendArity) {
    return createMetadata('class', name, defaultConstructor, associatedObjectKey, associatedObjects, suspendArity);
  }
  function numberToInt(a) {
    var tmp;
    if (a instanceof Long) {
      tmp = a.p1();
    } else {
      tmp = doubleToInt(a);
    }
    return tmp;
  }
  function doubleToInt(a) {
    var tmp;
    if (a > 2147483647) {
      tmp = 2147483647;
    } else if (a < -2147483648) {
      tmp = -2147483648;
    } else {
      // Inline function 'kotlin.js.jsBitwiseOr' call
      tmp = a | 0;
    }
    return tmp;
  }
  function toShort(a) {
    // Inline function 'kotlin.js.unsafeCast' call
    return a << 16 >> 16;
  }
  function numberToLong(a) {
    var tmp;
    if (a instanceof Long) {
      tmp = a;
    } else {
      tmp = fromNumber(a);
    }
    return tmp;
  }
  function numberToChar(a) {
    // Inline function 'kotlin.toUShort' call
    var this_0 = numberToInt(a);
    var tmp$ret$0 = _UShort___init__impl__jigrne(toShort(this_0));
    return _Char___init__impl__6a9atx_0(tmp$ret$0);
  }
  function toLong(a) {
    return fromInt(a);
  }
  function get_propertyRefClassMetadataCache() {
    _init_properties_reflectRuntime_kt__5r4uu3();
    return propertyRefClassMetadataCache;
  }
  var propertyRefClassMetadataCache;
  function metadataObject() {
    _init_properties_reflectRuntime_kt__5r4uu3();
    return classMeta(VOID, VOID, VOID, VOID, VOID);
  }
  function getPropertyCallableRef(name, paramCount, superType, getter, setter) {
    _init_properties_reflectRuntime_kt__5r4uu3();
    getter.get = getter;
    getter.set = setter;
    getter.callableName = name;
    // Inline function 'kotlin.js.unsafeCast' call
    return getPropertyRefClass(getter, getKPropMetadata(paramCount, setter), getInterfaceMaskFor(getter, superType));
  }
  function getPropertyRefClass(obj, metadata, imask) {
    _init_properties_reflectRuntime_kt__5r4uu3();
    obj.$metadata$ = metadata;
    obj.constructor = obj;
    obj.$imask$ = imask;
    return obj;
  }
  function getKPropMetadata(paramCount, setter) {
    _init_properties_reflectRuntime_kt__5r4uu3();
    return get_propertyRefClassMetadataCache()[paramCount][setter == null ? 0 : 1];
  }
  function getInterfaceMaskFor(obj, superType) {
    _init_properties_reflectRuntime_kt__5r4uu3();
    var tmp0_elvis_lhs = obj.$imask$;
    var tmp;
    if (tmp0_elvis_lhs == null) {
      // Inline function 'kotlin.arrayOf' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp$ret$2 = [superType];
      tmp = implement(tmp$ret$2);
    } else {
      tmp = tmp0_elvis_lhs;
    }
    return tmp;
  }
  var properties_initialized_reflectRuntime_kt_inkhwd;
  function _init_properties_reflectRuntime_kt__5r4uu3() {
    if (!properties_initialized_reflectRuntime_kt_inkhwd) {
      properties_initialized_reflectRuntime_kt_inkhwd = true;
      // Inline function 'kotlin.arrayOf' call
      // Inline function 'kotlin.arrayOf' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp = [metadataObject(), metadataObject()];
      // Inline function 'kotlin.arrayOf' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp_0 = [metadataObject(), metadataObject()];
      // Inline function 'kotlin.arrayOf' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      propertyRefClassMetadataCache = [tmp, tmp_0, [metadataObject(), metadataObject()]];
    }
  }
  function isArrayish(o) {
    return isJsArray(o) || isView(o);
  }
  function isJsArray(obj) {
    // Inline function 'kotlin.js.unsafeCast' call
    return Array.isArray(obj);
  }
  function isInterface(obj, iface) {
    return isInterfaceImpl(obj, iface.$metadata$.iid);
  }
  function isInterfaceImpl(obj, iface) {
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp0_elvis_lhs = obj.$imask$;
    var tmp;
    if (tmp0_elvis_lhs == null) {
      return false;
    } else {
      tmp = tmp0_elvis_lhs;
    }
    var mask = tmp;
    return isBitSet(mask, iface);
  }
  function isArray(obj) {
    var tmp;
    if (isJsArray(obj)) {
      // Inline function 'kotlin.js.asDynamic' call
      tmp = !obj.$type$;
    } else {
      tmp = false;
    }
    return tmp;
  }
  function isNumber(a) {
    var tmp;
    if (typeof a === 'number') {
      tmp = true;
    } else {
      tmp = a instanceof Long;
    }
    return tmp;
  }
  function isComparable(value) {
    var type = typeof value;
    return type === 'string' || type === 'boolean' || isNumber(value) || isInterface(value, Comparable);
  }
  function isCharSequence(value) {
    return typeof value === 'string' || isInterface(value, CharSequence);
  }
  function isBooleanArray(a) {
    return isJsArray(a) && a.$type$ === 'BooleanArray';
  }
  function isByteArray(a) {
    // Inline function 'kotlin.js.jsInstanceOf' call
    return a instanceof Int8Array;
  }
  function isShortArray(a) {
    // Inline function 'kotlin.js.jsInstanceOf' call
    return a instanceof Int16Array;
  }
  function isCharArray(a) {
    var tmp;
    // Inline function 'kotlin.js.jsInstanceOf' call
    if (a instanceof Uint16Array) {
      tmp = a.$type$ === 'CharArray';
    } else {
      tmp = false;
    }
    return tmp;
  }
  function isIntArray(a) {
    // Inline function 'kotlin.js.jsInstanceOf' call
    return a instanceof Int32Array;
  }
  function isFloatArray(a) {
    // Inline function 'kotlin.js.jsInstanceOf' call
    return a instanceof Float32Array;
  }
  function isLongArray(a) {
    return isJsArray(a) && a.$type$ === 'LongArray';
  }
  function isDoubleArray(a) {
    // Inline function 'kotlin.js.jsInstanceOf' call
    return a instanceof Float64Array;
  }
  function calculateErrorInfo(proto) {
    var tmp0_safe_receiver = proto.constructor;
    var metadata = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.$metadata$;
    var tmp2_safe_receiver = metadata == null ? null : metadata.errorInfo;
    if (tmp2_safe_receiver == null)
      null;
    else {
      // Inline function 'kotlin.let' call
      // Inline function 'kotlin.contracts.contract' call
      return tmp2_safe_receiver;
    }
    var result = 0;
    if (hasProp(proto, 'message'))
      result = result | 1;
    if (hasProp(proto, 'cause'))
      result = result | 2;
    if (!(result === 3)) {
      var parentProto = getPrototypeOf(proto);
      if (parentProto != Error.prototype) {
        result = result | calculateErrorInfo(parentProto);
      }
    }
    if (!(metadata == null)) {
      metadata.errorInfo = result;
    }
    return result;
  }
  function hasProp(proto, propName) {
    return proto.hasOwnProperty(propName);
  }
  function getPrototypeOf(obj) {
    return Object.getPrototypeOf(obj);
  }
  function get_VOID() {
    _init_properties_void_kt__3zg9as();
    return VOID;
  }
  var VOID;
  var properties_initialized_void_kt_e4ret2;
  function _init_properties_void_kt__3zg9as() {
    if (!properties_initialized_void_kt_e4ret2) {
      properties_initialized_void_kt_e4ret2 = true;
      VOID = void 0;
    }
  }
  function asList(_this__u8e3s4) {
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    return new ArrayList(_this__u8e3s4);
  }
  function fill(_this__u8e3s4, element, fromIndex, toIndex) {
    fromIndex = fromIndex === VOID ? 0 : fromIndex;
    toIndex = toIndex === VOID ? _this__u8e3s4.length : toIndex;
    Companion_instance_2.v1(fromIndex, toIndex, _this__u8e3s4.length);
    // Inline function 'kotlin.js.nativeFill' call
    // Inline function 'kotlin.js.asDynamic' call
    _this__u8e3s4.fill(element, fromIndex, toIndex);
  }
  function copyOf(_this__u8e3s4, newSize) {
    // Inline function 'kotlin.require' call
    // Inline function 'kotlin.contracts.contract' call
    if (!(newSize >= 0)) {
      // Inline function 'kotlin.collections.copyOf.<anonymous>' call
      var message = 'Invalid new array size: ' + newSize + '.';
      throw IllegalArgumentException_init_$Create$_0(toString_1(message));
    }
    return fillFrom(_this__u8e3s4, new Int32Array(newSize));
  }
  function copyOf_0(_this__u8e3s4, newSize) {
    // Inline function 'kotlin.require' call
    // Inline function 'kotlin.contracts.contract' call
    if (!(newSize >= 0)) {
      // Inline function 'kotlin.collections.copyOf.<anonymous>' call
      var message = 'Invalid new array size: ' + newSize + '.';
      throw IllegalArgumentException_init_$Create$_0(toString_1(message));
    }
    return arrayCopyResize(_this__u8e3s4, newSize, null);
  }
  function sortWith(_this__u8e3s4, comparator) {
    if (_this__u8e3s4.length > 1) {
      sortArrayWith(_this__u8e3s4, comparator);
    }
  }
  function digitToIntImpl(_this__u8e3s4) {
    // Inline function 'kotlin.code' call
    var ch = Char__toInt_impl_vasixd(_this__u8e3s4);
    var index = binarySearchRange(Digit_getInstance().w1_1, ch);
    var diff = ch - Digit_getInstance().w1_1[index] | 0;
    return diff < 10 ? diff : -1;
  }
  function binarySearchRange(array, needle) {
    var bottom = 0;
    var top = array.length - 1 | 0;
    var middle = -1;
    var value = 0;
    while (bottom <= top) {
      middle = (bottom + top | 0) / 2 | 0;
      value = array[middle];
      if (needle > value)
        bottom = middle + 1 | 0;
      else if (needle === value)
        return middle;
      else
        top = middle - 1 | 0;
    }
    return middle - (needle < value ? 1 : 0) | 0;
  }
  function Digit() {
    Digit_instance = this;
    var tmp = this;
    // Inline function 'kotlin.intArrayOf' call
    tmp.w1_1 = new Int32Array([48, 1632, 1776, 1984, 2406, 2534, 2662, 2790, 2918, 3046, 3174, 3302, 3430, 3558, 3664, 3792, 3872, 4160, 4240, 6112, 6160, 6470, 6608, 6784, 6800, 6992, 7088, 7232, 7248, 42528, 43216, 43264, 43472, 43504, 43600, 44016, 65296]);
  }
  var Digit_instance;
  function Digit_getInstance() {
    if (Digit_instance == null)
      new Digit();
    return Digit_instance;
  }
  function isWhitespaceImpl(_this__u8e3s4) {
    // Inline function 'kotlin.code' call
    var ch = Char__toInt_impl_vasixd(_this__u8e3s4);
    return (9 <= ch ? ch <= 13 : false) || (28 <= ch ? ch <= 32 : false) || ch === 160 || (ch > 4096 && (ch === 5760 || (8192 <= ch ? ch <= 8202 : false) || ch === 8232 || ch === 8233 || ch === 8239 || ch === 8287 || ch === 12288));
  }
  function Comparator() {
  }
  function isNaN_0(_this__u8e3s4) {
    return !(_this__u8e3s4 === _this__u8e3s4);
  }
  function takeHighestOneBit(_this__u8e3s4) {
    var tmp;
    if (_this__u8e3s4 === 0) {
      tmp = 0;
    } else {
      // Inline function 'kotlin.countLeadingZeroBits' call
      tmp = 1 << (31 - clz32(_this__u8e3s4) | 0);
    }
    return tmp;
  }
  function collectionToArray(collection) {
    return collectionToArrayCommonImpl(collection);
  }
  function terminateCollectionToArray(collectionSize, array) {
    return array;
  }
  function arrayOfNulls(reference, size) {
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.arrayOfNulls' call
    // Inline function 'kotlin.js.asDynamic' call
    return fillArrayVal(Array(size), null);
  }
  function listOf(element) {
    return arrayListOf([element]);
  }
  function mapOf(pair) {
    return hashMapOf([pair]);
  }
  function mapCapacity(expectedSize) {
    return expectedSize;
  }
  function setOf(element) {
    return hashSetOf([element]);
  }
  function checkIndexOverflow(index) {
    if (index < 0) {
      throwIndexOverflow();
    }
    return index;
  }
  function copyToArray(collection) {
    var tmp;
    // Inline function 'kotlin.js.asDynamic' call
    if (collection.toArray !== undefined) {
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      tmp = collection.toArray();
    } else {
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      tmp = collectionToArray(collection);
    }
    return tmp;
  }
  function arrayCopy(source, destination, destinationOffset, startIndex, endIndex) {
    Companion_instance_2.v1(startIndex, endIndex, source.length);
    var rangeSize = endIndex - startIndex | 0;
    Companion_instance_2.v1(destinationOffset, destinationOffset + rangeSize | 0, destination.length);
    if (isView(destination) && isView(source)) {
      // Inline function 'kotlin.js.asDynamic' call
      var subrange = source.subarray(startIndex, endIndex);
      // Inline function 'kotlin.js.asDynamic' call
      destination.set(subrange, destinationOffset);
    } else {
      if (!(source === destination) || destinationOffset <= startIndex) {
        var inductionVariable = 0;
        if (inductionVariable < rangeSize)
          do {
            var index = inductionVariable;
            inductionVariable = inductionVariable + 1 | 0;
            destination[destinationOffset + index | 0] = source[startIndex + index | 0];
          }
           while (inductionVariable < rangeSize);
      } else {
        var inductionVariable_0 = rangeSize - 1 | 0;
        if (0 <= inductionVariable_0)
          do {
            var index_0 = inductionVariable_0;
            inductionVariable_0 = inductionVariable_0 + -1 | 0;
            destination[destinationOffset + index_0 | 0] = source[startIndex + index_0 | 0];
          }
           while (0 <= inductionVariable_0);
      }
    }
  }
  function sortWith_0(_this__u8e3s4, comparator) {
    collectionsSort(_this__u8e3s4, comparator);
  }
  function collectionsSort(list, comparator) {
    if (list.j() <= 1)
      return Unit_instance;
    var array = copyToArray(list);
    sortArrayWith(array, comparator);
    var inductionVariable = 0;
    var last = array.length;
    if (inductionVariable < last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        list.x1(i, array[i]);
      }
       while (inductionVariable < last);
  }
  function AbstractMutableCollection() {
    AbstractCollection.call(this);
  }
  protoOf(AbstractMutableCollection).y1 = function (element) {
    this.z1();
    var iterator = this.g();
    while (iterator.h()) {
      if (equals(iterator.i(), element)) {
        iterator.a2();
        return true;
      }
    }
    return false;
  };
  protoOf(AbstractMutableCollection).n = function (elements) {
    this.z1();
    var modified = false;
    var tmp0_iterator = elements.g();
    while (tmp0_iterator.h()) {
      var element = tmp0_iterator.i();
      if (this.e(element))
        modified = true;
    }
    return modified;
  };
  protoOf(AbstractMutableCollection).toJSON = function () {
    return this.toArray();
  };
  protoOf(AbstractMutableCollection).z1 = function () {
  };
  function IteratorImpl($outer) {
    this.d2_1 = $outer;
    this.b2_1 = 0;
    this.c2_1 = -1;
  }
  protoOf(IteratorImpl).h = function () {
    return this.b2_1 < this.d2_1.j();
  };
  protoOf(IteratorImpl).i = function () {
    if (!this.h())
      throw NoSuchElementException_init_$Create$();
    var tmp = this;
    var tmp1 = this.b2_1;
    this.b2_1 = tmp1 + 1 | 0;
    tmp.c2_1 = tmp1;
    return this.d2_1.o(this.c2_1);
  };
  protoOf(IteratorImpl).a2 = function () {
    // Inline function 'kotlin.check' call
    // Inline function 'kotlin.contracts.contract' call
    if (!!(this.c2_1 === -1)) {
      // Inline function 'kotlin.collections.IteratorImpl.remove.<anonymous>' call
      var message = 'Call next() or previous() before removing element from the iterator.';
      throw IllegalStateException_init_$Create$_0(toString_1(message));
    }
    this.d2_1.f2(this.c2_1);
    this.b2_1 = this.c2_1;
    this.c2_1 = -1;
  };
  function AbstractMutableList() {
    AbstractMutableCollection.call(this);
    this.e2_1 = 0;
  }
  protoOf(AbstractMutableList).e = function (element) {
    this.z1();
    this.g2(this.j(), element);
    return true;
  };
  protoOf(AbstractMutableList).h2 = function (index, elements) {
    Companion_instance_2.i2(index, this.j());
    this.z1();
    var _index = index;
    var changed = false;
    var tmp0_iterator = elements.g();
    while (tmp0_iterator.h()) {
      var e = tmp0_iterator.i();
      var tmp1 = _index;
      _index = tmp1 + 1 | 0;
      this.g2(tmp1, e);
      changed = true;
    }
    return changed;
  };
  protoOf(AbstractMutableList).g = function () {
    return new IteratorImpl(this);
  };
  protoOf(AbstractMutableList).q = function (element) {
    return this.s(element) >= 0;
  };
  protoOf(AbstractMutableList).s = function (element) {
    var tmp$ret$1;
    $l$block: {
      // Inline function 'kotlin.collections.indexOfFirst' call
      var index = 0;
      var tmp0_iterator = this.g();
      while (tmp0_iterator.h()) {
        var item = tmp0_iterator.i();
        // Inline function 'kotlin.collections.AbstractMutableList.indexOf.<anonymous>' call
        if (equals(item, element)) {
          tmp$ret$1 = index;
          break $l$block;
        }
        index = index + 1 | 0;
      }
      tmp$ret$1 = -1;
    }
    return tmp$ret$1;
  };
  protoOf(AbstractMutableList).equals = function (other) {
    if (other === this)
      return true;
    if (!(!(other == null) ? isInterface(other, KtList) : false))
      return false;
    return Companion_instance_2.j2(this, other);
  };
  protoOf(AbstractMutableList).hashCode = function () {
    return Companion_instance_2.k2(this);
  };
  function AbstractMutableMap() {
    AbstractMap.call(this);
    this.n2_1 = null;
    this.o2_1 = null;
  }
  function AbstractMutableSet() {
    AbstractMutableCollection.call(this);
  }
  protoOf(AbstractMutableSet).equals = function (other) {
    if (other === this)
      return true;
    if (!(!(other == null) ? isInterface(other, KtSet) : false))
      return false;
    return Companion_instance_4.t2(this, other);
  };
  protoOf(AbstractMutableSet).hashCode = function () {
    return Companion_instance_4.u2(this);
  };
  function arrayOfUninitializedElements(capacity) {
    // Inline function 'kotlin.require' call
    // Inline function 'kotlin.contracts.contract' call
    if (!(capacity >= 0)) {
      // Inline function 'kotlin.collections.arrayOfUninitializedElements.<anonymous>' call
      var message = 'capacity must be non-negative.';
      throw IllegalArgumentException_init_$Create$_0(toString_1(message));
    }
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.arrayOfNulls' call
    // Inline function 'kotlin.js.asDynamic' call
    return fillArrayVal(Array(capacity), null);
  }
  function resetRange(_this__u8e3s4, fromIndex, toIndex) {
    // Inline function 'kotlin.js.nativeFill' call
    // Inline function 'kotlin.js.asDynamic' call
    _this__u8e3s4.fill(null, fromIndex, toIndex);
  }
  function copyOfUninitializedElements(_this__u8e3s4, newSize) {
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    return copyOf_0(_this__u8e3s4, newSize);
  }
  function resetAt(_this__u8e3s4, index) {
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    _this__u8e3s4[index] = null;
  }
  function Companion_0() {
    Companion_instance_0 = this;
    var tmp = this;
    // Inline function 'kotlin.also' call
    var this_0 = ArrayList_init_$Create$_0(0);
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'kotlin.collections.Companion.Empty.<anonymous>' call
    this_0.m_1 = true;
    tmp.v2_1 = this_0;
  }
  var Companion_instance_0;
  function Companion_getInstance_0() {
    if (Companion_instance_0 == null)
      new Companion_0();
    return Companion_instance_0;
  }
  function ArrayList_init_$Init$($this) {
    // Inline function 'kotlin.emptyArray' call
    var tmp$ret$0 = [];
    ArrayList.call($this, tmp$ret$0);
    return $this;
  }
  function ArrayList_init_$Create$() {
    return ArrayList_init_$Init$(objectCreate(protoOf(ArrayList)));
  }
  function ArrayList_init_$Init$_0(initialCapacity, $this) {
    // Inline function 'kotlin.emptyArray' call
    var tmp$ret$0 = [];
    ArrayList.call($this, tmp$ret$0);
    // Inline function 'kotlin.require' call
    // Inline function 'kotlin.contracts.contract' call
    if (!(initialCapacity >= 0)) {
      // Inline function 'kotlin.collections.ArrayList.<init>.<anonymous>' call
      var message = 'Negative initial capacity: ' + initialCapacity;
      throw IllegalArgumentException_init_$Create$_0(toString_1(message));
    }
    return $this;
  }
  function ArrayList_init_$Create$_0(initialCapacity) {
    return ArrayList_init_$Init$_0(initialCapacity, objectCreate(protoOf(ArrayList)));
  }
  function ArrayList_init_$Init$_1(elements, $this) {
    // Inline function 'kotlin.collections.toTypedArray' call
    var tmp$ret$0 = copyToArray(elements);
    ArrayList.call($this, tmp$ret$0);
    return $this;
  }
  function ArrayList_init_$Create$_1(elements) {
    return ArrayList_init_$Init$_1(elements, objectCreate(protoOf(ArrayList)));
  }
  function increaseLength($this, amount) {
    var previous = $this.j();
    // Inline function 'kotlin.js.asDynamic' call
    $this.l_1.length = $this.j() + amount | 0;
    return previous;
  }
  function rangeCheck($this, index) {
    // Inline function 'kotlin.apply' call
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'kotlin.collections.ArrayList.rangeCheck.<anonymous>' call
    Companion_instance_2.w2(index, $this.j());
    return index;
  }
  function insertionRangeCheck($this, index) {
    // Inline function 'kotlin.apply' call
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'kotlin.collections.ArrayList.insertionRangeCheck.<anonymous>' call
    Companion_instance_2.i2(index, $this.j());
    return index;
  }
  function ArrayList(array) {
    Companion_getInstance_0();
    AbstractMutableList.call(this);
    this.l_1 = array;
    this.m_1 = false;
  }
  protoOf(ArrayList).j = function () {
    return this.l_1.length;
  };
  protoOf(ArrayList).o = function (index) {
    var tmp = this.l_1[rangeCheck(this, index)];
    return (tmp == null ? true : !(tmp == null)) ? tmp : THROW_CCE();
  };
  protoOf(ArrayList).x1 = function (index, element) {
    this.z1();
    rangeCheck(this, index);
    // Inline function 'kotlin.apply' call
    var this_0 = this.l_1[index];
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'kotlin.collections.ArrayList.set.<anonymous>' call
    this.l_1[index] = element;
    var tmp = this_0;
    return (tmp == null ? true : !(tmp == null)) ? tmp : THROW_CCE();
  };
  protoOf(ArrayList).e = function (element) {
    this.z1();
    // Inline function 'kotlin.js.asDynamic' call
    this.l_1.push(element);
    this.e2_1 = this.e2_1 + 1 | 0;
    return true;
  };
  protoOf(ArrayList).g2 = function (index, element) {
    this.z1();
    // Inline function 'kotlin.js.asDynamic' call
    this.l_1.splice(insertionRangeCheck(this, index), 0, element);
    this.e2_1 = this.e2_1 + 1 | 0;
  };
  protoOf(ArrayList).n = function (elements) {
    this.z1();
    if (elements.p())
      return false;
    var offset = increaseLength(this, elements.j());
    // Inline function 'kotlin.collections.forEachIndexed' call
    var index = 0;
    var tmp0_iterator = elements.g();
    while (tmp0_iterator.h()) {
      var item = tmp0_iterator.i();
      // Inline function 'kotlin.collections.ArrayList.addAll.<anonymous>' call
      var tmp1 = index;
      index = tmp1 + 1 | 0;
      var index_0 = checkIndexOverflow(tmp1);
      this.l_1[offset + index_0 | 0] = item;
    }
    this.e2_1 = this.e2_1 + 1 | 0;
    return true;
  };
  protoOf(ArrayList).h2 = function (index, elements) {
    this.z1();
    insertionRangeCheck(this, index);
    if (index === this.j())
      return this.n(elements);
    if (elements.p())
      return false;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var tail = this.l_1.splice(index);
    this.n(elements);
    var offset = increaseLength(this, tail.length);
    // Inline function 'kotlin.repeat' call
    var times = tail.length;
    // Inline function 'kotlin.contracts.contract' call
    var inductionVariable = 0;
    if (inductionVariable < times)
      do {
        var index_0 = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        // Inline function 'kotlin.collections.ArrayList.addAll.<anonymous>' call
        this.l_1[offset + index_0 | 0] = tail[index_0];
      }
       while (inductionVariable < times);
    this.e2_1 = this.e2_1 + 1 | 0;
    return true;
  };
  protoOf(ArrayList).f2 = function (index) {
    this.z1();
    rangeCheck(this, index);
    this.e2_1 = this.e2_1 + 1 | 0;
    var tmp;
    if (index === get_lastIndex_0(this)) {
      // Inline function 'kotlin.js.asDynamic' call
      tmp = this.l_1.pop();
    } else {
      // Inline function 'kotlin.js.asDynamic' call
      tmp = this.l_1.splice(index, 1)[0];
    }
    return tmp;
  };
  protoOf(ArrayList).y1 = function (element) {
    this.z1();
    var inductionVariable = 0;
    var last = this.l_1.length - 1 | 0;
    if (inductionVariable <= last)
      do {
        var index = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        if (equals(this.l_1[index], element)) {
          // Inline function 'kotlin.js.asDynamic' call
          this.l_1.splice(index, 1);
          this.e2_1 = this.e2_1 + 1 | 0;
          return true;
        }
      }
       while (inductionVariable <= last);
    return false;
  };
  protoOf(ArrayList).s = function (element) {
    return indexOf(this.l_1, element);
  };
  protoOf(ArrayList).toString = function () {
    return arrayToString(this.l_1);
  };
  protoOf(ArrayList).x2 = function () {
    return [].slice.call(this.l_1);
  };
  protoOf(ArrayList).toArray = function () {
    return this.x2();
  };
  protoOf(ArrayList).z1 = function () {
    if (this.m_1)
      throw UnsupportedOperationException_init_$Create$();
  };
  var _stableSortingIsSupported;
  function sortArrayWith(array, comparator) {
    if (getStableSortingIsSupported()) {
      var comparison = sortArrayWith$lambda(comparator);
      // Inline function 'kotlin.js.asDynamic' call
      array.sort(comparison);
    } else {
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      mergeSort(array, 0, get_lastIndex(array), comparator);
    }
  }
  function getStableSortingIsSupported() {
    var tmp0_safe_receiver = _stableSortingIsSupported;
    if (tmp0_safe_receiver == null)
      null;
    else {
      // Inline function 'kotlin.let' call
      // Inline function 'kotlin.contracts.contract' call
      return tmp0_safe_receiver;
    }
    _stableSortingIsSupported = false;
    // Inline function 'kotlin.js.unsafeCast' call
    var array = [];
    var inductionVariable = 0;
    if (inductionVariable < 600)
      do {
        var index = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        // Inline function 'kotlin.js.asDynamic' call
        array.push(index);
      }
       while (inductionVariable < 600);
    var comparison = getStableSortingIsSupported$lambda;
    // Inline function 'kotlin.js.asDynamic' call
    array.sort(comparison);
    var inductionVariable_0 = 1;
    var last = array.length;
    if (inductionVariable_0 < last)
      do {
        var index_0 = inductionVariable_0;
        inductionVariable_0 = inductionVariable_0 + 1 | 0;
        var a = array[index_0 - 1 | 0];
        var b = array[index_0];
        if ((a & 3) === (b & 3) && a >= b)
          return false;
      }
       while (inductionVariable_0 < last);
    _stableSortingIsSupported = true;
    return true;
  }
  function mergeSort(array, start, endInclusive, comparator) {
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.arrayOfNulls' call
    var size = array.length;
    // Inline function 'kotlin.js.asDynamic' call
    var buffer = fillArrayVal(Array(size), null);
    var result = mergeSort_0(array, buffer, start, endInclusive, comparator);
    if (!(result === array)) {
      var inductionVariable = start;
      if (inductionVariable <= endInclusive)
        do {
          var i = inductionVariable;
          inductionVariable = inductionVariable + 1 | 0;
          array[i] = result[i];
        }
         while (!(i === endInclusive));
    }
  }
  function mergeSort_0(array, buffer, start, end, comparator) {
    if (start === end) {
      return array;
    }
    var median = (start + end | 0) / 2 | 0;
    var left = mergeSort_0(array, buffer, start, median, comparator);
    var right = mergeSort_0(array, buffer, median + 1 | 0, end, comparator);
    var target = left === buffer ? array : buffer;
    var leftIndex = start;
    var rightIndex = median + 1 | 0;
    var inductionVariable = start;
    if (inductionVariable <= end)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        if (leftIndex <= median && rightIndex <= end) {
          var leftValue = left[leftIndex];
          var rightValue = right[rightIndex];
          if (comparator.compare(leftValue, rightValue) <= 0) {
            target[i] = leftValue;
            leftIndex = leftIndex + 1 | 0;
          } else {
            target[i] = rightValue;
            rightIndex = rightIndex + 1 | 0;
          }
        } else if (leftIndex <= median) {
          target[i] = left[leftIndex];
          leftIndex = leftIndex + 1 | 0;
        } else {
          target[i] = right[rightIndex];
          rightIndex = rightIndex + 1 | 0;
        }
      }
       while (!(i === end));
    return target;
  }
  function sortArrayWith$lambda($comparator) {
    return function (a, b) {
      return $comparator.compare(a, b);
    };
  }
  function getStableSortingIsSupported$lambda(a, b) {
    return (a & 3) - (b & 3) | 0;
  }
  function HashMap_init_$Init$(internalMap, $this) {
    AbstractMutableMap.call($this);
    HashMap.call($this);
    $this.c3_1 = internalMap;
    return $this;
  }
  function HashMap_init_$Init$_0($this) {
    HashMap_init_$Init$(InternalHashMap_init_$Create$(), $this);
    return $this;
  }
  function HashMap_init_$Create$() {
    return HashMap_init_$Init$_0(objectCreate(protoOf(HashMap)));
  }
  function HashMap_init_$Init$_1(initialCapacity, loadFactor, $this) {
    HashMap_init_$Init$(InternalHashMap_init_$Create$_1(initialCapacity, loadFactor), $this);
    return $this;
  }
  function HashMap_init_$Init$_2(initialCapacity, $this) {
    HashMap_init_$Init$_1(initialCapacity, 1.0, $this);
    return $this;
  }
  function HashMap_init_$Create$_0(initialCapacity) {
    return HashMap_init_$Init$_2(initialCapacity, objectCreate(protoOf(HashMap)));
  }
  function HashMap_init_$Init$_3(original, $this) {
    HashMap_init_$Init$(InternalHashMap_init_$Create$_0(original), $this);
    return $this;
  }
  protoOf(HashMap).v = function (key) {
    return this.c3_1.e3(key);
  };
  protoOf(HashMap).x = function () {
    var tmp0_elvis_lhs = this.d3_1;
    var tmp;
    if (tmp0_elvis_lhs == null) {
      // Inline function 'kotlin.also' call
      var this_0 = new HashMapEntrySet(this.c3_1);
      // Inline function 'kotlin.contracts.contract' call
      // Inline function 'kotlin.collections.HashMap.<get-entries>.<anonymous>' call
      this.d3_1 = this_0;
      tmp = this_0;
    } else {
      tmp = tmp0_elvis_lhs;
    }
    return tmp;
  };
  protoOf(HashMap).w = function (key) {
    return this.c3_1.w(key);
  };
  protoOf(HashMap).p2 = function (key, value) {
    return this.c3_1.p2(key, value);
  };
  protoOf(HashMap).j = function () {
    return this.c3_1.j();
  };
  function HashMap() {
    this.d3_1 = null;
  }
  function HashMapEntrySet(backing) {
    HashMapEntrySetBase.call(this, backing);
  }
  protoOf(HashMapEntrySet).g = function () {
    return this.g3_1.h3();
  };
  function HashMapEntrySetBase(backing) {
    AbstractMutableSet.call(this);
    this.g3_1 = backing;
  }
  protoOf(HashMapEntrySetBase).j = function () {
    return this.g3_1.j();
  };
  protoOf(HashMapEntrySetBase).p = function () {
    return this.g3_1.j() === 0;
  };
  protoOf(HashMapEntrySetBase).i3 = function (element) {
    return this.g3_1.k3(element);
  };
  protoOf(HashMapEntrySetBase).q = function (element) {
    if (!(!(element == null) ? isInterface(element, Entry) : false))
      return false;
    return this.i3((!(element == null) ? isInterface(element, Entry) : false) ? element : THROW_CCE());
  };
  protoOf(HashMapEntrySetBase).j3 = function (element) {
    throw UnsupportedOperationException_init_$Create$();
  };
  protoOf(HashMapEntrySetBase).e = function (element) {
    return this.j3((!(element == null) ? isInterface(element, Entry) : false) ? element : THROW_CCE());
  };
  protoOf(HashMapEntrySetBase).n = function (elements) {
    throw UnsupportedOperationException_init_$Create$();
  };
  protoOf(HashMapEntrySetBase).r = function (elements) {
    return this.g3_1.l3(elements);
  };
  protoOf(HashMapEntrySetBase).z1 = function () {
    return this.g3_1.m3();
  };
  function HashSet_init_$Init$(map, $this) {
    AbstractMutableSet.call($this);
    HashSet.call($this);
    $this.n3_1 = map;
    return $this;
  }
  function HashSet_init_$Init$_0($this) {
    HashSet_init_$Init$(InternalHashMap_init_$Create$(), $this);
    return $this;
  }
  function HashSet_init_$Create$() {
    return HashSet_init_$Init$_0(objectCreate(protoOf(HashSet)));
  }
  function HashSet_init_$Init$_1(initialCapacity, loadFactor, $this) {
    HashSet_init_$Init$(InternalHashMap_init_$Create$_1(initialCapacity, loadFactor), $this);
    return $this;
  }
  function HashSet_init_$Init$_2(initialCapacity, $this) {
    HashSet_init_$Init$_1(initialCapacity, 1.0, $this);
    return $this;
  }
  function HashSet_init_$Create$_0(initialCapacity) {
    return HashSet_init_$Init$_2(initialCapacity, objectCreate(protoOf(HashSet)));
  }
  protoOf(HashSet).e = function (element) {
    return this.n3_1.p2(element, true) == null;
  };
  protoOf(HashSet).q = function (element) {
    return this.n3_1.e3(element);
  };
  protoOf(HashSet).p = function () {
    return this.n3_1.j() === 0;
  };
  protoOf(HashSet).g = function () {
    return this.n3_1.o3();
  };
  protoOf(HashSet).j = function () {
    return this.n3_1.j();
  };
  function HashSet() {
  }
  function computeHashSize($this, capacity) {
    return takeHighestOneBit(imul(coerceAtLeast(capacity, 1), 3));
  }
  function computeShift($this, hashSize) {
    // Inline function 'kotlin.countLeadingZeroBits' call
    return clz32(hashSize) + 1 | 0;
  }
  function InternalHashMap_init_$Init$($this) {
    InternalHashMap_init_$Init$_0(8, $this);
    return $this;
  }
  function InternalHashMap_init_$Create$() {
    return InternalHashMap_init_$Init$(objectCreate(protoOf(InternalHashMap)));
  }
  function InternalHashMap_init_$Init$_0(initialCapacity, $this) {
    InternalHashMap.call($this, arrayOfUninitializedElements(initialCapacity), null, new Int32Array(initialCapacity), new Int32Array(computeHashSize(Companion_instance_1, initialCapacity)), 2, 0);
    return $this;
  }
  function InternalHashMap_init_$Init$_1(original, $this) {
    InternalHashMap_init_$Init$_0(original.j(), $this);
    $this.z3(original);
    return $this;
  }
  function InternalHashMap_init_$Create$_0(original) {
    return InternalHashMap_init_$Init$_1(original, objectCreate(protoOf(InternalHashMap)));
  }
  function InternalHashMap_init_$Init$_2(initialCapacity, loadFactor, $this) {
    InternalHashMap_init_$Init$_0(initialCapacity, $this);
    // Inline function 'kotlin.require' call
    // Inline function 'kotlin.contracts.contract' call
    if (!(loadFactor > 0)) {
      // Inline function 'kotlin.collections.InternalHashMap.<init>.<anonymous>' call
      var message = 'Non-positive load factor: ' + loadFactor;
      throw IllegalArgumentException_init_$Create$_0(toString_1(message));
    }
    return $this;
  }
  function InternalHashMap_init_$Create$_1(initialCapacity, loadFactor) {
    return InternalHashMap_init_$Init$_2(initialCapacity, loadFactor, objectCreate(protoOf(InternalHashMap)));
  }
  function _get_capacity__a9k9f3($this) {
    return $this.p3_1.length;
  }
  function _get_hashSize__tftcho($this) {
    return $this.s3_1.length;
  }
  function registerModification($this) {
    $this.w3_1 = $this.w3_1 + 1 | 0;
  }
  function ensureExtraCapacity($this, n) {
    if (shouldCompact($this, n)) {
      compact($this, true);
    } else {
      ensureCapacity($this, $this.u3_1 + n | 0);
    }
  }
  function shouldCompact($this, extraCapacity) {
    var spareCapacity = _get_capacity__a9k9f3($this) - $this.u3_1 | 0;
    var gaps = $this.u3_1 - $this.j() | 0;
    return spareCapacity < extraCapacity && (gaps + spareCapacity | 0) >= extraCapacity && gaps >= (_get_capacity__a9k9f3($this) / 4 | 0);
  }
  function ensureCapacity($this, minCapacity) {
    if (minCapacity < 0)
      throw RuntimeException_init_$Create$_0('too many elements');
    if (minCapacity > _get_capacity__a9k9f3($this)) {
      var newSize = Companion_instance_2.a4(_get_capacity__a9k9f3($this), minCapacity);
      $this.p3_1 = copyOfUninitializedElements($this.p3_1, newSize);
      var tmp = $this;
      var tmp0_safe_receiver = $this.q3_1;
      tmp.q3_1 = tmp0_safe_receiver == null ? null : copyOfUninitializedElements(tmp0_safe_receiver, newSize);
      $this.r3_1 = copyOf($this.r3_1, newSize);
      var newHashSize = computeHashSize(Companion_instance_1, newSize);
      if (newHashSize > _get_hashSize__tftcho($this)) {
        rehash($this, newHashSize);
      }
    }
  }
  function allocateValuesArray($this) {
    var curValuesArray = $this.q3_1;
    if (!(curValuesArray == null))
      return curValuesArray;
    var newValuesArray = arrayOfUninitializedElements(_get_capacity__a9k9f3($this));
    $this.q3_1 = newValuesArray;
    return newValuesArray;
  }
  function hash($this, key) {
    return key == null ? 0 : imul(hashCode(key), -1640531527) >>> $this.v3_1 | 0;
  }
  function compact($this, updateHashArray) {
    var i = 0;
    var j = 0;
    var valuesArray = $this.q3_1;
    while (i < $this.u3_1) {
      var hash = $this.r3_1[i];
      if (hash >= 0) {
        $this.p3_1[j] = $this.p3_1[i];
        if (!(valuesArray == null)) {
          valuesArray[j] = valuesArray[i];
        }
        if (updateHashArray) {
          $this.r3_1[j] = hash;
          $this.s3_1[hash] = j + 1 | 0;
        }
        j = j + 1 | 0;
      }
      i = i + 1 | 0;
    }
    resetRange($this.p3_1, j, $this.u3_1);
    if (valuesArray == null)
      null;
    else {
      resetRange(valuesArray, j, $this.u3_1);
    }
    $this.u3_1 = j;
  }
  function rehash($this, newHashSize) {
    registerModification($this);
    if ($this.u3_1 > $this.x3_1) {
      compact($this, false);
    }
    $this.s3_1 = new Int32Array(newHashSize);
    $this.v3_1 = computeShift(Companion_instance_1, newHashSize);
    var i = 0;
    while (i < $this.u3_1) {
      var tmp0 = i;
      i = tmp0 + 1 | 0;
      if (!putRehash($this, tmp0)) {
        throw IllegalStateException_init_$Create$_0('This cannot happen with fixed magic multiplier and grow-only hash array. Have object hashCodes changed?');
      }
    }
  }
  function putRehash($this, i) {
    var hash_0 = hash($this, $this.p3_1[i]);
    var probesLeft = $this.t3_1;
    while (true) {
      var index = $this.s3_1[hash_0];
      if (index === 0) {
        $this.s3_1[hash_0] = i + 1 | 0;
        $this.r3_1[i] = hash_0;
        return true;
      }
      probesLeft = probesLeft - 1 | 0;
      if (probesLeft < 0)
        return false;
      var tmp0 = hash_0;
      hash_0 = tmp0 - 1 | 0;
      if (tmp0 === 0)
        hash_0 = _get_hashSize__tftcho($this) - 1 | 0;
    }
  }
  function findKey($this, key) {
    var hash_0 = hash($this, key);
    var probesLeft = $this.t3_1;
    while (true) {
      var index = $this.s3_1[hash_0];
      if (index === 0)
        return -1;
      if (index > 0 && equals($this.p3_1[index - 1 | 0], key))
        return index - 1 | 0;
      probesLeft = probesLeft - 1 | 0;
      if (probesLeft < 0)
        return -1;
      var tmp0 = hash_0;
      hash_0 = tmp0 - 1 | 0;
      if (tmp0 === 0)
        hash_0 = _get_hashSize__tftcho($this) - 1 | 0;
    }
  }
  function addKey($this, key) {
    $this.m3();
    retry: while (true) {
      var hash_0 = hash($this, key);
      var tentativeMaxProbeDistance = coerceAtMost(imul($this.t3_1, 2), _get_hashSize__tftcho($this) / 2 | 0);
      var probeDistance = 0;
      while (true) {
        var index = $this.s3_1[hash_0];
        if (index <= 0) {
          if ($this.u3_1 >= _get_capacity__a9k9f3($this)) {
            ensureExtraCapacity($this, 1);
            continue retry;
          }
          var tmp1 = $this.u3_1;
          $this.u3_1 = tmp1 + 1 | 0;
          var putIndex = tmp1;
          $this.p3_1[putIndex] = key;
          $this.r3_1[putIndex] = hash_0;
          $this.s3_1[hash_0] = putIndex + 1 | 0;
          $this.x3_1 = $this.x3_1 + 1 | 0;
          registerModification($this);
          if (probeDistance > $this.t3_1)
            $this.t3_1 = probeDistance;
          return putIndex;
        }
        if (equals($this.p3_1[index - 1 | 0], key)) {
          return -index | 0;
        }
        probeDistance = probeDistance + 1 | 0;
        if (probeDistance > tentativeMaxProbeDistance) {
          rehash($this, imul(_get_hashSize__tftcho($this), 2));
          continue retry;
        }
        var tmp4 = hash_0;
        hash_0 = tmp4 - 1 | 0;
        if (tmp4 === 0)
          hash_0 = _get_hashSize__tftcho($this) - 1 | 0;
      }
    }
  }
  function removeEntryAt($this, index) {
    resetAt($this.p3_1, index);
    var tmp0_safe_receiver = $this.q3_1;
    if (tmp0_safe_receiver == null)
      null;
    else {
      resetAt(tmp0_safe_receiver, index);
    }
    removeHashAt($this, $this.r3_1[index]);
    $this.r3_1[index] = -1;
    $this.x3_1 = $this.x3_1 - 1 | 0;
    registerModification($this);
  }
  function removeHashAt($this, removedHash) {
    var hash_0 = removedHash;
    var hole = removedHash;
    var probeDistance = 0;
    var patchAttemptsLeft = coerceAtMost(imul($this.t3_1, 2), _get_hashSize__tftcho($this) / 2 | 0);
    while (true) {
      var tmp0 = hash_0;
      hash_0 = tmp0 - 1 | 0;
      if (tmp0 === 0)
        hash_0 = _get_hashSize__tftcho($this) - 1 | 0;
      probeDistance = probeDistance + 1 | 0;
      if (probeDistance > $this.t3_1) {
        $this.s3_1[hole] = 0;
        return Unit_instance;
      }
      var index = $this.s3_1[hash_0];
      if (index === 0) {
        $this.s3_1[hole] = 0;
        return Unit_instance;
      }
      if (index < 0) {
        $this.s3_1[hole] = -1;
        hole = hash_0;
        probeDistance = 0;
      } else {
        var otherHash = hash($this, $this.p3_1[index - 1 | 0]);
        if (((otherHash - hash_0 | 0) & (_get_hashSize__tftcho($this) - 1 | 0)) >= probeDistance) {
          $this.s3_1[hole] = index;
          $this.r3_1[index - 1 | 0] = hole;
          hole = hash_0;
          probeDistance = 0;
        }
      }
      patchAttemptsLeft = patchAttemptsLeft - 1 | 0;
      if (patchAttemptsLeft < 0) {
        $this.s3_1[hole] = -1;
        return Unit_instance;
      }
    }
  }
  function contentEquals($this, other) {
    return $this.x3_1 === other.j() && $this.l3(other.x());
  }
  function putEntry($this, entry) {
    var index = addKey($this, entry.t());
    var valuesArray = allocateValuesArray($this);
    if (index >= 0) {
      valuesArray[index] = entry.u();
      return true;
    }
    var oldValue = valuesArray[(-index | 0) - 1 | 0];
    if (!equals(entry.u(), oldValue)) {
      valuesArray[(-index | 0) - 1 | 0] = entry.u();
      return true;
    }
    return false;
  }
  function putAllEntries($this, from) {
    if (from.p())
      return false;
    ensureExtraCapacity($this, from.j());
    var it = from.g();
    var updated = false;
    while (it.h()) {
      if (putEntry($this, it.i()))
        updated = true;
    }
    return updated;
  }
  function Companion_1() {
    this.b4_1 = -1640531527;
    this.c4_1 = 8;
    this.d4_1 = 2;
    this.e4_1 = -1;
  }
  var Companion_instance_1;
  function Companion_getInstance_1() {
    return Companion_instance_1;
  }
  function Itr(map) {
    this.f4_1 = map;
    this.g4_1 = 0;
    this.h4_1 = -1;
    this.i4_1 = this.f4_1.w3_1;
    this.j4();
  }
  protoOf(Itr).j4 = function () {
    while (this.g4_1 < this.f4_1.u3_1 && this.f4_1.r3_1[this.g4_1] < 0) {
      this.g4_1 = this.g4_1 + 1 | 0;
    }
  };
  protoOf(Itr).h = function () {
    return this.g4_1 < this.f4_1.u3_1;
  };
  protoOf(Itr).a2 = function () {
    this.k4();
    // Inline function 'kotlin.check' call
    // Inline function 'kotlin.contracts.contract' call
    if (!!(this.h4_1 === -1)) {
      // Inline function 'kotlin.collections.Itr.remove.<anonymous>' call
      var message = 'Call next() before removing element from the iterator.';
      throw IllegalStateException_init_$Create$_0(toString_1(message));
    }
    this.f4_1.m3();
    removeEntryAt(this.f4_1, this.h4_1);
    this.h4_1 = -1;
    this.i4_1 = this.f4_1.w3_1;
  };
  protoOf(Itr).k4 = function () {
    if (!(this.f4_1.w3_1 === this.i4_1))
      throw ConcurrentModificationException_init_$Create$();
  };
  function KeysItr(map) {
    Itr.call(this, map);
  }
  protoOf(KeysItr).i = function () {
    this.k4();
    if (this.g4_1 >= this.f4_1.u3_1)
      throw NoSuchElementException_init_$Create$();
    var tmp = this;
    var tmp1 = this.g4_1;
    this.g4_1 = tmp1 + 1 | 0;
    tmp.h4_1 = tmp1;
    var result = this.f4_1.p3_1[this.h4_1];
    this.j4();
    return result;
  };
  function EntriesItr(map) {
    Itr.call(this, map);
  }
  protoOf(EntriesItr).i = function () {
    this.k4();
    if (this.g4_1 >= this.f4_1.u3_1)
      throw NoSuchElementException_init_$Create$();
    var tmp = this;
    var tmp1 = this.g4_1;
    this.g4_1 = tmp1 + 1 | 0;
    tmp.h4_1 = tmp1;
    var result = new EntryRef(this.f4_1, this.h4_1);
    this.j4();
    return result;
  };
  protoOf(EntriesItr).t4 = function () {
    if (this.g4_1 >= this.f4_1.u3_1)
      throw NoSuchElementException_init_$Create$();
    var tmp = this;
    var tmp1 = this.g4_1;
    this.g4_1 = tmp1 + 1 | 0;
    tmp.h4_1 = tmp1;
    // Inline function 'kotlin.hashCode' call
    var tmp0_safe_receiver = this.f4_1.p3_1[this.h4_1];
    var tmp1_elvis_lhs = tmp0_safe_receiver == null ? null : hashCode(tmp0_safe_receiver);
    var tmp_0 = tmp1_elvis_lhs == null ? 0 : tmp1_elvis_lhs;
    // Inline function 'kotlin.hashCode' call
    var tmp0_safe_receiver_0 = ensureNotNull(this.f4_1.q3_1)[this.h4_1];
    var tmp1_elvis_lhs_0 = tmp0_safe_receiver_0 == null ? null : hashCode(tmp0_safe_receiver_0);
    var result = tmp_0 ^ (tmp1_elvis_lhs_0 == null ? 0 : tmp1_elvis_lhs_0);
    this.j4();
    return result;
  };
  protoOf(EntriesItr).u4 = function (sb) {
    if (this.g4_1 >= this.f4_1.u3_1)
      throw NoSuchElementException_init_$Create$();
    var tmp = this;
    var tmp1 = this.g4_1;
    this.g4_1 = tmp1 + 1 | 0;
    tmp.h4_1 = tmp1;
    var key = this.f4_1.p3_1[this.h4_1];
    if (equals(key, this.f4_1)) {
      sb.x4('(this Map)');
    } else {
      sb.w4(key);
    }
    sb.y4(_Char___init__impl__6a9atx(61));
    var value = ensureNotNull(this.f4_1.q3_1)[this.h4_1];
    if (equals(value, this.f4_1)) {
      sb.x4('(this Map)');
    } else {
      sb.w4(value);
    }
    this.j4();
  };
  function EntryRef(map, index) {
    this.z4_1 = map;
    this.a5_1 = index;
  }
  protoOf(EntryRef).t = function () {
    return this.z4_1.p3_1[this.a5_1];
  };
  protoOf(EntryRef).u = function () {
    return ensureNotNull(this.z4_1.q3_1)[this.a5_1];
  };
  protoOf(EntryRef).equals = function (other) {
    var tmp;
    var tmp_0;
    if (!(other == null) ? isInterface(other, Entry) : false) {
      tmp_0 = equals(other.t(), this.t());
    } else {
      tmp_0 = false;
    }
    if (tmp_0) {
      tmp = equals(other.u(), this.u());
    } else {
      tmp = false;
    }
    return tmp;
  };
  protoOf(EntryRef).hashCode = function () {
    // Inline function 'kotlin.hashCode' call
    var tmp0_safe_receiver = this.t();
    var tmp1_elvis_lhs = tmp0_safe_receiver == null ? null : hashCode(tmp0_safe_receiver);
    var tmp = tmp1_elvis_lhs == null ? 0 : tmp1_elvis_lhs;
    // Inline function 'kotlin.hashCode' call
    var tmp0_safe_receiver_0 = this.u();
    var tmp1_elvis_lhs_0 = tmp0_safe_receiver_0 == null ? null : hashCode(tmp0_safe_receiver_0);
    return tmp ^ (tmp1_elvis_lhs_0 == null ? 0 : tmp1_elvis_lhs_0);
  };
  protoOf(EntryRef).toString = function () {
    return toString_0(this.t()) + '=' + toString_0(this.u());
  };
  function InternalHashMap(keysArray, valuesArray, presenceArray, hashArray, maxProbeDistance, length) {
    this.p3_1 = keysArray;
    this.q3_1 = valuesArray;
    this.r3_1 = presenceArray;
    this.s3_1 = hashArray;
    this.t3_1 = maxProbeDistance;
    this.u3_1 = length;
    this.v3_1 = computeShift(Companion_instance_1, _get_hashSize__tftcho(this));
    this.w3_1 = 0;
    this.x3_1 = 0;
    this.y3_1 = false;
  }
  protoOf(InternalHashMap).j = function () {
    return this.x3_1;
  };
  protoOf(InternalHashMap).w = function (key) {
    var index = findKey(this, key);
    if (index < 0)
      return null;
    return ensureNotNull(this.q3_1)[index];
  };
  protoOf(InternalHashMap).e3 = function (key) {
    return findKey(this, key) >= 0;
  };
  protoOf(InternalHashMap).p2 = function (key, value) {
    var index = addKey(this, key);
    var valuesArray = allocateValuesArray(this);
    if (index < 0) {
      var oldValue = valuesArray[(-index | 0) - 1 | 0];
      valuesArray[(-index | 0) - 1 | 0] = value;
      return oldValue;
    } else {
      valuesArray[index] = value;
      return null;
    }
  };
  protoOf(InternalHashMap).z3 = function (from) {
    this.m3();
    putAllEntries(this, from.x());
  };
  protoOf(InternalHashMap).equals = function (other) {
    var tmp;
    if (other === this) {
      tmp = true;
    } else {
      var tmp_0;
      if (!(other == null) ? isInterface(other, KtMap) : false) {
        tmp_0 = contentEquals(this, other);
      } else {
        tmp_0 = false;
      }
      tmp = tmp_0;
    }
    return tmp;
  };
  protoOf(InternalHashMap).hashCode = function () {
    var result = 0;
    var it = this.h3();
    while (it.h()) {
      result = result + it.t4() | 0;
    }
    return result;
  };
  protoOf(InternalHashMap).toString = function () {
    var sb = StringBuilder_init_$Create$(2 + imul(this.x3_1, 3) | 0);
    sb.x4('{');
    var i = 0;
    var it = this.h3();
    while (it.h()) {
      if (i > 0) {
        sb.x4(', ');
      }
      it.u4(sb);
      i = i + 1 | 0;
    }
    sb.x4('}');
    return sb.toString();
  };
  protoOf(InternalHashMap).m3 = function () {
    if (this.y3_1)
      throw UnsupportedOperationException_init_$Create$();
  };
  protoOf(InternalHashMap).k3 = function (entry) {
    var index = findKey(this, entry.t());
    if (index < 0)
      return false;
    return equals(ensureNotNull(this.q3_1)[index], entry.u());
  };
  protoOf(InternalHashMap).b5 = function (entry) {
    return this.k3(isInterface(entry, Entry) ? entry : THROW_CCE());
  };
  protoOf(InternalHashMap).o3 = function () {
    return new KeysItr(this);
  };
  protoOf(InternalHashMap).h3 = function () {
    return new EntriesItr(this);
  };
  function InternalMap() {
  }
  function LinkedHashMap_init_$Init$($this) {
    HashMap_init_$Init$_0($this);
    LinkedHashMap.call($this);
    return $this;
  }
  function LinkedHashMap_init_$Create$() {
    return LinkedHashMap_init_$Init$(objectCreate(protoOf(LinkedHashMap)));
  }
  function LinkedHashMap_init_$Init$_0(initialCapacity, $this) {
    HashMap_init_$Init$_2(initialCapacity, $this);
    LinkedHashMap.call($this);
    return $this;
  }
  function LinkedHashMap_init_$Create$_0(initialCapacity) {
    return LinkedHashMap_init_$Init$_0(initialCapacity, objectCreate(protoOf(LinkedHashMap)));
  }
  function LinkedHashMap_init_$Init$_1(original, $this) {
    HashMap_init_$Init$_3(original, $this);
    LinkedHashMap.call($this);
    return $this;
  }
  function LinkedHashMap_init_$Create$_1(original) {
    return LinkedHashMap_init_$Init$_1(original, objectCreate(protoOf(LinkedHashMap)));
  }
  function LinkedHashMap() {
  }
  function LinkedHashSet_init_$Init$($this) {
    HashSet_init_$Init$_0($this);
    LinkedHashSet.call($this);
    return $this;
  }
  function LinkedHashSet_init_$Create$() {
    return LinkedHashSet_init_$Init$(objectCreate(protoOf(LinkedHashSet)));
  }
  function LinkedHashSet_init_$Init$_0(initialCapacity, loadFactor, $this) {
    HashSet_init_$Init$_1(initialCapacity, loadFactor, $this);
    LinkedHashSet.call($this);
    return $this;
  }
  function LinkedHashSet_init_$Init$_1(initialCapacity, $this) {
    LinkedHashSet_init_$Init$_0(initialCapacity, 1.0, $this);
    return $this;
  }
  function LinkedHashSet_init_$Create$_0(initialCapacity) {
    return LinkedHashSet_init_$Init$_1(initialCapacity, objectCreate(protoOf(LinkedHashSet)));
  }
  protoOf(LinkedHashSet).z1 = function () {
    return this.n3_1.m3();
  };
  function LinkedHashSet() {
  }
  function Exception_init_$Init$($this) {
    extendThrowable($this);
    Exception.call($this);
    return $this;
  }
  function Exception_init_$Create$() {
    var tmp = Exception_init_$Init$(objectCreate(protoOf(Exception)));
    captureStack(tmp, Exception_init_$Create$);
    return tmp;
  }
  function Exception_init_$Init$_0(message, $this) {
    extendThrowable($this, message);
    Exception.call($this);
    return $this;
  }
  function Exception_init_$Create$_0(message) {
    var tmp = Exception_init_$Init$_0(message, objectCreate(protoOf(Exception)));
    captureStack(tmp, Exception_init_$Create$_0);
    return tmp;
  }
  function Exception() {
    captureStack(this, Exception);
  }
  function IllegalArgumentException_init_$Init$($this) {
    RuntimeException_init_$Init$($this);
    IllegalArgumentException.call($this);
    return $this;
  }
  function IllegalArgumentException_init_$Create$() {
    var tmp = IllegalArgumentException_init_$Init$(objectCreate(protoOf(IllegalArgumentException)));
    captureStack(tmp, IllegalArgumentException_init_$Create$);
    return tmp;
  }
  function IllegalArgumentException_init_$Init$_0(message, $this) {
    RuntimeException_init_$Init$_0(message, $this);
    IllegalArgumentException.call($this);
    return $this;
  }
  function IllegalArgumentException_init_$Create$_0(message) {
    var tmp = IllegalArgumentException_init_$Init$_0(message, objectCreate(protoOf(IllegalArgumentException)));
    captureStack(tmp, IllegalArgumentException_init_$Create$_0);
    return tmp;
  }
  function IllegalArgumentException() {
    captureStack(this, IllegalArgumentException);
  }
  function IndexOutOfBoundsException_init_$Init$($this) {
    RuntimeException_init_$Init$($this);
    IndexOutOfBoundsException.call($this);
    return $this;
  }
  function IndexOutOfBoundsException_init_$Create$() {
    var tmp = IndexOutOfBoundsException_init_$Init$(objectCreate(protoOf(IndexOutOfBoundsException)));
    captureStack(tmp, IndexOutOfBoundsException_init_$Create$);
    return tmp;
  }
  function IndexOutOfBoundsException_init_$Init$_0(message, $this) {
    RuntimeException_init_$Init$_0(message, $this);
    IndexOutOfBoundsException.call($this);
    return $this;
  }
  function IndexOutOfBoundsException_init_$Create$_0(message) {
    var tmp = IndexOutOfBoundsException_init_$Init$_0(message, objectCreate(protoOf(IndexOutOfBoundsException)));
    captureStack(tmp, IndexOutOfBoundsException_init_$Create$_0);
    return tmp;
  }
  function IndexOutOfBoundsException() {
    captureStack(this, IndexOutOfBoundsException);
  }
  function IllegalStateException_init_$Init$($this) {
    RuntimeException_init_$Init$($this);
    IllegalStateException.call($this);
    return $this;
  }
  function IllegalStateException_init_$Create$() {
    var tmp = IllegalStateException_init_$Init$(objectCreate(protoOf(IllegalStateException)));
    captureStack(tmp, IllegalStateException_init_$Create$);
    return tmp;
  }
  function IllegalStateException_init_$Init$_0(message, $this) {
    RuntimeException_init_$Init$_0(message, $this);
    IllegalStateException.call($this);
    return $this;
  }
  function IllegalStateException_init_$Create$_0(message) {
    var tmp = IllegalStateException_init_$Init$_0(message, objectCreate(protoOf(IllegalStateException)));
    captureStack(tmp, IllegalStateException_init_$Create$_0);
    return tmp;
  }
  function IllegalStateException() {
    captureStack(this, IllegalStateException);
  }
  function UnsupportedOperationException_init_$Init$($this) {
    RuntimeException_init_$Init$($this);
    UnsupportedOperationException.call($this);
    return $this;
  }
  function UnsupportedOperationException_init_$Create$() {
    var tmp = UnsupportedOperationException_init_$Init$(objectCreate(protoOf(UnsupportedOperationException)));
    captureStack(tmp, UnsupportedOperationException_init_$Create$);
    return tmp;
  }
  function UnsupportedOperationException_init_$Init$_0(message, $this) {
    RuntimeException_init_$Init$_0(message, $this);
    UnsupportedOperationException.call($this);
    return $this;
  }
  function UnsupportedOperationException_init_$Create$_0(message) {
    var tmp = UnsupportedOperationException_init_$Init$_0(message, objectCreate(protoOf(UnsupportedOperationException)));
    captureStack(tmp, UnsupportedOperationException_init_$Create$_0);
    return tmp;
  }
  function UnsupportedOperationException() {
    captureStack(this, UnsupportedOperationException);
  }
  function RuntimeException_init_$Init$($this) {
    Exception_init_$Init$($this);
    RuntimeException.call($this);
    return $this;
  }
  function RuntimeException_init_$Create$() {
    var tmp = RuntimeException_init_$Init$(objectCreate(protoOf(RuntimeException)));
    captureStack(tmp, RuntimeException_init_$Create$);
    return tmp;
  }
  function RuntimeException_init_$Init$_0(message, $this) {
    Exception_init_$Init$_0(message, $this);
    RuntimeException.call($this);
    return $this;
  }
  function RuntimeException_init_$Create$_0(message) {
    var tmp = RuntimeException_init_$Init$_0(message, objectCreate(protoOf(RuntimeException)));
    captureStack(tmp, RuntimeException_init_$Create$_0);
    return tmp;
  }
  function RuntimeException() {
    captureStack(this, RuntimeException);
  }
  function NoSuchElementException_init_$Init$($this) {
    RuntimeException_init_$Init$($this);
    NoSuchElementException.call($this);
    return $this;
  }
  function NoSuchElementException_init_$Create$() {
    var tmp = NoSuchElementException_init_$Init$(objectCreate(protoOf(NoSuchElementException)));
    captureStack(tmp, NoSuchElementException_init_$Create$);
    return tmp;
  }
  function NoSuchElementException_init_$Init$_0(message, $this) {
    RuntimeException_init_$Init$_0(message, $this);
    NoSuchElementException.call($this);
    return $this;
  }
  function NoSuchElementException_init_$Create$_0(message) {
    var tmp = NoSuchElementException_init_$Init$_0(message, objectCreate(protoOf(NoSuchElementException)));
    captureStack(tmp, NoSuchElementException_init_$Create$_0);
    return tmp;
  }
  function NoSuchElementException() {
    captureStack(this, NoSuchElementException);
  }
  function NumberFormatException_init_$Init$($this) {
    IllegalArgumentException_init_$Init$($this);
    NumberFormatException.call($this);
    return $this;
  }
  function NumberFormatException_init_$Create$() {
    var tmp = NumberFormatException_init_$Init$(objectCreate(protoOf(NumberFormatException)));
    captureStack(tmp, NumberFormatException_init_$Create$);
    return tmp;
  }
  function NumberFormatException_init_$Init$_0(message, $this) {
    IllegalArgumentException_init_$Init$_0(message, $this);
    NumberFormatException.call($this);
    return $this;
  }
  function NumberFormatException_init_$Create$_0(message) {
    var tmp = NumberFormatException_init_$Init$_0(message, objectCreate(protoOf(NumberFormatException)));
    captureStack(tmp, NumberFormatException_init_$Create$_0);
    return tmp;
  }
  function NumberFormatException() {
    captureStack(this, NumberFormatException);
  }
  function ArithmeticException_init_$Init$($this) {
    RuntimeException_init_$Init$($this);
    ArithmeticException.call($this);
    return $this;
  }
  function ArithmeticException_init_$Create$() {
    var tmp = ArithmeticException_init_$Init$(objectCreate(protoOf(ArithmeticException)));
    captureStack(tmp, ArithmeticException_init_$Create$);
    return tmp;
  }
  function ArithmeticException_init_$Init$_0(message, $this) {
    RuntimeException_init_$Init$_0(message, $this);
    ArithmeticException.call($this);
    return $this;
  }
  function ArithmeticException_init_$Create$_0(message) {
    var tmp = ArithmeticException_init_$Init$_0(message, objectCreate(protoOf(ArithmeticException)));
    captureStack(tmp, ArithmeticException_init_$Create$_0);
    return tmp;
  }
  function ArithmeticException() {
    captureStack(this, ArithmeticException);
  }
  function ConcurrentModificationException_init_$Init$($this) {
    RuntimeException_init_$Init$($this);
    ConcurrentModificationException.call($this);
    return $this;
  }
  function ConcurrentModificationException_init_$Create$() {
    var tmp = ConcurrentModificationException_init_$Init$(objectCreate(protoOf(ConcurrentModificationException)));
    captureStack(tmp, ConcurrentModificationException_init_$Create$);
    return tmp;
  }
  function ConcurrentModificationException() {
    captureStack(this, ConcurrentModificationException);
  }
  function NullPointerException_init_$Init$($this) {
    RuntimeException_init_$Init$($this);
    NullPointerException.call($this);
    return $this;
  }
  function NullPointerException_init_$Create$() {
    var tmp = NullPointerException_init_$Init$(objectCreate(protoOf(NullPointerException)));
    captureStack(tmp, NullPointerException_init_$Create$);
    return tmp;
  }
  function NullPointerException() {
    captureStack(this, NullPointerException);
  }
  function NoWhenBranchMatchedException_init_$Init$($this) {
    RuntimeException_init_$Init$($this);
    NoWhenBranchMatchedException.call($this);
    return $this;
  }
  function NoWhenBranchMatchedException_init_$Create$() {
    var tmp = NoWhenBranchMatchedException_init_$Init$(objectCreate(protoOf(NoWhenBranchMatchedException)));
    captureStack(tmp, NoWhenBranchMatchedException_init_$Create$);
    return tmp;
  }
  function NoWhenBranchMatchedException() {
    captureStack(this, NoWhenBranchMatchedException);
  }
  function ClassCastException_init_$Init$($this) {
    RuntimeException_init_$Init$($this);
    ClassCastException.call($this);
    return $this;
  }
  function ClassCastException_init_$Create$() {
    var tmp = ClassCastException_init_$Init$(objectCreate(protoOf(ClassCastException)));
    captureStack(tmp, ClassCastException_init_$Create$);
    return tmp;
  }
  function ClassCastException() {
    captureStack(this, ClassCastException);
  }
  function lazy(initializer) {
    return new UnsafeLazyImpl(initializer);
  }
  function fillFrom(src, dst) {
    var srcLen = src.length;
    var dstLen = dst.length;
    var index = 0;
    // Inline function 'kotlin.js.unsafeCast' call
    var arr = dst;
    while (index < srcLen && index < dstLen) {
      var tmp = index;
      var tmp0 = index;
      index = tmp0 + 1 | 0;
      arr[tmp] = src[tmp0];
    }
    return dst;
  }
  function arrayCopyResize(source, newSize, defaultValue) {
    // Inline function 'kotlin.js.unsafeCast' call
    var result = source.slice(0, newSize);
    // Inline function 'kotlin.copyArrayType' call
    if (source.$type$ !== undefined) {
      result.$type$ = source.$type$;
    }
    var index = source.length;
    if (newSize > index) {
      // Inline function 'kotlin.js.asDynamic' call
      result.length = newSize;
      while (index < newSize) {
        var tmp0 = index;
        index = tmp0 + 1 | 0;
        result[tmp0] = defaultValue;
      }
    }
    return result;
  }
  function KClass() {
  }
  function KClassImpl(jClass) {
    this.g5_1 = jClass;
  }
  protoOf(KClassImpl).h5 = function () {
    return this.g5_1;
  };
  protoOf(KClassImpl).equals = function (other) {
    var tmp;
    if (other instanceof NothingKClassImpl) {
      tmp = false;
    } else {
      if (other instanceof ErrorKClass) {
        tmp = false;
      } else {
        if (other instanceof KClassImpl) {
          tmp = equals(this.h5(), other.h5());
        } else {
          tmp = false;
        }
      }
    }
    return tmp;
  };
  protoOf(KClassImpl).hashCode = function () {
    var tmp0_safe_receiver = this.f5();
    var tmp1_elvis_lhs = tmp0_safe_receiver == null ? null : getStringHashCode(tmp0_safe_receiver);
    return tmp1_elvis_lhs == null ? 0 : tmp1_elvis_lhs;
  };
  protoOf(KClassImpl).toString = function () {
    return 'class ' + this.f5();
  };
  function NothingKClassImpl() {
    NothingKClassImpl_instance = this;
    KClassImpl.call(this, Object);
    this.j5_1 = 'Nothing';
  }
  protoOf(NothingKClassImpl).f5 = function () {
    return this.j5_1;
  };
  protoOf(NothingKClassImpl).h5 = function () {
    throw UnsupportedOperationException_init_$Create$_0("There's no native JS class for Nothing type");
  };
  protoOf(NothingKClassImpl).equals = function (other) {
    return other === this;
  };
  protoOf(NothingKClassImpl).hashCode = function () {
    return 0;
  };
  var NothingKClassImpl_instance;
  function NothingKClassImpl_getInstance() {
    if (NothingKClassImpl_instance == null)
      new NothingKClassImpl();
    return NothingKClassImpl_instance;
  }
  function ErrorKClass() {
  }
  protoOf(ErrorKClass).f5 = function () {
    var message = 'Unknown simpleName for ErrorKClass';
    throw IllegalStateException_init_$Create$_0(toString_1(message));
  };
  protoOf(ErrorKClass).equals = function (other) {
    return other === this;
  };
  protoOf(ErrorKClass).hashCode = function () {
    return 0;
  };
  function PrimitiveKClassImpl(jClass, givenSimpleName, isInstanceFunction) {
    KClassImpl.call(this, jClass);
    this.l5_1 = givenSimpleName;
    this.m5_1 = isInstanceFunction;
  }
  protoOf(PrimitiveKClassImpl).equals = function (other) {
    if (!(other instanceof PrimitiveKClassImpl))
      return false;
    return protoOf(KClassImpl).equals.call(this, other) && this.l5_1 === other.l5_1;
  };
  protoOf(PrimitiveKClassImpl).f5 = function () {
    return this.l5_1;
  };
  function SimpleKClassImpl(jClass) {
    KClassImpl.call(this, jClass);
    var tmp = this;
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var tmp0_safe_receiver = jClass.$metadata$;
    tmp.o5_1 = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.simpleName;
  }
  protoOf(SimpleKClassImpl).f5 = function () {
    return this.o5_1;
  };
  function KProperty1() {
  }
  function get_functionClasses() {
    _init_properties_primitives_kt__3fums4();
    return functionClasses;
  }
  var functionClasses;
  function PrimitiveClasses$anyClass$lambda(it) {
    return !(it == null);
  }
  function PrimitiveClasses$numberClass$lambda(it) {
    return isNumber(it);
  }
  function PrimitiveClasses$booleanClass$lambda(it) {
    return !(it == null) ? typeof it === 'boolean' : false;
  }
  function PrimitiveClasses$byteClass$lambda(it) {
    return !(it == null) ? typeof it === 'number' : false;
  }
  function PrimitiveClasses$shortClass$lambda(it) {
    return !(it == null) ? typeof it === 'number' : false;
  }
  function PrimitiveClasses$intClass$lambda(it) {
    return !(it == null) ? typeof it === 'number' : false;
  }
  function PrimitiveClasses$floatClass$lambda(it) {
    return !(it == null) ? typeof it === 'number' : false;
  }
  function PrimitiveClasses$doubleClass$lambda(it) {
    return !(it == null) ? typeof it === 'number' : false;
  }
  function PrimitiveClasses$arrayClass$lambda(it) {
    return !(it == null) ? isArray(it) : false;
  }
  function PrimitiveClasses$stringClass$lambda(it) {
    return !(it == null) ? typeof it === 'string' : false;
  }
  function PrimitiveClasses$throwableClass$lambda(it) {
    return it instanceof Error;
  }
  function PrimitiveClasses$booleanArrayClass$lambda(it) {
    return !(it == null) ? isBooleanArray(it) : false;
  }
  function PrimitiveClasses$charArrayClass$lambda(it) {
    return !(it == null) ? isCharArray(it) : false;
  }
  function PrimitiveClasses$byteArrayClass$lambda(it) {
    return !(it == null) ? isByteArray(it) : false;
  }
  function PrimitiveClasses$shortArrayClass$lambda(it) {
    return !(it == null) ? isShortArray(it) : false;
  }
  function PrimitiveClasses$intArrayClass$lambda(it) {
    return !(it == null) ? isIntArray(it) : false;
  }
  function PrimitiveClasses$longArrayClass$lambda(it) {
    return !(it == null) ? isLongArray(it) : false;
  }
  function PrimitiveClasses$floatArrayClass$lambda(it) {
    return !(it == null) ? isFloatArray(it) : false;
  }
  function PrimitiveClasses$doubleArrayClass$lambda(it) {
    return !(it == null) ? isDoubleArray(it) : false;
  }
  function PrimitiveClasses$functionClass$lambda($arity) {
    return function (it) {
      var tmp;
      if (typeof it === 'function') {
        // Inline function 'kotlin.js.asDynamic' call
        tmp = it.length === $arity;
      } else {
        tmp = false;
      }
      return tmp;
    };
  }
  function PrimitiveClasses() {
    PrimitiveClasses_instance = this;
    var tmp = this;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_0 = Object;
    tmp.anyClass = new PrimitiveKClassImpl(tmp_0, 'Any', PrimitiveClasses$anyClass$lambda);
    var tmp_1 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_2 = Number;
    tmp_1.numberClass = new PrimitiveKClassImpl(tmp_2, 'Number', PrimitiveClasses$numberClass$lambda);
    this.nothingClass = NothingKClassImpl_getInstance();
    var tmp_3 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_4 = Boolean;
    tmp_3.booleanClass = new PrimitiveKClassImpl(tmp_4, 'Boolean', PrimitiveClasses$booleanClass$lambda);
    var tmp_5 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_6 = Number;
    tmp_5.byteClass = new PrimitiveKClassImpl(tmp_6, 'Byte', PrimitiveClasses$byteClass$lambda);
    var tmp_7 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_8 = Number;
    tmp_7.shortClass = new PrimitiveKClassImpl(tmp_8, 'Short', PrimitiveClasses$shortClass$lambda);
    var tmp_9 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_10 = Number;
    tmp_9.intClass = new PrimitiveKClassImpl(tmp_10, 'Int', PrimitiveClasses$intClass$lambda);
    var tmp_11 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_12 = Number;
    tmp_11.floatClass = new PrimitiveKClassImpl(tmp_12, 'Float', PrimitiveClasses$floatClass$lambda);
    var tmp_13 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_14 = Number;
    tmp_13.doubleClass = new PrimitiveKClassImpl(tmp_14, 'Double', PrimitiveClasses$doubleClass$lambda);
    var tmp_15 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_16 = Array;
    tmp_15.arrayClass = new PrimitiveKClassImpl(tmp_16, 'Array', PrimitiveClasses$arrayClass$lambda);
    var tmp_17 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_18 = String;
    tmp_17.stringClass = new PrimitiveKClassImpl(tmp_18, 'String', PrimitiveClasses$stringClass$lambda);
    var tmp_19 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_20 = Error;
    tmp_19.throwableClass = new PrimitiveKClassImpl(tmp_20, 'Throwable', PrimitiveClasses$throwableClass$lambda);
    var tmp_21 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_22 = Array;
    tmp_21.booleanArrayClass = new PrimitiveKClassImpl(tmp_22, 'BooleanArray', PrimitiveClasses$booleanArrayClass$lambda);
    var tmp_23 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_24 = Uint16Array;
    tmp_23.charArrayClass = new PrimitiveKClassImpl(tmp_24, 'CharArray', PrimitiveClasses$charArrayClass$lambda);
    var tmp_25 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_26 = Int8Array;
    tmp_25.byteArrayClass = new PrimitiveKClassImpl(tmp_26, 'ByteArray', PrimitiveClasses$byteArrayClass$lambda);
    var tmp_27 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_28 = Int16Array;
    tmp_27.shortArrayClass = new PrimitiveKClassImpl(tmp_28, 'ShortArray', PrimitiveClasses$shortArrayClass$lambda);
    var tmp_29 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_30 = Int32Array;
    tmp_29.intArrayClass = new PrimitiveKClassImpl(tmp_30, 'IntArray', PrimitiveClasses$intArrayClass$lambda);
    var tmp_31 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_32 = Array;
    tmp_31.longArrayClass = new PrimitiveKClassImpl(tmp_32, 'LongArray', PrimitiveClasses$longArrayClass$lambda);
    var tmp_33 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_34 = Float32Array;
    tmp_33.floatArrayClass = new PrimitiveKClassImpl(tmp_34, 'FloatArray', PrimitiveClasses$floatArrayClass$lambda);
    var tmp_35 = this;
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp_36 = Float64Array;
    tmp_35.doubleArrayClass = new PrimitiveKClassImpl(tmp_36, 'DoubleArray', PrimitiveClasses$doubleArrayClass$lambda);
  }
  protoOf(PrimitiveClasses).p5 = function () {
    return this.anyClass;
  };
  protoOf(PrimitiveClasses).q5 = function () {
    return this.numberClass;
  };
  protoOf(PrimitiveClasses).r5 = function () {
    return this.nothingClass;
  };
  protoOf(PrimitiveClasses).s5 = function () {
    return this.booleanClass;
  };
  protoOf(PrimitiveClasses).t5 = function () {
    return this.byteClass;
  };
  protoOf(PrimitiveClasses).u5 = function () {
    return this.shortClass;
  };
  protoOf(PrimitiveClasses).v5 = function () {
    return this.intClass;
  };
  protoOf(PrimitiveClasses).w5 = function () {
    return this.floatClass;
  };
  protoOf(PrimitiveClasses).x5 = function () {
    return this.doubleClass;
  };
  protoOf(PrimitiveClasses).y5 = function () {
    return this.arrayClass;
  };
  protoOf(PrimitiveClasses).z5 = function () {
    return this.stringClass;
  };
  protoOf(PrimitiveClasses).a6 = function () {
    return this.throwableClass;
  };
  protoOf(PrimitiveClasses).b6 = function () {
    return this.booleanArrayClass;
  };
  protoOf(PrimitiveClasses).c6 = function () {
    return this.charArrayClass;
  };
  protoOf(PrimitiveClasses).d6 = function () {
    return this.byteArrayClass;
  };
  protoOf(PrimitiveClasses).e6 = function () {
    return this.shortArrayClass;
  };
  protoOf(PrimitiveClasses).f6 = function () {
    return this.intArrayClass;
  };
  protoOf(PrimitiveClasses).g6 = function () {
    return this.longArrayClass;
  };
  protoOf(PrimitiveClasses).h6 = function () {
    return this.floatArrayClass;
  };
  protoOf(PrimitiveClasses).i6 = function () {
    return this.doubleArrayClass;
  };
  protoOf(PrimitiveClasses).functionClass = function (arity) {
    var tmp0_elvis_lhs = get_functionClasses()[arity];
    var tmp;
    if (tmp0_elvis_lhs == null) {
      // Inline function 'kotlin.run' call
      // Inline function 'kotlin.contracts.contract' call
      // Inline function 'kotlin.reflect.js.internal.PrimitiveClasses.functionClass.<anonymous>' call
      // Inline function 'kotlin.js.unsafeCast' call
      var tmp_0 = Function;
      var tmp_1 = 'Function' + arity;
      var result = new PrimitiveKClassImpl(tmp_0, tmp_1, PrimitiveClasses$functionClass$lambda(arity));
      // Inline function 'kotlin.js.asDynamic' call
      get_functionClasses()[arity] = result;
      tmp = result;
    } else {
      tmp = tmp0_elvis_lhs;
    }
    return tmp;
  };
  var PrimitiveClasses_instance;
  function PrimitiveClasses_getInstance() {
    if (PrimitiveClasses_instance == null)
      new PrimitiveClasses();
    return PrimitiveClasses_instance;
  }
  var properties_initialized_primitives_kt_jle18u;
  function _init_properties_primitives_kt__3fums4() {
    if (!properties_initialized_primitives_kt_jle18u) {
      properties_initialized_primitives_kt_jle18u = true;
      // Inline function 'kotlin.arrayOfNulls' call
      functionClasses = fillArrayVal(Array(0), null);
    }
  }
  function getKClass(jClass) {
    var tmp;
    if (Array.isArray(jClass)) {
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      tmp = getKClassM(jClass);
    } else {
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      tmp = getKClass1(jClass);
    }
    return tmp;
  }
  function getKClassM(jClasses) {
    var tmp;
    switch (jClasses.length) {
      case 1:
        tmp = getKClass1(jClasses[0]);
        break;
      case 0:
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp = NothingKClassImpl_getInstance();
        break;
      default:
        // Inline function 'kotlin.js.unsafeCast' call

        // Inline function 'kotlin.js.asDynamic' call

        tmp = new ErrorKClass();
        break;
    }
    return tmp;
  }
  function getKClass1(jClass) {
    if (jClass === String) {
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      return PrimitiveClasses_getInstance().stringClass;
    }
    // Inline function 'kotlin.js.asDynamic' call
    var metadata = jClass.$metadata$;
    var tmp;
    if (metadata != null) {
      var tmp_0;
      if (metadata.$kClass$ == null) {
        var kClass = new SimpleKClassImpl(jClass);
        metadata.$kClass$ = kClass;
        tmp_0 = kClass;
      } else {
        tmp_0 = metadata.$kClass$;
      }
      tmp = tmp_0;
    } else {
      tmp = new SimpleKClassImpl(jClass);
    }
    return tmp;
  }
  function getKClassFromExpression(e) {
    // Inline function 'kotlin.js.unsafeCast' call
    var tmp;
    switch (typeof e) {
      case 'string':
        tmp = PrimitiveClasses_getInstance().stringClass;
        break;
      case 'number':
        var tmp_0;
        // Inline function 'kotlin.js.asDynamic' call

        // Inline function 'kotlin.js.jsBitwiseOr' call

        if ((e | 0) === e) {
          tmp_0 = PrimitiveClasses_getInstance().intClass;
        } else {
          tmp_0 = PrimitiveClasses_getInstance().doubleClass;
        }

        tmp = tmp_0;
        break;
      case 'boolean':
        tmp = PrimitiveClasses_getInstance().booleanClass;
        break;
      case 'function':
        var tmp_1 = PrimitiveClasses_getInstance();
        // Inline function 'kotlin.js.asDynamic' call

        tmp = tmp_1.functionClass(e.length);
        break;
      default:
        var tmp_2;
        if (isBooleanArray(e)) {
          tmp_2 = PrimitiveClasses_getInstance().booleanArrayClass;
        } else {
          if (isCharArray(e)) {
            tmp_2 = PrimitiveClasses_getInstance().charArrayClass;
          } else {
            if (isByteArray(e)) {
              tmp_2 = PrimitiveClasses_getInstance().byteArrayClass;
            } else {
              if (isShortArray(e)) {
                tmp_2 = PrimitiveClasses_getInstance().shortArrayClass;
              } else {
                if (isIntArray(e)) {
                  tmp_2 = PrimitiveClasses_getInstance().intArrayClass;
                } else {
                  if (isLongArray(e)) {
                    tmp_2 = PrimitiveClasses_getInstance().longArrayClass;
                  } else {
                    if (isFloatArray(e)) {
                      tmp_2 = PrimitiveClasses_getInstance().floatArrayClass;
                    } else {
                      if (isDoubleArray(e)) {
                        tmp_2 = PrimitiveClasses_getInstance().doubleArrayClass;
                      } else {
                        if (isInterface(e, KClass)) {
                          tmp_2 = getKClass(KClass);
                        } else {
                          if (isArray(e)) {
                            tmp_2 = PrimitiveClasses_getInstance().arrayClass;
                          } else {
                            var constructor = Object.getPrototypeOf(e).constructor;
                            var tmp_3;
                            if (constructor === Object) {
                              tmp_3 = PrimitiveClasses_getInstance().anyClass;
                            } else if (constructor === Error) {
                              tmp_3 = PrimitiveClasses_getInstance().throwableClass;
                            } else {
                              var jsClass = constructor;
                              tmp_3 = getKClass1(jsClass);
                            }
                            tmp_2 = tmp_3;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }

        tmp = tmp_2;
        break;
    }
    // Inline function 'kotlin.js.asDynamic' call
    return tmp;
  }
  function StringBuilder_init_$Init$(capacity, $this) {
    StringBuilder_init_$Init$_0($this);
    return $this;
  }
  function StringBuilder_init_$Create$(capacity) {
    return StringBuilder_init_$Init$(capacity, objectCreate(protoOf(StringBuilder)));
  }
  function StringBuilder_init_$Init$_0($this) {
    StringBuilder.call($this, '');
    return $this;
  }
  function StringBuilder_init_$Create$_0() {
    return StringBuilder_init_$Init$_0(objectCreate(protoOf(StringBuilder)));
  }
  function StringBuilder(content) {
    this.v4_1 = !(content === undefined) ? content : '';
  }
  protoOf(StringBuilder).a = function () {
    // Inline function 'kotlin.js.asDynamic' call
    return this.v4_1.length;
  };
  protoOf(StringBuilder).b = function (index) {
    // Inline function 'kotlin.text.getOrElse' call
    var this_0 = this.v4_1;
    // Inline function 'kotlin.contracts.contract' call
    var tmp;
    if (0 <= index ? index <= (charSequenceLength(this_0) - 1 | 0) : false) {
      tmp = charSequenceGet(this_0, index);
    } else {
      throw IndexOutOfBoundsException_init_$Create$_0('index: ' + index + ', length: ' + this.a() + '}');
    }
    return tmp;
  };
  protoOf(StringBuilder).c = function (startIndex, endIndex) {
    // Inline function 'kotlin.text.substring' call
    // Inline function 'kotlin.js.asDynamic' call
    return this.v4_1.substring(startIndex, endIndex);
  };
  protoOf(StringBuilder).y4 = function (value) {
    this.v4_1 = this.v4_1 + toString(value);
    return this;
  };
  protoOf(StringBuilder).f = function (value) {
    this.v4_1 = this.v4_1 + toString_0(value);
    return this;
  };
  protoOf(StringBuilder).w4 = function (value) {
    this.v4_1 = this.v4_1 + toString_0(value);
    return this;
  };
  protoOf(StringBuilder).x4 = function (value) {
    var tmp = this;
    var tmp_0 = this.v4_1;
    tmp.v4_1 = tmp_0 + (value == null ? 'null' : value);
    return this;
  };
  protoOf(StringBuilder).toString = function () {
    return this.v4_1;
  };
  function uppercaseChar(_this__u8e3s4) {
    // Inline function 'kotlin.text.uppercase' call
    // Inline function 'kotlin.js.unsafeCast' call
    // Inline function 'kotlin.js.asDynamic' call
    var uppercase = toString(_this__u8e3s4).toUpperCase();
    return uppercase.length > 1 ? _this__u8e3s4 : charSequenceGet(uppercase, 0);
  }
  function isWhitespace(_this__u8e3s4) {
    return isWhitespaceImpl(_this__u8e3s4);
  }
  function checkRadix(radix) {
    if (!(2 <= radix ? radix <= 36 : false)) {
      throw IllegalArgumentException_init_$Create$_0('radix ' + radix + ' was not in valid range 2..36');
    }
    return radix;
  }
  function toInt(_this__u8e3s4) {
    var tmp0_elvis_lhs = toIntOrNull(_this__u8e3s4);
    var tmp;
    if (tmp0_elvis_lhs == null) {
      numberFormatError(_this__u8e3s4);
    } else {
      tmp = tmp0_elvis_lhs;
    }
    return tmp;
  }
  function digitOf(char, radix) {
    // Inline function 'kotlin.let' call
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'kotlin.text.digitOf.<anonymous>' call
    var it = Char__compareTo_impl_ypi4mb(char, _Char___init__impl__6a9atx(48)) >= 0 && Char__compareTo_impl_ypi4mb(char, _Char___init__impl__6a9atx(57)) <= 0 ? Char__minus_impl_a2frrh(char, _Char___init__impl__6a9atx(48)) : Char__compareTo_impl_ypi4mb(char, _Char___init__impl__6a9atx(65)) >= 0 && Char__compareTo_impl_ypi4mb(char, _Char___init__impl__6a9atx(90)) <= 0 ? Char__minus_impl_a2frrh(char, _Char___init__impl__6a9atx(65)) + 10 | 0 : Char__compareTo_impl_ypi4mb(char, _Char___init__impl__6a9atx(97)) >= 0 && Char__compareTo_impl_ypi4mb(char, _Char___init__impl__6a9atx(122)) <= 0 ? Char__minus_impl_a2frrh(char, _Char___init__impl__6a9atx(97)) + 10 | 0 : Char__compareTo_impl_ypi4mb(char, _Char___init__impl__6a9atx(128)) < 0 ? -1 : Char__compareTo_impl_ypi4mb(char, _Char___init__impl__6a9atx(65313)) >= 0 && Char__compareTo_impl_ypi4mb(char, _Char___init__impl__6a9atx(65338)) <= 0 ? Char__minus_impl_a2frrh(char, _Char___init__impl__6a9atx(65313)) + 10 | 0 : Char__compareTo_impl_ypi4mb(char, _Char___init__impl__6a9atx(65345)) >= 0 && Char__compareTo_impl_ypi4mb(char, _Char___init__impl__6a9atx(65370)) <= 0 ? Char__minus_impl_a2frrh(char, _Char___init__impl__6a9atx(65345)) + 10 | 0 : digitToIntImpl(char);
    return it >= radix ? -1 : it;
  }
  var STRING_CASE_INSENSITIVE_ORDER;
  function compareTo_0(_this__u8e3s4, other, ignoreCase) {
    ignoreCase = ignoreCase === VOID ? false : ignoreCase;
    _init_properties_stringJs_kt__bg7zye();
    if (ignoreCase) {
      var n1 = _this__u8e3s4.length;
      var n2 = other.length;
      // Inline function 'kotlin.comparisons.minOf' call
      var min = Math.min(n1, n2);
      if (min === 0)
        return n1 - n2 | 0;
      var inductionVariable = 0;
      if (inductionVariable < min)
        do {
          var index = inductionVariable;
          inductionVariable = inductionVariable + 1 | 0;
          var thisChar = charSequenceGet(_this__u8e3s4, index);
          var otherChar = charSequenceGet(other, index);
          if (!(thisChar === otherChar)) {
            thisChar = uppercaseChar(thisChar);
            otherChar = uppercaseChar(otherChar);
            if (!(thisChar === otherChar)) {
              // Inline function 'kotlin.text.lowercaseChar' call
              // Inline function 'kotlin.text.lowercase' call
              var this_0 = thisChar;
              // Inline function 'kotlin.js.unsafeCast' call
              // Inline function 'kotlin.js.asDynamic' call
              var tmp$ret$3 = toString(this_0).toLowerCase();
              thisChar = charSequenceGet(tmp$ret$3, 0);
              // Inline function 'kotlin.text.lowercaseChar' call
              // Inline function 'kotlin.text.lowercase' call
              var this_1 = otherChar;
              // Inline function 'kotlin.js.unsafeCast' call
              // Inline function 'kotlin.js.asDynamic' call
              var tmp$ret$7 = toString(this_1).toLowerCase();
              otherChar = charSequenceGet(tmp$ret$7, 0);
              if (!(thisChar === otherChar)) {
                return Char__compareTo_impl_ypi4mb(thisChar, otherChar);
              }
            }
          }
        }
         while (inductionVariable < min);
      return n1 - n2 | 0;
    } else {
      return compareTo(_this__u8e3s4, other);
    }
  }
  function toCharArray(_this__u8e3s4) {
    _init_properties_stringJs_kt__bg7zye();
    var tmp = 0;
    var tmp_0 = _this__u8e3s4.length;
    var tmp_1 = charArray(tmp_0);
    while (tmp < tmp_0) {
      var tmp_2 = tmp;
      tmp_1[tmp_2] = charSequenceGet(_this__u8e3s4, tmp_2);
      tmp = tmp + 1 | 0;
    }
    return tmp_1;
  }
  function sam$kotlin_Comparator$0(function_0) {
    this.j6_1 = function_0;
  }
  protoOf(sam$kotlin_Comparator$0).k6 = function (a, b) {
    return this.j6_1(a, b);
  };
  protoOf(sam$kotlin_Comparator$0).compare = function (a, b) {
    return this.k6(a, b);
  };
  protoOf(sam$kotlin_Comparator$0).r1 = function () {
    return this.j6_1;
  };
  protoOf(sam$kotlin_Comparator$0).equals = function (other) {
    var tmp;
    if (!(other == null) ? isInterface(other, Comparator) : false) {
      var tmp_0;
      if (!(other == null) ? isInterface(other, FunctionAdapter) : false) {
        tmp_0 = equals(this.r1(), other.r1());
      } else {
        tmp_0 = false;
      }
      tmp = tmp_0;
    } else {
      tmp = false;
    }
    return tmp;
  };
  protoOf(sam$kotlin_Comparator$0).hashCode = function () {
    return hashCode(this.r1());
  };
  function STRING_CASE_INSENSITIVE_ORDER$lambda(a, b) {
    _init_properties_stringJs_kt__bg7zye();
    return compareTo_0(a, b, true);
  }
  var properties_initialized_stringJs_kt_nta8o4;
  function _init_properties_stringJs_kt__bg7zye() {
    if (!properties_initialized_stringJs_kt_nta8o4) {
      properties_initialized_stringJs_kt_nta8o4 = true;
      var tmp = STRING_CASE_INSENSITIVE_ORDER$lambda;
      STRING_CASE_INSENSITIVE_ORDER = new sam$kotlin_Comparator$0(tmp);
    }
  }
  function equals_0(_this__u8e3s4, other, ignoreCase) {
    ignoreCase = ignoreCase === VOID ? false : ignoreCase;
    if (_this__u8e3s4 == null)
      return other == null;
    if (other == null)
      return false;
    if (!ignoreCase)
      return _this__u8e3s4 == other;
    if (!(_this__u8e3s4.length === other.length))
      return false;
    var inductionVariable = 0;
    var last = _this__u8e3s4.length;
    if (inductionVariable < last)
      do {
        var index = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var thisChar = charSequenceGet(_this__u8e3s4, index);
        var otherChar = charSequenceGet(other, index);
        if (!equals_1(thisChar, otherChar, ignoreCase)) {
          return false;
        }
      }
       while (inductionVariable < last);
    return true;
  }
  function AbstractCollection$toString$lambda(this$0) {
    return function (it) {
      return it === this$0 ? '(this Collection)' : toString_0(it);
    };
  }
  function AbstractCollection() {
  }
  protoOf(AbstractCollection).q = function (element) {
    var tmp$ret$0;
    $l$block_0: {
      // Inline function 'kotlin.collections.any' call
      var tmp;
      if (isInterface(this, Collection)) {
        tmp = this.p();
      } else {
        tmp = false;
      }
      if (tmp) {
        tmp$ret$0 = false;
        break $l$block_0;
      }
      var tmp0_iterator = this.g();
      while (tmp0_iterator.h()) {
        var element_0 = tmp0_iterator.i();
        // Inline function 'kotlin.collections.AbstractCollection.contains.<anonymous>' call
        if (equals(element_0, element)) {
          tmp$ret$0 = true;
          break $l$block_0;
        }
      }
      tmp$ret$0 = false;
    }
    return tmp$ret$0;
  };
  protoOf(AbstractCollection).r = function (elements) {
    var tmp$ret$0;
    $l$block_0: {
      // Inline function 'kotlin.collections.all' call
      var tmp;
      if (isInterface(elements, Collection)) {
        tmp = elements.p();
      } else {
        tmp = false;
      }
      if (tmp) {
        tmp$ret$0 = true;
        break $l$block_0;
      }
      var tmp0_iterator = elements.g();
      while (tmp0_iterator.h()) {
        var element = tmp0_iterator.i();
        // Inline function 'kotlin.collections.AbstractCollection.containsAll.<anonymous>' call
        if (!this.q(element)) {
          tmp$ret$0 = false;
          break $l$block_0;
        }
      }
      tmp$ret$0 = true;
    }
    return tmp$ret$0;
  };
  protoOf(AbstractCollection).p = function () {
    return this.j() === 0;
  };
  protoOf(AbstractCollection).toString = function () {
    return joinToString_0(this, ', ', '[', ']', VOID, VOID, AbstractCollection$toString$lambda(this));
  };
  protoOf(AbstractCollection).toArray = function () {
    return collectionToArray(this);
  };
  function Companion_2() {
    this.u1_1 = 2147483639;
  }
  protoOf(Companion_2).w2 = function (index, size) {
    if (index < 0 || index >= size) {
      throw IndexOutOfBoundsException_init_$Create$_0('index: ' + index + ', size: ' + size);
    }
  };
  protoOf(Companion_2).i2 = function (index, size) {
    if (index < 0 || index > size) {
      throw IndexOutOfBoundsException_init_$Create$_0('index: ' + index + ', size: ' + size);
    }
  };
  protoOf(Companion_2).v1 = function (fromIndex, toIndex, size) {
    if (fromIndex < 0 || toIndex > size) {
      throw IndexOutOfBoundsException_init_$Create$_0('fromIndex: ' + fromIndex + ', toIndex: ' + toIndex + ', size: ' + size);
    }
    if (fromIndex > toIndex) {
      throw IllegalArgumentException_init_$Create$_0('fromIndex: ' + fromIndex + ' > toIndex: ' + toIndex);
    }
  };
  protoOf(Companion_2).a4 = function (oldCapacity, minCapacity) {
    var newCapacity = oldCapacity + (oldCapacity >> 1) | 0;
    if ((newCapacity - minCapacity | 0) < 0)
      newCapacity = minCapacity;
    if ((newCapacity - 2147483639 | 0) > 0)
      newCapacity = minCapacity > 2147483639 ? 2147483647 : 2147483639;
    return newCapacity;
  };
  protoOf(Companion_2).k2 = function (c) {
    var hashCode_0 = 1;
    var tmp0_iterator = c.g();
    while (tmp0_iterator.h()) {
      var e = tmp0_iterator.i();
      var tmp = imul(31, hashCode_0);
      var tmp2_elvis_lhs = e == null ? null : hashCode(e);
      hashCode_0 = tmp + (tmp2_elvis_lhs == null ? 0 : tmp2_elvis_lhs) | 0;
    }
    return hashCode_0;
  };
  protoOf(Companion_2).j2 = function (c, other) {
    if (!(c.j() === other.j()))
      return false;
    var otherIterator = other.g();
    var tmp0_iterator = c.g();
    while (tmp0_iterator.h()) {
      var elem = tmp0_iterator.i();
      var elemOther = otherIterator.i();
      if (!equals(elem, elemOther)) {
        return false;
      }
    }
    return true;
  };
  var Companion_instance_2;
  function Companion_getInstance_2() {
    return Companion_instance_2;
  }
  function toString_2($this, o) {
    return o === $this ? '(this Map)' : toString_0(o);
  }
  function implFindEntry($this, key) {
    var tmp$ret$1;
    $l$block: {
      // Inline function 'kotlin.collections.firstOrNull' call
      var tmp0_iterator = $this.x().g();
      while (tmp0_iterator.h()) {
        var element = tmp0_iterator.i();
        // Inline function 'kotlin.collections.AbstractMap.implFindEntry.<anonymous>' call
        if (equals(element.t(), key)) {
          tmp$ret$1 = element;
          break $l$block;
        }
      }
      tmp$ret$1 = null;
    }
    return tmp$ret$1;
  }
  function Companion_3() {
  }
  var Companion_instance_3;
  function Companion_getInstance_3() {
    return Companion_instance_3;
  }
  function AbstractMap$toString$lambda(this$0) {
    return function (it) {
      return this$0.l6(it);
    };
  }
  function AbstractMap() {
    this.q2_1 = null;
    this.r2_1 = null;
  }
  protoOf(AbstractMap).v = function (key) {
    return !(implFindEntry(this, key) == null);
  };
  protoOf(AbstractMap).s2 = function (entry) {
    if (!(!(entry == null) ? isInterface(entry, Entry) : false))
      return false;
    var key = entry.t();
    var value = entry.u();
    // Inline function 'kotlin.collections.get' call
    var ourValue = (isInterface(this, KtMap) ? this : THROW_CCE()).w(key);
    if (!equals(value, ourValue)) {
      return false;
    }
    var tmp;
    if (ourValue == null) {
      // Inline function 'kotlin.collections.containsKey' call
      tmp = !(isInterface(this, KtMap) ? this : THROW_CCE()).v(key);
    } else {
      tmp = false;
    }
    if (tmp) {
      return false;
    }
    return true;
  };
  protoOf(AbstractMap).equals = function (other) {
    if (other === this)
      return true;
    if (!(!(other == null) ? isInterface(other, KtMap) : false))
      return false;
    if (!(this.j() === other.j()))
      return false;
    var tmp$ret$0;
    $l$block_0: {
      // Inline function 'kotlin.collections.all' call
      var this_0 = other.x();
      var tmp;
      if (isInterface(this_0, Collection)) {
        tmp = this_0.p();
      } else {
        tmp = false;
      }
      if (tmp) {
        tmp$ret$0 = true;
        break $l$block_0;
      }
      var tmp0_iterator = this_0.g();
      while (tmp0_iterator.h()) {
        var element = tmp0_iterator.i();
        // Inline function 'kotlin.collections.AbstractMap.equals.<anonymous>' call
        if (!this.s2(element)) {
          tmp$ret$0 = false;
          break $l$block_0;
        }
      }
      tmp$ret$0 = true;
    }
    return tmp$ret$0;
  };
  protoOf(AbstractMap).w = function (key) {
    var tmp0_safe_receiver = implFindEntry(this, key);
    return tmp0_safe_receiver == null ? null : tmp0_safe_receiver.u();
  };
  protoOf(AbstractMap).hashCode = function () {
    return hashCode(this.x());
  };
  protoOf(AbstractMap).p = function () {
    return this.j() === 0;
  };
  protoOf(AbstractMap).j = function () {
    return this.x().j();
  };
  protoOf(AbstractMap).toString = function () {
    var tmp = this.x();
    return joinToString_0(tmp, ', ', '{', '}', VOID, VOID, AbstractMap$toString$lambda(this));
  };
  protoOf(AbstractMap).l6 = function (entry) {
    return toString_2(this, entry.t()) + '=' + toString_2(this, entry.u());
  };
  function Companion_4() {
  }
  protoOf(Companion_4).u2 = function (c) {
    var hashCode_0 = 0;
    var tmp0_iterator = c.g();
    while (tmp0_iterator.h()) {
      var element = tmp0_iterator.i();
      var tmp = hashCode_0;
      var tmp2_elvis_lhs = element == null ? null : hashCode(element);
      hashCode_0 = tmp + (tmp2_elvis_lhs == null ? 0 : tmp2_elvis_lhs) | 0;
    }
    return hashCode_0;
  };
  protoOf(Companion_4).t2 = function (c, other) {
    if (!(c.j() === other.j()))
      return false;
    // Inline function 'kotlin.collections.containsAll' call
    return c.r(other);
  };
  var Companion_instance_4;
  function Companion_getInstance_4() {
    return Companion_instance_4;
  }
  function ArrayDeque_init_$Init$($this) {
    AbstractMutableList.call($this);
    ArrayDeque.call($this);
    $this.o6_1 = Companion_getInstance_5().q6_1;
    return $this;
  }
  function ArrayDeque_init_$Create$() {
    return ArrayDeque_init_$Init$(objectCreate(protoOf(ArrayDeque)));
  }
  function ArrayDeque_init_$Init$_0(elements, $this) {
    AbstractMutableList.call($this);
    ArrayDeque.call($this);
    var tmp = $this;
    // Inline function 'kotlin.collections.toTypedArray' call
    tmp.o6_1 = copyToArray(elements);
    $this.p6_1 = $this.o6_1.length;
    // Inline function 'kotlin.collections.isEmpty' call
    if ($this.o6_1.length === 0)
      $this.o6_1 = Companion_getInstance_5().q6_1;
    return $this;
  }
  function ArrayDeque_init_$Create$_0(elements) {
    return ArrayDeque_init_$Init$_0(elements, objectCreate(protoOf(ArrayDeque)));
  }
  function ensureCapacity_0($this, minCapacity) {
    if (minCapacity < 0)
      throw IllegalStateException_init_$Create$_0('Deque is too big.');
    if (minCapacity <= $this.o6_1.length)
      return Unit_instance;
    if ($this.o6_1 === Companion_getInstance_5().q6_1) {
      var tmp = $this;
      // Inline function 'kotlin.arrayOfNulls' call
      var size = coerceAtLeast(minCapacity, 10);
      tmp.o6_1 = fillArrayVal(Array(size), null);
      return Unit_instance;
    }
    var newCapacity = Companion_instance_2.a4($this.o6_1.length, minCapacity);
    copyElements($this, newCapacity);
  }
  function copyElements($this, newCapacity) {
    // Inline function 'kotlin.arrayOfNulls' call
    var newElements = fillArrayVal(Array(newCapacity), null);
    // Inline function 'kotlin.collections.copyInto' call
    var this_0 = $this.o6_1;
    var startIndex = $this.n6_1;
    var endIndex = $this.o6_1.length;
    arrayCopy(this_0, newElements, 0, startIndex, endIndex);
    // Inline function 'kotlin.collections.copyInto' call
    var this_1 = $this.o6_1;
    var destinationOffset = $this.o6_1.length - $this.n6_1 | 0;
    var endIndex_0 = $this.n6_1;
    arrayCopy(this_1, newElements, destinationOffset, 0, endIndex_0);
    $this.n6_1 = 0;
    $this.o6_1 = newElements;
  }
  function positiveMod($this, index) {
    return index >= $this.o6_1.length ? index - $this.o6_1.length | 0 : index;
  }
  function negativeMod($this, index) {
    return index < 0 ? index + $this.o6_1.length | 0 : index;
  }
  function incremented($this, index) {
    return index === get_lastIndex($this.o6_1) ? 0 : index + 1 | 0;
  }
  function decremented($this, index) {
    return index === 0 ? get_lastIndex($this.o6_1) : index - 1 | 0;
  }
  function copyCollectionElements($this, internalIndex, elements) {
    var iterator = elements.g();
    var inductionVariable = internalIndex;
    var last = $this.o6_1.length;
    if (inductionVariable < last)
      $l$loop: do {
        var index = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        if (!iterator.h())
          break $l$loop;
        $this.o6_1[index] = iterator.i();
      }
       while (inductionVariable < last);
    var inductionVariable_0 = 0;
    var last_0 = $this.n6_1;
    if (inductionVariable_0 < last_0)
      $l$loop_0: do {
        var index_0 = inductionVariable_0;
        inductionVariable_0 = inductionVariable_0 + 1 | 0;
        if (!iterator.h())
          break $l$loop_0;
        $this.o6_1[index_0] = iterator.i();
      }
       while (inductionVariable_0 < last_0);
    $this.p6_1 = $this.p6_1 + elements.j() | 0;
  }
  function nullifyNonEmpty($this, internalFromIndex, internalToIndex) {
    if (internalFromIndex < internalToIndex) {
      fill($this.o6_1, null, internalFromIndex, internalToIndex);
    } else {
      fill($this.o6_1, null, internalFromIndex, $this.o6_1.length);
      fill($this.o6_1, null, 0, internalToIndex);
    }
  }
  function registerModification_0($this) {
    $this.e2_1 = $this.e2_1 + 1 | 0;
  }
  function Companion_5() {
    Companion_instance_5 = this;
    var tmp = this;
    // Inline function 'kotlin.emptyArray' call
    tmp.q6_1 = [];
    this.r6_1 = 10;
  }
  var Companion_instance_5;
  function Companion_getInstance_5() {
    if (Companion_instance_5 == null)
      new Companion_5();
    return Companion_instance_5;
  }
  protoOf(ArrayDeque).j = function () {
    return this.p6_1;
  };
  protoOf(ArrayDeque).p = function () {
    return this.p6_1 === 0;
  };
  protoOf(ArrayDeque).s6 = function () {
    var tmp;
    if (this.p()) {
      tmp = null;
    } else {
      // Inline function 'kotlin.collections.ArrayDeque.internalGet' call
      var internalIndex = this.n6_1;
      var tmp_0 = this.o6_1[internalIndex];
      tmp = (tmp_0 == null ? true : !(tmp_0 == null)) ? tmp_0 : THROW_CCE();
    }
    return tmp;
  };
  protoOf(ArrayDeque).t6 = function (element) {
    registerModification_0(this);
    ensureCapacity_0(this, this.p6_1 + 1 | 0);
    this.n6_1 = decremented(this, this.n6_1);
    this.o6_1[this.n6_1] = element;
    this.p6_1 = this.p6_1 + 1 | 0;
  };
  protoOf(ArrayDeque).u6 = function (element) {
    registerModification_0(this);
    ensureCapacity_0(this, this.p6_1 + 1 | 0);
    var tmp = this.o6_1;
    // Inline function 'kotlin.collections.ArrayDeque.internalIndex' call
    var index = this.p6_1;
    tmp[positiveMod(this, this.n6_1 + index | 0)] = element;
    this.p6_1 = this.p6_1 + 1 | 0;
  };
  protoOf(ArrayDeque).v6 = function () {
    if (this.p())
      throw NoSuchElementException_init_$Create$_0('ArrayDeque is empty.');
    registerModification_0(this);
    // Inline function 'kotlin.collections.ArrayDeque.internalGet' call
    var internalIndex = this.n6_1;
    var tmp = this.o6_1[internalIndex];
    var element = (tmp == null ? true : !(tmp == null)) ? tmp : THROW_CCE();
    this.o6_1[this.n6_1] = null;
    this.n6_1 = incremented(this, this.n6_1);
    this.p6_1 = this.p6_1 - 1 | 0;
    return element;
  };
  protoOf(ArrayDeque).w6 = function () {
    if (this.p())
      throw NoSuchElementException_init_$Create$_0('ArrayDeque is empty.');
    registerModification_0(this);
    // Inline function 'kotlin.collections.ArrayDeque.internalIndex' call
    var index = get_lastIndex_0(this);
    var internalLastIndex = positiveMod(this, this.n6_1 + index | 0);
    // Inline function 'kotlin.collections.ArrayDeque.internalGet' call
    var tmp = this.o6_1[internalLastIndex];
    var element = (tmp == null ? true : !(tmp == null)) ? tmp : THROW_CCE();
    this.o6_1[internalLastIndex] = null;
    this.p6_1 = this.p6_1 - 1 | 0;
    return element;
  };
  protoOf(ArrayDeque).e = function (element) {
    this.u6(element);
    return true;
  };
  protoOf(ArrayDeque).g2 = function (index, element) {
    Companion_instance_2.i2(index, this.p6_1);
    if (index === this.p6_1) {
      this.u6(element);
      return Unit_instance;
    } else if (index === 0) {
      this.t6(element);
      return Unit_instance;
    }
    registerModification_0(this);
    ensureCapacity_0(this, this.p6_1 + 1 | 0);
    // Inline function 'kotlin.collections.ArrayDeque.internalIndex' call
    var internalIndex = positiveMod(this, this.n6_1 + index | 0);
    if (index < (this.p6_1 + 1 | 0) >> 1) {
      var decrementedInternalIndex = decremented(this, internalIndex);
      var decrementedHead = decremented(this, this.n6_1);
      if (decrementedInternalIndex >= this.n6_1) {
        this.o6_1[decrementedHead] = this.o6_1[this.n6_1];
        // Inline function 'kotlin.collections.copyInto' call
        var this_0 = this.o6_1;
        var destination = this.o6_1;
        var destinationOffset = this.n6_1;
        var startIndex = this.n6_1 + 1 | 0;
        var endIndex = decrementedInternalIndex + 1 | 0;
        arrayCopy(this_0, destination, destinationOffset, startIndex, endIndex);
      } else {
        // Inline function 'kotlin.collections.copyInto' call
        var this_1 = this.o6_1;
        var destination_0 = this.o6_1;
        var destinationOffset_0 = this.n6_1 - 1 | 0;
        var startIndex_0 = this.n6_1;
        var endIndex_0 = this.o6_1.length;
        arrayCopy(this_1, destination_0, destinationOffset_0, startIndex_0, endIndex_0);
        this.o6_1[this.o6_1.length - 1 | 0] = this.o6_1[0];
        // Inline function 'kotlin.collections.copyInto' call
        var this_2 = this.o6_1;
        var destination_1 = this.o6_1;
        var endIndex_1 = decrementedInternalIndex + 1 | 0;
        arrayCopy(this_2, destination_1, 0, 1, endIndex_1);
      }
      this.o6_1[decrementedInternalIndex] = element;
      this.n6_1 = decrementedHead;
    } else {
      // Inline function 'kotlin.collections.ArrayDeque.internalIndex' call
      var index_0 = this.p6_1;
      var tail = positiveMod(this, this.n6_1 + index_0 | 0);
      if (internalIndex < tail) {
        // Inline function 'kotlin.collections.copyInto' call
        var this_3 = this.o6_1;
        var destination_2 = this.o6_1;
        var destinationOffset_1 = internalIndex + 1 | 0;
        arrayCopy(this_3, destination_2, destinationOffset_1, internalIndex, tail);
      } else {
        // Inline function 'kotlin.collections.copyInto' call
        var this_4 = this.o6_1;
        var destination_3 = this.o6_1;
        arrayCopy(this_4, destination_3, 1, 0, tail);
        this.o6_1[0] = this.o6_1[this.o6_1.length - 1 | 0];
        // Inline function 'kotlin.collections.copyInto' call
        var this_5 = this.o6_1;
        var destination_4 = this.o6_1;
        var destinationOffset_2 = internalIndex + 1 | 0;
        var endIndex_2 = this.o6_1.length - 1 | 0;
        arrayCopy(this_5, destination_4, destinationOffset_2, internalIndex, endIndex_2);
      }
      this.o6_1[internalIndex] = element;
    }
    this.p6_1 = this.p6_1 + 1 | 0;
  };
  protoOf(ArrayDeque).n = function (elements) {
    if (elements.p())
      return false;
    registerModification_0(this);
    ensureCapacity_0(this, this.p6_1 + elements.j() | 0);
    // Inline function 'kotlin.collections.ArrayDeque.internalIndex' call
    var index = this.p6_1;
    var tmp$ret$0 = positiveMod(this, this.n6_1 + index | 0);
    copyCollectionElements(this, tmp$ret$0, elements);
    return true;
  };
  protoOf(ArrayDeque).h2 = function (index, elements) {
    Companion_instance_2.i2(index, this.p6_1);
    if (elements.p()) {
      return false;
    } else if (index === this.p6_1) {
      return this.n(elements);
    }
    registerModification_0(this);
    ensureCapacity_0(this, this.p6_1 + elements.j() | 0);
    // Inline function 'kotlin.collections.ArrayDeque.internalIndex' call
    var index_0 = this.p6_1;
    var tail = positiveMod(this, this.n6_1 + index_0 | 0);
    // Inline function 'kotlin.collections.ArrayDeque.internalIndex' call
    var internalIndex = positiveMod(this, this.n6_1 + index | 0);
    var elementsSize = elements.j();
    if (index < (this.p6_1 + 1 | 0) >> 1) {
      var shiftedHead = this.n6_1 - elementsSize | 0;
      if (internalIndex >= this.n6_1) {
        if (shiftedHead >= 0) {
          // Inline function 'kotlin.collections.copyInto' call
          var this_0 = this.o6_1;
          var destination = this.o6_1;
          var destinationOffset = shiftedHead;
          var startIndex = this.n6_1;
          arrayCopy(this_0, destination, destinationOffset, startIndex, internalIndex);
        } else {
          shiftedHead = shiftedHead + this.o6_1.length | 0;
          var elementsToShift = internalIndex - this.n6_1 | 0;
          var shiftToBack = this.o6_1.length - shiftedHead | 0;
          if (shiftToBack >= elementsToShift) {
            // Inline function 'kotlin.collections.copyInto' call
            var this_1 = this.o6_1;
            var destination_0 = this.o6_1;
            var destinationOffset_0 = shiftedHead;
            var startIndex_0 = this.n6_1;
            arrayCopy(this_1, destination_0, destinationOffset_0, startIndex_0, internalIndex);
          } else {
            // Inline function 'kotlin.collections.copyInto' call
            var this_2 = this.o6_1;
            var destination_1 = this.o6_1;
            var destinationOffset_1 = shiftedHead;
            var startIndex_1 = this.n6_1;
            var endIndex = this.n6_1 + shiftToBack | 0;
            arrayCopy(this_2, destination_1, destinationOffset_1, startIndex_1, endIndex);
            // Inline function 'kotlin.collections.copyInto' call
            var this_3 = this.o6_1;
            var destination_2 = this.o6_1;
            var startIndex_2 = this.n6_1 + shiftToBack | 0;
            arrayCopy(this_3, destination_2, 0, startIndex_2, internalIndex);
          }
        }
      } else {
        // Inline function 'kotlin.collections.copyInto' call
        var this_4 = this.o6_1;
        var destination_3 = this.o6_1;
        var destinationOffset_2 = shiftedHead;
        var startIndex_3 = this.n6_1;
        var endIndex_0 = this.o6_1.length;
        arrayCopy(this_4, destination_3, destinationOffset_2, startIndex_3, endIndex_0);
        if (elementsSize >= internalIndex) {
          // Inline function 'kotlin.collections.copyInto' call
          var this_5 = this.o6_1;
          var destination_4 = this.o6_1;
          var destinationOffset_3 = this.o6_1.length - elementsSize | 0;
          arrayCopy(this_5, destination_4, destinationOffset_3, 0, internalIndex);
        } else {
          // Inline function 'kotlin.collections.copyInto' call
          var this_6 = this.o6_1;
          var destination_5 = this.o6_1;
          var destinationOffset_4 = this.o6_1.length - elementsSize | 0;
          arrayCopy(this_6, destination_5, destinationOffset_4, 0, elementsSize);
          // Inline function 'kotlin.collections.copyInto' call
          var this_7 = this.o6_1;
          var destination_6 = this.o6_1;
          arrayCopy(this_7, destination_6, 0, elementsSize, internalIndex);
        }
      }
      this.n6_1 = shiftedHead;
      copyCollectionElements(this, negativeMod(this, internalIndex - elementsSize | 0), elements);
    } else {
      var shiftedInternalIndex = internalIndex + elementsSize | 0;
      if (internalIndex < tail) {
        if ((tail + elementsSize | 0) <= this.o6_1.length) {
          // Inline function 'kotlin.collections.copyInto' call
          var this_8 = this.o6_1;
          var destination_7 = this.o6_1;
          arrayCopy(this_8, destination_7, shiftedInternalIndex, internalIndex, tail);
        } else {
          if (shiftedInternalIndex >= this.o6_1.length) {
            // Inline function 'kotlin.collections.copyInto' call
            var this_9 = this.o6_1;
            var destination_8 = this.o6_1;
            var destinationOffset_5 = shiftedInternalIndex - this.o6_1.length | 0;
            arrayCopy(this_9, destination_8, destinationOffset_5, internalIndex, tail);
          } else {
            var shiftToFront = (tail + elementsSize | 0) - this.o6_1.length | 0;
            // Inline function 'kotlin.collections.copyInto' call
            var this_10 = this.o6_1;
            var destination_9 = this.o6_1;
            var startIndex_4 = tail - shiftToFront | 0;
            arrayCopy(this_10, destination_9, 0, startIndex_4, tail);
            // Inline function 'kotlin.collections.copyInto' call
            var this_11 = this.o6_1;
            var destination_10 = this.o6_1;
            var endIndex_1 = tail - shiftToFront | 0;
            arrayCopy(this_11, destination_10, shiftedInternalIndex, internalIndex, endIndex_1);
          }
        }
      } else {
        // Inline function 'kotlin.collections.copyInto' call
        var this_12 = this.o6_1;
        var destination_11 = this.o6_1;
        arrayCopy(this_12, destination_11, elementsSize, 0, tail);
        if (shiftedInternalIndex >= this.o6_1.length) {
          // Inline function 'kotlin.collections.copyInto' call
          var this_13 = this.o6_1;
          var destination_12 = this.o6_1;
          var destinationOffset_6 = shiftedInternalIndex - this.o6_1.length | 0;
          var endIndex_2 = this.o6_1.length;
          arrayCopy(this_13, destination_12, destinationOffset_6, internalIndex, endIndex_2);
        } else {
          // Inline function 'kotlin.collections.copyInto' call
          var this_14 = this.o6_1;
          var destination_13 = this.o6_1;
          var startIndex_5 = this.o6_1.length - elementsSize | 0;
          var endIndex_3 = this.o6_1.length;
          arrayCopy(this_14, destination_13, 0, startIndex_5, endIndex_3);
          // Inline function 'kotlin.collections.copyInto' call
          var this_15 = this.o6_1;
          var destination_14 = this.o6_1;
          var endIndex_4 = this.o6_1.length - elementsSize | 0;
          arrayCopy(this_15, destination_14, shiftedInternalIndex, internalIndex, endIndex_4);
        }
      }
      copyCollectionElements(this, internalIndex, elements);
    }
    return true;
  };
  protoOf(ArrayDeque).o = function (index) {
    Companion_instance_2.w2(index, this.p6_1);
    // Inline function 'kotlin.collections.ArrayDeque.internalGet' call
    // Inline function 'kotlin.collections.ArrayDeque.internalIndex' call
    var internalIndex = positiveMod(this, this.n6_1 + index | 0);
    var tmp = this.o6_1[internalIndex];
    return (tmp == null ? true : !(tmp == null)) ? tmp : THROW_CCE();
  };
  protoOf(ArrayDeque).x1 = function (index, element) {
    Companion_instance_2.w2(index, this.p6_1);
    // Inline function 'kotlin.collections.ArrayDeque.internalIndex' call
    var internalIndex = positiveMod(this, this.n6_1 + index | 0);
    // Inline function 'kotlin.collections.ArrayDeque.internalGet' call
    var tmp = this.o6_1[internalIndex];
    var oldElement = (tmp == null ? true : !(tmp == null)) ? tmp : THROW_CCE();
    this.o6_1[internalIndex] = element;
    return oldElement;
  };
  protoOf(ArrayDeque).q = function (element) {
    return !(this.s(element) === -1);
  };
  protoOf(ArrayDeque).s = function (element) {
    // Inline function 'kotlin.collections.ArrayDeque.internalIndex' call
    var index = this.p6_1;
    var tail = positiveMod(this, this.n6_1 + index | 0);
    if (this.n6_1 < tail) {
      var inductionVariable = this.n6_1;
      if (inductionVariable < tail)
        do {
          var index_0 = inductionVariable;
          inductionVariable = inductionVariable + 1 | 0;
          if (equals(element, this.o6_1[index_0]))
            return index_0 - this.n6_1 | 0;
        }
         while (inductionVariable < tail);
    } else if (this.n6_1 >= tail) {
      var inductionVariable_0 = this.n6_1;
      var last = this.o6_1.length;
      if (inductionVariable_0 < last)
        do {
          var index_1 = inductionVariable_0;
          inductionVariable_0 = inductionVariable_0 + 1 | 0;
          if (equals(element, this.o6_1[index_1]))
            return index_1 - this.n6_1 | 0;
        }
         while (inductionVariable_0 < last);
      var inductionVariable_1 = 0;
      if (inductionVariable_1 < tail)
        do {
          var index_2 = inductionVariable_1;
          inductionVariable_1 = inductionVariable_1 + 1 | 0;
          if (equals(element, this.o6_1[index_2]))
            return (index_2 + this.o6_1.length | 0) - this.n6_1 | 0;
        }
         while (inductionVariable_1 < tail);
    }
    return -1;
  };
  protoOf(ArrayDeque).y1 = function (element) {
    var index = this.s(element);
    if (index === -1)
      return false;
    this.f2(index);
    return true;
  };
  protoOf(ArrayDeque).f2 = function (index) {
    Companion_instance_2.w2(index, this.p6_1);
    if (index === get_lastIndex_0(this)) {
      return this.w6();
    } else if (index === 0) {
      return this.v6();
    }
    registerModification_0(this);
    // Inline function 'kotlin.collections.ArrayDeque.internalIndex' call
    var internalIndex = positiveMod(this, this.n6_1 + index | 0);
    // Inline function 'kotlin.collections.ArrayDeque.internalGet' call
    var tmp = this.o6_1[internalIndex];
    var element = (tmp == null ? true : !(tmp == null)) ? tmp : THROW_CCE();
    if (index < this.p6_1 >> 1) {
      if (internalIndex >= this.n6_1) {
        // Inline function 'kotlin.collections.copyInto' call
        var this_0 = this.o6_1;
        var destination = this.o6_1;
        var destinationOffset = this.n6_1 + 1 | 0;
        var startIndex = this.n6_1;
        arrayCopy(this_0, destination, destinationOffset, startIndex, internalIndex);
      } else {
        // Inline function 'kotlin.collections.copyInto' call
        var this_1 = this.o6_1;
        var destination_0 = this.o6_1;
        arrayCopy(this_1, destination_0, 1, 0, internalIndex);
        this.o6_1[0] = this.o6_1[this.o6_1.length - 1 | 0];
        // Inline function 'kotlin.collections.copyInto' call
        var this_2 = this.o6_1;
        var destination_1 = this.o6_1;
        var destinationOffset_0 = this.n6_1 + 1 | 0;
        var startIndex_0 = this.n6_1;
        var endIndex = this.o6_1.length - 1 | 0;
        arrayCopy(this_2, destination_1, destinationOffset_0, startIndex_0, endIndex);
      }
      this.o6_1[this.n6_1] = null;
      this.n6_1 = incremented(this, this.n6_1);
    } else {
      // Inline function 'kotlin.collections.ArrayDeque.internalIndex' call
      var index_0 = get_lastIndex_0(this);
      var internalLastIndex = positiveMod(this, this.n6_1 + index_0 | 0);
      if (internalIndex <= internalLastIndex) {
        // Inline function 'kotlin.collections.copyInto' call
        var this_3 = this.o6_1;
        var destination_2 = this.o6_1;
        var startIndex_1 = internalIndex + 1 | 0;
        var endIndex_0 = internalLastIndex + 1 | 0;
        arrayCopy(this_3, destination_2, internalIndex, startIndex_1, endIndex_0);
      } else {
        // Inline function 'kotlin.collections.copyInto' call
        var this_4 = this.o6_1;
        var destination_3 = this.o6_1;
        var startIndex_2 = internalIndex + 1 | 0;
        var endIndex_1 = this.o6_1.length;
        arrayCopy(this_4, destination_3, internalIndex, startIndex_2, endIndex_1);
        this.o6_1[this.o6_1.length - 1 | 0] = this.o6_1[0];
        // Inline function 'kotlin.collections.copyInto' call
        var this_5 = this.o6_1;
        var destination_4 = this.o6_1;
        var endIndex_2 = internalLastIndex + 1 | 0;
        arrayCopy(this_5, destination_4, 0, 1, endIndex_2);
      }
      this.o6_1[internalLastIndex] = null;
    }
    this.p6_1 = this.p6_1 - 1 | 0;
    return element;
  };
  protoOf(ArrayDeque).x6 = function () {
    // Inline function 'kotlin.collections.isNotEmpty' call
    if (!this.p()) {
      registerModification_0(this);
      // Inline function 'kotlin.collections.ArrayDeque.internalIndex' call
      var index = this.p6_1;
      var tail = positiveMod(this, this.n6_1 + index | 0);
      nullifyNonEmpty(this, this.n6_1, tail);
    }
    this.n6_1 = 0;
    this.p6_1 = 0;
  };
  protoOf(ArrayDeque).y6 = function (array) {
    var tmp = array.length >= this.p6_1 ? array : arrayOfNulls(array, this.p6_1);
    var dest = isArray(tmp) ? tmp : THROW_CCE();
    // Inline function 'kotlin.collections.ArrayDeque.internalIndex' call
    var index = this.p6_1;
    var tail = positiveMod(this, this.n6_1 + index | 0);
    if (this.n6_1 < tail) {
      // Inline function 'kotlin.collections.copyInto' call
      var this_0 = this.o6_1;
      var startIndex = this.n6_1;
      arrayCopy(this_0, dest, 0, startIndex, tail);
    } else {
      // Inline function 'kotlin.collections.isNotEmpty' call
      if (!this.p()) {
        // Inline function 'kotlin.collections.copyInto' call
        var this_1 = this.o6_1;
        var startIndex_0 = this.n6_1;
        var endIndex = this.o6_1.length;
        arrayCopy(this_1, dest, 0, startIndex_0, endIndex);
        // Inline function 'kotlin.collections.copyInto' call
        var this_2 = this.o6_1;
        var destinationOffset = this.o6_1.length - this.n6_1 | 0;
        arrayCopy(this_2, dest, destinationOffset, 0, tail);
      }
    }
    var tmp_0 = terminateCollectionToArray(this.p6_1, dest);
    return isArray(tmp_0) ? tmp_0 : THROW_CCE();
  };
  protoOf(ArrayDeque).x2 = function () {
    // Inline function 'kotlin.arrayOfNulls' call
    var size = this.p6_1;
    var tmp$ret$0 = fillArrayVal(Array(size), null);
    return this.y6(tmp$ret$0);
  };
  protoOf(ArrayDeque).toArray = function () {
    return this.x2();
  };
  function ArrayDeque() {
    Companion_getInstance_5();
    this.n6_1 = 0;
    this.p6_1 = 0;
  }
  function collectionToArrayCommonImpl(collection) {
    if (collection.p()) {
      // Inline function 'kotlin.emptyArray' call
      return [];
    }
    // Inline function 'kotlin.arrayOfNulls' call
    var size = collection.j();
    var destination = fillArrayVal(Array(size), null);
    var iterator = collection.g();
    var index = 0;
    while (iterator.h()) {
      var tmp0 = index;
      index = tmp0 + 1 | 0;
      destination[tmp0] = iterator.i();
    }
    return destination;
  }
  function emptyList() {
    return EmptyList_getInstance();
  }
  function listOf_0(elements) {
    return elements.length > 0 ? asList(elements) : emptyList();
  }
  function get_lastIndex_0(_this__u8e3s4) {
    return _this__u8e3s4.j() - 1 | 0;
  }
  function EmptyList() {
    EmptyList_instance = this;
    this.z6_1 = new Long(-1478467534, -1720727600);
  }
  protoOf(EmptyList).equals = function (other) {
    var tmp;
    if (!(other == null) ? isInterface(other, KtList) : false) {
      tmp = other.p();
    } else {
      tmp = false;
    }
    return tmp;
  };
  protoOf(EmptyList).hashCode = function () {
    return 1;
  };
  protoOf(EmptyList).toString = function () {
    return '[]';
  };
  protoOf(EmptyList).j = function () {
    return 0;
  };
  protoOf(EmptyList).p = function () {
    return true;
  };
  protoOf(EmptyList).a7 = function (element) {
    return false;
  };
  protoOf(EmptyList).q = function (element) {
    if (!false)
      return false;
    var tmp;
    if (false) {
      tmp = element;
    } else {
      tmp = THROW_CCE();
    }
    return this.a7(tmp);
  };
  protoOf(EmptyList).b7 = function (elements) {
    return elements.p();
  };
  protoOf(EmptyList).r = function (elements) {
    return this.b7(elements);
  };
  protoOf(EmptyList).o = function (index) {
    throw IndexOutOfBoundsException_init_$Create$_0("Empty list doesn't contain element at index " + index + '.');
  };
  protoOf(EmptyList).c7 = function (element) {
    return -1;
  };
  protoOf(EmptyList).s = function (element) {
    if (!false)
      return -1;
    var tmp;
    if (false) {
      tmp = element;
    } else {
      tmp = THROW_CCE();
    }
    return this.c7(tmp);
  };
  protoOf(EmptyList).g = function () {
    return EmptyIterator_instance;
  };
  var EmptyList_instance;
  function EmptyList_getInstance() {
    if (EmptyList_instance == null)
      new EmptyList();
    return EmptyList_instance;
  }
  function EmptyIterator() {
  }
  protoOf(EmptyIterator).h = function () {
    return false;
  };
  protoOf(EmptyIterator).i = function () {
    throw NoSuchElementException_init_$Create$();
  };
  var EmptyIterator_instance;
  function EmptyIterator_getInstance() {
    return EmptyIterator_instance;
  }
  function arrayListOf(elements) {
    return elements.length === 0 ? ArrayList_init_$Create$() : ArrayList_init_$Create$_1(new ArrayAsCollection(elements, true));
  }
  function throwIndexOverflow() {
    throw ArithmeticException_init_$Create$_0('Index overflow has happened.');
  }
  function ArrayAsCollection(values, isVarargs) {
    this.d7_1 = values;
    this.e7_1 = isVarargs;
  }
  protoOf(ArrayAsCollection).j = function () {
    return this.d7_1.length;
  };
  protoOf(ArrayAsCollection).p = function () {
    // Inline function 'kotlin.collections.isEmpty' call
    return this.d7_1.length === 0;
  };
  protoOf(ArrayAsCollection).f7 = function (element) {
    return contains(this.d7_1, element);
  };
  protoOf(ArrayAsCollection).g7 = function (elements) {
    var tmp$ret$0;
    $l$block_0: {
      // Inline function 'kotlin.collections.all' call
      var tmp;
      if (isInterface(elements, Collection)) {
        tmp = elements.p();
      } else {
        tmp = false;
      }
      if (tmp) {
        tmp$ret$0 = true;
        break $l$block_0;
      }
      var tmp0_iterator = elements.g();
      while (tmp0_iterator.h()) {
        var element = tmp0_iterator.i();
        // Inline function 'kotlin.collections.ArrayAsCollection.containsAll.<anonymous>' call
        if (!this.f7(element)) {
          tmp$ret$0 = false;
          break $l$block_0;
        }
      }
      tmp$ret$0 = true;
    }
    return tmp$ret$0;
  };
  protoOf(ArrayAsCollection).r = function (elements) {
    return this.g7(elements);
  };
  protoOf(ArrayAsCollection).g = function () {
    return arrayIterator(this.d7_1);
  };
  function optimizeReadOnlyList(_this__u8e3s4) {
    switch (_this__u8e3s4.j()) {
      case 0:
        return emptyList();
      case 1:
        return listOf(_this__u8e3s4.o(0));
      default:
        return _this__u8e3s4;
    }
  }
  function collectionSizeOrDefault(_this__u8e3s4, default_0) {
    var tmp;
    if (isInterface(_this__u8e3s4, Collection)) {
      tmp = _this__u8e3s4.j();
    } else {
      tmp = default_0;
    }
    return tmp;
  }
  function emptyMap() {
    var tmp = EmptyMap_getInstance();
    return isInterface(tmp, KtMap) ? tmp : THROW_CCE();
  }
  function toMutableMap(_this__u8e3s4) {
    return LinkedHashMap_init_$Create$_1(_this__u8e3s4);
  }
  function mapOf_0(pairs) {
    return pairs.length > 0 ? toMap(pairs, LinkedHashMap_init_$Create$_0(mapCapacity(pairs.length))) : emptyMap();
  }
  function EmptyMap() {
    EmptyMap_instance = this;
    this.h7_1 = new Long(-888910638, 1920087921);
  }
  protoOf(EmptyMap).equals = function (other) {
    var tmp;
    if (!(other == null) ? isInterface(other, KtMap) : false) {
      tmp = other.p();
    } else {
      tmp = false;
    }
    return tmp;
  };
  protoOf(EmptyMap).hashCode = function () {
    return 0;
  };
  protoOf(EmptyMap).toString = function () {
    return '{}';
  };
  protoOf(EmptyMap).j = function () {
    return 0;
  };
  protoOf(EmptyMap).p = function () {
    return true;
  };
  protoOf(EmptyMap).i7 = function (key) {
    return false;
  };
  protoOf(EmptyMap).v = function (key) {
    if (!(key == null ? true : !(key == null)))
      return false;
    return this.i7((key == null ? true : !(key == null)) ? key : THROW_CCE());
  };
  protoOf(EmptyMap).j7 = function (key) {
    return null;
  };
  protoOf(EmptyMap).w = function (key) {
    if (!(key == null ? true : !(key == null)))
      return null;
    return this.j7((key == null ? true : !(key == null)) ? key : THROW_CCE());
  };
  protoOf(EmptyMap).x = function () {
    return EmptySet_getInstance();
  };
  var EmptyMap_instance;
  function EmptyMap_getInstance() {
    if (EmptyMap_instance == null)
      new EmptyMap();
    return EmptyMap_instance;
  }
  function toMap(_this__u8e3s4, destination) {
    // Inline function 'kotlin.apply' call
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'kotlin.collections.toMap.<anonymous>' call
    putAll(destination, _this__u8e3s4);
    return destination;
  }
  function putAll(_this__u8e3s4, pairs) {
    var inductionVariable = 0;
    var last = pairs.length;
    while (inductionVariable < last) {
      var tmp1_loop_parameter = pairs[inductionVariable];
      inductionVariable = inductionVariable + 1 | 0;
      var key = tmp1_loop_parameter.m7();
      var value = tmp1_loop_parameter.n7();
      _this__u8e3s4.p2(key, value);
    }
  }
  function hashMapOf(pairs) {
    // Inline function 'kotlin.apply' call
    var this_0 = HashMap_init_$Create$_0(mapCapacity(pairs.length));
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'kotlin.collections.hashMapOf.<anonymous>' call
    putAll(this_0, pairs);
    return this_0;
  }
  function addAll(_this__u8e3s4, elements) {
    if (isInterface(elements, Collection))
      return _this__u8e3s4.n(elements);
    else {
      var result = false;
      var tmp1_iterator = elements.g();
      while (tmp1_iterator.h()) {
        var item = tmp1_iterator.i();
        if (_this__u8e3s4.e(item))
          result = true;
      }
      return result;
    }
  }
  function emptySet() {
    return EmptySet_getInstance();
  }
  function optimizeReadOnlySet(_this__u8e3s4) {
    switch (_this__u8e3s4.j()) {
      case 0:
        return emptySet();
      case 1:
        return setOf(_this__u8e3s4.g().i());
      default:
        return _this__u8e3s4;
    }
  }
  function EmptySet() {
    EmptySet_instance = this;
    this.o7_1 = new Long(1993859828, 793161749);
  }
  protoOf(EmptySet).equals = function (other) {
    var tmp;
    if (!(other == null) ? isInterface(other, KtSet) : false) {
      tmp = other.p();
    } else {
      tmp = false;
    }
    return tmp;
  };
  protoOf(EmptySet).hashCode = function () {
    return 0;
  };
  protoOf(EmptySet).toString = function () {
    return '[]';
  };
  protoOf(EmptySet).j = function () {
    return 0;
  };
  protoOf(EmptySet).p = function () {
    return true;
  };
  protoOf(EmptySet).b7 = function (elements) {
    return elements.p();
  };
  protoOf(EmptySet).r = function (elements) {
    return this.b7(elements);
  };
  protoOf(EmptySet).g = function () {
    return EmptyIterator_instance;
  };
  var EmptySet_instance;
  function EmptySet_getInstance() {
    if (EmptySet_instance == null)
      new EmptySet();
    return EmptySet_instance;
  }
  function hashSetOf(elements) {
    return toCollection(elements, HashSet_init_$Create$_0(mapCapacity(elements.length)));
  }
  function compareValues(a, b) {
    if (a === b)
      return 0;
    if (a == null)
      return -1;
    if (b == null)
      return 1;
    return compareTo((!(a == null) ? isComparable(a) : false) ? a : THROW_CCE(), b);
  }
  function appendElement(_this__u8e3s4, element, transform) {
    if (!(transform == null)) {
      _this__u8e3s4.f(transform(element));
    } else {
      if (element == null ? true : isCharSequence(element)) {
        _this__u8e3s4.f(element);
      } else {
        if (element instanceof Char) {
          _this__u8e3s4.y4(element.p7_1);
        } else {
          _this__u8e3s4.f(toString_0(element));
        }
      }
    }
  }
  function equals_1(_this__u8e3s4, other, ignoreCase) {
    ignoreCase = ignoreCase === VOID ? false : ignoreCase;
    if (_this__u8e3s4 === other)
      return true;
    if (!ignoreCase)
      return false;
    var thisUpper = uppercaseChar(_this__u8e3s4);
    var otherUpper = uppercaseChar(other);
    var tmp;
    if (thisUpper === otherUpper) {
      tmp = true;
    } else {
      // Inline function 'kotlin.text.lowercaseChar' call
      // Inline function 'kotlin.text.lowercase' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp$ret$2 = toString(thisUpper).toLowerCase();
      var tmp_0 = charSequenceGet(tmp$ret$2, 0);
      // Inline function 'kotlin.text.lowercaseChar' call
      // Inline function 'kotlin.text.lowercase' call
      // Inline function 'kotlin.js.unsafeCast' call
      // Inline function 'kotlin.js.asDynamic' call
      var tmp$ret$6 = toString(otherUpper).toLowerCase();
      tmp = tmp_0 === charSequenceGet(tmp$ret$6, 0);
    }
    return tmp;
  }
  function toIntOrNull(_this__u8e3s4) {
    return toIntOrNull_0(_this__u8e3s4, 10);
  }
  function toIntOrNull_0(_this__u8e3s4, radix) {
    checkRadix(radix);
    var length = _this__u8e3s4.length;
    if (length === 0)
      return null;
    var start;
    var isNegative;
    var limit;
    var firstChar = charSequenceGet(_this__u8e3s4, 0);
    if (Char__compareTo_impl_ypi4mb(firstChar, _Char___init__impl__6a9atx(48)) < 0) {
      if (length === 1)
        return null;
      start = 1;
      if (firstChar === _Char___init__impl__6a9atx(45)) {
        isNegative = true;
        limit = -2147483648;
      } else if (firstChar === _Char___init__impl__6a9atx(43)) {
        isNegative = false;
        limit = -2147483647;
      } else
        return null;
    } else {
      start = 0;
      isNegative = false;
      limit = -2147483647;
    }
    var limitForMaxRadix = -59652323;
    var limitBeforeMul = limitForMaxRadix;
    var result = 0;
    var inductionVariable = start;
    if (inductionVariable < length)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var digit = digitOf(charSequenceGet(_this__u8e3s4, i), radix);
        if (digit < 0)
          return null;
        if (result < limitBeforeMul) {
          if (limitBeforeMul === limitForMaxRadix) {
            limitBeforeMul = limit / radix | 0;
            if (result < limitBeforeMul) {
              return null;
            }
          } else {
            return null;
          }
        }
        result = imul(result, radix);
        if (result < (limit + digit | 0))
          return null;
        result = result - digit | 0;
      }
       while (inductionVariable < length);
    return isNegative ? result : -result | 0;
  }
  function numberFormatError(input) {
    throw NumberFormatException_init_$Create$_0("Invalid number format: '" + input + "'");
  }
  function isBlank(_this__u8e3s4) {
    var tmp$ret$1;
    $l$block: {
      // Inline function 'kotlin.text.all' call
      var inductionVariable = 0;
      while (inductionVariable < charSequenceLength(_this__u8e3s4)) {
        var element = charSequenceGet(_this__u8e3s4, inductionVariable);
        inductionVariable = inductionVariable + 1 | 0;
        // Inline function 'kotlin.text.isBlank.<anonymous>' call
        if (!isWhitespace(element)) {
          tmp$ret$1 = false;
          break $l$block;
        }
      }
      tmp$ret$1 = true;
    }
    return tmp$ret$1;
  }
  function trim(_this__u8e3s4) {
    // Inline function 'kotlin.text.trim' call
    var startIndex = 0;
    var endIndex = charSequenceLength(_this__u8e3s4) - 1 | 0;
    var startFound = false;
    $l$loop: while (startIndex <= endIndex) {
      var index = !startFound ? startIndex : endIndex;
      var p0 = charSequenceGet(_this__u8e3s4, index);
      var match = isWhitespace(p0);
      if (!startFound) {
        if (!match)
          startFound = true;
        else
          startIndex = startIndex + 1 | 0;
      } else {
        if (!match)
          break $l$loop;
        else
          endIndex = endIndex - 1 | 0;
      }
    }
    return charSequenceSubSequence(_this__u8e3s4, startIndex, endIndex + 1 | 0);
  }
  function UnsafeLazyImpl(initializer) {
    this.q7_1 = initializer;
    this.r7_1 = UNINITIALIZED_VALUE_instance;
  }
  protoOf(UnsafeLazyImpl).u = function () {
    if (this.r7_1 === UNINITIALIZED_VALUE_instance) {
      this.r7_1 = ensureNotNull(this.q7_1)();
      this.q7_1 = null;
    }
    var tmp = this.r7_1;
    return (tmp == null ? true : !(tmp == null)) ? tmp : THROW_CCE();
  };
  protoOf(UnsafeLazyImpl).s7 = function () {
    return !(this.r7_1 === UNINITIALIZED_VALUE_instance);
  };
  protoOf(UnsafeLazyImpl).toString = function () {
    return this.s7() ? toString_0(this.u()) : 'Lazy value not initialized yet.';
  };
  function UNINITIALIZED_VALUE() {
  }
  var UNINITIALIZED_VALUE_instance;
  function UNINITIALIZED_VALUE_getInstance() {
    return UNINITIALIZED_VALUE_instance;
  }
  function Pair(first, second) {
    this.k7_1 = first;
    this.l7_1 = second;
  }
  protoOf(Pair).toString = function () {
    return '(' + toString_0(this.k7_1) + ', ' + toString_0(this.l7_1) + ')';
  };
  protoOf(Pair).m7 = function () {
    return this.k7_1;
  };
  protoOf(Pair).n7 = function () {
    return this.l7_1;
  };
  protoOf(Pair).hashCode = function () {
    var result = this.k7_1 == null ? 0 : hashCode(this.k7_1);
    result = imul(result, 31) + (this.l7_1 == null ? 0 : hashCode(this.l7_1)) | 0;
    return result;
  };
  protoOf(Pair).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof Pair))
      return false;
    var tmp0_other_with_cast = other instanceof Pair ? other : THROW_CCE();
    if (!equals(this.k7_1, tmp0_other_with_cast.k7_1))
      return false;
    if (!equals(this.l7_1, tmp0_other_with_cast.l7_1))
      return false;
    return true;
  };
  function to(_this__u8e3s4, that) {
    return new Pair(_this__u8e3s4, that);
  }
  function _UShort___init__impl__jigrne(data) {
    return data;
  }
  function _UShort___get_data__impl__g0245($this) {
    return $this;
  }
  //region block: post-declaration
  protoOf(InternalHashMap).l3 = containsAllEntries;
  //endregion
  //region block: init
  Unit_instance = new Unit();
  _stableSortingIsSupported = null;
  Companion_instance_1 = new Companion_1();
  Companion_instance_2 = new Companion_2();
  Companion_instance_3 = new Companion_3();
  Companion_instance_4 = new Companion_4();
  EmptyIterator_instance = new EmptyIterator();
  UNINITIALIZED_VALUE_instance = new UNINITIALIZED_VALUE();
  //endregion
  //region block: exports
  _.$_$ = _.$_$ || {};
  _.$_$.a = getKClassFromExpression;
  _.$_$.b = VOID;
  _.$_$.c = ArrayDeque_init_$Create$_0;
  _.$_$.d = ArrayList_init_$Create$_0;
  _.$_$.e = ArrayList_init_$Create$;
  _.$_$.f = ArrayList_init_$Create$_1;
  _.$_$.g = HashMap_init_$Create$;
  _.$_$.h = LinkedHashMap_init_$Create$_0;
  _.$_$.i = LinkedHashMap_init_$Create$;
  _.$_$.j = StringBuilder_init_$Create$;
  _.$_$.k = StringBuilder_init_$Create$_0;
  _.$_$.l = IllegalArgumentException_init_$Create$_0;
  _.$_$.m = IllegalStateException_init_$Create$_0;
  _.$_$.n = _Char___init__impl__6a9atx;
  _.$_$.o = Char__toInt_impl_vasixd;
  _.$_$.p = Unit_instance;
  _.$_$.q = Collection;
  _.$_$.r = KtList;
  _.$_$.s = KtMap;
  _.$_$.t = addAll;
  _.$_$.u = checkIndexOverflow;
  _.$_$.v = collectionSizeOrDefault;
  _.$_$.w = copyToArray;
  _.$_$.x = emptyList;
  _.$_$.y = emptyMap;
  _.$_$.z = listOf;
  _.$_$.a1 = listOf_0;
  _.$_$.b1 = mapCapacity;
  _.$_$.c1 = mapOf;
  _.$_$.d1 = mapOf_0;
  _.$_$.e1 = plus;
  _.$_$.f1 = sortedWith;
  _.$_$.g1 = toMutableMap;
  _.$_$.h1 = toSet;
  _.$_$.i1 = compareValues;
  _.$_$.j1 = FunctionAdapter;
  _.$_$.k1 = charSequenceGet;
  _.$_$.l1 = charSequenceLength;
  _.$_$.m1 = equals;
  _.$_$.n1 = getBooleanHashCode;
  _.$_$.o1 = getPropertyCallableRef;
  _.$_$.p1 = getStringHashCode;
  _.$_$.q1 = hashCode;
  _.$_$.r1 = initMetadataForClass;
  _.$_$.s1 = initMetadataForObject;
  _.$_$.t1 = isCharSequence;
  _.$_$.u1 = isInterface;
  _.$_$.v1 = numberToInt;
  _.$_$.w1 = numberToLong;
  _.$_$.x1 = protoOf;
  _.$_$.y1 = toLong;
  _.$_$.z1 = toString_1;
  _.$_$.a2 = KProperty1;
  _.$_$.b2 = equals_0;
  _.$_$.c2 = isBlank;
  _.$_$.d2 = toCharArray;
  _.$_$.e2 = toIntOrNull;
  _.$_$.f2 = toInt;
  _.$_$.g2 = trim;
  _.$_$.h2 = Comparator;
  _.$_$.i2 = IllegalArgumentException;
  _.$_$.j2 = Long;
  _.$_$.k2 = THROW_CCE;
  _.$_$.l2 = ensureNotNull;
  _.$_$.m2 = lazy;
  _.$_$.n2 = noWhenBranchMatchedException;
  _.$_$.o2 = toString_0;
  _.$_$.p2 = to;
  //endregion
  return _;
}(module.exports));

//# sourceMappingURL=kotlin-kotlin-stdlib.js.map
