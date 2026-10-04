var KadiRuntime = (() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };

  // lastikadi-game-runtime-interface/dist/kotlin-kotlin-stdlib.js
  var require_kotlin_kotlin_stdlib = __commonJS({
    "lastikadi-game-runtime-interface/dist/kotlin-kotlin-stdlib.js"(exports, module) {
      if (typeof Math.imul === "undefined") {
        Math.imul = function imul(a, b) {
          return (a & 4294901760) * (b & 65535) + (a & 65535) * (b | 0) | 0;
        };
      }
      if (typeof ArrayBuffer.isView === "undefined") {
        ArrayBuffer.isView = function(a) {
          return a != null && a.__proto__ != null && a.__proto__.__proto__ === Int8Array.prototype.__proto__;
        };
      }
      if (typeof Array.prototype.fill === "undefined") {
        Object.defineProperty(Array.prototype, "fill", { value: function(value) {
          if (this == null) {
            throw new TypeError("this is null or not defined");
          }
          var O = Object(this);
          var len = O.length >>> 0;
          var start = arguments[1];
          var relativeStart = start >> 0;
          var k = relativeStart < 0 ? Math.max(len + relativeStart, 0) : Math.min(relativeStart, len);
          var end = arguments[2];
          var relativeEnd = end === void 0 ? len : end >> 0;
          var finalValue = relativeEnd < 0 ? Math.max(len + relativeEnd, 0) : Math.min(relativeEnd, len);
          while (k < finalValue) {
            O[k] = value;
            k++;
          }
          ;
          return O;
        } });
      }
      [Int8Array, Int16Array, Uint16Array, Int32Array, Float32Array, Float64Array].forEach(function(TypedArray) {
        if (typeof TypedArray.prototype.fill === "undefined") {
          Object.defineProperty(TypedArray.prototype, "fill", { value: Array.prototype.fill });
        }
      });
      if (typeof Math.clz32 === "undefined") {
        Math.clz32 = /* @__PURE__ */ (function(log, LN2) {
          return function(x) {
            var asUint = x >>> 0;
            if (asUint === 0) {
              return 32;
            }
            return 31 - (log(asUint) / LN2 | 0) | 0;
          };
        })(Math.log, Math.LN2);
      }
      (function(_) {
        "use strict";
        var imul = Math.imul;
        var isView = ArrayBuffer.isView;
        var clz32 = Math.clz32;
        initMetadataForInterface(CharSequence, "CharSequence");
        initMetadataForInterface(Comparable, "Comparable");
        initMetadataForClass(Number_0, "Number");
        initMetadataForObject(Unit, "Unit");
        initMetadataForClass(Char, "Char", VOID, VOID, [Comparable]);
        initMetadataForInterface(Collection, "Collection");
        initMetadataForInterface(KtList, "List", VOID, VOID, [Collection]);
        initMetadataForInterface(Entry, "Entry");
        initMetadataForInterface(KtMap, "Map");
        initMetadataForInterface(KtSet, "Set", VOID, VOID, [Collection]);
        initMetadataForCompanion(Companion);
        initMetadataForClass(Long, "Long", VOID, Number_0, [Number_0, Comparable]);
        initMetadataForInterface(FunctionAdapter, "FunctionAdapter");
        initMetadataForClass(arrayIterator$1);
        initMetadataForObject(Digit, "Digit");
        initMetadataForInterface(Comparator, "Comparator");
        initMetadataForClass(AbstractCollection, "AbstractCollection", VOID, VOID, [Collection]);
        initMetadataForClass(AbstractMutableCollection, "AbstractMutableCollection", VOID, AbstractCollection, [AbstractCollection, Collection]);
        initMetadataForClass(IteratorImpl, "IteratorImpl");
        initMetadataForClass(AbstractMutableList, "AbstractMutableList", VOID, AbstractMutableCollection, [AbstractMutableCollection, KtList, Collection]);
        initMetadataForClass(AbstractMap, "AbstractMap", VOID, VOID, [KtMap]);
        initMetadataForClass(AbstractMutableMap, "AbstractMutableMap", VOID, AbstractMap, [AbstractMap, KtMap]);
        initMetadataForClass(AbstractMutableSet, "AbstractMutableSet", VOID, AbstractMutableCollection, [AbstractMutableCollection, Collection, KtSet]);
        initMetadataForCompanion(Companion_0);
        initMetadataForClass(ArrayList, "ArrayList", ArrayList_init_$Create$, AbstractMutableList, [AbstractMutableList, KtList, Collection]);
        initMetadataForClass(HashMap, "HashMap", HashMap_init_$Create$, AbstractMutableMap, [AbstractMutableMap, KtMap]);
        initMetadataForClass(HashMapEntrySetBase, "HashMapEntrySetBase", VOID, AbstractMutableSet, [Collection, KtSet, AbstractMutableSet]);
        initMetadataForClass(HashMapEntrySet, "HashMapEntrySet", VOID, HashMapEntrySetBase);
        initMetadataForClass(HashSet, "HashSet", HashSet_init_$Create$, AbstractMutableSet, [AbstractMutableSet, Collection, KtSet]);
        initMetadataForCompanion(Companion_1);
        initMetadataForClass(Itr, "Itr");
        initMetadataForClass(KeysItr, "KeysItr", VOID, Itr);
        initMetadataForClass(EntriesItr, "EntriesItr", VOID, Itr);
        initMetadataForClass(EntryRef, "EntryRef", VOID, VOID, [Entry]);
        function containsAllEntries(m) {
          var tmp$ret$0;
          $l$block_0: {
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
        initMetadataForInterface(InternalMap, "InternalMap");
        initMetadataForClass(InternalHashMap, "InternalHashMap", InternalHashMap_init_$Create$, VOID, [InternalMap]);
        initMetadataForClass(LinkedHashMap, "LinkedHashMap", LinkedHashMap_init_$Create$, HashMap, [HashMap, KtMap]);
        initMetadataForClass(LinkedHashSet, "LinkedHashSet", LinkedHashSet_init_$Create$, HashSet, [HashSet, Collection, KtSet]);
        initMetadataForClass(Exception, "Exception", Exception_init_$Create$, Error);
        initMetadataForClass(RuntimeException, "RuntimeException", RuntimeException_init_$Create$, Exception);
        initMetadataForClass(IllegalArgumentException, "IllegalArgumentException", IllegalArgumentException_init_$Create$, RuntimeException);
        initMetadataForClass(IndexOutOfBoundsException, "IndexOutOfBoundsException", IndexOutOfBoundsException_init_$Create$, RuntimeException);
        initMetadataForClass(IllegalStateException, "IllegalStateException", IllegalStateException_init_$Create$, RuntimeException);
        initMetadataForClass(UnsupportedOperationException, "UnsupportedOperationException", UnsupportedOperationException_init_$Create$, RuntimeException);
        initMetadataForClass(NoSuchElementException, "NoSuchElementException", NoSuchElementException_init_$Create$, RuntimeException);
        initMetadataForClass(NumberFormatException, "NumberFormatException", NumberFormatException_init_$Create$, IllegalArgumentException);
        initMetadataForClass(ArithmeticException, "ArithmeticException", ArithmeticException_init_$Create$, RuntimeException);
        initMetadataForClass(ConcurrentModificationException, "ConcurrentModificationException", ConcurrentModificationException_init_$Create$, RuntimeException);
        initMetadataForClass(NullPointerException, "NullPointerException", NullPointerException_init_$Create$, RuntimeException);
        initMetadataForClass(NoWhenBranchMatchedException, "NoWhenBranchMatchedException", NoWhenBranchMatchedException_init_$Create$, RuntimeException);
        initMetadataForClass(ClassCastException, "ClassCastException", ClassCastException_init_$Create$, RuntimeException);
        initMetadataForInterface(KClass, "KClass");
        initMetadataForClass(KClassImpl, "KClassImpl", VOID, VOID, [KClass]);
        initMetadataForObject(NothingKClassImpl, "NothingKClassImpl", VOID, KClassImpl);
        initMetadataForClass(ErrorKClass, "ErrorKClass", ErrorKClass, VOID, [KClass]);
        initMetadataForClass(PrimitiveKClassImpl, "PrimitiveKClassImpl", VOID, KClassImpl);
        initMetadataForClass(SimpleKClassImpl, "SimpleKClassImpl", VOID, KClassImpl);
        initMetadataForInterface(KProperty1, "KProperty1");
        initMetadataForObject(PrimitiveClasses, "PrimitiveClasses");
        initMetadataForClass(StringBuilder, "StringBuilder", StringBuilder_init_$Create$_0, VOID, [CharSequence]);
        initMetadataForClass(sam$kotlin_Comparator$0, "sam$kotlin_Comparator$0", VOID, VOID, [Comparator, FunctionAdapter]);
        initMetadataForCompanion(Companion_2);
        initMetadataForCompanion(Companion_3);
        initMetadataForCompanion(Companion_4);
        initMetadataForCompanion(Companion_5);
        initMetadataForClass(ArrayDeque, "ArrayDeque", ArrayDeque_init_$Create$, AbstractMutableList);
        initMetadataForObject(EmptyList, "EmptyList", VOID, VOID, [KtList]);
        initMetadataForObject(EmptyIterator, "EmptyIterator");
        initMetadataForClass(ArrayAsCollection, "ArrayAsCollection", VOID, VOID, [Collection]);
        initMetadataForObject(EmptyMap, "EmptyMap", VOID, VOID, [KtMap]);
        initMetadataForObject(EmptySet, "EmptySet", VOID, VOID, [KtSet]);
        initMetadataForClass(UnsafeLazyImpl, "UnsafeLazyImpl");
        initMetadataForObject(UNINITIALIZED_VALUE, "UNINITIALIZED_VALUE");
        initMetadataForClass(Pair, "Pair");
        function CharSequence() {
        }
        function Comparable() {
        }
        function Number_0() {
        }
        function Unit() {
        }
        protoOf(Unit).toString = function() {
          return "kotlin.Unit";
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
              } while (inductionVariable <= last);
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
              } while (inductionVariable_0 <= last_0);
          }
          return -1;
        }
        function get_lastIndex(_this__u8e3s4) {
          return _this__u8e3s4.length - 1 | 0;
        }
        function joinToString(_this__u8e3s4, separator, prefix, postfix, limit, truncated, transform) {
          separator = separator === VOID ? ", " : separator;
          prefix = prefix === VOID ? "" : prefix;
          postfix = postfix === VOID ? "" : postfix;
          limit = limit === VOID ? -1 : limit;
          truncated = truncated === VOID ? "..." : truncated;
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
          separator = separator === VOID ? ", " : separator;
          prefix = prefix === VOID ? "" : prefix;
          postfix = postfix === VOID ? "" : postfix;
          limit = limit === VOID ? -1 : limit;
          truncated = truncated === VOID ? "..." : truncated;
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
          separator = separator === VOID ? ", " : separator;
          prefix = prefix === VOID ? "" : prefix;
          postfix = postfix === VOID ? "" : postfix;
          limit = limit === VOID ? -1 : limit;
          truncated = truncated === VOID ? "..." : truncated;
          transform = transform === VOID ? null : transform;
          return joinTo_0(_this__u8e3s4, StringBuilder_init_$Create$_0(), separator, prefix, postfix, limit, truncated, transform).toString();
        }
        function joinTo_0(_this__u8e3s4, buffer, separator, prefix, postfix, limit, truncated, transform) {
          separator = separator === VOID ? ", " : separator;
          prefix = prefix === VOID ? "" : prefix;
          postfix = postfix === VOID ? "" : postfix;
          limit = limit === VOID ? -1 : limit;
          truncated = truncated === VOID ? "..." : truncated;
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
            var tmp = copyToArray(_this__u8e3s4);
            var this_0 = isArray(tmp) ? tmp : THROW_CCE();
            sortWith(this_0, comparator);
            return asList(this_0);
          }
          var this_1 = toMutableList_0(_this__u8e3s4);
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
          return tmp1_elvis_lhs == null ? "null" : tmp1_elvis_lhs;
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
        protoOf(Long).e1 = function(other) {
          return compare(this, other);
        };
        protoOf(Long).d = function(other) {
          return this.e1(other instanceof Long ? other : THROW_CCE());
        };
        protoOf(Long).f1 = function(other) {
          return add(this, other);
        };
        protoOf(Long).g1 = function(other) {
          return multiply(this, other);
        };
        protoOf(Long).h1 = function(other) {
          return divide(this, other);
        };
        protoOf(Long).i1 = function(other) {
          return modulo(this, other);
        };
        protoOf(Long).j1 = function() {
          return this.k1().f1(new Long(1, 0));
        };
        protoOf(Long).l1 = function(bitCount) {
          return shiftLeft(this, bitCount);
        };
        protoOf(Long).m1 = function(bitCount) {
          return shiftRightUnsigned(this, bitCount);
        };
        protoOf(Long).n1 = function(other) {
          return new Long(this.c1_1 & other.c1_1, this.d1_1 & other.d1_1);
        };
        protoOf(Long).o1 = function(other) {
          return new Long(this.c1_1 ^ other.c1_1, this.d1_1 ^ other.d1_1);
        };
        protoOf(Long).k1 = function() {
          return new Long(~this.c1_1, ~this.d1_1);
        };
        protoOf(Long).p1 = function() {
          return this.c1_1;
        };
        protoOf(Long).q1 = function() {
          return toNumber(this);
        };
        protoOf(Long).toString = function() {
          return toStringImpl(this, 10);
        };
        protoOf(Long).equals = function(other) {
          var tmp;
          if (other instanceof Long) {
            tmp = equalsLong(this, other);
          } else {
            tmp = false;
          }
          return tmp;
        };
        protoOf(Long).hashCode = function() {
          return hashCode_0(this);
        };
        protoOf(Long).valueOf = function() {
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
            } while (!(i === last));
          return array;
        }
        function arrayIterator(array) {
          return new arrayIterator$1(array);
        }
        function charArray(size) {
          var type = "CharArray";
          var array = new Uint16Array(size);
          array.$type$ = type;
          return array;
        }
        function arrayIterator$1($array) {
          this.t1_1 = $array;
          this.s1_1 = 0;
        }
        protoOf(arrayIterator$1).h = function() {
          return !(this.s1_1 === this.t1_1.length);
        };
        protoOf(arrayIterator$1).i = function() {
          var tmp;
          if (!(this.s1_1 === this.t1_1.length)) {
            var tmp1 = this.s1_1;
            this.s1_1 = tmp1 + 1 | 0;
            tmp = this.t1_1[tmp1];
          } else {
            throw NoSuchElementException_init_$Create$_0("" + this.s1_1);
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
            bufFloat64 = new Float64Array(get_buf());
            bufFloat32 = new Float32Array(get_buf());
            bufInt32 = new Int32Array(get_buf());
            get_bufFloat64()[0] = -1;
            lowIndex = !(get_bufInt32()[0] === 0) ? 1 : 0;
            highIndex = 1 - get_lowIndex() | 0;
          }
        }
        function charSequenceGet(a, index) {
          var tmp;
          if (isString(a)) {
            var code = a.charCodeAt(index);
            var tmp_0;
            var this_0 = _Char___init__impl__6a9atx(0);
            if (code < Char__toInt_impl_vasixd(this_0)) {
              tmp_0 = true;
            } else {
              var this_1 = _Char___init__impl__6a9atx(65535);
              tmp_0 = code > Char__toInt_impl_vasixd(this_1);
            }
            if (tmp_0) {
              throw IllegalArgumentException_init_$Create$_0("Invalid Char code: " + code);
            }
            tmp = numberToChar(code);
          } else {
            tmp = a.b(index);
          }
          return tmp;
        }
        function isString(a) {
          return typeof a === "string";
        }
        function charSequenceLength(a) {
          var tmp;
          if (isString(a)) {
            tmp = a.length;
          } else {
            tmp = a.a();
          }
          return tmp;
        }
        function charSequenceSubSequence(a, startIndex, endIndex) {
          var tmp;
          if (isString(a)) {
            tmp = a.substring(startIndex, endIndex);
          } else {
            tmp = a.c(startIndex, endIndex);
          }
          return tmp;
        }
        function arrayToString(array) {
          return joinToString(array, ", ", "[", "]", VOID, VOID, arrayToString$lambda);
        }
        function arrayToString$lambda(it) {
          return toString_1(it);
        }
        function compareTo(a, b) {
          var tmp;
          switch (typeof a) {
            case "number":
              var tmp_0;
              if (typeof b === "number") {
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
            case "string":
            case "boolean":
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
              var ia = 1 / a;
              var tmp_1;
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
          if (!("kotlinHashCodeValue$" in obj)) {
            var hash2 = calculateRandomHash();
            var descriptor = new Object();
            descriptor.value = hash2;
            descriptor.enumerable = false;
            Object.defineProperty(obj, "kotlinHashCodeValue$", descriptor);
          }
          return obj["kotlinHashCodeValue$"];
        }
        function calculateRandomHash() {
          return Math.random() * 4294967296 | 0;
        }
        function objectCreate(proto) {
          proto = proto === VOID ? null : proto;
          return Object.create(proto);
        }
        function defineProp(obj, name, getter, setter) {
          return Object.defineProperty(obj, name, { configurable: true, get: getter, set: setter });
        }
        function toString_1(o) {
          var tmp;
          if (o == null) {
            tmp = "null";
          } else if (isArrayish(o)) {
            tmp = "[...]";
          } else if (!(typeof o.toString === "function")) {
            tmp = anyToString(o);
          } else {
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
            case "object":
              tmp = "function" === typeof obj.hashCode ? obj.hashCode() : getObjectHashCode(obj);
              break;
            case "function":
              tmp = getObjectHashCode(obj);
              break;
            case "number":
              tmp = getNumberHashCode(obj);
              break;
            case "boolean":
              tmp = getBooleanHashCode(obj);
              break;
            case "string":
              tmp = getStringHashCode(String(obj));
              break;
            case "bigint":
              tmp = getBigIntHashCode(obj);
              break;
            case "symbol":
              tmp = getSymbolHashCode(obj);
              break;
            default:
              tmp = (function() {
                throw new Error("Unexpected typeof `" + typeOf + "`");
              })();
              break;
          }
          return tmp;
        }
        function getBooleanHashCode(value) {
          return value ? 1231 : 1237;
        }
        function getStringHashCode(str) {
          var hash2 = 0;
          var length = str.length;
          var inductionVariable = 0;
          var last = length - 1 | 0;
          if (inductionVariable <= last)
            do {
              var i = inductionVariable;
              inductionVariable = inductionVariable + 1 | 0;
              var code = str.charCodeAt(i);
              hash2 = imul(hash2, 31) + code | 0;
            } while (!(i === last));
          return hash2;
        }
        function getBigIntHashCode(value) {
          var shiftNumber = BigInt(32);
          var MASK = BigInt(4294967295);
          var bigNumber = value < 0 ? -value : value;
          var hashCode2 = 0;
          var signum = value < 0 ? -1 : 1;
          while (bigNumber != 0) {
            var chunk = Number(bigNumber & MASK);
            hashCode2 = imul(31, hashCode2) + chunk | 0;
            bigNumber = bigNumber >> shiftNumber;
          }
          return imul(hashCode2, signum);
        }
        function getSymbolHashCode(value) {
          var hashCodeMap = symbolIsSharable(value) ? getSymbolMap() : getSymbolWeakMap();
          var cachedHashCode = hashCodeMap.get(value);
          if (cachedHashCode !== VOID)
            return cachedHashCode;
          var hash2 = calculateRandomHash();
          hashCodeMap.set(value, hash2);
          return hash2;
        }
        function symbolIsSharable(symbol) {
          return Symbol.keyFor(symbol) != VOID;
        }
        function getSymbolMap() {
          if (symbolMap === VOID) {
            symbolMap = /* @__PURE__ */ new Map();
          }
          return symbolMap;
        }
        function getSymbolWeakMap() {
          if (symbolWeakMap === VOID) {
            symbolWeakMap = /* @__PURE__ */ new WeakMap();
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
          if (typeof obj1 === "object" && typeof obj1.equals === "function") {
            return obj1.equals(obj2);
          }
          if (obj1 !== obj1) {
            return obj2 !== obj2;
          }
          if (typeof obj1 === "number" && typeof obj2 === "number") {
            var tmp;
            if (obj1 === obj2) {
              var tmp_0;
              if (obj1 !== 0) {
                tmp_0 = true;
              } else {
                var tmp_1 = 1 / obj1;
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
          var message = "Should be lowered";
          throw IllegalStateException_init_$Create$_0(toString_1(message));
        }
        function captureStack(instance, constructorFunction) {
          if (Error.captureStackTrace != null) {
            Error.captureStackTrace(instance, constructorFunction);
          } else {
            instance.stack = new Error().stack;
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
            throw Exception_init_$Create$_0("division by zero");
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
            var approx2 = Math.max(1, Math.floor(approxDouble));
            var log2 = Math.ceil(Math.log(approx2) / Math.LN2);
            var delta = log2 <= 48 ? 1 : Math.pow(2, log2 - 48);
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
          return _this__u8e3s4.d1_1 * 4294967296 + getLowBitsUnsigned(_this__u8e3s4);
        }
        function toStringImpl(_this__u8e3s4, radix) {
          _init_properties_longJs_kt__elc2w5();
          if (radix < 2 || 36 < radix) {
            throw Exception_init_$Create$_0("radix out of range: " + radix);
          }
          if (isZero(_this__u8e3s4)) {
            return "0";
          }
          if (isNegative(_this__u8e3s4)) {
            if (equalsLong(_this__u8e3s4, get_MIN_VALUE())) {
              var radixLong = fromInt(radix);
              var div = _this__u8e3s4.h1(radixLong);
              var rem = subtract(multiply(div, radixLong), _this__u8e3s4).p1();
              var tmp = toStringImpl(div, radix);
              return tmp + rem.toString(radix);
            } else {
              return "-" + toStringImpl(negate(_this__u8e3s4), radix);
            }
          }
          var digitsPerTime = radix === 2 ? 31 : radix <= 10 ? 9 : radix <= 21 ? 7 : radix <= 35 ? 6 : 5;
          var radixToPower = fromNumber(Math.pow(radix, digitsPerTime));
          var rem_0 = _this__u8e3s4;
          var result = "";
          while (true) {
            var remDiv = rem_0.h1(radixToPower);
            var intval = subtract(rem_0, multiply(remDiv, radixToPower)).p1();
            var digits = intval.toString(radix);
            rem_0 = remDiv;
            if (isZero(rem_0)) {
              return digits + result;
            } else {
              while (digits.length < digitsPerTime) {
                digits = "0" + digits;
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
          } else if (value <= -9223372036854776e3) {
            return get_MIN_VALUE();
          } else if (value + 1 >= 9223372036854776e3) {
            return get_MAX_VALUE();
          } else if (value < 0) {
            return negate(fromNumber(-value));
          } else {
            var twoPwr32 = 4294967296;
            var tmp = value % twoPwr32 | 0;
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
          return _this__u8e3s4.c1_1 >= 0 ? _this__u8e3s4.c1_1 : 4294967296 + _this__u8e3s4.c1_1;
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
          var iid = kind === "interface" ? generateInterfaceId() : VOID;
          return { kind, simpleName: name, associatedObjectKey, associatedObjects, suspendArity, $kClass$: undef, defaultConstructor, iid };
        }
        function generateInterfaceId() {
          if (globalInterfaceId === VOID) {
            globalInterfaceId = 0;
          }
          globalInterfaceId = globalInterfaceId + 1 | 0;
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
          var kind = "class";
          initMetadataFor(kind, ctor, name, defaultConstructor, parent, interfaces, suspendArity, associatedObjectKey, associatedObjects);
        }
        function initMetadataForObject(ctor, name, defaultConstructor, parent, interfaces, suspendArity, associatedObjectKey, associatedObjects) {
          var kind = "object";
          initMetadataFor(kind, ctor, name, defaultConstructor, parent, interfaces, suspendArity, associatedObjectKey, associatedObjects);
        }
        function initMetadataForInterface(ctor, name, defaultConstructor, parent, interfaces, suspendArity, associatedObjectKey, associatedObjects) {
          var kind = "interface";
          initMetadataFor(kind, ctor, name, defaultConstructor, parent, interfaces, suspendArity, associatedObjectKey, associatedObjects);
        }
        function initMetadataForLambda(ctor, parent, interfaces, suspendArity) {
          initMetadataForClass(ctor, "Lambda", VOID, parent, interfaces, suspendArity, VOID, VOID);
        }
        function initMetadataForCoroutine(ctor, parent, interfaces, suspendArity) {
          initMetadataForClass(ctor, "Coroutine", VOID, parent, interfaces, suspendArity, VOID, VOID);
        }
        function initMetadataForFunctionReference(ctor, parent, interfaces, suspendArity) {
          initMetadataForClass(ctor, "FunctionReference", VOID, parent, interfaces, suspendArity, VOID, VOID);
        }
        function initMetadataForCompanion(ctor, parent, interfaces, suspendArity) {
          initMetadataForObject(ctor, "Companion", VOID, parent, interfaces, suspendArity, VOID, VOID);
        }
        function classMeta(name, defaultConstructor, associatedObjectKey, associatedObjects, suspendArity) {
          return createMetadata("class", name, defaultConstructor, associatedObjectKey, associatedObjects, suspendArity);
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
            tmp = a | 0;
          }
          return tmp;
        }
        function toShort(a) {
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
            var tmp = [metadataObject(), metadataObject()];
            var tmp_0 = [metadataObject(), metadataObject()];
            propertyRefClassMetadataCache = [tmp, tmp_0, [metadataObject(), metadataObject()]];
          }
        }
        function isArrayish(o) {
          return isJsArray(o) || isView(o);
        }
        function isJsArray(obj) {
          return Array.isArray(obj);
        }
        function isInterface(obj, iface) {
          return isInterfaceImpl(obj, iface.$metadata$.iid);
        }
        function isInterfaceImpl(obj, iface) {
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
            tmp = !obj.$type$;
          } else {
            tmp = false;
          }
          return tmp;
        }
        function isNumber(a) {
          var tmp;
          if (typeof a === "number") {
            tmp = true;
          } else {
            tmp = a instanceof Long;
          }
          return tmp;
        }
        function isComparable(value) {
          var type = typeof value;
          return type === "string" || type === "boolean" || isNumber(value) || isInterface(value, Comparable);
        }
        function isCharSequence(value) {
          return typeof value === "string" || isInterface(value, CharSequence);
        }
        function isBooleanArray(a) {
          return isJsArray(a) && a.$type$ === "BooleanArray";
        }
        function isByteArray(a) {
          return a instanceof Int8Array;
        }
        function isShortArray(a) {
          return a instanceof Int16Array;
        }
        function isCharArray(a) {
          var tmp;
          if (a instanceof Uint16Array) {
            tmp = a.$type$ === "CharArray";
          } else {
            tmp = false;
          }
          return tmp;
        }
        function isIntArray(a) {
          return a instanceof Int32Array;
        }
        function isFloatArray(a) {
          return a instanceof Float32Array;
        }
        function isLongArray(a) {
          return isJsArray(a) && a.$type$ === "LongArray";
        }
        function isDoubleArray(a) {
          return a instanceof Float64Array;
        }
        function calculateErrorInfo(proto) {
          var tmp0_safe_receiver = proto.constructor;
          var metadata = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.$metadata$;
          var tmp2_safe_receiver = metadata == null ? null : metadata.errorInfo;
          if (tmp2_safe_receiver == null)
            null;
          else {
            return tmp2_safe_receiver;
          }
          var result = 0;
          if (hasProp(proto, "message"))
            result = result | 1;
          if (hasProp(proto, "cause"))
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
          return new ArrayList(_this__u8e3s4);
        }
        function fill(_this__u8e3s4, element, fromIndex, toIndex) {
          fromIndex = fromIndex === VOID ? 0 : fromIndex;
          toIndex = toIndex === VOID ? _this__u8e3s4.length : toIndex;
          Companion_instance_2.v1(fromIndex, toIndex, _this__u8e3s4.length);
          _this__u8e3s4.fill(element, fromIndex, toIndex);
        }
        function copyOf(_this__u8e3s4, newSize) {
          if (!(newSize >= 0)) {
            var message = "Invalid new array size: " + newSize + ".";
            throw IllegalArgumentException_init_$Create$_0(toString_1(message));
          }
          return fillFrom(_this__u8e3s4, new Int32Array(newSize));
        }
        function copyOf_0(_this__u8e3s4, newSize) {
          if (!(newSize >= 0)) {
            var message = "Invalid new array size: " + newSize + ".";
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
          tmp.w1_1 = new Int32Array([48, 1632, 1776, 1984, 2406, 2534, 2662, 2790, 2918, 3046, 3174, 3302, 3430, 3558, 3664, 3792, 3872, 4160, 4240, 6112, 6160, 6470, 6608, 6784, 6800, 6992, 7088, 7232, 7248, 42528, 43216, 43264, 43472, 43504, 43600, 44016, 65296]);
        }
        var Digit_instance;
        function Digit_getInstance() {
          if (Digit_instance == null)
            new Digit();
          return Digit_instance;
        }
        function isWhitespaceImpl(_this__u8e3s4) {
          var ch = Char__toInt_impl_vasixd(_this__u8e3s4);
          return (9 <= ch ? ch <= 13 : false) || (28 <= ch ? ch <= 32 : false) || ch === 160 || ch > 4096 && (ch === 5760 || (8192 <= ch ? ch <= 8202 : false) || ch === 8232 || ch === 8233 || ch === 8239 || ch === 8287 || ch === 12288);
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
          if (collection.toArray !== void 0) {
            tmp = collection.toArray();
          } else {
            tmp = collectionToArray(collection);
          }
          return tmp;
        }
        function arrayCopy(source, destination, destinationOffset, startIndex, endIndex) {
          Companion_instance_2.v1(startIndex, endIndex, source.length);
          var rangeSize = endIndex - startIndex | 0;
          Companion_instance_2.v1(destinationOffset, destinationOffset + rangeSize | 0, destination.length);
          if (isView(destination) && isView(source)) {
            var subrange = source.subarray(startIndex, endIndex);
            destination.set(subrange, destinationOffset);
          } else {
            if (!(source === destination) || destinationOffset <= startIndex) {
              var inductionVariable = 0;
              if (inductionVariable < rangeSize)
                do {
                  var index = inductionVariable;
                  inductionVariable = inductionVariable + 1 | 0;
                  destination[destinationOffset + index | 0] = source[startIndex + index | 0];
                } while (inductionVariable < rangeSize);
            } else {
              var inductionVariable_0 = rangeSize - 1 | 0;
              if (0 <= inductionVariable_0)
                do {
                  var index_0 = inductionVariable_0;
                  inductionVariable_0 = inductionVariable_0 + -1 | 0;
                  destination[destinationOffset + index_0 | 0] = source[startIndex + index_0 | 0];
                } while (0 <= inductionVariable_0);
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
            } while (inductionVariable < last);
        }
        function AbstractMutableCollection() {
          AbstractCollection.call(this);
        }
        protoOf(AbstractMutableCollection).y1 = function(element) {
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
        protoOf(AbstractMutableCollection).n = function(elements) {
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
        protoOf(AbstractMutableCollection).toJSON = function() {
          return this.toArray();
        };
        protoOf(AbstractMutableCollection).z1 = function() {
        };
        function IteratorImpl($outer) {
          this.d2_1 = $outer;
          this.b2_1 = 0;
          this.c2_1 = -1;
        }
        protoOf(IteratorImpl).h = function() {
          return this.b2_1 < this.d2_1.j();
        };
        protoOf(IteratorImpl).i = function() {
          if (!this.h())
            throw NoSuchElementException_init_$Create$();
          var tmp = this;
          var tmp1 = this.b2_1;
          this.b2_1 = tmp1 + 1 | 0;
          tmp.c2_1 = tmp1;
          return this.d2_1.o(this.c2_1);
        };
        protoOf(IteratorImpl).a2 = function() {
          if (!!(this.c2_1 === -1)) {
            var message = "Call next() or previous() before removing element from the iterator.";
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
        protoOf(AbstractMutableList).e = function(element) {
          this.z1();
          this.g2(this.j(), element);
          return true;
        };
        protoOf(AbstractMutableList).h2 = function(index, elements) {
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
        protoOf(AbstractMutableList).g = function() {
          return new IteratorImpl(this);
        };
        protoOf(AbstractMutableList).q = function(element) {
          return this.s(element) >= 0;
        };
        protoOf(AbstractMutableList).s = function(element) {
          var tmp$ret$1;
          $l$block: {
            var index = 0;
            var tmp0_iterator = this.g();
            while (tmp0_iterator.h()) {
              var item = tmp0_iterator.i();
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
        protoOf(AbstractMutableList).equals = function(other) {
          if (other === this)
            return true;
          if (!(!(other == null) ? isInterface(other, KtList) : false))
            return false;
          return Companion_instance_2.j2(this, other);
        };
        protoOf(AbstractMutableList).hashCode = function() {
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
        protoOf(AbstractMutableSet).equals = function(other) {
          if (other === this)
            return true;
          if (!(!(other == null) ? isInterface(other, KtSet) : false))
            return false;
          return Companion_instance_4.t2(this, other);
        };
        protoOf(AbstractMutableSet).hashCode = function() {
          return Companion_instance_4.u2(this);
        };
        function arrayOfUninitializedElements(capacity) {
          if (!(capacity >= 0)) {
            var message = "capacity must be non-negative.";
            throw IllegalArgumentException_init_$Create$_0(toString_1(message));
          }
          return fillArrayVal(Array(capacity), null);
        }
        function resetRange(_this__u8e3s4, fromIndex, toIndex) {
          _this__u8e3s4.fill(null, fromIndex, toIndex);
        }
        function copyOfUninitializedElements(_this__u8e3s4, newSize) {
          return copyOf_0(_this__u8e3s4, newSize);
        }
        function resetAt(_this__u8e3s4, index) {
          _this__u8e3s4[index] = null;
        }
        function Companion_0() {
          Companion_instance_0 = this;
          var tmp = this;
          var this_0 = ArrayList_init_$Create$_0(0);
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
          var tmp$ret$0 = [];
          ArrayList.call($this, tmp$ret$0);
          return $this;
        }
        function ArrayList_init_$Create$() {
          return ArrayList_init_$Init$(objectCreate(protoOf(ArrayList)));
        }
        function ArrayList_init_$Init$_0(initialCapacity, $this) {
          var tmp$ret$0 = [];
          ArrayList.call($this, tmp$ret$0);
          if (!(initialCapacity >= 0)) {
            var message = "Negative initial capacity: " + initialCapacity;
            throw IllegalArgumentException_init_$Create$_0(toString_1(message));
          }
          return $this;
        }
        function ArrayList_init_$Create$_0(initialCapacity) {
          return ArrayList_init_$Init$_0(initialCapacity, objectCreate(protoOf(ArrayList)));
        }
        function ArrayList_init_$Init$_1(elements, $this) {
          var tmp$ret$0 = copyToArray(elements);
          ArrayList.call($this, tmp$ret$0);
          return $this;
        }
        function ArrayList_init_$Create$_1(elements) {
          return ArrayList_init_$Init$_1(elements, objectCreate(protoOf(ArrayList)));
        }
        function increaseLength($this, amount) {
          var previous = $this.j();
          $this.l_1.length = $this.j() + amount | 0;
          return previous;
        }
        function rangeCheck($this, index) {
          Companion_instance_2.w2(index, $this.j());
          return index;
        }
        function insertionRangeCheck($this, index) {
          Companion_instance_2.i2(index, $this.j());
          return index;
        }
        function ArrayList(array) {
          Companion_getInstance_0();
          AbstractMutableList.call(this);
          this.l_1 = array;
          this.m_1 = false;
        }
        protoOf(ArrayList).j = function() {
          return this.l_1.length;
        };
        protoOf(ArrayList).o = function(index) {
          var tmp = this.l_1[rangeCheck(this, index)];
          return (tmp == null ? true : !(tmp == null)) ? tmp : THROW_CCE();
        };
        protoOf(ArrayList).x1 = function(index, element) {
          this.z1();
          rangeCheck(this, index);
          var this_0 = this.l_1[index];
          this.l_1[index] = element;
          var tmp = this_0;
          return (tmp == null ? true : !(tmp == null)) ? tmp : THROW_CCE();
        };
        protoOf(ArrayList).e = function(element) {
          this.z1();
          this.l_1.push(element);
          this.e2_1 = this.e2_1 + 1 | 0;
          return true;
        };
        protoOf(ArrayList).g2 = function(index, element) {
          this.z1();
          this.l_1.splice(insertionRangeCheck(this, index), 0, element);
          this.e2_1 = this.e2_1 + 1 | 0;
        };
        protoOf(ArrayList).n = function(elements) {
          this.z1();
          if (elements.p())
            return false;
          var offset = increaseLength(this, elements.j());
          var index = 0;
          var tmp0_iterator = elements.g();
          while (tmp0_iterator.h()) {
            var item = tmp0_iterator.i();
            var tmp1 = index;
            index = tmp1 + 1 | 0;
            var index_0 = checkIndexOverflow(tmp1);
            this.l_1[offset + index_0 | 0] = item;
          }
          this.e2_1 = this.e2_1 + 1 | 0;
          return true;
        };
        protoOf(ArrayList).h2 = function(index, elements) {
          this.z1();
          insertionRangeCheck(this, index);
          if (index === this.j())
            return this.n(elements);
          if (elements.p())
            return false;
          var tail = this.l_1.splice(index);
          this.n(elements);
          var offset = increaseLength(this, tail.length);
          var times = tail.length;
          var inductionVariable = 0;
          if (inductionVariable < times)
            do {
              var index_0 = inductionVariable;
              inductionVariable = inductionVariable + 1 | 0;
              this.l_1[offset + index_0 | 0] = tail[index_0];
            } while (inductionVariable < times);
          this.e2_1 = this.e2_1 + 1 | 0;
          return true;
        };
        protoOf(ArrayList).f2 = function(index) {
          this.z1();
          rangeCheck(this, index);
          this.e2_1 = this.e2_1 + 1 | 0;
          var tmp;
          if (index === get_lastIndex_0(this)) {
            tmp = this.l_1.pop();
          } else {
            tmp = this.l_1.splice(index, 1)[0];
          }
          return tmp;
        };
        protoOf(ArrayList).y1 = function(element) {
          this.z1();
          var inductionVariable = 0;
          var last = this.l_1.length - 1 | 0;
          if (inductionVariable <= last)
            do {
              var index = inductionVariable;
              inductionVariable = inductionVariable + 1 | 0;
              if (equals(this.l_1[index], element)) {
                this.l_1.splice(index, 1);
                this.e2_1 = this.e2_1 + 1 | 0;
                return true;
              }
            } while (inductionVariable <= last);
          return false;
        };
        protoOf(ArrayList).s = function(element) {
          return indexOf(this.l_1, element);
        };
        protoOf(ArrayList).toString = function() {
          return arrayToString(this.l_1);
        };
        protoOf(ArrayList).x2 = function() {
          return [].slice.call(this.l_1);
        };
        protoOf(ArrayList).toArray = function() {
          return this.x2();
        };
        protoOf(ArrayList).z1 = function() {
          if (this.m_1)
            throw UnsupportedOperationException_init_$Create$();
        };
        var _stableSortingIsSupported;
        function sortArrayWith(array, comparator) {
          if (getStableSortingIsSupported()) {
            var comparison = sortArrayWith$lambda(comparator);
            array.sort(comparison);
          } else {
            mergeSort(array, 0, get_lastIndex(array), comparator);
          }
        }
        function getStableSortingIsSupported() {
          var tmp0_safe_receiver = _stableSortingIsSupported;
          if (tmp0_safe_receiver == null)
            null;
          else {
            return tmp0_safe_receiver;
          }
          _stableSortingIsSupported = false;
          var array = [];
          var inductionVariable = 0;
          if (inductionVariable < 600)
            do {
              var index = inductionVariable;
              inductionVariable = inductionVariable + 1 | 0;
              array.push(index);
            } while (inductionVariable < 600);
          var comparison = getStableSortingIsSupported$lambda;
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
            } while (inductionVariable_0 < last);
          _stableSortingIsSupported = true;
          return true;
        }
        function mergeSort(array, start, endInclusive, comparator) {
          var size = array.length;
          var buffer = fillArrayVal(Array(size), null);
          var result = mergeSort_0(array, buffer, start, endInclusive, comparator);
          if (!(result === array)) {
            var inductionVariable = start;
            if (inductionVariable <= endInclusive)
              do {
                var i = inductionVariable;
                inductionVariable = inductionVariable + 1 | 0;
                array[i] = result[i];
              } while (!(i === endInclusive));
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
            } while (!(i === end));
          return target;
        }
        function sortArrayWith$lambda($comparator) {
          return function(a, b) {
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
          HashMap_init_$Init$_1(initialCapacity, 1, $this);
          return $this;
        }
        function HashMap_init_$Create$_0(initialCapacity) {
          return HashMap_init_$Init$_2(initialCapacity, objectCreate(protoOf(HashMap)));
        }
        function HashMap_init_$Init$_3(original, $this) {
          HashMap_init_$Init$(InternalHashMap_init_$Create$_0(original), $this);
          return $this;
        }
        protoOf(HashMap).v = function(key) {
          return this.c3_1.e3(key);
        };
        protoOf(HashMap).x = function() {
          var tmp0_elvis_lhs = this.d3_1;
          var tmp;
          if (tmp0_elvis_lhs == null) {
            var this_0 = new HashMapEntrySet(this.c3_1);
            this.d3_1 = this_0;
            tmp = this_0;
          } else {
            tmp = tmp0_elvis_lhs;
          }
          return tmp;
        };
        protoOf(HashMap).w = function(key) {
          return this.c3_1.w(key);
        };
        protoOf(HashMap).p2 = function(key, value) {
          return this.c3_1.p2(key, value);
        };
        protoOf(HashMap).j = function() {
          return this.c3_1.j();
        };
        function HashMap() {
          this.d3_1 = null;
        }
        function HashMapEntrySet(backing) {
          HashMapEntrySetBase.call(this, backing);
        }
        protoOf(HashMapEntrySet).g = function() {
          return this.g3_1.h3();
        };
        function HashMapEntrySetBase(backing) {
          AbstractMutableSet.call(this);
          this.g3_1 = backing;
        }
        protoOf(HashMapEntrySetBase).j = function() {
          return this.g3_1.j();
        };
        protoOf(HashMapEntrySetBase).p = function() {
          return this.g3_1.j() === 0;
        };
        protoOf(HashMapEntrySetBase).i3 = function(element) {
          return this.g3_1.k3(element);
        };
        protoOf(HashMapEntrySetBase).q = function(element) {
          if (!(!(element == null) ? isInterface(element, Entry) : false))
            return false;
          return this.i3((!(element == null) ? isInterface(element, Entry) : false) ? element : THROW_CCE());
        };
        protoOf(HashMapEntrySetBase).j3 = function(element) {
          throw UnsupportedOperationException_init_$Create$();
        };
        protoOf(HashMapEntrySetBase).e = function(element) {
          return this.j3((!(element == null) ? isInterface(element, Entry) : false) ? element : THROW_CCE());
        };
        protoOf(HashMapEntrySetBase).n = function(elements) {
          throw UnsupportedOperationException_init_$Create$();
        };
        protoOf(HashMapEntrySetBase).r = function(elements) {
          return this.g3_1.l3(elements);
        };
        protoOf(HashMapEntrySetBase).z1 = function() {
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
          HashSet_init_$Init$_1(initialCapacity, 1, $this);
          return $this;
        }
        function HashSet_init_$Create$_0(initialCapacity) {
          return HashSet_init_$Init$_2(initialCapacity, objectCreate(protoOf(HashSet)));
        }
        protoOf(HashSet).e = function(element) {
          return this.n3_1.p2(element, true) == null;
        };
        protoOf(HashSet).q = function(element) {
          return this.n3_1.e3(element);
        };
        protoOf(HashSet).p = function() {
          return this.n3_1.j() === 0;
        };
        protoOf(HashSet).g = function() {
          return this.n3_1.o3();
        };
        protoOf(HashSet).j = function() {
          return this.n3_1.j();
        };
        function HashSet() {
        }
        function computeHashSize($this, capacity) {
          return takeHighestOneBit(imul(coerceAtLeast(capacity, 1), 3));
        }
        function computeShift($this, hashSize) {
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
          if (!(loadFactor > 0)) {
            var message = "Non-positive load factor: " + loadFactor;
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
            throw RuntimeException_init_$Create$_0("too many elements");
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
            var hash2 = $this.r3_1[i];
            if (hash2 >= 0) {
              $this.p3_1[j] = $this.p3_1[i];
              if (!(valuesArray == null)) {
                valuesArray[j] = valuesArray[i];
              }
              if (updateHashArray) {
                $this.r3_1[j] = hash2;
                $this.s3_1[hash2] = j + 1 | 0;
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
              throw IllegalStateException_init_$Create$_0("This cannot happen with fixed magic multiplier and grow-only hash array. Have object hashCodes changed?");
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
        protoOf(Itr).j4 = function() {
          while (this.g4_1 < this.f4_1.u3_1 && this.f4_1.r3_1[this.g4_1] < 0) {
            this.g4_1 = this.g4_1 + 1 | 0;
          }
        };
        protoOf(Itr).h = function() {
          return this.g4_1 < this.f4_1.u3_1;
        };
        protoOf(Itr).a2 = function() {
          this.k4();
          if (!!(this.h4_1 === -1)) {
            var message = "Call next() before removing element from the iterator.";
            throw IllegalStateException_init_$Create$_0(toString_1(message));
          }
          this.f4_1.m3();
          removeEntryAt(this.f4_1, this.h4_1);
          this.h4_1 = -1;
          this.i4_1 = this.f4_1.w3_1;
        };
        protoOf(Itr).k4 = function() {
          if (!(this.f4_1.w3_1 === this.i4_1))
            throw ConcurrentModificationException_init_$Create$();
        };
        function KeysItr(map) {
          Itr.call(this, map);
        }
        protoOf(KeysItr).i = function() {
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
        protoOf(EntriesItr).i = function() {
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
        protoOf(EntriesItr).t4 = function() {
          if (this.g4_1 >= this.f4_1.u3_1)
            throw NoSuchElementException_init_$Create$();
          var tmp = this;
          var tmp1 = this.g4_1;
          this.g4_1 = tmp1 + 1 | 0;
          tmp.h4_1 = tmp1;
          var tmp0_safe_receiver = this.f4_1.p3_1[this.h4_1];
          var tmp1_elvis_lhs = tmp0_safe_receiver == null ? null : hashCode(tmp0_safe_receiver);
          var tmp_0 = tmp1_elvis_lhs == null ? 0 : tmp1_elvis_lhs;
          var tmp0_safe_receiver_0 = ensureNotNull(this.f4_1.q3_1)[this.h4_1];
          var tmp1_elvis_lhs_0 = tmp0_safe_receiver_0 == null ? null : hashCode(tmp0_safe_receiver_0);
          var result = tmp_0 ^ (tmp1_elvis_lhs_0 == null ? 0 : tmp1_elvis_lhs_0);
          this.j4();
          return result;
        };
        protoOf(EntriesItr).u4 = function(sb) {
          if (this.g4_1 >= this.f4_1.u3_1)
            throw NoSuchElementException_init_$Create$();
          var tmp = this;
          var tmp1 = this.g4_1;
          this.g4_1 = tmp1 + 1 | 0;
          tmp.h4_1 = tmp1;
          var key = this.f4_1.p3_1[this.h4_1];
          if (equals(key, this.f4_1)) {
            sb.x4("(this Map)");
          } else {
            sb.w4(key);
          }
          sb.y4(_Char___init__impl__6a9atx(61));
          var value = ensureNotNull(this.f4_1.q3_1)[this.h4_1];
          if (equals(value, this.f4_1)) {
            sb.x4("(this Map)");
          } else {
            sb.w4(value);
          }
          this.j4();
        };
        function EntryRef(map, index) {
          this.z4_1 = map;
          this.a5_1 = index;
        }
        protoOf(EntryRef).t = function() {
          return this.z4_1.p3_1[this.a5_1];
        };
        protoOf(EntryRef).u = function() {
          return ensureNotNull(this.z4_1.q3_1)[this.a5_1];
        };
        protoOf(EntryRef).equals = function(other) {
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
        protoOf(EntryRef).hashCode = function() {
          var tmp0_safe_receiver = this.t();
          var tmp1_elvis_lhs = tmp0_safe_receiver == null ? null : hashCode(tmp0_safe_receiver);
          var tmp = tmp1_elvis_lhs == null ? 0 : tmp1_elvis_lhs;
          var tmp0_safe_receiver_0 = this.u();
          var tmp1_elvis_lhs_0 = tmp0_safe_receiver_0 == null ? null : hashCode(tmp0_safe_receiver_0);
          return tmp ^ (tmp1_elvis_lhs_0 == null ? 0 : tmp1_elvis_lhs_0);
        };
        protoOf(EntryRef).toString = function() {
          return toString_0(this.t()) + "=" + toString_0(this.u());
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
        protoOf(InternalHashMap).j = function() {
          return this.x3_1;
        };
        protoOf(InternalHashMap).w = function(key) {
          var index = findKey(this, key);
          if (index < 0)
            return null;
          return ensureNotNull(this.q3_1)[index];
        };
        protoOf(InternalHashMap).e3 = function(key) {
          return findKey(this, key) >= 0;
        };
        protoOf(InternalHashMap).p2 = function(key, value) {
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
        protoOf(InternalHashMap).z3 = function(from) {
          this.m3();
          putAllEntries(this, from.x());
        };
        protoOf(InternalHashMap).equals = function(other) {
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
        protoOf(InternalHashMap).hashCode = function() {
          var result = 0;
          var it = this.h3();
          while (it.h()) {
            result = result + it.t4() | 0;
          }
          return result;
        };
        protoOf(InternalHashMap).toString = function() {
          var sb = StringBuilder_init_$Create$(2 + imul(this.x3_1, 3) | 0);
          sb.x4("{");
          var i = 0;
          var it = this.h3();
          while (it.h()) {
            if (i > 0) {
              sb.x4(", ");
            }
            it.u4(sb);
            i = i + 1 | 0;
          }
          sb.x4("}");
          return sb.toString();
        };
        protoOf(InternalHashMap).m3 = function() {
          if (this.y3_1)
            throw UnsupportedOperationException_init_$Create$();
        };
        protoOf(InternalHashMap).k3 = function(entry) {
          var index = findKey(this, entry.t());
          if (index < 0)
            return false;
          return equals(ensureNotNull(this.q3_1)[index], entry.u());
        };
        protoOf(InternalHashMap).b5 = function(entry) {
          return this.k3(isInterface(entry, Entry) ? entry : THROW_CCE());
        };
        protoOf(InternalHashMap).o3 = function() {
          return new KeysItr(this);
        };
        protoOf(InternalHashMap).h3 = function() {
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
          LinkedHashSet_init_$Init$_0(initialCapacity, 1, $this);
          return $this;
        }
        function LinkedHashSet_init_$Create$_0(initialCapacity) {
          return LinkedHashSet_init_$Init$_1(initialCapacity, objectCreate(protoOf(LinkedHashSet)));
        }
        protoOf(LinkedHashSet).z1 = function() {
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
          var result = source.slice(0, newSize);
          if (source.$type$ !== void 0) {
            result.$type$ = source.$type$;
          }
          var index = source.length;
          if (newSize > index) {
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
        protoOf(KClassImpl).h5 = function() {
          return this.g5_1;
        };
        protoOf(KClassImpl).equals = function(other) {
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
        protoOf(KClassImpl).hashCode = function() {
          var tmp0_safe_receiver = this.f5();
          var tmp1_elvis_lhs = tmp0_safe_receiver == null ? null : getStringHashCode(tmp0_safe_receiver);
          return tmp1_elvis_lhs == null ? 0 : tmp1_elvis_lhs;
        };
        protoOf(KClassImpl).toString = function() {
          return "class " + this.f5();
        };
        function NothingKClassImpl() {
          NothingKClassImpl_instance = this;
          KClassImpl.call(this, Object);
          this.j5_1 = "Nothing";
        }
        protoOf(NothingKClassImpl).f5 = function() {
          return this.j5_1;
        };
        protoOf(NothingKClassImpl).h5 = function() {
          throw UnsupportedOperationException_init_$Create$_0("There's no native JS class for Nothing type");
        };
        protoOf(NothingKClassImpl).equals = function(other) {
          return other === this;
        };
        protoOf(NothingKClassImpl).hashCode = function() {
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
        protoOf(ErrorKClass).f5 = function() {
          var message = "Unknown simpleName for ErrorKClass";
          throw IllegalStateException_init_$Create$_0(toString_1(message));
        };
        protoOf(ErrorKClass).equals = function(other) {
          return other === this;
        };
        protoOf(ErrorKClass).hashCode = function() {
          return 0;
        };
        function PrimitiveKClassImpl(jClass, givenSimpleName, isInstanceFunction) {
          KClassImpl.call(this, jClass);
          this.l5_1 = givenSimpleName;
          this.m5_1 = isInstanceFunction;
        }
        protoOf(PrimitiveKClassImpl).equals = function(other) {
          if (!(other instanceof PrimitiveKClassImpl))
            return false;
          return protoOf(KClassImpl).equals.call(this, other) && this.l5_1 === other.l5_1;
        };
        protoOf(PrimitiveKClassImpl).f5 = function() {
          return this.l5_1;
        };
        function SimpleKClassImpl(jClass) {
          KClassImpl.call(this, jClass);
          var tmp = this;
          var tmp0_safe_receiver = jClass.$metadata$;
          tmp.o5_1 = tmp0_safe_receiver == null ? null : tmp0_safe_receiver.simpleName;
        }
        protoOf(SimpleKClassImpl).f5 = function() {
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
          return !(it == null) ? typeof it === "boolean" : false;
        }
        function PrimitiveClasses$byteClass$lambda(it) {
          return !(it == null) ? typeof it === "number" : false;
        }
        function PrimitiveClasses$shortClass$lambda(it) {
          return !(it == null) ? typeof it === "number" : false;
        }
        function PrimitiveClasses$intClass$lambda(it) {
          return !(it == null) ? typeof it === "number" : false;
        }
        function PrimitiveClasses$floatClass$lambda(it) {
          return !(it == null) ? typeof it === "number" : false;
        }
        function PrimitiveClasses$doubleClass$lambda(it) {
          return !(it == null) ? typeof it === "number" : false;
        }
        function PrimitiveClasses$arrayClass$lambda(it) {
          return !(it == null) ? isArray(it) : false;
        }
        function PrimitiveClasses$stringClass$lambda(it) {
          return !(it == null) ? typeof it === "string" : false;
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
          return function(it) {
            var tmp;
            if (typeof it === "function") {
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
          var tmp_0 = Object;
          tmp.anyClass = new PrimitiveKClassImpl(tmp_0, "Any", PrimitiveClasses$anyClass$lambda);
          var tmp_1 = this;
          var tmp_2 = Number;
          tmp_1.numberClass = new PrimitiveKClassImpl(tmp_2, "Number", PrimitiveClasses$numberClass$lambda);
          this.nothingClass = NothingKClassImpl_getInstance();
          var tmp_3 = this;
          var tmp_4 = Boolean;
          tmp_3.booleanClass = new PrimitiveKClassImpl(tmp_4, "Boolean", PrimitiveClasses$booleanClass$lambda);
          var tmp_5 = this;
          var tmp_6 = Number;
          tmp_5.byteClass = new PrimitiveKClassImpl(tmp_6, "Byte", PrimitiveClasses$byteClass$lambda);
          var tmp_7 = this;
          var tmp_8 = Number;
          tmp_7.shortClass = new PrimitiveKClassImpl(tmp_8, "Short", PrimitiveClasses$shortClass$lambda);
          var tmp_9 = this;
          var tmp_10 = Number;
          tmp_9.intClass = new PrimitiveKClassImpl(tmp_10, "Int", PrimitiveClasses$intClass$lambda);
          var tmp_11 = this;
          var tmp_12 = Number;
          tmp_11.floatClass = new PrimitiveKClassImpl(tmp_12, "Float", PrimitiveClasses$floatClass$lambda);
          var tmp_13 = this;
          var tmp_14 = Number;
          tmp_13.doubleClass = new PrimitiveKClassImpl(tmp_14, "Double", PrimitiveClasses$doubleClass$lambda);
          var tmp_15 = this;
          var tmp_16 = Array;
          tmp_15.arrayClass = new PrimitiveKClassImpl(tmp_16, "Array", PrimitiveClasses$arrayClass$lambda);
          var tmp_17 = this;
          var tmp_18 = String;
          tmp_17.stringClass = new PrimitiveKClassImpl(tmp_18, "String", PrimitiveClasses$stringClass$lambda);
          var tmp_19 = this;
          var tmp_20 = Error;
          tmp_19.throwableClass = new PrimitiveKClassImpl(tmp_20, "Throwable", PrimitiveClasses$throwableClass$lambda);
          var tmp_21 = this;
          var tmp_22 = Array;
          tmp_21.booleanArrayClass = new PrimitiveKClassImpl(tmp_22, "BooleanArray", PrimitiveClasses$booleanArrayClass$lambda);
          var tmp_23 = this;
          var tmp_24 = Uint16Array;
          tmp_23.charArrayClass = new PrimitiveKClassImpl(tmp_24, "CharArray", PrimitiveClasses$charArrayClass$lambda);
          var tmp_25 = this;
          var tmp_26 = Int8Array;
          tmp_25.byteArrayClass = new PrimitiveKClassImpl(tmp_26, "ByteArray", PrimitiveClasses$byteArrayClass$lambda);
          var tmp_27 = this;
          var tmp_28 = Int16Array;
          tmp_27.shortArrayClass = new PrimitiveKClassImpl(tmp_28, "ShortArray", PrimitiveClasses$shortArrayClass$lambda);
          var tmp_29 = this;
          var tmp_30 = Int32Array;
          tmp_29.intArrayClass = new PrimitiveKClassImpl(tmp_30, "IntArray", PrimitiveClasses$intArrayClass$lambda);
          var tmp_31 = this;
          var tmp_32 = Array;
          tmp_31.longArrayClass = new PrimitiveKClassImpl(tmp_32, "LongArray", PrimitiveClasses$longArrayClass$lambda);
          var tmp_33 = this;
          var tmp_34 = Float32Array;
          tmp_33.floatArrayClass = new PrimitiveKClassImpl(tmp_34, "FloatArray", PrimitiveClasses$floatArrayClass$lambda);
          var tmp_35 = this;
          var tmp_36 = Float64Array;
          tmp_35.doubleArrayClass = new PrimitiveKClassImpl(tmp_36, "DoubleArray", PrimitiveClasses$doubleArrayClass$lambda);
        }
        protoOf(PrimitiveClasses).p5 = function() {
          return this.anyClass;
        };
        protoOf(PrimitiveClasses).q5 = function() {
          return this.numberClass;
        };
        protoOf(PrimitiveClasses).r5 = function() {
          return this.nothingClass;
        };
        protoOf(PrimitiveClasses).s5 = function() {
          return this.booleanClass;
        };
        protoOf(PrimitiveClasses).t5 = function() {
          return this.byteClass;
        };
        protoOf(PrimitiveClasses).u5 = function() {
          return this.shortClass;
        };
        protoOf(PrimitiveClasses).v5 = function() {
          return this.intClass;
        };
        protoOf(PrimitiveClasses).w5 = function() {
          return this.floatClass;
        };
        protoOf(PrimitiveClasses).x5 = function() {
          return this.doubleClass;
        };
        protoOf(PrimitiveClasses).y5 = function() {
          return this.arrayClass;
        };
        protoOf(PrimitiveClasses).z5 = function() {
          return this.stringClass;
        };
        protoOf(PrimitiveClasses).a6 = function() {
          return this.throwableClass;
        };
        protoOf(PrimitiveClasses).b6 = function() {
          return this.booleanArrayClass;
        };
        protoOf(PrimitiveClasses).c6 = function() {
          return this.charArrayClass;
        };
        protoOf(PrimitiveClasses).d6 = function() {
          return this.byteArrayClass;
        };
        protoOf(PrimitiveClasses).e6 = function() {
          return this.shortArrayClass;
        };
        protoOf(PrimitiveClasses).f6 = function() {
          return this.intArrayClass;
        };
        protoOf(PrimitiveClasses).g6 = function() {
          return this.longArrayClass;
        };
        protoOf(PrimitiveClasses).h6 = function() {
          return this.floatArrayClass;
        };
        protoOf(PrimitiveClasses).i6 = function() {
          return this.doubleArrayClass;
        };
        protoOf(PrimitiveClasses).functionClass = function(arity) {
          var tmp0_elvis_lhs = get_functionClasses()[arity];
          var tmp;
          if (tmp0_elvis_lhs == null) {
            var tmp_0 = Function;
            var tmp_1 = "Function" + arity;
            var result = new PrimitiveKClassImpl(tmp_0, tmp_1, PrimitiveClasses$functionClass$lambda(arity));
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
            functionClasses = fillArrayVal(Array(0), null);
          }
        }
        function getKClass(jClass) {
          var tmp;
          if (Array.isArray(jClass)) {
            tmp = getKClassM(jClass);
          } else {
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
              tmp = NothingKClassImpl_getInstance();
              break;
            default:
              tmp = new ErrorKClass();
              break;
          }
          return tmp;
        }
        function getKClass1(jClass) {
          if (jClass === String) {
            return PrimitiveClasses_getInstance().stringClass;
          }
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
          var tmp;
          switch (typeof e) {
            case "string":
              tmp = PrimitiveClasses_getInstance().stringClass;
              break;
            case "number":
              var tmp_0;
              if ((e | 0) === e) {
                tmp_0 = PrimitiveClasses_getInstance().intClass;
              } else {
                tmp_0 = PrimitiveClasses_getInstance().doubleClass;
              }
              tmp = tmp_0;
              break;
            case "boolean":
              tmp = PrimitiveClasses_getInstance().booleanClass;
              break;
            case "function":
              var tmp_1 = PrimitiveClasses_getInstance();
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
          StringBuilder.call($this, "");
          return $this;
        }
        function StringBuilder_init_$Create$_0() {
          return StringBuilder_init_$Init$_0(objectCreate(protoOf(StringBuilder)));
        }
        function StringBuilder(content) {
          this.v4_1 = !(content === void 0) ? content : "";
        }
        protoOf(StringBuilder).a = function() {
          return this.v4_1.length;
        };
        protoOf(StringBuilder).b = function(index) {
          var this_0 = this.v4_1;
          var tmp;
          if (0 <= index ? index <= (charSequenceLength(this_0) - 1 | 0) : false) {
            tmp = charSequenceGet(this_0, index);
          } else {
            throw IndexOutOfBoundsException_init_$Create$_0("index: " + index + ", length: " + this.a() + "}");
          }
          return tmp;
        };
        protoOf(StringBuilder).c = function(startIndex, endIndex) {
          return this.v4_1.substring(startIndex, endIndex);
        };
        protoOf(StringBuilder).y4 = function(value) {
          this.v4_1 = this.v4_1 + toString(value);
          return this;
        };
        protoOf(StringBuilder).f = function(value) {
          this.v4_1 = this.v4_1 + toString_0(value);
          return this;
        };
        protoOf(StringBuilder).w4 = function(value) {
          this.v4_1 = this.v4_1 + toString_0(value);
          return this;
        };
        protoOf(StringBuilder).x4 = function(value) {
          var tmp = this;
          var tmp_0 = this.v4_1;
          tmp.v4_1 = tmp_0 + (value == null ? "null" : value);
          return this;
        };
        protoOf(StringBuilder).toString = function() {
          return this.v4_1;
        };
        function uppercaseChar(_this__u8e3s4) {
          var uppercase = toString(_this__u8e3s4).toUpperCase();
          return uppercase.length > 1 ? _this__u8e3s4 : charSequenceGet(uppercase, 0);
        }
        function isWhitespace(_this__u8e3s4) {
          return isWhitespaceImpl(_this__u8e3s4);
        }
        function checkRadix(radix) {
          if (!(2 <= radix ? radix <= 36 : false)) {
            throw IllegalArgumentException_init_$Create$_0("radix " + radix + " was not in valid range 2..36");
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
                    var this_0 = thisChar;
                    var tmp$ret$3 = toString(this_0).toLowerCase();
                    thisChar = charSequenceGet(tmp$ret$3, 0);
                    var this_1 = otherChar;
                    var tmp$ret$7 = toString(this_1).toLowerCase();
                    otherChar = charSequenceGet(tmp$ret$7, 0);
                    if (!(thisChar === otherChar)) {
                      return Char__compareTo_impl_ypi4mb(thisChar, otherChar);
                    }
                  }
                }
              } while (inductionVariable < min);
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
        protoOf(sam$kotlin_Comparator$0).k6 = function(a, b) {
          return this.j6_1(a, b);
        };
        protoOf(sam$kotlin_Comparator$0).compare = function(a, b) {
          return this.k6(a, b);
        };
        protoOf(sam$kotlin_Comparator$0).r1 = function() {
          return this.j6_1;
        };
        protoOf(sam$kotlin_Comparator$0).equals = function(other) {
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
        protoOf(sam$kotlin_Comparator$0).hashCode = function() {
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
            } while (inductionVariable < last);
          return true;
        }
        function AbstractCollection$toString$lambda(this$0) {
          return function(it) {
            return it === this$0 ? "(this Collection)" : toString_0(it);
          };
        }
        function AbstractCollection() {
        }
        protoOf(AbstractCollection).q = function(element) {
          var tmp$ret$0;
          $l$block_0: {
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
              if (equals(element_0, element)) {
                tmp$ret$0 = true;
                break $l$block_0;
              }
            }
            tmp$ret$0 = false;
          }
          return tmp$ret$0;
        };
        protoOf(AbstractCollection).r = function(elements) {
          var tmp$ret$0;
          $l$block_0: {
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
              if (!this.q(element)) {
                tmp$ret$0 = false;
                break $l$block_0;
              }
            }
            tmp$ret$0 = true;
          }
          return tmp$ret$0;
        };
        protoOf(AbstractCollection).p = function() {
          return this.j() === 0;
        };
        protoOf(AbstractCollection).toString = function() {
          return joinToString_0(this, ", ", "[", "]", VOID, VOID, AbstractCollection$toString$lambda(this));
        };
        protoOf(AbstractCollection).toArray = function() {
          return collectionToArray(this);
        };
        function Companion_2() {
          this.u1_1 = 2147483639;
        }
        protoOf(Companion_2).w2 = function(index, size) {
          if (index < 0 || index >= size) {
            throw IndexOutOfBoundsException_init_$Create$_0("index: " + index + ", size: " + size);
          }
        };
        protoOf(Companion_2).i2 = function(index, size) {
          if (index < 0 || index > size) {
            throw IndexOutOfBoundsException_init_$Create$_0("index: " + index + ", size: " + size);
          }
        };
        protoOf(Companion_2).v1 = function(fromIndex, toIndex, size) {
          if (fromIndex < 0 || toIndex > size) {
            throw IndexOutOfBoundsException_init_$Create$_0("fromIndex: " + fromIndex + ", toIndex: " + toIndex + ", size: " + size);
          }
          if (fromIndex > toIndex) {
            throw IllegalArgumentException_init_$Create$_0("fromIndex: " + fromIndex + " > toIndex: " + toIndex);
          }
        };
        protoOf(Companion_2).a4 = function(oldCapacity, minCapacity) {
          var newCapacity = oldCapacity + (oldCapacity >> 1) | 0;
          if ((newCapacity - minCapacity | 0) < 0)
            newCapacity = minCapacity;
          if ((newCapacity - 2147483639 | 0) > 0)
            newCapacity = minCapacity > 2147483639 ? 2147483647 : 2147483639;
          return newCapacity;
        };
        protoOf(Companion_2).k2 = function(c) {
          var hashCode_02 = 1;
          var tmp0_iterator = c.g();
          while (tmp0_iterator.h()) {
            var e = tmp0_iterator.i();
            var tmp = imul(31, hashCode_02);
            var tmp2_elvis_lhs = e == null ? null : hashCode(e);
            hashCode_02 = tmp + (tmp2_elvis_lhs == null ? 0 : tmp2_elvis_lhs) | 0;
          }
          return hashCode_02;
        };
        protoOf(Companion_2).j2 = function(c, other) {
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
          return o === $this ? "(this Map)" : toString_0(o);
        }
        function implFindEntry($this, key) {
          var tmp$ret$1;
          $l$block: {
            var tmp0_iterator = $this.x().g();
            while (tmp0_iterator.h()) {
              var element = tmp0_iterator.i();
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
          return function(it) {
            return this$0.l6(it);
          };
        }
        function AbstractMap() {
          this.q2_1 = null;
          this.r2_1 = null;
        }
        protoOf(AbstractMap).v = function(key) {
          return !(implFindEntry(this, key) == null);
        };
        protoOf(AbstractMap).s2 = function(entry) {
          if (!(!(entry == null) ? isInterface(entry, Entry) : false))
            return false;
          var key = entry.t();
          var value = entry.u();
          var ourValue = (isInterface(this, KtMap) ? this : THROW_CCE()).w(key);
          if (!equals(value, ourValue)) {
            return false;
          }
          var tmp;
          if (ourValue == null) {
            tmp = !(isInterface(this, KtMap) ? this : THROW_CCE()).v(key);
          } else {
            tmp = false;
          }
          if (tmp) {
            return false;
          }
          return true;
        };
        protoOf(AbstractMap).equals = function(other) {
          if (other === this)
            return true;
          if (!(!(other == null) ? isInterface(other, KtMap) : false))
            return false;
          if (!(this.j() === other.j()))
            return false;
          var tmp$ret$0;
          $l$block_0: {
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
              if (!this.s2(element)) {
                tmp$ret$0 = false;
                break $l$block_0;
              }
            }
            tmp$ret$0 = true;
          }
          return tmp$ret$0;
        };
        protoOf(AbstractMap).w = function(key) {
          var tmp0_safe_receiver = implFindEntry(this, key);
          return tmp0_safe_receiver == null ? null : tmp0_safe_receiver.u();
        };
        protoOf(AbstractMap).hashCode = function() {
          return hashCode(this.x());
        };
        protoOf(AbstractMap).p = function() {
          return this.j() === 0;
        };
        protoOf(AbstractMap).j = function() {
          return this.x().j();
        };
        protoOf(AbstractMap).toString = function() {
          var tmp = this.x();
          return joinToString_0(tmp, ", ", "{", "}", VOID, VOID, AbstractMap$toString$lambda(this));
        };
        protoOf(AbstractMap).l6 = function(entry) {
          return toString_2(this, entry.t()) + "=" + toString_2(this, entry.u());
        };
        function Companion_4() {
        }
        protoOf(Companion_4).u2 = function(c) {
          var hashCode_02 = 0;
          var tmp0_iterator = c.g();
          while (tmp0_iterator.h()) {
            var element = tmp0_iterator.i();
            var tmp = hashCode_02;
            var tmp2_elvis_lhs = element == null ? null : hashCode(element);
            hashCode_02 = tmp + (tmp2_elvis_lhs == null ? 0 : tmp2_elvis_lhs) | 0;
          }
          return hashCode_02;
        };
        protoOf(Companion_4).t2 = function(c, other) {
          if (!(c.j() === other.j()))
            return false;
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
          tmp.o6_1 = copyToArray(elements);
          $this.p6_1 = $this.o6_1.length;
          if ($this.o6_1.length === 0)
            $this.o6_1 = Companion_getInstance_5().q6_1;
          return $this;
        }
        function ArrayDeque_init_$Create$_0(elements) {
          return ArrayDeque_init_$Init$_0(elements, objectCreate(protoOf(ArrayDeque)));
        }
        function ensureCapacity_0($this, minCapacity) {
          if (minCapacity < 0)
            throw IllegalStateException_init_$Create$_0("Deque is too big.");
          if (minCapacity <= $this.o6_1.length)
            return Unit_instance;
          if ($this.o6_1 === Companion_getInstance_5().q6_1) {
            var tmp = $this;
            var size = coerceAtLeast(minCapacity, 10);
            tmp.o6_1 = fillArrayVal(Array(size), null);
            return Unit_instance;
          }
          var newCapacity = Companion_instance_2.a4($this.o6_1.length, minCapacity);
          copyElements($this, newCapacity);
        }
        function copyElements($this, newCapacity) {
          var newElements = fillArrayVal(Array(newCapacity), null);
          var this_0 = $this.o6_1;
          var startIndex = $this.n6_1;
          var endIndex = $this.o6_1.length;
          arrayCopy(this_0, newElements, 0, startIndex, endIndex);
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
            } while (inductionVariable < last);
          var inductionVariable_0 = 0;
          var last_0 = $this.n6_1;
          if (inductionVariable_0 < last_0)
            $l$loop_0: do {
              var index_0 = inductionVariable_0;
              inductionVariable_0 = inductionVariable_0 + 1 | 0;
              if (!iterator.h())
                break $l$loop_0;
              $this.o6_1[index_0] = iterator.i();
            } while (inductionVariable_0 < last_0);
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
          tmp.q6_1 = [];
          this.r6_1 = 10;
        }
        var Companion_instance_5;
        function Companion_getInstance_5() {
          if (Companion_instance_5 == null)
            new Companion_5();
          return Companion_instance_5;
        }
        protoOf(ArrayDeque).j = function() {
          return this.p6_1;
        };
        protoOf(ArrayDeque).p = function() {
          return this.p6_1 === 0;
        };
        protoOf(ArrayDeque).s6 = function() {
          var tmp;
          if (this.p()) {
            tmp = null;
          } else {
            var internalIndex = this.n6_1;
            var tmp_0 = this.o6_1[internalIndex];
            tmp = (tmp_0 == null ? true : !(tmp_0 == null)) ? tmp_0 : THROW_CCE();
          }
          return tmp;
        };
        protoOf(ArrayDeque).t6 = function(element) {
          registerModification_0(this);
          ensureCapacity_0(this, this.p6_1 + 1 | 0);
          this.n6_1 = decremented(this, this.n6_1);
          this.o6_1[this.n6_1] = element;
          this.p6_1 = this.p6_1 + 1 | 0;
        };
        protoOf(ArrayDeque).u6 = function(element) {
          registerModification_0(this);
          ensureCapacity_0(this, this.p6_1 + 1 | 0);
          var tmp = this.o6_1;
          var index = this.p6_1;
          tmp[positiveMod(this, this.n6_1 + index | 0)] = element;
          this.p6_1 = this.p6_1 + 1 | 0;
        };
        protoOf(ArrayDeque).v6 = function() {
          if (this.p())
            throw NoSuchElementException_init_$Create$_0("ArrayDeque is empty.");
          registerModification_0(this);
          var internalIndex = this.n6_1;
          var tmp = this.o6_1[internalIndex];
          var element = (tmp == null ? true : !(tmp == null)) ? tmp : THROW_CCE();
          this.o6_1[this.n6_1] = null;
          this.n6_1 = incremented(this, this.n6_1);
          this.p6_1 = this.p6_1 - 1 | 0;
          return element;
        };
        protoOf(ArrayDeque).w6 = function() {
          if (this.p())
            throw NoSuchElementException_init_$Create$_0("ArrayDeque is empty.");
          registerModification_0(this);
          var index = get_lastIndex_0(this);
          var internalLastIndex = positiveMod(this, this.n6_1 + index | 0);
          var tmp = this.o6_1[internalLastIndex];
          var element = (tmp == null ? true : !(tmp == null)) ? tmp : THROW_CCE();
          this.o6_1[internalLastIndex] = null;
          this.p6_1 = this.p6_1 - 1 | 0;
          return element;
        };
        protoOf(ArrayDeque).e = function(element) {
          this.u6(element);
          return true;
        };
        protoOf(ArrayDeque).g2 = function(index, element) {
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
          var internalIndex = positiveMod(this, this.n6_1 + index | 0);
          if (index < (this.p6_1 + 1 | 0) >> 1) {
            var decrementedInternalIndex = decremented(this, internalIndex);
            var decrementedHead = decremented(this, this.n6_1);
            if (decrementedInternalIndex >= this.n6_1) {
              this.o6_1[decrementedHead] = this.o6_1[this.n6_1];
              var this_0 = this.o6_1;
              var destination = this.o6_1;
              var destinationOffset = this.n6_1;
              var startIndex = this.n6_1 + 1 | 0;
              var endIndex = decrementedInternalIndex + 1 | 0;
              arrayCopy(this_0, destination, destinationOffset, startIndex, endIndex);
            } else {
              var this_1 = this.o6_1;
              var destination_0 = this.o6_1;
              var destinationOffset_0 = this.n6_1 - 1 | 0;
              var startIndex_0 = this.n6_1;
              var endIndex_0 = this.o6_1.length;
              arrayCopy(this_1, destination_0, destinationOffset_0, startIndex_0, endIndex_0);
              this.o6_1[this.o6_1.length - 1 | 0] = this.o6_1[0];
              var this_2 = this.o6_1;
              var destination_1 = this.o6_1;
              var endIndex_1 = decrementedInternalIndex + 1 | 0;
              arrayCopy(this_2, destination_1, 0, 1, endIndex_1);
            }
            this.o6_1[decrementedInternalIndex] = element;
            this.n6_1 = decrementedHead;
          } else {
            var index_0 = this.p6_1;
            var tail = positiveMod(this, this.n6_1 + index_0 | 0);
            if (internalIndex < tail) {
              var this_3 = this.o6_1;
              var destination_2 = this.o6_1;
              var destinationOffset_1 = internalIndex + 1 | 0;
              arrayCopy(this_3, destination_2, destinationOffset_1, internalIndex, tail);
            } else {
              var this_4 = this.o6_1;
              var destination_3 = this.o6_1;
              arrayCopy(this_4, destination_3, 1, 0, tail);
              this.o6_1[0] = this.o6_1[this.o6_1.length - 1 | 0];
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
        protoOf(ArrayDeque).n = function(elements) {
          if (elements.p())
            return false;
          registerModification_0(this);
          ensureCapacity_0(this, this.p6_1 + elements.j() | 0);
          var index = this.p6_1;
          var tmp$ret$0 = positiveMod(this, this.n6_1 + index | 0);
          copyCollectionElements(this, tmp$ret$0, elements);
          return true;
        };
        protoOf(ArrayDeque).h2 = function(index, elements) {
          Companion_instance_2.i2(index, this.p6_1);
          if (elements.p()) {
            return false;
          } else if (index === this.p6_1) {
            return this.n(elements);
          }
          registerModification_0(this);
          ensureCapacity_0(this, this.p6_1 + elements.j() | 0);
          var index_0 = this.p6_1;
          var tail = positiveMod(this, this.n6_1 + index_0 | 0);
          var internalIndex = positiveMod(this, this.n6_1 + index | 0);
          var elementsSize = elements.j();
          if (index < (this.p6_1 + 1 | 0) >> 1) {
            var shiftedHead = this.n6_1 - elementsSize | 0;
            if (internalIndex >= this.n6_1) {
              if (shiftedHead >= 0) {
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
                  var this_1 = this.o6_1;
                  var destination_0 = this.o6_1;
                  var destinationOffset_0 = shiftedHead;
                  var startIndex_0 = this.n6_1;
                  arrayCopy(this_1, destination_0, destinationOffset_0, startIndex_0, internalIndex);
                } else {
                  var this_2 = this.o6_1;
                  var destination_1 = this.o6_1;
                  var destinationOffset_1 = shiftedHead;
                  var startIndex_1 = this.n6_1;
                  var endIndex = this.n6_1 + shiftToBack | 0;
                  arrayCopy(this_2, destination_1, destinationOffset_1, startIndex_1, endIndex);
                  var this_3 = this.o6_1;
                  var destination_2 = this.o6_1;
                  var startIndex_2 = this.n6_1 + shiftToBack | 0;
                  arrayCopy(this_3, destination_2, 0, startIndex_2, internalIndex);
                }
              }
            } else {
              var this_4 = this.o6_1;
              var destination_3 = this.o6_1;
              var destinationOffset_2 = shiftedHead;
              var startIndex_3 = this.n6_1;
              var endIndex_0 = this.o6_1.length;
              arrayCopy(this_4, destination_3, destinationOffset_2, startIndex_3, endIndex_0);
              if (elementsSize >= internalIndex) {
                var this_5 = this.o6_1;
                var destination_4 = this.o6_1;
                var destinationOffset_3 = this.o6_1.length - elementsSize | 0;
                arrayCopy(this_5, destination_4, destinationOffset_3, 0, internalIndex);
              } else {
                var this_6 = this.o6_1;
                var destination_5 = this.o6_1;
                var destinationOffset_4 = this.o6_1.length - elementsSize | 0;
                arrayCopy(this_6, destination_5, destinationOffset_4, 0, elementsSize);
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
                var this_8 = this.o6_1;
                var destination_7 = this.o6_1;
                arrayCopy(this_8, destination_7, shiftedInternalIndex, internalIndex, tail);
              } else {
                if (shiftedInternalIndex >= this.o6_1.length) {
                  var this_9 = this.o6_1;
                  var destination_8 = this.o6_1;
                  var destinationOffset_5 = shiftedInternalIndex - this.o6_1.length | 0;
                  arrayCopy(this_9, destination_8, destinationOffset_5, internalIndex, tail);
                } else {
                  var shiftToFront = (tail + elementsSize | 0) - this.o6_1.length | 0;
                  var this_10 = this.o6_1;
                  var destination_9 = this.o6_1;
                  var startIndex_4 = tail - shiftToFront | 0;
                  arrayCopy(this_10, destination_9, 0, startIndex_4, tail);
                  var this_11 = this.o6_1;
                  var destination_10 = this.o6_1;
                  var endIndex_1 = tail - shiftToFront | 0;
                  arrayCopy(this_11, destination_10, shiftedInternalIndex, internalIndex, endIndex_1);
                }
              }
            } else {
              var this_12 = this.o6_1;
              var destination_11 = this.o6_1;
              arrayCopy(this_12, destination_11, elementsSize, 0, tail);
              if (shiftedInternalIndex >= this.o6_1.length) {
                var this_13 = this.o6_1;
                var destination_12 = this.o6_1;
                var destinationOffset_6 = shiftedInternalIndex - this.o6_1.length | 0;
                var endIndex_2 = this.o6_1.length;
                arrayCopy(this_13, destination_12, destinationOffset_6, internalIndex, endIndex_2);
              } else {
                var this_14 = this.o6_1;
                var destination_13 = this.o6_1;
                var startIndex_5 = this.o6_1.length - elementsSize | 0;
                var endIndex_3 = this.o6_1.length;
                arrayCopy(this_14, destination_13, 0, startIndex_5, endIndex_3);
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
        protoOf(ArrayDeque).o = function(index) {
          Companion_instance_2.w2(index, this.p6_1);
          var internalIndex = positiveMod(this, this.n6_1 + index | 0);
          var tmp = this.o6_1[internalIndex];
          return (tmp == null ? true : !(tmp == null)) ? tmp : THROW_CCE();
        };
        protoOf(ArrayDeque).x1 = function(index, element) {
          Companion_instance_2.w2(index, this.p6_1);
          var internalIndex = positiveMod(this, this.n6_1 + index | 0);
          var tmp = this.o6_1[internalIndex];
          var oldElement = (tmp == null ? true : !(tmp == null)) ? tmp : THROW_CCE();
          this.o6_1[internalIndex] = element;
          return oldElement;
        };
        protoOf(ArrayDeque).q = function(element) {
          return !(this.s(element) === -1);
        };
        protoOf(ArrayDeque).s = function(element) {
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
              } while (inductionVariable < tail);
          } else if (this.n6_1 >= tail) {
            var inductionVariable_0 = this.n6_1;
            var last = this.o6_1.length;
            if (inductionVariable_0 < last)
              do {
                var index_1 = inductionVariable_0;
                inductionVariable_0 = inductionVariable_0 + 1 | 0;
                if (equals(element, this.o6_1[index_1]))
                  return index_1 - this.n6_1 | 0;
              } while (inductionVariable_0 < last);
            var inductionVariable_1 = 0;
            if (inductionVariable_1 < tail)
              do {
                var index_2 = inductionVariable_1;
                inductionVariable_1 = inductionVariable_1 + 1 | 0;
                if (equals(element, this.o6_1[index_2]))
                  return (index_2 + this.o6_1.length | 0) - this.n6_1 | 0;
              } while (inductionVariable_1 < tail);
          }
          return -1;
        };
        protoOf(ArrayDeque).y1 = function(element) {
          var index = this.s(element);
          if (index === -1)
            return false;
          this.f2(index);
          return true;
        };
        protoOf(ArrayDeque).f2 = function(index) {
          Companion_instance_2.w2(index, this.p6_1);
          if (index === get_lastIndex_0(this)) {
            return this.w6();
          } else if (index === 0) {
            return this.v6();
          }
          registerModification_0(this);
          var internalIndex = positiveMod(this, this.n6_1 + index | 0);
          var tmp = this.o6_1[internalIndex];
          var element = (tmp == null ? true : !(tmp == null)) ? tmp : THROW_CCE();
          if (index < this.p6_1 >> 1) {
            if (internalIndex >= this.n6_1) {
              var this_0 = this.o6_1;
              var destination = this.o6_1;
              var destinationOffset = this.n6_1 + 1 | 0;
              var startIndex = this.n6_1;
              arrayCopy(this_0, destination, destinationOffset, startIndex, internalIndex);
            } else {
              var this_1 = this.o6_1;
              var destination_0 = this.o6_1;
              arrayCopy(this_1, destination_0, 1, 0, internalIndex);
              this.o6_1[0] = this.o6_1[this.o6_1.length - 1 | 0];
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
            var index_0 = get_lastIndex_0(this);
            var internalLastIndex = positiveMod(this, this.n6_1 + index_0 | 0);
            if (internalIndex <= internalLastIndex) {
              var this_3 = this.o6_1;
              var destination_2 = this.o6_1;
              var startIndex_1 = internalIndex + 1 | 0;
              var endIndex_0 = internalLastIndex + 1 | 0;
              arrayCopy(this_3, destination_2, internalIndex, startIndex_1, endIndex_0);
            } else {
              var this_4 = this.o6_1;
              var destination_3 = this.o6_1;
              var startIndex_2 = internalIndex + 1 | 0;
              var endIndex_1 = this.o6_1.length;
              arrayCopy(this_4, destination_3, internalIndex, startIndex_2, endIndex_1);
              this.o6_1[this.o6_1.length - 1 | 0] = this.o6_1[0];
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
        protoOf(ArrayDeque).x6 = function() {
          if (!this.p()) {
            registerModification_0(this);
            var index = this.p6_1;
            var tail = positiveMod(this, this.n6_1 + index | 0);
            nullifyNonEmpty(this, this.n6_1, tail);
          }
          this.n6_1 = 0;
          this.p6_1 = 0;
        };
        protoOf(ArrayDeque).y6 = function(array) {
          var tmp = array.length >= this.p6_1 ? array : arrayOfNulls(array, this.p6_1);
          var dest = isArray(tmp) ? tmp : THROW_CCE();
          var index = this.p6_1;
          var tail = positiveMod(this, this.n6_1 + index | 0);
          if (this.n6_1 < tail) {
            var this_0 = this.o6_1;
            var startIndex = this.n6_1;
            arrayCopy(this_0, dest, 0, startIndex, tail);
          } else {
            if (!this.p()) {
              var this_1 = this.o6_1;
              var startIndex_0 = this.n6_1;
              var endIndex = this.o6_1.length;
              arrayCopy(this_1, dest, 0, startIndex_0, endIndex);
              var this_2 = this.o6_1;
              var destinationOffset = this.o6_1.length - this.n6_1 | 0;
              arrayCopy(this_2, dest, destinationOffset, 0, tail);
            }
          }
          var tmp_0 = terminateCollectionToArray(this.p6_1, dest);
          return isArray(tmp_0) ? tmp_0 : THROW_CCE();
        };
        protoOf(ArrayDeque).x2 = function() {
          var size = this.p6_1;
          var tmp$ret$0 = fillArrayVal(Array(size), null);
          return this.y6(tmp$ret$0);
        };
        protoOf(ArrayDeque).toArray = function() {
          return this.x2();
        };
        function ArrayDeque() {
          Companion_getInstance_5();
          this.n6_1 = 0;
          this.p6_1 = 0;
        }
        function collectionToArrayCommonImpl(collection) {
          if (collection.p()) {
            return [];
          }
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
        protoOf(EmptyList).equals = function(other) {
          var tmp;
          if (!(other == null) ? isInterface(other, KtList) : false) {
            tmp = other.p();
          } else {
            tmp = false;
          }
          return tmp;
        };
        protoOf(EmptyList).hashCode = function() {
          return 1;
        };
        protoOf(EmptyList).toString = function() {
          return "[]";
        };
        protoOf(EmptyList).j = function() {
          return 0;
        };
        protoOf(EmptyList).p = function() {
          return true;
        };
        protoOf(EmptyList).a7 = function(element) {
          return false;
        };
        protoOf(EmptyList).q = function(element) {
          if (true)
            return false;
          var tmp;
          if (false) {
            tmp = element;
          } else {
            tmp = THROW_CCE();
          }
          return this.a7(tmp);
        };
        protoOf(EmptyList).b7 = function(elements) {
          return elements.p();
        };
        protoOf(EmptyList).r = function(elements) {
          return this.b7(elements);
        };
        protoOf(EmptyList).o = function(index) {
          throw IndexOutOfBoundsException_init_$Create$_0("Empty list doesn't contain element at index " + index + ".");
        };
        protoOf(EmptyList).c7 = function(element) {
          return -1;
        };
        protoOf(EmptyList).s = function(element) {
          if (true)
            return -1;
          var tmp;
          if (false) {
            tmp = element;
          } else {
            tmp = THROW_CCE();
          }
          return this.c7(tmp);
        };
        protoOf(EmptyList).g = function() {
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
        protoOf(EmptyIterator).h = function() {
          return false;
        };
        protoOf(EmptyIterator).i = function() {
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
          throw ArithmeticException_init_$Create$_0("Index overflow has happened.");
        }
        function ArrayAsCollection(values, isVarargs) {
          this.d7_1 = values;
          this.e7_1 = isVarargs;
        }
        protoOf(ArrayAsCollection).j = function() {
          return this.d7_1.length;
        };
        protoOf(ArrayAsCollection).p = function() {
          return this.d7_1.length === 0;
        };
        protoOf(ArrayAsCollection).f7 = function(element) {
          return contains(this.d7_1, element);
        };
        protoOf(ArrayAsCollection).g7 = function(elements) {
          var tmp$ret$0;
          $l$block_0: {
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
              if (!this.f7(element)) {
                tmp$ret$0 = false;
                break $l$block_0;
              }
            }
            tmp$ret$0 = true;
          }
          return tmp$ret$0;
        };
        protoOf(ArrayAsCollection).r = function(elements) {
          return this.g7(elements);
        };
        protoOf(ArrayAsCollection).g = function() {
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
        protoOf(EmptyMap).equals = function(other) {
          var tmp;
          if (!(other == null) ? isInterface(other, KtMap) : false) {
            tmp = other.p();
          } else {
            tmp = false;
          }
          return tmp;
        };
        protoOf(EmptyMap).hashCode = function() {
          return 0;
        };
        protoOf(EmptyMap).toString = function() {
          return "{}";
        };
        protoOf(EmptyMap).j = function() {
          return 0;
        };
        protoOf(EmptyMap).p = function() {
          return true;
        };
        protoOf(EmptyMap).i7 = function(key) {
          return false;
        };
        protoOf(EmptyMap).v = function(key) {
          if (!(key == null ? true : !(key == null)))
            return false;
          return this.i7((key == null ? true : !(key == null)) ? key : THROW_CCE());
        };
        protoOf(EmptyMap).j7 = function(key) {
          return null;
        };
        protoOf(EmptyMap).w = function(key) {
          if (!(key == null ? true : !(key == null)))
            return null;
          return this.j7((key == null ? true : !(key == null)) ? key : THROW_CCE());
        };
        protoOf(EmptyMap).x = function() {
          return EmptySet_getInstance();
        };
        var EmptyMap_instance;
        function EmptyMap_getInstance() {
          if (EmptyMap_instance == null)
            new EmptyMap();
          return EmptyMap_instance;
        }
        function toMap(_this__u8e3s4, destination) {
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
          var this_0 = HashMap_init_$Create$_0(mapCapacity(pairs.length));
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
        protoOf(EmptySet).equals = function(other) {
          var tmp;
          if (!(other == null) ? isInterface(other, KtSet) : false) {
            tmp = other.p();
          } else {
            tmp = false;
          }
          return tmp;
        };
        protoOf(EmptySet).hashCode = function() {
          return 0;
        };
        protoOf(EmptySet).toString = function() {
          return "[]";
        };
        protoOf(EmptySet).j = function() {
          return 0;
        };
        protoOf(EmptySet).p = function() {
          return true;
        };
        protoOf(EmptySet).b7 = function(elements) {
          return elements.p();
        };
        protoOf(EmptySet).r = function(elements) {
          return this.b7(elements);
        };
        protoOf(EmptySet).g = function() {
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
            var tmp$ret$2 = toString(thisUpper).toLowerCase();
            var tmp_0 = charSequenceGet(tmp$ret$2, 0);
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
          var isNegative2;
          var limit;
          var firstChar = charSequenceGet(_this__u8e3s4, 0);
          if (Char__compareTo_impl_ypi4mb(firstChar, _Char___init__impl__6a9atx(48)) < 0) {
            if (length === 1)
              return null;
            start = 1;
            if (firstChar === _Char___init__impl__6a9atx(45)) {
              isNegative2 = true;
              limit = -2147483648;
            } else if (firstChar === _Char___init__impl__6a9atx(43)) {
              isNegative2 = false;
              limit = -2147483647;
            } else
              return null;
          } else {
            start = 0;
            isNegative2 = false;
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
            } while (inductionVariable < length);
          return isNegative2 ? result : -result | 0;
        }
        function numberFormatError(input) {
          throw NumberFormatException_init_$Create$_0("Invalid number format: '" + input + "'");
        }
        function isBlank(_this__u8e3s4) {
          var tmp$ret$1;
          $l$block: {
            var inductionVariable = 0;
            while (inductionVariable < charSequenceLength(_this__u8e3s4)) {
              var element = charSequenceGet(_this__u8e3s4, inductionVariable);
              inductionVariable = inductionVariable + 1 | 0;
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
        protoOf(UnsafeLazyImpl).u = function() {
          if (this.r7_1 === UNINITIALIZED_VALUE_instance) {
            this.r7_1 = ensureNotNull(this.q7_1)();
            this.q7_1 = null;
          }
          var tmp = this.r7_1;
          return (tmp == null ? true : !(tmp == null)) ? tmp : THROW_CCE();
        };
        protoOf(UnsafeLazyImpl).s7 = function() {
          return !(this.r7_1 === UNINITIALIZED_VALUE_instance);
        };
        protoOf(UnsafeLazyImpl).toString = function() {
          return this.s7() ? toString_0(this.u()) : "Lazy value not initialized yet.";
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
        protoOf(Pair).toString = function() {
          return "(" + toString_0(this.k7_1) + ", " + toString_0(this.l7_1) + ")";
        };
        protoOf(Pair).m7 = function() {
          return this.k7_1;
        };
        protoOf(Pair).n7 = function() {
          return this.l7_1;
        };
        protoOf(Pair).hashCode = function() {
          var result = this.k7_1 == null ? 0 : hashCode(this.k7_1);
          result = imul(result, 31) + (this.l7_1 == null ? 0 : hashCode(this.l7_1)) | 0;
          return result;
        };
        protoOf(Pair).equals = function(other) {
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
        protoOf(InternalHashMap).l3 = containsAllEntries;
        Unit_instance = new Unit();
        _stableSortingIsSupported = null;
        Companion_instance_1 = new Companion_1();
        Companion_instance_2 = new Companion_2();
        Companion_instance_3 = new Companion_3();
        Companion_instance_4 = new Companion_4();
        EmptyIterator_instance = new EmptyIterator();
        UNINITIALIZED_VALUE_instance = new UNINITIALIZED_VALUE();
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
        return _;
      })(module.exports);
    }
  });

  // lastikadi-game-runtime-interface/dist/portable-rule-proof-runtime-core.js
  var require_portable_rule_proof_runtime_core = __commonJS({
    "lastikadi-game-runtime-interface/dist/portable-rule-proof-runtime-core.js"(exports, module) {
      (function(_, kotlin_kotlin) {
        "use strict";
        var imul = Math.imul;
        var noWhenBranchMatchedException = kotlin_kotlin.$_$.n2;
        var _Char___init__impl__6a9atx = kotlin_kotlin.$_$.n;
        var Unit_instance = kotlin_kotlin.$_$.p;
        var checkIndexOverflow = kotlin_kotlin.$_$.u;
        var equals = kotlin_kotlin.$_$.m1;
        var charSequenceGet = kotlin_kotlin.$_$.k1;
        var Char__toInt_impl_vasixd = kotlin_kotlin.$_$.o;
        var toLong = kotlin_kotlin.$_$.y1;
        var protoOf = kotlin_kotlin.$_$.x1;
        var FunctionAdapter = kotlin_kotlin.$_$.j1;
        var isInterface = kotlin_kotlin.$_$.u1;
        var Comparator = kotlin_kotlin.$_$.h2;
        var hashCode = kotlin_kotlin.$_$.q1;
        var initMetadataForClass = kotlin_kotlin.$_$.r1;
        var VOID = kotlin_kotlin.$_$.b;
        var toString = kotlin_kotlin.$_$.o2;
        var compareValues = kotlin_kotlin.$_$.i1;
        var collectionSizeOrDefault = kotlin_kotlin.$_$.v;
        var ArrayList_init_$Create$ = kotlin_kotlin.$_$.d;
        var to = kotlin_kotlin.$_$.p2;
        var getKClassFromExpression = kotlin_kotlin.$_$.a;
        var toString_0 = kotlin_kotlin.$_$.z1;
        var IllegalStateException_init_$Create$ = kotlin_kotlin.$_$.m;
        var sortedWith = kotlin_kotlin.$_$.f1;
        var KtMap = kotlin_kotlin.$_$.s;
        var KtList = kotlin_kotlin.$_$.r;
        var Long = kotlin_kotlin.$_$.j2;
        var StringBuilder_init_$Create$ = kotlin_kotlin.$_$.k;
        var ArrayList_init_$Create$_0 = kotlin_kotlin.$_$.e;
        var toCharArray = kotlin_kotlin.$_$.d2;
        var StringBuilder_init_$Create$_0 = kotlin_kotlin.$_$.j;
        var initMetadataForObject = kotlin_kotlin.$_$.s1;
        var getBooleanHashCode = kotlin_kotlin.$_$.n1;
        var THROW_CCE = kotlin_kotlin.$_$.k2;
        var getStringHashCode = kotlin_kotlin.$_$.p1;
        var listOf = kotlin_kotlin.$_$.a1;
        initMetadataForClass(sam$kotlin_Comparator$0, "sam$kotlin_Comparator$0", VOID, VOID, [Comparator, FunctionAdapter]);
        initMetadataForObject(Canon, "Canon");
        initMetadataForClass(Jv, "Jv");
        initMetadataForObject(Null, "Null", VOID, Jv);
        initMetadataForClass(Bool, "Bool", VOID, Jv);
        initMetadataForClass(Num, "Num", VOID, Jv);
        initMetadataForClass(Str, "Str", VOID, Jv);
        initMetadataForClass(Arr, "Arr", VOID, Jv);
        initMetadataForClass(Obj, "Obj", VOID, Jv);
        initMetadataForClass(XorShift32, "XorShift32");
        initMetadataForClass(CommandSpec, "CommandSpec");
        initMetadataForObject(V1, "V1");
        function write($this, j, sb) {
          if (equals(j, Null_getInstance()))
            sb.x4("null");
          else {
            if (j instanceof Bool)
              sb.x4(j.x7_1 ? "true" : "false");
            else {
              if (j instanceof Num)
                sb.x4(j.w7_1.toString());
              else {
                if (j instanceof Str) {
                  sb.y4(_Char___init__impl__6a9atx(34));
                  appendEscaped($this, j.v7_1, sb);
                  sb.y4(_Char___init__impl__6a9atx(34));
                } else {
                  if (j instanceof Arr) {
                    sb.y4(_Char___init__impl__6a9atx(91));
                    var index = 0;
                    var tmp0_iterator = j.u7_1.g();
                    while (tmp0_iterator.h()) {
                      var item = tmp0_iterator.i();
                      var tmp1 = index;
                      index = tmp1 + 1 | 0;
                      if (checkIndexOverflow(tmp1) > 0) {
                        sb.y4(_Char___init__impl__6a9atx(44));
                      }
                      write(Canon_instance, item, sb);
                    }
                    sb.y4(_Char___init__impl__6a9atx(93));
                  } else {
                    if (j instanceof Obj) {
                      sb.y4(_Char___init__impl__6a9atx(123));
                      var index_0 = 0;
                      var tmp0_iterator_0 = j.t7_1.g();
                      while (tmp0_iterator_0.h()) {
                        var item_0 = tmp0_iterator_0.i();
                        var tmp1_0 = index_0;
                        index_0 = tmp1_0 + 1 | 0;
                        if (checkIndexOverflow(tmp1_0) > 0) {
                          sb.y4(_Char___init__impl__6a9atx(44));
                        }
                        sb.y4(_Char___init__impl__6a9atx(34));
                        appendEscaped(Canon_instance, item_0.k7_1, sb);
                        sb.y4(_Char___init__impl__6a9atx(34));
                        sb.y4(_Char___init__impl__6a9atx(58));
                        write(Canon_instance, item_0.l7_1, sb);
                      }
                      sb.y4(_Char___init__impl__6a9atx(125));
                    } else {
                      noWhenBranchMatchedException();
                    }
                  }
                }
              }
            }
          }
        }
        function appendEscaped($this, s, sb) {
          var inductionVariable = 0;
          var last = s.length;
          while (inductionVariable < last) {
            var c = charSequenceGet(s, inductionVariable);
            inductionVariable = inductionVariable + 1 | 0;
            if (c === _Char___init__impl__6a9atx(34))
              sb.x4('\\"');
            else if (c === _Char___init__impl__6a9atx(92))
              sb.x4("\\\\");
            else if (c === _Char___init__impl__6a9atx(10))
              sb.x4("\\n");
            else if (c === _Char___init__impl__6a9atx(13))
              sb.x4("\\r");
            else if (c === _Char___init__impl__6a9atx(9))
              sb.x4("\\t");
            else if (c === _Char___init__impl__6a9atx(8))
              sb.x4("\\b");
            else if (c === _Char___init__impl__6a9atx(12))
              sb.x4("\\f");
            else {
              if (Char__toInt_impl_vasixd(c) < 32) {
                var tmp = sb.x4("\\u");
                var tmp$ret$1 = Char__toInt_impl_vasixd(c);
                tmp.x4($this.z7(toLong(tmp$ret$1), 4));
              } else {
                sb.y4(c);
              }
            }
          }
        }
        function sam$kotlin_Comparator$0(function_0) {
          this.a8_1 = function_0;
        }
        protoOf(sam$kotlin_Comparator$0).k6 = function(a, b) {
          return this.a8_1(a, b);
        };
        protoOf(sam$kotlin_Comparator$0).compare = function(a, b) {
          return this.k6(a, b);
        };
        protoOf(sam$kotlin_Comparator$0).r1 = function() {
          return this.a8_1;
        };
        protoOf(sam$kotlin_Comparator$0).equals = function(other) {
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
        protoOf(sam$kotlin_Comparator$0).hashCode = function() {
          return hashCode(this.r1());
        };
        function Canon$jv$lambda(a, b) {
          var tmp = toString(a.t());
          var tmp$ret$1 = toString(b.t());
          return compareValues(tmp, tmp$ret$1);
        }
        function Canon() {
          this.y7_1 = "0123456789abcdef";
        }
        protoOf(Canon).b8 = function(order) {
          var destination = ArrayList_init_$Create$(collectionSizeOrDefault(order, 10));
          var tmp0_iterator = order.g();
          while (tmp0_iterator.h()) {
            var item = tmp0_iterator.i();
            var k = item.m7();
            var v = item.n7();
            var tmp$ret$0 = to(k, Canon_instance.c8(v));
            destination.e(tmp$ret$0);
          }
          return new Obj(destination);
        };
        protoOf(Canon).c8 = function(value) {
          var tmp;
          if (value == null) {
            tmp = Null_getInstance();
          } else {
            if (!(value == null) ? typeof value === "boolean" : false) {
              tmp = new Bool(value);
            } else {
              if (!(value == null) ? typeof value === "number" : false) {
                tmp = new Num(toLong(value));
              } else {
                if (value instanceof Long) {
                  tmp = new Num(value);
                } else {
                  if (!(value == null) ? typeof value === "string" : false) {
                    tmp = new Str(value);
                  } else {
                    if (value instanceof Jv) {
                      tmp = value;
                    } else {
                      if (!(value == null) ? isInterface(value, KtList) : false) {
                        var destination = ArrayList_init_$Create$(collectionSizeOrDefault(value, 10));
                        var tmp0_iterator = value.g();
                        while (tmp0_iterator.h()) {
                          var item = tmp0_iterator.i();
                          var tmp$ret$0 = Canon_instance.c8(item);
                          destination.e(tmp$ret$0);
                        }
                        tmp = new Arr(destination);
                      } else {
                        if (!(value == null) ? isInterface(value, KtMap) : false) {
                          var this_0 = value.x();
                          var tmp_0 = Canon$jv$lambda;
                          var tmp$ret$3 = new sam$kotlin_Comparator$0(tmp_0);
                          var this_1 = sortedWith(this_0, tmp$ret$3);
                          var destination_0 = ArrayList_init_$Create$(collectionSizeOrDefault(this_1, 10));
                          var tmp0_iterator_0 = this_1.g();
                          while (tmp0_iterator_0.h()) {
                            var item_0 = tmp0_iterator_0.i();
                            var tmp$ret$5 = to(toString(item_0.t()), Canon_instance.c8(item_0.u()));
                            destination_0.e(tmp$ret$5);
                          }
                          tmp = new Obj(destination_0);
                        } else {
                          var tmp1_elvis_lhs = getKClassFromExpression(value).f5();
                          var message = "cannot canonicalize " + (tmp1_elvis_lhs == null ? "?" : tmp1_elvis_lhs);
                          throw IllegalStateException_init_$Create$(toString_0(message));
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          return tmp;
        };
        protoOf(Canon).d8 = function(j) {
          var sb = StringBuilder_init_$Create$();
          write(this, j, sb);
          return sb.toString();
        };
        protoOf(Canon).e8 = function(s) {
          var out = ArrayList_init_$Create$_0();
          var i = 0;
          var chars = toCharArray(s);
          while (i < chars.length) {
            var this_0 = chars[i];
            var c = Char__toInt_impl_vasixd(this_0);
            if (c < 128) {
              out.e(c);
              i = i + 1 | 0;
            } else if (c < 2048) {
              out.e(192 | c >> 6);
              out.e(128 | c & 63);
              i = i + 1 | 0;
            } else {
              var tmp;
              if ((55296 <= c ? c <= 56319 : false) && (i + 1 | 0) < chars.length) {
                var this_1 = chars[i + 1 | 0];
                var containsArg = Char__toInt_impl_vasixd(this_1);
                tmp = 56320 <= containsArg ? containsArg <= 57343 : false;
              } else {
                tmp = false;
              }
              if (tmp) {
                var this_2 = chars[i + 1 | 0];
                var lo = Char__toInt_impl_vasixd(this_2);
                var cp = (65536 + ((c - 55296 | 0) << 10) | 0) + (lo - 56320 | 0) | 0;
                out.e(240 | cp >> 18);
                out.e(128 | cp >> 12 & 63);
                out.e(128 | cp >> 6 & 63);
                out.e(128 | cp & 63);
                i = i + 2 | 0;
              } else {
                out.e(224 | c >> 12);
                out.e(128 | c >> 6 & 63);
                out.e(128 | c & 63);
                i = i + 1 | 0;
              }
            }
          }
          return out;
        };
        protoOf(Canon).f8 = function(bytes) {
          var h = new Long(-2128831035, 0);
          var _iterator__ex2g4s = bytes.g();
          while (_iterator__ex2g4s.h()) {
            var b = _iterator__ex2g4s.i();
            h = h.o1(toLong(b).n1(new Long(255, 0)));
            h = h.g1(new Long(16777619, 0)).n1(new Long(-1, 0));
          }
          return h;
        };
        protoOf(Canon).g8 = function(text) {
          return this.f8(this.e8(text));
        };
        protoOf(Canon).z7 = function(v, digits) {
          var sb = StringBuilder_init_$Create$_0(digits);
          var inductionVariable = digits - 1 | 0;
          if (0 <= inductionVariable)
            do {
              var i = inductionVariable;
              inductionVariable = inductionVariable + -1 | 0;
              sb.y4(charSequenceGet("0123456789abcdef", v.m1(imul(4, i)).n1(new Long(15, 0)).p1()));
            } while (0 <= inductionVariable);
          return sb.toString();
        };
        var Canon_instance;
        function Canon_getInstance() {
          return Canon_instance;
        }
        function Null() {
          Null_instance = this;
          Jv.call(this);
        }
        var Null_instance;
        function Null_getInstance() {
          if (Null_instance == null)
            new Null();
          return Null_instance;
        }
        function Bool(v) {
          Jv.call(this);
          this.x7_1 = v;
        }
        protoOf(Bool).toString = function() {
          return "Bool(v=" + this.x7_1 + ")";
        };
        protoOf(Bool).hashCode = function() {
          return getBooleanHashCode(this.x7_1);
        };
        protoOf(Bool).equals = function(other) {
          if (this === other)
            return true;
          if (!(other instanceof Bool))
            return false;
          var tmp0_other_with_cast = other instanceof Bool ? other : THROW_CCE();
          if (!(this.x7_1 === tmp0_other_with_cast.x7_1))
            return false;
          return true;
        };
        function Num(v) {
          Jv.call(this);
          this.w7_1 = v;
        }
        protoOf(Num).toString = function() {
          return "Num(v=" + this.w7_1.toString() + ")";
        };
        protoOf(Num).hashCode = function() {
          return this.w7_1.hashCode();
        };
        protoOf(Num).equals = function(other) {
          if (this === other)
            return true;
          if (!(other instanceof Num))
            return false;
          var tmp0_other_with_cast = other instanceof Num ? other : THROW_CCE();
          if (!this.w7_1.equals(tmp0_other_with_cast.w7_1))
            return false;
          return true;
        };
        function Str(v) {
          Jv.call(this);
          this.v7_1 = v;
        }
        protoOf(Str).toString = function() {
          return "Str(v=" + this.v7_1 + ")";
        };
        protoOf(Str).hashCode = function() {
          return getStringHashCode(this.v7_1);
        };
        protoOf(Str).equals = function(other) {
          if (this === other)
            return true;
          if (!(other instanceof Str))
            return false;
          var tmp0_other_with_cast = other instanceof Str ? other : THROW_CCE();
          if (!(this.v7_1 === tmp0_other_with_cast.v7_1))
            return false;
          return true;
        };
        function Arr(items) {
          Jv.call(this);
          this.u7_1 = items;
        }
        protoOf(Arr).toString = function() {
          return "Arr(items=" + toString_0(this.u7_1) + ")";
        };
        protoOf(Arr).hashCode = function() {
          return hashCode(this.u7_1);
        };
        protoOf(Arr).equals = function(other) {
          if (this === other)
            return true;
          if (!(other instanceof Arr))
            return false;
          var tmp0_other_with_cast = other instanceof Arr ? other : THROW_CCE();
          if (!equals(this.u7_1, tmp0_other_with_cast.u7_1))
            return false;
          return true;
        };
        function Obj(fields) {
          Jv.call(this);
          this.t7_1 = fields;
        }
        protoOf(Obj).toString = function() {
          return "Obj(fields=" + toString_0(this.t7_1) + ")";
        };
        protoOf(Obj).hashCode = function() {
          return hashCode(this.t7_1);
        };
        protoOf(Obj).equals = function(other) {
          if (this === other)
            return true;
          if (!(other instanceof Obj))
            return false;
          var tmp0_other_with_cast = other instanceof Obj ? other : THROW_CCE();
          if (!equals(this.t7_1, tmp0_other_with_cast.t7_1))
            return false;
          return true;
        };
        function Jv() {
        }
        function XorShift32(seed) {
          this.h8_1 = seed.equals(new Long(0, 0)) ? new Long(1831565813, 0) : seed.n1(new Long(-1, 0));
        }
        protoOf(XorShift32).i = function() {
          var x = this.h8_1;
          x = x.o1(x.l1(13));
          x = x.o1(x.m1(17));
          x = x.o1(x.l1(5));
          this.h8_1 = x.n1(new Long(-1, 0));
          return this.h8_1.n1(new Long(2147483647, 0));
        };
        function CommandSpec(action, actor, tokens, nonce) {
          this.i8_1 = action;
          this.j8_1 = actor;
          this.k8_1 = tokens;
          this.l8_1 = nonce;
        }
        protoOf(CommandSpec).toString = function() {
          return "CommandSpec(action=" + this.i8_1 + ", actor=" + this.j8_1 + ", tokens=" + toString_0(this.k8_1) + ", nonce=" + this.l8_1 + ")";
        };
        protoOf(CommandSpec).hashCode = function() {
          var result = getStringHashCode(this.i8_1);
          result = imul(result, 31) + this.j8_1 | 0;
          result = imul(result, 31) + hashCode(this.k8_1) | 0;
          result = imul(result, 31) + (this.l8_1 == null ? 0 : getStringHashCode(this.l8_1)) | 0;
          return result;
        };
        protoOf(CommandSpec).equals = function(other) {
          if (this === other)
            return true;
          if (!(other instanceof CommandSpec))
            return false;
          var tmp0_other_with_cast = other instanceof CommandSpec ? other : THROW_CCE();
          if (!(this.i8_1 === tmp0_other_with_cast.i8_1))
            return false;
          if (!(this.j8_1 === tmp0_other_with_cast.j8_1))
            return false;
          if (!equals(this.k8_1, tmp0_other_with_cast.k8_1))
            return false;
          if (!(this.l8_1 == tmp0_other_with_cast.l8_1))
            return false;
          return true;
        };
        function V1() {
          this.m8_1 = "state";
          this.n8_1 = "command";
          this.o8_1 = "validation";
          this.p8_1 = "rejection";
          this.q8_1 = "transition";
          this.r8_1 = "domainEvent";
          this.s8_1 = "legalAction";
          this.t8_1 = "projection";
          this.u8_1 = "results";
        }
        protoOf(V1).v8 = function(seat, bindingType, boundId, labels) {
          return Canon_instance.b8(listOf([to("seat", seat), to("bindingType", bindingType), to("boundId", boundId), to("labels", labels)]));
        };
        protoOf(V1).w8 = function(rejectionKind, code, message, violations) {
          var tmp = Canon_instance;
          var tmp_0 = to("kind", "rejection");
          var tmp_1 = to("rejectionKind", rejectionKind);
          var tmp_2 = to("code", code);
          var tmp_3 = to("message", message);
          var destination = ArrayList_init_$Create$(collectionSizeOrDefault(violations, 10));
          var tmp0_iterator = violations.g();
          while (tmp0_iterator.h()) {
            var item = tmp0_iterator.i();
            var p = item.m7();
            var r = item.n7();
            var tmp$ret$0 = Canon_instance.b8(listOf([to("path", p), to("reason", r)]));
            destination.e(tmp$ret$0);
          }
          return tmp.b8(listOf([tmp_0, tmp_1, tmp_2, tmp_3, to("violations", destination)]));
        };
        protoOf(V1).x8 = function(participant, placement, score) {
          return Canon_instance.b8(listOf([to("participant", participant), to("placement", placement), to("score", score)]));
        };
        protoOf(V1).y8 = function(terminal, winnerSeat, placement, summary) {
          return Canon_instance.b8(listOf([to("kind", "results"), to("terminal", terminal), to("winnerSeat", winnerSeat), to("placement", placement), to("summary", summary)]));
        };
        protoOf(V1).z8 = function(accepted, rejection, newState, events, terminal, results) {
          return Canon_instance.b8(listOf([to("kind", "transition"), to("accepted", accepted), to("rejection", rejection), to("newState", newState), to("events", events), to("terminal", terminal), to("results", results)]));
        };
        var V1_instance;
        function V1_getInstance() {
          return V1_instance;
        }
        Canon_instance = new Canon();
        V1_instance = new V1();
        _.$_$ = _.$_$ || {};
        _.$_$.a = Canon_instance;
        _.$_$.b = Null_getInstance;
        _.$_$.c = V1_instance;
        _.$_$.d = CommandSpec;
        _.$_$.e = Arr;
        _.$_$.f = Bool;
        _.$_$.g = Num;
        _.$_$.h = Obj;
        _.$_$.i = Str;
        _.$_$.j = XorShift32;
        return _;
      })(module.exports, require_kotlin_kotlin_stdlib());
    }
  });

  // lastikadi-game-runtime-interface/dist/portable-rule-proof-kadi-runtime-browser.js
  var require_portable_rule_proof_kadi_runtime_browser = __commonJS({
    "lastikadi-game-runtime-interface/dist/portable-rule-proof-kadi-runtime-browser.js"(exports, module) {
      (function(_, kotlin_kotlin, kotlin_portable_rule_proof_runtime_core) {
        "use strict";
        var imul = Math.imul;
        var VOID = kotlin_kotlin.$_$.b;
        var protoOf = kotlin_kotlin.$_$.x1;
        var getBooleanHashCode = kotlin_kotlin.$_$.n1;
        var THROW_CCE = kotlin_kotlin.$_$.k2;
        var initMetadataForClass = kotlin_kotlin.$_$.r1;
        var getStringHashCode = kotlin_kotlin.$_$.p1;
        var ArrayList_init_$Create$ = kotlin_kotlin.$_$.e;
        var collectionSizeOrDefault = kotlin_kotlin.$_$.v;
        var ArrayList_init_$Create$_0 = kotlin_kotlin.$_$.d;
        var Unit_instance = kotlin_kotlin.$_$.p;
        var addAll = kotlin_kotlin.$_$.t;
        var listOf = kotlin_kotlin.$_$.a1;
        var plus = kotlin_kotlin.$_$.e1;
        var lazy = kotlin_kotlin.$_$.m2;
        var toInt = kotlin_kotlin.$_$.f2;
        var initMetadataForObject = kotlin_kotlin.$_$.s1;
        var KProperty1 = kotlin_kotlin.$_$.a2;
        var getPropertyCallableRef = kotlin_kotlin.$_$.o1;
        var toString = kotlin_kotlin.$_$.z1;
        var IllegalStateException_init_$Create$ = kotlin_kotlin.$_$.m;
        var emptyList = kotlin_kotlin.$_$.x;
        var ArrayList_init_$Create$_1 = kotlin_kotlin.$_$.f;
        var Long = kotlin_kotlin.$_$.j2;
        var toLong = kotlin_kotlin.$_$.y1;
        var XorShift32 = kotlin_portable_rule_proof_runtime_core.$_$.j;
        var ArrayDeque_init_$Create$ = kotlin_kotlin.$_$.c;
        var mapCapacity = kotlin_kotlin.$_$.b1;
        var LinkedHashMap_init_$Create$ = kotlin_kotlin.$_$.h;
        var toMutableMap = kotlin_kotlin.$_$.g1;
        var IllegalArgumentException_init_$Create$ = kotlin_kotlin.$_$.l;
        var toSet = kotlin_kotlin.$_$.h1;
        var charSequenceLength = kotlin_kotlin.$_$.l1;
        var Canon_instance = kotlin_portable_rule_proof_runtime_core.$_$.a;
        var ensureNotNull = kotlin_kotlin.$_$.l2;
        var equals = kotlin_kotlin.$_$.m1;
        var isBlank = kotlin_kotlin.$_$.c2;
        var LinkedHashMap_init_$Create$_0 = kotlin_kotlin.$_$.i;
        var Collection = kotlin_kotlin.$_$.q;
        var isInterface = kotlin_kotlin.$_$.u1;
        var to = kotlin_kotlin.$_$.p2;
        var toString_0 = kotlin_kotlin.$_$.o2;
        var hashCode = kotlin_kotlin.$_$.q1;
        var isCharSequence = kotlin_kotlin.$_$.t1;
        var trim = kotlin_kotlin.$_$.g2;
        var emptyMap = kotlin_kotlin.$_$.y;
        var V1_instance = kotlin_portable_rule_proof_runtime_core.$_$.c;
        var IllegalArgumentException = kotlin_kotlin.$_$.i2;
        var listOf_0 = kotlin_kotlin.$_$.z;
        var mapOf = kotlin_kotlin.$_$.c1;
        var Null_getInstance = kotlin_portable_rule_proof_runtime_core.$_$.b;
        var Bool = kotlin_portable_rule_proof_runtime_core.$_$.f;
        var numberToLong = kotlin_kotlin.$_$.w1;
        var Num = kotlin_portable_rule_proof_runtime_core.$_$.g;
        var Str = kotlin_portable_rule_proof_runtime_core.$_$.i;
        var Arr = kotlin_portable_rule_proof_runtime_core.$_$.e;
        var Obj = kotlin_portable_rule_proof_runtime_core.$_$.h;
        var mapOf_0 = kotlin_kotlin.$_$.d1;
        var toIntOrNull = kotlin_kotlin.$_$.e2;
        var numberToInt = kotlin_kotlin.$_$.v1;
        var equals_0 = kotlin_kotlin.$_$.b2;
        var HashMap_init_$Create$ = kotlin_kotlin.$_$.g;
        var CommandSpec = kotlin_portable_rule_proof_runtime_core.$_$.d;
        var copyToArray = kotlin_kotlin.$_$.w;
        initMetadataForClass(CardSpecialty, "CardSpecialty", CardSpecialty);
        initMetadataForClass(Card, "Card");
        initMetadataForObject(CardCatalog, "CardCatalog");
        initMetadataForClass(KadiGameState, "KadiGameState");
        initMetadataForObject(CardJv, "CardJv");
        initMetadataForClass(FixtureState, "FixtureState");
        initMetadataForObject(KadiRules, "KadiRules");
        initMetadataForObject(KadiModule, "KadiModule");
        initMetadataForClass(KadiBoundGame, "KadiBoundGame");
        initMetadataForObject(JsJson, "JsJson");
        initMetadataForClass(KadiRuntimeJs, "KadiRuntimeJs");
        function CardSpecialty(special, cardChanger, rotateGame, penalise, topAnyCard, stopPlay) {
          special = special === VOID ? false : special;
          cardChanger = cardChanger === VOID ? false : cardChanger;
          rotateGame = rotateGame === VOID ? false : rotateGame;
          penalise = penalise === VOID ? false : penalise;
          topAnyCard = topAnyCard === VOID ? false : topAnyCard;
          stopPlay = stopPlay === VOID ? false : stopPlay;
          this.a9_1 = special;
          this.b9_1 = cardChanger;
          this.c9_1 = rotateGame;
          this.d9_1 = penalise;
          this.e9_1 = topAnyCard;
          this.f9_1 = stopPlay;
        }
        protoOf(CardSpecialty).toString = function() {
          return "CardSpecialty(special=" + this.a9_1 + ", cardChanger=" + this.b9_1 + ", rotateGame=" + this.c9_1 + ", penalise=" + this.d9_1 + ", topAnyCard=" + this.e9_1 + ", stopPlay=" + this.f9_1 + ")";
        };
        protoOf(CardSpecialty).hashCode = function() {
          var result = getBooleanHashCode(this.a9_1);
          result = imul(result, 31) + getBooleanHashCode(this.b9_1) | 0;
          result = imul(result, 31) + getBooleanHashCode(this.c9_1) | 0;
          result = imul(result, 31) + getBooleanHashCode(this.d9_1) | 0;
          result = imul(result, 31) + getBooleanHashCode(this.e9_1) | 0;
          result = imul(result, 31) + getBooleanHashCode(this.f9_1) | 0;
          return result;
        };
        protoOf(CardSpecialty).equals = function(other) {
          if (this === other)
            return true;
          if (!(other instanceof CardSpecialty))
            return false;
          var tmp0_other_with_cast = other instanceof CardSpecialty ? other : THROW_CCE();
          if (!(this.a9_1 === tmp0_other_with_cast.a9_1))
            return false;
          if (!(this.b9_1 === tmp0_other_with_cast.b9_1))
            return false;
          if (!(this.c9_1 === tmp0_other_with_cast.c9_1))
            return false;
          if (!(this.d9_1 === tmp0_other_with_cast.d9_1))
            return false;
          if (!(this.e9_1 === tmp0_other_with_cast.e9_1))
            return false;
          if (!(this.f9_1 === tmp0_other_with_cast.f9_1))
            return false;
          return true;
        };
        function Card(value, family, symbol, cardName, reversed, special) {
          reversed = reversed === VOID ? false : reversed;
          special = special === VOID ? new CardSpecialty() : special;
          this.g9_1 = value;
          this.h9_1 = family;
          this.i9_1 = symbol;
          this.j9_1 = cardName;
          this.k9_1 = reversed;
          this.l9_1 = special;
        }
        protoOf(Card).toString = function() {
          return "Card(value=" + this.g9_1 + ", family=" + this.h9_1 + ", symbol=" + this.i9_1 + ", cardName=" + this.j9_1 + ", reversed=" + this.k9_1 + ", special=" + this.l9_1.toString() + ")";
        };
        protoOf(Card).hashCode = function() {
          var result = this.g9_1;
          result = imul(result, 31) + getStringHashCode(this.h9_1) | 0;
          result = imul(result, 31) + getStringHashCode(this.i9_1) | 0;
          result = imul(result, 31) + getStringHashCode(this.j9_1) | 0;
          result = imul(result, 31) + getBooleanHashCode(this.k9_1) | 0;
          result = imul(result, 31) + this.l9_1.hashCode() | 0;
          return result;
        };
        protoOf(Card).equals = function(other) {
          if (this === other)
            return true;
          if (!(other instanceof Card))
            return false;
          var tmp0_other_with_cast = other instanceof Card ? other : THROW_CCE();
          if (!(this.g9_1 === tmp0_other_with_cast.g9_1))
            return false;
          if (!(this.h9_1 === tmp0_other_with_cast.h9_1))
            return false;
          if (!(this.i9_1 === tmp0_other_with_cast.i9_1))
            return false;
          if (!(this.j9_1 === tmp0_other_with_cast.j9_1))
            return false;
          if (!(this.k9_1 === tmp0_other_with_cast.k9_1))
            return false;
          if (!this.l9_1.equals(tmp0_other_with_cast.l9_1))
            return false;
          return true;
        };
        function CardCatalog$deck$delegate$lambda() {
          var this_0 = CardCatalog_getInstance().m9_1;
          var destination = ArrayList_init_$Create$();
          var tmp0_iterator = this_0.g();
          while (tmp0_iterator.h()) {
            var element = tmp0_iterator.i();
            var this_1 = CardCatalog_getInstance().n9_1;
            var destination_0 = ArrayList_init_$Create$_0(collectionSizeOrDefault(this_1, 10));
            var tmp0_iterator_0 = this_1.g();
            while (tmp0_iterator_0.h()) {
              var item = tmp0_iterator_0.i();
              var tmp$ret$0 = CardCatalog_getInstance().p9(element, item);
              destination_0.e(tmp$ret$0);
            }
            var list = destination_0;
            addAll(destination, list);
          }
          return plus(destination, listOf([CardCatalog_getInstance().q9("Joker1"), CardCatalog_getInstance().q9("Joker2")]));
        }
        function CardCatalog() {
          CardCatalog_instance = this;
          this.m9_1 = listOf(["Heart", "Kisu", "Mavi", "Spade"]);
          this.n9_1 = listOf(["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]);
          var tmp = this;
          tmp.o9_1 = lazy(CardCatalog$deck$delegate$lambda);
        }
        protoOf(CardCatalog).r9 = function(symbol) {
          switch (symbol) {
            case "A":
              return 1;
            case "J":
              return 25;
            case "Q":
            case "K":
              return 2;
            default:
              return toInt(symbol);
          }
        };
        protoOf(CardCatalog).s9 = function(symbol) {
          var special = false;
          var cardChanger = false;
          var rotateGame = false;
          var penalise = false;
          var topAnyCard = false;
          var stopPlay = false;
          switch (symbol) {
            case "2":
              special = true;
              penalise = true;
              break;
            case "7":
              special = true;
              stopPlay = true;
              break;
            case "8":
              special = true;
              rotateGame = true;
              break;
            case "J":
              special = true;
              cardChanger = true;
              topAnyCard = true;
              break;
          }
          return new CardSpecialty(special, cardChanger, rotateGame, penalise, topAnyCard, stopPlay);
        };
        protoOf(CardCatalog).p9 = function(family, symbol) {
          return new Card(this.r9(symbol), family, symbol, family + "_" + symbol, false, this.s9(symbol));
        };
        protoOf(CardCatalog).q9 = function(name) {
          return new Card(5, "Joker", "Joker", name, false, new CardSpecialty(true, false, false, true, true, false));
        };
        protoOf(CardCatalog).t9 = function() {
          var this_0 = this.o9_1;
          deck$factory();
          return this_0.u();
        };
        protoOf(CardCatalog).u9 = function(name) {
          var tmp$ret$1;
          $l$block: {
            var tmp0_iterator = this.t9().g();
            while (tmp0_iterator.h()) {
              var element = tmp0_iterator.i();
              if (element.j9_1 === name) {
                tmp$ret$1 = element;
                break $l$block;
              }
            }
            tmp$ret$1 = null;
          }
          return tmp$ret$1;
        };
        var CardCatalog_instance;
        function CardCatalog_getInstance() {
          if (CardCatalog_instance == null)
            new CardCatalog();
          return CardCatalog_instance;
        }
        function deck$factory() {
          return getPropertyCallableRef("deck", 1, KProperty1, function(receiver) {
            return receiver.t9();
          }, null);
        }
        function penaltyTarget($this) {
          return !($this.ea_1 === 0) ? $this.ea_1 : $this.na($this.x9_1);
        }
        function hasBlockingCard($this, cardName, hand) {
          return KadiRules_instance.oa(cardName, stateHolder($this), hand);
        }
        function stateHolder($this) {
          var tmp = $this.x9_1;
          var tmp_0 = $this.ga_1;
          var tmp0_elvis_lhs = $this.ka_1.s6();
          var tmp_1;
          if (tmp0_elvis_lhs == null) {
            var message = "empty pile";
            throw IllegalStateException_init_$Create$(toString(message));
          } else {
            tmp_1 = tmp0_elvis_lhs;
          }
          var tmp_2 = tmp_1;
          var tmp_3 = $this.la_1;
          var tmp1_elvis_lhs = $this.ma_1.w($this.x9_1);
          return new FixtureState($this.ha_1, tmp, tmp_0, tmp_2, tmp_3, tmp1_elvis_lhs == null ? emptyList() : tmp1_elvis_lhs, $this.ba_1, $this.aa_1, $this.ca_1, $this.y9_1, $this.z9_1, $this.ea_1, $this.fa_1);
        }
        function machineRequest($this, hand, played) {
          var _iterator__ex2g4s = hand.g();
          while (_iterator__ex2g4s.h()) {
            var card = _iterator__ex2g4s.i();
            if (!(card === played) && (card.h9_1 === "Heart" || card.h9_1 === "Kisu" || card.h9_1 === "Mavi" || card.h9_1 === "Spade"))
              return card.h9_1;
          }
          return "Free";
        }
        function hasSameValueFollowUp($this, hand, staged) {
          var _iterator__ex2g4s = hand.g();
          while (_iterator__ex2g4s.h()) {
            var card = _iterator__ex2g4s.i();
            if (KadiRules_instance.pa(card, staged))
              return true;
          }
          return false;
        }
        function deterministicShuffle($this, cards) {
          var list = ArrayList_init_$Create$_1(cards);
          var seed = new Long(11135, 0);
          var _iterator__ex2g4s = cards.g();
          while (_iterator__ex2g4s.h()) {
            var c = _iterator__ex2g4s.i();
            var this_0 = seed.g1(toLong(31));
            var other = getStringHashCode(c.j9_1);
            seed = this_0.f1(toLong(other)).n1(new Long(2147483647, 0));
          }
          var rnd = new XorShift32(seed);
          var inductionVariable = list.j() - 1 | 0;
          if (1 <= inductionVariable)
            do {
              var i = inductionVariable;
              inductionVariable = inductionVariable + -1 | 0;
              var j = rnd.i().i1(toLong(i + 1 | 0)).p1();
              var t = list.o(i);
              list.x1(i, list.o(j));
              list.x1(j, t);
            } while (1 <= inductionVariable);
          return list;
        }
        function recyclePlayingPile($this) {
          var top = $this.ka_1.v6();
          var recycled = ArrayList_init_$Create$_1($this.ka_1);
          $this.ka_1.x6();
          $this.ka_1.t6(top);
          var order = deterministicShuffle($this, recycled);
          $this.ja_1.h2(0, order);
        }
        function KadiGameState(gameId, playerIds, machinePlayerIds, drawPile, playingPile, directiveCard, handsInput, started, currentPlayerId, penaltyCount, jokerPenalty, requestedFamily, turnHasPlayed, lastCardAnnounced, direction, blockedPlayerId, blockedCardType, winnerId) {
          this.v9_1 = gameId;
          this.w9_1 = started;
          this.x9_1 = currentPlayerId;
          this.y9_1 = penaltyCount;
          this.z9_1 = jokerPenalty;
          this.aa_1 = requestedFamily;
          this.ba_1 = turnHasPlayed;
          this.ca_1 = lastCardAnnounced;
          this.da_1 = direction;
          this.ea_1 = blockedPlayerId;
          this.fa_1 = blockedCardType;
          this.ga_1 = winnerId;
          this.ha_1 = ArrayList_init_$Create$_1(playerIds);
          this.ia_1 = ArrayList_init_$Create$_1(machinePlayerIds);
          this.ja_1 = ArrayList_init_$Create$_1(drawPile);
          this.ka_1 = ArrayDeque_init_$Create$(ArrayList_init_$Create$_1(playingPile));
          this.la_1 = directiveCard;
          var tmp = this;
          var destination = LinkedHashMap_init_$Create$(mapCapacity(handsInput.j()));
          var tmp0_iterator = handsInput.x().g();
          while (tmp0_iterator.h()) {
            var element = tmp0_iterator.i();
            var tmp_0 = element.t();
            var tmp$ret$1 = ArrayList_init_$Create$_1(element.u());
            destination.p2(tmp_0, tmp$ret$1);
          }
          tmp.ma_1 = toMutableMap(destination);
          if (this.ha_1.j() < 2)
            throw IllegalArgumentException_init_$Create$("A game requires at least two players");
          if (!(toSet(this.ha_1).j() === this.ha_1.j()))
            throw IllegalArgumentException_init_$Create$("Player IDs must be unique");
          if (!toSet(this.ha_1).r(this.ia_1))
            throw IllegalArgumentException_init_$Create$("Machine IDs must be game players");
          var _iterator__ex2g4s = this.ha_1.g();
          while (_iterator__ex2g4s.h()) {
            var pid = _iterator__ex2g4s.i();
            if (!this.ma_1.v(pid)) {
              var this_0 = this.ma_1;
              var value = ArrayList_init_$Create$();
              this_0.p2(pid, value);
            }
          }
        }
        protoOf(KadiGameState).qa = function() {
          return this.ha_1;
        };
        protoOf(KadiGameState).ra = function() {
          return this.ia_1;
        };
        protoOf(KadiGameState).sa = function(playerId) {
          return this.ga_1 === 0 && this.ia_1.q(playerId) && this.x9_1 === playerId;
        };
        protoOf(KadiGameState).ta = function(pid) {
          var tmp0_safe_receiver = this.ma_1.w(pid);
          var tmp;
          if (tmp0_safe_receiver == null) {
            tmp = null;
          } else {
            var destination = ArrayList_init_$Create$_0(collectionSizeOrDefault(tmp0_safe_receiver, 10));
            var tmp0_iterator = tmp0_safe_receiver.g();
            while (tmp0_iterator.h()) {
              var item = tmp0_iterator.i();
              var tmp$ret$0 = item.j9_1;
              destination.e(tmp$ret$0);
            }
            tmp = destination;
          }
          var tmp1_elvis_lhs = tmp;
          return tmp1_elvis_lhs == null ? emptyList() : tmp1_elvis_lhs;
        };
        protoOf(KadiGameState).ua = function(entropy) {
          if (this.w9_1)
            return Unit_instance;
          var pids = this.ha_1;
          var b = ((imul(pids.j(), 6) + 1 | 0) + 53 | 0) / 54 | 0;
          var packs = Math.max(1, b);
          var cards = ArrayList_init_$Create$();
          var inductionVariable = 0;
          if (inductionVariable < packs)
            do {
              var index = inductionVariable;
              inductionVariable = inductionVariable + 1 | 0;
              cards.n(CardCatalog_getInstance().t9());
            } while (inductionVariable < packs);
          var tmp;
          var tmp_0;
          if (entropy == null) {
            tmp_0 = true;
          } else {
            tmp_0 = charSequenceLength(entropy) === 0;
          }
          if (tmp_0) {
            tmp = new Long(24301, 0);
          } else {
            tmp = Canon_instance.g8(entropy);
          }
          var seed = tmp;
          var rnd = new XorShift32(seed);
          var inductionVariable_0 = cards.j() - 1 | 0;
          if (1 <= inductionVariable_0)
            do {
              var i = inductionVariable_0;
              inductionVariable_0 = inductionVariable_0 + -1 | 0;
              var j = rnd.i().i1(toLong(i + 1 | 0)).p1();
              var t = cards.o(i);
              cards.x1(i, cards.o(j));
              cards.x1(j, t);
            } while (1 <= inductionVariable_0);
          this.ja_1.n(cards);
          var inductionVariable_1 = 0;
          if (inductionVariable_1 < 6)
            do {
              var index_0 = inductionVariable_1;
              inductionVariable_1 = inductionVariable_1 + 1 | 0;
              var _iterator__ex2g4s = pids.g();
              while (_iterator__ex2g4s.h()) {
                var pid = _iterator__ex2g4s.i();
                ensureNotNull(this.ma_1.w(pid)).e(this.ja_1.f2(0));
              }
            } while (inductionVariable_1 < 6);
          var top = this.ja_1.f2(0);
          this.ka_1.t6(top);
          this.la_1 = KadiRules_instance.va(top) ? null : top;
          this.aa_1 = KadiRules_instance.va(top) ? "Free" : top.i9_1 === "J" ? "CHOICE" : null;
          this.w9_1 = true;
        };
        protoOf(KadiGameState).wa = function() {
          if (!(this.la_1 == null))
            return this.la_1;
          var _iterator__ex2g4s = this.ka_1.g();
          while (_iterator__ex2g4s.h()) {
            var card = _iterator__ex2g4s.i();
            if (!KadiRules_instance.va(card))
              return card;
          }
          return null;
        };
        protoOf(KadiGameState).xa = function(playerId) {
          if (!this.ha_1.q(playerId))
            throw IllegalArgumentException_init_$Create$("Unknown player");
        };
        protoOf(KadiGameState).na = function(playerId) {
          return KadiRules_instance.ya(this.ha_1, playerId, this.da_1);
        };
        protoOf(KadiGameState).za = function(playerId, cardName) {
          return KadiRules_instance.ab(stateHolder(this), playerId, cardName);
        };
        protoOf(KadiGameState).bb = function(playerId) {
          return KadiRules_instance.cb(stateHolder(this), playerId);
        };
        protoOf(KadiGameState).db = function(playerId, cardName, requestedFamilyArg) {
          this.xa(playerId);
          if (!(this.ga_1 === 0))
            throw IllegalArgumentException_init_$Create$("Game is over");
          if (!(playerId === this.x9_1))
            throw IllegalArgumentException_init_$Create$("It is not this player's turn");
          if (equals("CHOICE", this.aa_1) && (cardName == null || isBlank(cardName))) {
            this.aa_1 = KadiRules_instance.eb(requestedFamilyArg);
            return Unit_instance;
          }
          var hand = ensureNotNull(this.ma_1.w(playerId));
          if (this.ea_1 === playerId && !hasBlockingCard(this, ensureNotNull(cardName), hand)) {
            throw IllegalArgumentException_init_$Create$("This player must pass or play the blocking card");
          }
          var tmp$ret$1;
          $l$block: {
            var tmp0_iterator = hand.g();
            while (tmp0_iterator.h()) {
              var element = tmp0_iterator.i();
              if (element.j9_1 === cardName) {
                tmp$ret$1 = element;
                break $l$block;
              }
            }
            tmp$ret$1 = null;
          }
          var tmp0_elvis_lhs = tmp$ret$1;
          var tmp;
          if (tmp0_elvis_lhs == null) {
            throw IllegalArgumentException_init_$Create$("Card is not in player's hand");
          } else {
            tmp = tmp0_elvis_lhs;
          }
          var card = tmp;
          var continuingChain = this.ba_1;
          var tmp1_elvis_lhs = this.ka_1.s6();
          var tmp_0;
          if (tmp1_elvis_lhs == null) {
            var message = "empty pile";
            throw IllegalStateException_init_$Create$(toString(message));
          } else {
            tmp_0 = tmp1_elvis_lhs;
          }
          var currentTop = tmp_0;
          if (continuingChain && !KadiRules_instance.pa(card, currentTop)) {
            throw IllegalArgumentException_init_$Create$("Continue this play with the same card value");
          }
          if (hand.j() === 1 && !this.ca_1) {
            throw IllegalArgumentException_init_$Create$("Announce your last card before playing it");
          }
          if (hand.j() === 1 && KadiRules_instance.fb(card)) {
            throw IllegalArgumentException_init_$Create$("A special card cannot be the final card");
          }
          if (equals("CHOICE", this.aa_1) && !continuingChain)
            throw IllegalArgumentException_init_$Create$("Choose the opening Jack request first");
          if (!continuingChain && this.z9_1 && !KadiRules_instance.va(card)) {
            throw IllegalArgumentException_init_$Create$("Only a Joker can block a Joker penalty");
          }
          if (!continuingChain && this.y9_1 > 0 && !KadiRules_instance.gb(card) && !KadiRules_instance.va(card)) {
            throw IllegalArgumentException_init_$Create$("A penalty must be cleared with a 2 or Joker");
          }
          if (!continuingChain && !(this.aa_1 == null) && !(this.aa_1 === card.h9_1) && !KadiRules_instance.va(card) && !KadiRules_instance.hb(this.aa_1, card)) {
            throw IllegalArgumentException_init_$Create$("Card does not match the requested family");
          }
          if (continuingChain || this.y9_1 <= 0 || !KadiRules_instance.gb(card) && !KadiRules_instance.va(card)) {
            if (!continuingChain && this.aa_1 == null && !KadiRules_instance.ib(card, stateHolder(this))) {
              throw IllegalArgumentException_init_$Create$("Card cannot be played");
            }
          }
          var secondJoker = KadiRules_instance.va(card) && KadiRules_instance.va(currentTop);
          hand.y1(card);
          this.ka_1.t6(card);
          if (!KadiRules_instance.va(card))
            this.la_1 = card;
          this.ba_1 = true;
          if (hand.j() > 1)
            this.ca_1 = false;
          if (secondJoker) {
            this.y9_1 = 0;
            this.z9_1 = false;
            this.aa_1 = "Free";
          } else if (KadiRules_instance.va(card)) {
            this.y9_1 = this.y9_1 + 5 | 0;
            this.z9_1 = true;
          } else if (KadiRules_instance.gb(card)) {
            this.y9_1 = this.y9_1 + card.g9_1 | 0;
          } else {
            this.y9_1 = 0;
            this.z9_1 = false;
          }
          if (card.l9_1.b9_1) {
            if (!continuingChain)
              this.aa_1 = KadiRules_instance.eb(requestedFamilyArg);
          } else if (!secondJoker) {
            this.aa_1 = null;
          }
          if (KadiRules_instance.kb(card)) {
            this.ea_1 = this.na(playerId);
            this.fa_1 = "7";
          } else if (KadiRules_instance.jb(card)) {
            this.da_1 = imul(this.da_1, -1);
            this.ea_1 = this.na(playerId);
            this.fa_1 = "8";
          }
          this.x9_1 = playerId;
          if (hand.p() && !KadiRules_instance.fb(card) && this.ca_1)
            this.ga_1 = playerId;
          else if (!hand.p() && !hasSameValueFollowUp(this, hand, card)) {
            this.lb(playerId);
          }
        };
        protoOf(KadiGameState).mb = function(playerId) {
          this.xa(playerId);
          if (!(this.ga_1 === 0))
            throw IllegalArgumentException_init_$Create$("Game is over");
          if (!(playerId === this.x9_1))
            throw IllegalArgumentException_init_$Create$("It is not this player's turn");
          if (this.ja_1.p()) {
            recyclePlayingPile(this);
          }
          var servedPenalty = this.y9_1 > 0;
          var hand = ensureNotNull(this.ma_1.w(playerId));
          var b = this.y9_1;
          var cardsToDraw = Math.max(1, b);
          var inductionVariable = 0;
          if (inductionVariable < cardsToDraw)
            $l$loop: do {
              var i = inductionVariable;
              inductionVariable = inductionVariable + 1 | 0;
              if (this.ja_1.p())
                break $l$loop;
              hand.e(this.ja_1.f2(0));
            } while (inductionVariable < cardsToDraw);
          this.y9_1 = 0;
          this.z9_1 = false;
          var directive = this.wa();
          this.aa_1 = servedPenalty && !(directive == null) && equals("J", directive.i9_1) ? "Free" : null;
          this.ba_1 = false;
          this.ea_1 = 0;
          this.fa_1 = null;
          this.x9_1 = this.na(playerId);
        };
        protoOf(KadiGameState).nb = function(playerId) {
          this.xa(playerId);
          if (!(this.ga_1 === 0))
            throw IllegalArgumentException_init_$Create$("Game is over");
          if (!(playerId === this.x9_1) || !(this.ea_1 === playerId)) {
            throw IllegalArgumentException_init_$Create$("Only the blocked player can pass");
          }
          this.ea_1 = 0;
          this.fa_1 = null;
          this.ba_1 = false;
          this.x9_1 = this.na(playerId);
        };
        protoOf(KadiGameState).ob = function(playerId) {
          this.xa(playerId);
          if (!(this.ga_1 === 0))
            throw IllegalArgumentException_init_$Create$("Game is over");
          this.ga_1 = this.na(playerId);
          this.x9_1 = this.ga_1;
          this.ba_1 = false;
          this.ca_1 = false;
          this.ea_1 = 0;
          this.fa_1 = null;
        };
        protoOf(KadiGameState).pb = function(playerId) {
          this.xa(playerId);
          if (!(this.ga_1 === 0))
            throw IllegalArgumentException_init_$Create$("Game is over");
          if (!(playerId === this.x9_1))
            throw IllegalArgumentException_init_$Create$("It is not this player's turn");
          if (!(ensureNotNull(this.ma_1.w(playerId)).j() === 1))
            throw IllegalArgumentException_init_$Create$("Announce only when holding one card");
          this.ca_1 = true;
        };
        protoOf(KadiGameState).lb = function(playerId) {
          this.xa(playerId);
          if (!(playerId === this.x9_1))
            throw IllegalArgumentException_init_$Create$("It is not this player's turn");
          if (!this.ba_1)
            throw IllegalArgumentException_init_$Create$("Play or draw before finishing the turn");
          if (!(this.ga_1 === 0))
            throw IllegalArgumentException_init_$Create$("Game is over");
          this.ba_1 = false;
          this.ca_1 = false;
          this.x9_1 = this.na(playerId);
        };
        protoOf(KadiGameState).qb = function() {
          if (!(this.ga_1 === 0) || !this.ia_1.q(this.x9_1))
            return false;
          var playerId = this.x9_1;
          var hand = ensureNotNull(this.ma_1.w(playerId));
          if (this.ea_1 === playerId) {
            var _iterator__ex2g4s = hand.g();
            while (_iterator__ex2g4s.h()) {
              var card = _iterator__ex2g4s.i();
              if (hasBlockingCard(this, card.j9_1, hand)) {
                this.db(playerId, card.j9_1, null);
                return true;
              }
            }
            this.nb(playerId);
            return true;
          }
          var choice = null;
          var _iterator__ex2g4s_0 = hand.g();
          $l$loop_3: while (_iterator__ex2g4s_0.h()) {
            var card_0 = _iterator__ex2g4s_0.i();
            if (this.z9_1 && !KadiRules_instance.va(card_0))
              continue $l$loop_3;
            if (this.y9_1 > 0 && !KadiRules_instance.gb(card_0) && !KadiRules_instance.va(card_0))
              continue $l$loop_3;
            if (!(this.aa_1 == null) && !(this.aa_1 === card_0.h9_1) && !KadiRules_instance.va(card_0) && !KadiRules_instance.hb(this.aa_1, card_0))
              continue $l$loop_3;
            if (this.y9_1 === 0 && this.aa_1 == null && !KadiRules_instance.ib(card_0, stateHolder(this)))
              continue $l$loop_3;
            if (hand.j() === 1 && KadiRules_instance.fb(card_0))
              continue $l$loop_3;
            choice = card_0;
            break $l$loop_3;
          }
          if (choice == null) {
            this.mb(playerId);
            return true;
          }
          if (hand.j() === 1) {
            this.pb(playerId);
          }
          var family = choice.l9_1.b9_1 ? machineRequest(this, hand, choice) : null;
          this.db(playerId, choice.j9_1, family);
          if (this.ga_1 === 0 && this.x9_1 === playerId && this.ba_1) {
            this.lb(playerId);
          }
          return true;
        };
        protoOf(KadiGameState).rb = function() {
          var values = LinkedHashMap_init_$Create$_0();
          var _iterator__ex2g4s = this.ma_1.x().g();
          while (_iterator__ex2g4s.h()) {
            var _destruct__k2r9zo = _iterator__ex2g4s.i();
            var playerId = _destruct__k2r9zo.t();
            var hand = _destruct__k2r9zo.u();
            var total = 0;
            var _iterator__ex2g4s_0 = hand.g();
            while (_iterator__ex2g4s_0.h()) {
              var card = _iterator__ex2g4s_0.i();
              var tmp = total;
              var b = card.g9_1;
              total = tmp + Math.max(0, b) | 0;
            }
            var value = total;
            values.p2(playerId, value);
          }
          return values;
        };
        protoOf(KadiGameState).sb = function(playerId) {
          var tmp0_safe_receiver = this.ma_1.w(playerId);
          var tmp;
          if (tmp0_safe_receiver == null) {
            tmp = null;
          } else {
            var destination = ArrayList_init_$Create$_0(collectionSizeOrDefault(tmp0_safe_receiver, 10));
            var tmp0_iterator = tmp0_safe_receiver.g();
            while (tmp0_iterator.h()) {
              var item = tmp0_iterator.i();
              var tmp$ret$0 = item.j9_1;
              destination.e(tmp$ret$0);
            }
            tmp = destination;
          }
          var tmp1_elvis_lhs = tmp;
          var hand = tmp1_elvis_lhs == null ? emptyList() : tmp1_elvis_lhs;
          var isPlayerTurn = this.x9_1 === playerId && this.ga_1 === 0;
          var topCard = this.ka_1.s6();
          var tmp_0;
          if (isPlayerTurn && this.ba_1 && this.ea_1 === 0 && !(this.aa_1 === "CHOICE") && !(topCard == null)) {
            var tmp2_safe_receiver = this.ma_1.w(playerId);
            var tmp_1;
            if (tmp2_safe_receiver == null) {
              tmp_1 = null;
            } else {
              var tmp$ret$3;
              $l$block_0: {
                var tmp_2;
                if (isInterface(tmp2_safe_receiver, Collection)) {
                  tmp_2 = tmp2_safe_receiver.p();
                } else {
                  tmp_2 = false;
                }
                if (tmp_2) {
                  tmp$ret$3 = false;
                  break $l$block_0;
                }
                var tmp0_iterator_0 = tmp2_safe_receiver.g();
                while (tmp0_iterator_0.h()) {
                  var element = tmp0_iterator_0.i();
                  if (KadiRules_instance.pa(element, topCard)) {
                    tmp$ret$3 = true;
                    break $l$block_0;
                  }
                }
                tmp$ret$3 = false;
              }
              tmp_1 = tmp$ret$3;
            }
            tmp_0 = tmp_1 === true;
          } else {
            tmp_0 = false;
          }
          var sameValueAvailable = tmp_0;
          var legal = isPlayerTurn ? this.bb(playerId) : emptyList();
          var tmp_3 = Canon_instance;
          var tmp_4 = to("gameId", this.v9_1);
          var tmp_5 = to("playerId", playerId);
          var tmp_6 = to("currentPlayerId", this.x9_1);
          var tmp_7 = to("gameOver", !(this.ga_1 === 0));
          var tmp_8 = to("winnerId", this.ga_1);
          var tmp_9 = to("turnHasPlayed", this.ba_1);
          var tmp3_elvis_lhs = this.aa_1;
          var tmp_10 = to("requestedFamily", tmp3_elvis_lhs == null ? "" : tmp3_elvis_lhs);
          var tmp_11 = to("penaltyCount", this.y9_1);
          var tmp_12 = to("penaltyTargetId", this.y9_1 === 0 ? 0 : penaltyTarget(this));
          var tmp_13 = to("penaltyType", this.y9_1 === 0 ? "" : "CARD_PENALTY");
          var tmp_14 = to("blockedPlayerId", this.ea_1);
          var tmp4_elvis_lhs = this.fa_1;
          return tmp_3.b8(listOf([tmp_4, tmp_5, tmp_6, tmp_7, tmp_8, tmp_9, tmp_10, tmp_11, tmp_12, tmp_13, tmp_14, to("blockedCardType", tmp4_elvis_lhs == null ? "" : tmp4_elvis_lhs), to("lastCardAnnounced", this.ca_1), to("mustAnnounceLastCard", isPlayerTurn && hand.j() === 1 && !this.ca_1), to("sameValueFollowUpAvailable", sameValueAvailable), to("canDraw", isPlayerTurn), to("canPass", isPlayerTurn && this.ea_1 === playerId && !this.ba_1), to("canFinish", isPlayerTurn && this.ba_1 && !(this.aa_1 === "CHOICE")), to("canAnnounce", isPlayerTurn && hand.j() === 1), to("legalCards", legal), to("hand", hand)]));
        };
        protoOf(KadiGameState).tb = function(playerId) {
          this.xa(playerId);
          var hand = ensureNotNull(this.ma_1.w(playerId));
          var counts = LinkedHashMap_init_$Create$_0();
          var _iterator__ex2g4s = this.ma_1.x().g();
          while (_iterator__ex2g4s.h()) {
            var _destruct__k2r9zo = _iterator__ex2g4s.i();
            var pid = _destruct__k2r9zo.t();
            var h = _destruct__k2r9zo.u();
            var value = h.j();
            counts.p2(pid, value);
          }
          var tmp = Canon_instance;
          var tmp_0 = to("gameId", this.v9_1);
          var tmp_1 = to("playerId", playerId);
          var tmp_2 = to("opponentId", this.na(playerId));
          var tmp_3 = to("started", this.w9_1);
          var tmp_4 = to("gameOver", !(this.ga_1 === 0));
          var tmp_5 = to("currentPlayerId", this.x9_1);
          var tmp0_safe_receiver = this.ka_1.s6();
          var tmp_6;
          if (tmp0_safe_receiver == null) {
            tmp_6 = null;
          } else {
            tmp_6 = CardJv_instance.ub(tmp0_safe_receiver);
          }
          var tmp_7 = to("topCard", tmp_6);
          var tmp1_safe_receiver = this.wa();
          var tmp_8;
          if (tmp1_safe_receiver == null) {
            tmp_8 = null;
          } else {
            tmp_8 = CardJv_instance.ub(tmp1_safe_receiver);
          }
          var tmp_9 = to("lastDirectiveCard", tmp_8);
          var destination = ArrayList_init_$Create$_0(collectionSizeOrDefault(hand, 10));
          var tmp0_iterator = hand.g();
          while (tmp0_iterator.h()) {
            var item = tmp0_iterator.i();
            var tmp$ret$7 = CardJv_instance.ub(item);
            destination.e(tmp$ret$7);
          }
          return tmp.b8(listOf([tmp_0, tmp_1, tmp_2, tmp_3, tmp_4, tmp_5, tmp_7, tmp_9, to("hand", destination), to("drawCount", this.ja_1.j()), to("penaltyCount", this.y9_1), to("requestedFamily", this.aa_1), to("penaltyPlayerId", this.y9_1 === 0 ? 0 : penaltyTarget(this)), to("penaltyType", this.y9_1 === 0 ? null : "CARD_PENALTY"), to("direction", this.da_1), to("blockedPlayerId", this.ea_1), to("blockedCardType", this.fa_1), to("turnHasPlayed", this.ba_1), to("lastCardAnnounced", this.ca_1), to("mustAnnounceLastCard", hand.j() === 1 && !this.ca_1), to("playerCardCounts", counts), to("machinePlayerIds", this.ia_1), to("winnerId", this.ga_1)]));
        };
        function CardJv() {
        }
        protoOf(CardJv).ub = function(c) {
          return Canon_instance.b8(listOf([to("value", c.g9_1), to("family", c.h9_1), to("symbol", c.i9_1), to("cardName", c.j9_1), to("reversed", c.k9_1), to("special", Canon_instance.b8(listOf([to("special", c.l9_1.a9_1), to("cardChanger", c.l9_1.b9_1), to("rotateGame", c.l9_1.c9_1), to("penalise", c.l9_1.d9_1), to("topAnyCard", c.l9_1.e9_1), to("stopPlay", c.l9_1.f9_1)])))]));
        };
        var CardJv_instance;
        function CardJv_getInstance() {
          return CardJv_instance;
        }
        function FixtureState(playerIds, currentPlayerId, winnerId, topCard, directive, hand, turnHasPlayed, requestedFamily, lastCardAnnounced, penaltyCount, jokerPenalty, blockedPlayerId, blockedCardType) {
          lastCardAnnounced = lastCardAnnounced === VOID ? false : lastCardAnnounced;
          penaltyCount = penaltyCount === VOID ? 0 : penaltyCount;
          jokerPenalty = jokerPenalty === VOID ? false : jokerPenalty;
          blockedPlayerId = blockedPlayerId === VOID ? 0 : blockedPlayerId;
          blockedCardType = blockedCardType === VOID ? null : blockedCardType;
          this.vb_1 = playerIds;
          this.wb_1 = currentPlayerId;
          this.xb_1 = winnerId;
          this.yb_1 = topCard;
          this.zb_1 = directive;
          this.ac_1 = hand;
          this.bc_1 = turnHasPlayed;
          this.cc_1 = requestedFamily;
          this.dc_1 = lastCardAnnounced;
          this.ec_1 = penaltyCount;
          this.fc_1 = jokerPenalty;
          this.gc_1 = blockedPlayerId;
          this.hc_1 = blockedCardType;
        }
        protoOf(FixtureState).toString = function() {
          return "FixtureState(playerIds=" + toString(this.vb_1) + ", currentPlayerId=" + this.wb_1 + ", winnerId=" + this.xb_1 + ", topCard=" + this.yb_1.toString() + ", directive=" + toString_0(this.zb_1) + ", hand=" + toString(this.ac_1) + ", turnHasPlayed=" + this.bc_1 + ", requestedFamily=" + this.cc_1 + ", lastCardAnnounced=" + this.dc_1 + ", penaltyCount=" + this.ec_1 + ", jokerPenalty=" + this.fc_1 + ", blockedPlayerId=" + this.gc_1 + ", blockedCardType=" + this.hc_1 + ")";
        };
        protoOf(FixtureState).hashCode = function() {
          var result = hashCode(this.vb_1);
          result = imul(result, 31) + this.wb_1 | 0;
          result = imul(result, 31) + this.xb_1 | 0;
          result = imul(result, 31) + this.yb_1.hashCode() | 0;
          result = imul(result, 31) + (this.zb_1 == null ? 0 : this.zb_1.hashCode()) | 0;
          result = imul(result, 31) + hashCode(this.ac_1) | 0;
          result = imul(result, 31) + getBooleanHashCode(this.bc_1) | 0;
          result = imul(result, 31) + (this.cc_1 == null ? 0 : getStringHashCode(this.cc_1)) | 0;
          result = imul(result, 31) + getBooleanHashCode(this.dc_1) | 0;
          result = imul(result, 31) + this.ec_1 | 0;
          result = imul(result, 31) + getBooleanHashCode(this.fc_1) | 0;
          result = imul(result, 31) + this.gc_1 | 0;
          result = imul(result, 31) + (this.hc_1 == null ? 0 : getStringHashCode(this.hc_1)) | 0;
          return result;
        };
        protoOf(FixtureState).equals = function(other) {
          if (this === other)
            return true;
          if (!(other instanceof FixtureState))
            return false;
          var tmp0_other_with_cast = other instanceof FixtureState ? other : THROW_CCE();
          if (!equals(this.vb_1, tmp0_other_with_cast.vb_1))
            return false;
          if (!(this.wb_1 === tmp0_other_with_cast.wb_1))
            return false;
          if (!(this.xb_1 === tmp0_other_with_cast.xb_1))
            return false;
          if (!this.yb_1.equals(tmp0_other_with_cast.yb_1))
            return false;
          if (!equals(this.zb_1, tmp0_other_with_cast.zb_1))
            return false;
          if (!equals(this.ac_1, tmp0_other_with_cast.ac_1))
            return false;
          if (!(this.bc_1 === tmp0_other_with_cast.bc_1))
            return false;
          if (!(this.cc_1 == tmp0_other_with_cast.cc_1))
            return false;
          if (!(this.dc_1 === tmp0_other_with_cast.dc_1))
            return false;
          if (!(this.ec_1 === tmp0_other_with_cast.ec_1))
            return false;
          if (!(this.fc_1 === tmp0_other_with_cast.fc_1))
            return false;
          if (!(this.gc_1 === tmp0_other_with_cast.gc_1))
            return false;
          if (!(this.hc_1 == tmp0_other_with_cast.hc_1))
            return false;
          return true;
        };
        function KadiRules() {
        }
        protoOf(KadiRules).va = function(card) {
          return card.i9_1 === "Joker";
        };
        protoOf(KadiRules).fb = function(card) {
          return card.l9_1.a9_1;
        };
        protoOf(KadiRules).gb = function(card) {
          return card.l9_1.d9_1;
        };
        protoOf(KadiRules).ic = function(card) {
          return card.l9_1.e9_1;
        };
        protoOf(KadiRules).kb = function(card) {
          return card.l9_1.f9_1;
        };
        protoOf(KadiRules).jb = function(card) {
          return card.l9_1.c9_1;
        };
        protoOf(KadiRules).jc = function(card, target) {
          if (card == null || target == null)
            return false;
          return this.va(card) || this.ic(card) || !(card.h9_1 == null) && card.h9_1 === target.h9_1 || !(card.i9_1 == null) && card.i9_1 === target.i9_1;
        };
        protoOf(KadiRules).pa = function(candidate, stagedCard) {
          if (candidate == null || stagedCard == null)
            return false;
          return !(candidate.i9_1 == null) && candidate.i9_1 === stagedCard.i9_1;
        };
        protoOf(KadiRules).hb = function(requestedFamily, card) {
          return requestedFamily === "Free" || requestedFamily === "Special" && this.fb(card);
        };
        protoOf(KadiRules).oa = function(cardName, state, hand) {
          var tmp$ret$1;
          $l$block: {
            var tmp0_iterator = hand.g();
            while (tmp0_iterator.h()) {
              var element = tmp0_iterator.i();
              if (element.j9_1 === cardName) {
                tmp$ret$1 = element;
                break $l$block;
              }
            }
            tmp$ret$1 = null;
          }
          var tmp0_elvis_lhs = tmp$ret$1;
          var tmp;
          if (tmp0_elvis_lhs == null) {
            return false;
          } else {
            tmp = tmp0_elvis_lhs;
          }
          var card = tmp;
          return "7" === state.hc_1 && this.kb(card) || "8" === state.hc_1 && this.jb(card);
        };
        protoOf(KadiRules).kc = function(state) {
          var tmp0_elvis_lhs = state.zb_1;
          return tmp0_elvis_lhs == null ? state.yb_1 : tmp0_elvis_lhs;
        };
        protoOf(KadiRules).ib = function(card, state) {
          return this.jc(card, this.kc(state));
        };
        protoOf(KadiRules).ab = function(state, playerId, cardName) {
          if (!(state.xb_1 === 0))
            return "GAME_OVER";
          if (!(playerId === state.wb_1))
            return "NOT_YOUR_TURN";
          if (state.gc_1 === playerId && (cardName == null || !this.oa(cardName, state, state.ac_1)))
            return "BLOCKED_NEEDS_COUNTER";
          var tmp$ret$1;
          $l$block: {
            var tmp0_iterator = state.ac_1.g();
            while (tmp0_iterator.h()) {
              var element = tmp0_iterator.i();
              if (element.j9_1 === cardName) {
                tmp$ret$1 = element;
                break $l$block;
              }
            }
            tmp$ret$1 = null;
          }
          var card = tmp$ret$1;
          if (card == null)
            return "CARD_NOT_IN_HAND";
          if (state.cc_1 === "CHOICE" && (cardName == null || isBlank(cardName)))
            return "CHOICE_PENDING";
          var continuingChain = state.bc_1;
          if (continuingChain && !this.pa(card, state.yb_1))
            return "CHAIN_SYMBOL_MISMATCH";
          if (state.ac_1.j() === 1 && !state.dc_1)
            return "MUST_ANNOUNCE_FIRST";
          if (state.ac_1.j() === 1 && this.fb(card))
            return "SPECIAL_CANNOT_FINISH";
          if (state.cc_1 === "CHOICE" && !continuingChain)
            return "CHOICE_PENDING";
          if (!continuingChain && state.fc_1 && !this.va(card))
            return "JOKER_PENALTY_ONLY_JOKER";
          if (!continuingChain && state.ec_1 > 0 && !this.gb(card) && !this.va(card))
            return "MUST_CLEAR_PENALTY";
          if (!continuingChain && !(state.cc_1 == null) && !(state.cc_1 === card.h9_1) && !this.va(card) && !this.hb(state.cc_1, card))
            return "REQUEST_MISMATCH";
          if (!continuingChain && state.ec_1 > 0 && (this.gb(card) || this.va(card)))
            return null;
          if (!continuingChain && state.cc_1 == null && !this.ib(card, state))
            return "NO_MATCH";
          return null;
        };
        protoOf(KadiRules).cb = function(state, playerId) {
          if (!(state.xb_1 === 0) || !(playerId === state.wb_1))
            return emptyList();
          var this_0 = state.ac_1;
          var destination = ArrayList_init_$Create$();
          var tmp0_iterator = this_0.g();
          while (tmp0_iterator.h()) {
            var element = tmp0_iterator.i();
            if (KadiRules_instance.ab(state, playerId, element.j9_1) == null) {
              destination.e(element);
            }
          }
          var destination_0 = ArrayList_init_$Create$_0(collectionSizeOrDefault(destination, 10));
          var tmp0_iterator_0 = destination.g();
          while (tmp0_iterator_0.h()) {
            var item = tmp0_iterator_0.i();
            var tmp$ret$3 = item.j9_1;
            destination_0.e(tmp$ret$3);
          }
          return destination_0;
        };
        protoOf(KadiRules).ya = function(playerIds, current, direction) {
          var index = playerIds.s(current);
          return playerIds.o(((index + direction | 0) + playerIds.j() | 0) % playerIds.j() | 0);
        };
        protoOf(KadiRules).eb = function(family) {
          if (family == null || isBlank(family)) {
            throw IllegalArgumentException_init_$Create$("A Jack play requires a requested family");
          }
          var normalized = toString(trim(isCharSequence(family) ? family : THROW_CCE()));
          if (!(normalized === "Heart") && !(normalized === "Kisu") && !(normalized === "Mavi") && !(normalized === "Spade") && !(normalized === "Special") && !(normalized === "Free")) {
            throw IllegalArgumentException_init_$Create$("Unknown requested family");
          }
          return normalized;
        };
        var KadiRules_instance;
        function KadiRules_getInstance() {
          return KadiRules_instance;
        }
        function KadiModule() {
          KadiModule_instance = this;
          this.lc_1 = "kadi-rule-engine-java";
          this.mc_1 = "lastikadi";
          this.nc_1 = "1.0";
          this.oc_1 = "69907c8d53bf6274c8a430986e4662eff53d69ee";
          this.pc_1 = 7;
          this.qc_1 = listOf([1, 2]);
          this.rc_1 = emptyList();
          this.sc_1 = "kadi-rule-engine-java";
          this.tc_1 = "lastikadi";
          this.uc_1 = "1.0";
          this.vc_1 = "69907c8d53bf6274c8a430986e4662eff53d69ee";
          this.wc_1 = "tz.co.lastikadi:kadi-runtime@las-267";
          this.xc_1 = "kadi-rules@69907c8d";
          this.yc_1 = listOf(["rules", "machine-turn", "multiplayer", "v1"]);
        }
        protoOf(KadiModule).zc = function(entropy, playerIds, machinePlayerIds, gameId) {
          var state = new KadiGameState(gameId, playerIds, machinePlayerIds, emptyList(), emptyList(), null, emptyMap(), false, 1, 0, false, null, false, false, 1, 0, null, 0);
          state.ua(entropy);
          return new KadiBoundGame(state);
        };
        var KadiModule_instance;
        function KadiModule_getInstance() {
          if (KadiModule_instance == null)
            new KadiModule();
          return KadiModule_instance;
        }
        function KadiBoundGame(state) {
          this.ad_1 = state;
        }
        protoOf(KadiBoundGame).bd = function() {
          return this.ad_1.qa();
        };
        protoOf(KadiBoundGame).cd = function(pid) {
          return this.ad_1.ta(pid);
        };
        protoOf(KadiBoundGame).dd = function(actor) {
          return this.ad_1.bb(actor);
        };
        protoOf(KadiBoundGame).ed = function() {
          return this.ad_1.x9_1;
        };
        protoOf(KadiBoundGame).fd = function() {
          return this.ad_1.ga_1;
        };
        protoOf(KadiBoundGame).gd = function() {
          return this.ad_1.aa_1;
        };
        protoOf(KadiBoundGame).hd = function() {
          return this.ad_1.da_1;
        };
        protoOf(KadiBoundGame).id = function(playerId, cardName) {
          return this.ad_1.za(playerId, cardName);
        };
        protoOf(KadiBoundGame).jd = function() {
          return this.ad_1.ra();
        };
        protoOf(KadiBoundGame).sa = function(actor) {
          return this.ad_1.sa(actor);
        };
        protoOf(KadiBoundGame).kd = function(actor) {
          return this.ad_1.tb(actor);
        };
        protoOf(KadiBoundGame).ld = function(actor) {
          return this.ad_1.sb(actor);
        };
        protoOf(KadiBoundGame).md = function() {
          return this.ad_1.tb(this.ad_1.x9_1);
        };
        protoOf(KadiBoundGame).nd = function(command) {
          var tokens = command.k8_1;
          var tmp;
          try {
            switch (command.i8_1) {
              case "play":
                var tmp1_safe_receiver = tokens.w("cardName");
                var card = tmp1_safe_receiver == null ? null : toString(tmp1_safe_receiver);
                var tmp2_safe_receiver = tokens.w("requestedFamily");
                var requestedFamily = tmp2_safe_receiver == null ? null : toString(tmp2_safe_receiver);
                var reason = this.ad_1.za(command.j8_1, card);
                if (!(reason == null)) {
                  return V1_instance.z8(false, V1_instance.w8("invalid", reason, reason, emptyList()), null, emptyList(), this.od(), null);
                }
                this.ad_1.db(command.j8_1, card, requestedFamily);
                break;
              case "draw":
                this.ad_1.mb(command.j8_1);
                break;
              case "pass":
                this.ad_1.nb(command.j8_1);
                break;
              case "finish":
                this.ad_1.lb(command.j8_1);
                break;
              case "announceLastCard":
                this.ad_1.pb(command.j8_1);
                break;
              case "forfeit":
                this.ad_1.ob(command.j8_1);
                break;
              case "machineTurn":
                if (!this.ad_1.sa(this.ad_1.x9_1)) {
                  throw IllegalArgumentException_init_$Create$("It is not a machine seat's turn");
                }
                if (!this.ad_1.qb()) {
                  throw IllegalArgumentException_init_$Create$("Machine turn failed");
                }
                break;
              default:
                throw IllegalArgumentException_init_$Create$("Unsupported command: " + command.i8_1);
            }
            var terminal = this.od();
            tmp = V1_instance.z8(true, null, this.md(), emptyList(), terminal, terminal ? this.pd() : null);
          } catch ($p) {
            var tmp_0;
            if ($p instanceof IllegalArgumentException) {
              var e = $p;
              tmp_0 = V1_instance.z8(false, V1_instance.w8("invalid", "INVALID", e.message, emptyList()), null, emptyList(), this.od(), null);
            } else {
              throw $p;
            }
            tmp = tmp_0;
          }
          return tmp;
        };
        protoOf(KadiBoundGame).od = function() {
          return !(this.ad_1.ga_1 === 0);
        };
        protoOf(KadiBoundGame).pd = function() {
          var terminal = this.od();
          var winner = this.ad_1.ga_1;
          var tmp;
          if (terminal) {
            var tmp_0 = V1_instance;
            var tmp_1 = V1_instance.v8(winner, "human", null, listOf_0("seat-" + winner));
            var tmp0_safe_receiver = this.ad_1.ma_1.w(winner);
            var tmp_2;
            if (tmp0_safe_receiver == null) {
              tmp_2 = null;
            } else {
              var sum = 0;
              var tmp0_iterator = tmp0_safe_receiver.g();
              while (tmp0_iterator.h()) {
                var element = tmp0_iterator.i();
                var tmp_3 = sum;
                var b = element.g9_1;
                sum = tmp_3 + Math.max(0, b) | 0;
              }
              tmp_2 = sum;
            }
            var tmp1_elvis_lhs = tmp_2;
            tmp = listOf_0(tmp_0.x8(tmp_1, 1, tmp1_elvis_lhs == null ? 0 : tmp1_elvis_lhs));
          } else {
            tmp = emptyList();
          }
          var placement = tmp;
          return V1_instance.y8(terminal, terminal ? winner : null, placement, mapOf(to("remainingValues", this.ad_1.rb())));
        };
        function JsJson() {
        }
        protoOf(JsJson).qd = function(body) {
          if (isBlank(body))
            return {};
          return JSON.parse(body);
        };
        protoOf(JsJson).rd = function(value) {
          var tmp = JSON.stringify(value);
          return (!(tmp == null) ? typeof tmp === "string" : false) ? tmp : THROW_CCE();
        };
        protoOf(JsJson).sd = function(body) {
          return this.td(this.qd(body));
        };
        protoOf(JsJson).ud = function(value) {
          var tmp = Object.prototype.toString.call(value);
          return (!(tmp == null) ? typeof tmp === "string" : false) ? tmp : THROW_CCE();
        };
        protoOf(JsJson).td = function(value) {
          if (value == null)
            return Null_getInstance();
          var tmp;
          switch (this.ud(value)) {
            case "[object Boolean]":
              tmp = new Bool((!(value == null) ? typeof value === "boolean" : false) ? value : THROW_CCE());
              break;
            case "[object Number]":
              tmp = new Num(numberToLong((!(value == null) ? typeof value === "number" : false) ? value : THROW_CCE()));
              break;
            case "[object String]":
              tmp = new Str((!(value == null) ? typeof value === "string" : false) ? value : THROW_CCE());
              break;
            case "[object Array]":
              var items = ArrayList_init_$Create$();
              var arr = value;
              var n = arr.length;
              var inductionVariable = 0;
              if (inductionVariable < n)
                do {
                  var i = inductionVariable;
                  inductionVariable = inductionVariable + 1 | 0;
                  items.e(this.td(arr[i]));
                } while (inductionVariable < n);
              tmp = new Arr(items);
              break;
            default:
              var tmp_0 = Canon_instance;
              var this_0 = this.vd(value);
              var destination = ArrayList_init_$Create$_0(collectionSizeOrDefault(this_0, 10));
              var tmp0_iterator = this_0.g();
              while (tmp0_iterator.h()) {
                var item = tmp0_iterator.i();
                var tmp$ret$0 = to(item, JsJson_instance.td(value[item]));
                destination.e(tmp$ret$0);
              }
              tmp = tmp_0.b8(destination);
              break;
          }
          return tmp;
        };
        protoOf(JsJson).vd = function(value) {
          var keys = Object.keys(value);
          var out = ArrayList_init_$Create$();
          var n = keys.length;
          var inductionVariable = 0;
          if (inductionVariable < n)
            do {
              var i = inductionVariable;
              inductionVariable = inductionVariable + 1 | 0;
              var tmp = keys[i];
              out.e((!(tmp == null) ? typeof tmp === "string" : false) ? tmp : THROW_CCE());
            } while (inductionVariable < n);
          return out;
        };
        var JsJson_instance;
        function JsJson_getInstance() {
          return JsJson_instance;
        }
        function identity($this) {
          return listOf([to("runtimeId", KadiModule_getInstance().sc_1), to("moduleId", KadiModule_getInstance().tc_1), to("schemaVersion", KadiModule_getInstance().uc_1)]);
        }
        function okBase($this, payload) {
          return Canon_instance.b8(plus(plus(listOf_0(to("status", "ok")), identity($this)), listOf_0(to("payload", payload))));
        }
        function errorBase($this, message) {
          return Canon_instance.b8(plus(plus(listOf_0(to("status", "error")), identity($this)), listOf_0(to("errors", listOf_0(message)))));
        }
        function statePayload($this, playerId) {
          return Canon_instance.b8(listOf([to("gameId", $this.wd_1), to("playerId", playerId), to("currentPlayerId", $this.yd_1.ed()), to("winnerId", $this.yd_1.fd()), to("hand", $this.yd_1.cd(playerId)), to("requestedFamily", $this.yd_1.gd()), to("direction", $this.yd_1.hd()), to("gameOver", !($this.yd_1.fd() === 0)), to("started", true)]));
        }
        function actionPayload($this, action) {
          return okBase($this, Canon_instance.b8(listOf([to("action", action), to("gameId", $this.wd_1), to("winnerId", $this.yd_1.fd()), to("playerIds", $this.yd_1.bd())])));
        }
        function applyChecked($this, spec) {
          var res = $this.yd_1.nd(spec);
          var tmp;
          if (res instanceof Obj) {
            var tmp$ret$1;
            $l$block: {
              var tmp0_iterator = res.t7_1.g();
              while (tmp0_iterator.h()) {
                var element = tmp0_iterator.i();
                if (element.k7_1 === "accepted") {
                  tmp$ret$1 = element;
                  break $l$block;
                }
              }
              tmp$ret$1 = null;
            }
            var tmp1_safe_receiver = tmp$ret$1;
            tmp = equals(tmp1_safe_receiver == null ? null : tmp1_safe_receiver.l7_1, new Bool(true));
          } else {
            tmp = false;
          }
          var accepted = tmp;
          if (!accepted)
            throw IllegalArgumentException_init_$Create$(rejectionCode($this, res));
        }
        function rejectionCode($this, res) {
          var tmp0_elvis_lhs = res instanceof Obj ? res : null;
          var tmp;
          if (tmp0_elvis_lhs == null) {
            return "REJECTED";
          } else {
            tmp = tmp0_elvis_lhs;
          }
          var obj = tmp;
          var tmp$ret$1;
          $l$block: {
            var tmp0_iterator = obj.t7_1.g();
            while (tmp0_iterator.h()) {
              var element = tmp0_iterator.i();
              if (element.k7_1 === "rejection") {
                tmp$ret$1 = element;
                break $l$block;
              }
            }
            tmp$ret$1 = null;
          }
          var tmp1_safe_receiver = tmp$ret$1;
          var tmp_0 = tmp1_safe_receiver == null ? null : tmp1_safe_receiver.l7_1;
          var tmp2_elvis_lhs = tmp_0 instanceof Obj ? tmp_0 : null;
          var tmp_1;
          if (tmp2_elvis_lhs == null) {
            return "REJECTED";
          } else {
            tmp_1 = tmp2_elvis_lhs;
          }
          var rejection = tmp_1;
          var tmp$ret$3;
          $l$block_0: {
            var tmp0_iterator_0 = rejection.t7_1.g();
            while (tmp0_iterator_0.h()) {
              var element_0 = tmp0_iterator_0.i();
              if (element_0.k7_1 === "code") {
                tmp$ret$3 = element_0;
                break $l$block_0;
              }
            }
            tmp$ret$3 = null;
          }
          var tmp3_safe_receiver = tmp$ret$3;
          var code = tmp3_safe_receiver == null ? null : tmp3_safe_receiver.l7_1;
          var tmp_2;
          if (code instanceof Str) {
            tmp_2 = code.v7_1;
          } else {
            if (code instanceof Num) {
              tmp_2 = code.w7_1.toString();
            } else {
              tmp_2 = "REJECTED";
            }
          }
          return tmp_2;
        }
        function playTokens($this, args) {
          return mapOf_0([to("cardName", args.w("cardName")), to("requestedFamily", args.w("requestedFamily"))]);
        }
        function intArg($this, args, message) {
          var tmp0_elvis_lhs = args.w("playerId");
          var tmp;
          if (tmp0_elvis_lhs == null) {
            throw IllegalArgumentException_init_$Create$(message);
          } else {
            tmp = tmp0_elvis_lhs;
          }
          var raw = tmp;
          var tmp$ret$0 = toString(trim(isCharSequence(raw) ? raw : THROW_CCE()));
          var tmp1_elvis_lhs = toIntOrNull(tmp$ret$0);
          var tmp_0;
          if (tmp1_elvis_lhs == null) {
            throw IllegalArgumentException_init_$Create$(message);
          } else {
            tmp_0 = tmp1_elvis_lhs;
          }
          return tmp_0;
        }
        function intValue($this, value) {
          var tmp;
          switch (JsJson_instance.ud(value)) {
            case "[object Number]":
              tmp = numberToInt((!(value == null) ? typeof value === "number" : false) ? value : THROW_CCE());
              break;
            case "[object String]":
              var this_0 = toString(value);
              var tmp$ret$0 = toString(trim(isCharSequence(this_0) ? this_0 : THROW_CCE()));
              var tmp1_elvis_lhs = toIntOrNull(tmp$ret$0);
              tmp = tmp1_elvis_lhs == null ? 0 : tmp1_elvis_lhs;
              break;
            default:
              tmp = 0;
              break;
          }
          return tmp;
        }
        function boolValue($this, value) {
          var tmp;
          switch (JsJson_instance.ud(value)) {
            case "[object Boolean]":
              tmp = (!(value == null) ? typeof value === "boolean" : false) ? value : THROW_CCE();
              break;
            case "[object String]":
              var this_0 = toString(value);
              var tmp$ret$0 = toString(trim(isCharSequence(this_0) ? this_0 : THROW_CCE()));
              tmp = equals_0(tmp$ret$0, "true", true);
              break;
            default:
              tmp = false;
              break;
          }
          return tmp;
        }
        function strOrNull($this, value) {
          var tmp;
          if (JsJson_instance.ud(value) === "[object String]") {
            var s = toString(value);
            var tmp_0;
            if (charSequenceLength(s) === 0) {
              tmp_0 = null;
            } else {
              tmp_0 = s;
            }
            tmp = tmp_0;
          } else {
            tmp = null;
          }
          return tmp;
        }
        function familyOrNull($this, value) {
          var tmp;
          switch (JsJson_instance.ud(value)) {
            case "[object String]":
              var s = toString(value);
              var tmp_0;
              if (charSequenceLength(s) === 0) {
                tmp_0 = null;
              } else {
                tmp_0 = s;
              }
              tmp = tmp_0;
              break;
            case "[object Null]":
            case "[object Undefined]":
              tmp = null;
              break;
            default:
              tmp = null;
              break;
          }
          return tmp;
        }
        function intListValue($this, value) {
          var out = ArrayList_init_$Create$();
          if (JsJson_instance.ud(value) === "[object Array]") {
            var n = value.length;
            var inductionVariable = 0;
            if (inductionVariable < n)
              do {
                var i = inductionVariable;
                inductionVariable = inductionVariable + 1 | 0;
                out.e(intValue($this, value[i]));
              } while (inductionVariable < n);
          }
          return out;
        }
        function strListValue($this, value) {
          var out = ArrayList_init_$Create$();
          if (JsJson_instance.ud(value) === "[object Array]") {
            var n = value.length;
            var inductionVariable = 0;
            if (inductionVariable < n)
              do {
                var i = inductionVariable;
                inductionVariable = inductionVariable + 1 | 0;
                out.e(toString(value[i]));
              } while (inductionVariable < n);
          }
          return out;
        }
        function cardNameOf($this, value) {
          switch (JsJson_instance.ud(value)) {
            case "[object Null]":
            case "[object Undefined]":
              return null;
            case "[object Object]":
              return strOrNull($this, value["cardName"]);
            default:
              return null;
          }
        }
        function cardByName($this, name) {
          var tmp0_elvis_lhs = CardCatalog_getInstance().u9(name);
          var tmp;
          if (tmp0_elvis_lhs == null) {
            var message = "unknown card in fixture: " + name;
            throw IllegalStateException_init_$Create$(toString(message));
          } else {
            tmp = tmp0_elvis_lhs;
          }
          return tmp;
        }
        function parseArgs($this, body) {
          if (isBlank(body))
            return emptyMap();
          var jsObj = JsJson_instance.qd(body);
          var out = HashMap_init_$Create$();
          var _iterator__ex2g4s = JsJson_instance.vd(jsObj).g();
          while (_iterator__ex2g4s.h()) {
            var key = _iterator__ex2g4s.i();
            var value = jsObj[key];
            var tmp;
            switch (JsJson_instance.ud(value)) {
              case "[object String]":
                tmp = (!(value == null) ? typeof value === "string" : false) ? value : THROW_CCE();
                break;
              case "[object Number]":
              case "[object Boolean]":
                tmp = toString(value);
                break;
              case "[object Null]":
              case "[object Undefined]":
                tmp = null;
                break;
              default:
                tmp = JsJson_instance.rd(value);
                break;
            }
            var value_0 = tmp;
            out.p2(key, value_0);
          }
          return out;
        }
        function jvFromJson($this, body) {
          var tmp;
          if (isBlank(body)) {
            tmp = Canon_instance.b8(emptyList());
          } else {
            tmp = JsJson_instance.sd(body);
          }
          return tmp;
        }
        function KadiRuntimeJs(gameId, entropy, humanPlayerId, machinePlayerId) {
          this.wd_1 = gameId;
          this.xd_1 = humanPlayerId;
          this.yd_1 = KadiModule_getInstance().zc(entropy, listOf([this.xd_1, machinePlayerId]), listOf_0(machinePlayerId), this.wd_1);
        }
        protoOf(KadiRuntimeJs).identityJson = function() {
          return Canon_instance.d8(Canon_instance.b8(identity(this)));
        };
        protoOf(KadiRuntimeJs).initializeJson = function(sessionId, optionsJson, participantsJson) {
          var payload = Canon_instance.b8(listOf([to("gameId", this.wd_1), to("playerIds", this.yd_1.bd())]));
          var metadata = Canon_instance.b8(listOf([to("sessionId", sessionId), to("options", jvFromJson(this, optionsJson)), to("participants", jvFromJson(this, participantsJson))]));
          return Canon_instance.d8(Canon_instance.b8(plus(plus(listOf_0(to("status", "ok")), identity(this)), listOf([to("payload", payload), to("metadata", metadata)]))));
        };
        protoOf(KadiRuntimeJs).executeJson = function(action, argsJson) {
          var name = toString(trim(isCharSequence(action) ? action : THROW_CCE())).toLowerCase();
          if (charSequenceLength(name) === 0)
            return Canon_instance.d8(errorBase(this, "Command name is required"));
          var args = parseArgs(this, argsJson);
          var tmp;
          try {
            var tmp_0;
            switch (name) {
              case "play":
                var playerId = intArg(this, args, "Player id is required");
                applyChecked(this, new CommandSpec("play", playerId, playTokens(this, args), "envelope"));
                tmp_0 = actionPayload(this, "play");
                break;
              case "draw":
                var playerId_0 = intArg(this, args, "Player id is required");
                applyChecked(this, new CommandSpec("draw", playerId_0, emptyMap(), "envelope"));
                tmp_0 = actionPayload(this, "draw");
                break;
              case "pass":
                var playerId_1 = intArg(this, args, "Player id is required");
                applyChecked(this, new CommandSpec("pass", playerId_1, emptyMap(), "envelope"));
                tmp_0 = actionPayload(this, "pass");
                break;
              case "finish":
                var playerId_2 = intArg(this, args, "Player id is required");
                applyChecked(this, new CommandSpec("finish", playerId_2, emptyMap(), "envelope"));
                tmp_0 = actionPayload(this, "finish");
                break;
              case "forfeit":
                var playerId_3 = intArg(this, args, "Player id is required");
                applyChecked(this, new CommandSpec("forfeit", playerId_3, emptyMap(), "envelope"));
                tmp_0 = actionPayload(this, "forfeit");
                break;
              case "announcelastcard":
                var playerId_4 = intArg(this, args, "Player id is required");
                applyChecked(this, new CommandSpec("announceLastCard", playerId_4, emptyMap(), "envelope"));
                tmp_0 = actionPayload(this, "announceLastCard");
                break;
              case "machineturn":
                var tmp_1;
                if (!this.yd_1.sa(this.yd_1.ed())) {
                  tmp_1 = errorBase(this, "It is not a machine seat's turn");
                } else {
                  applyChecked(this, new CommandSpec("machineTurn", this.yd_1.ed(), emptyMap(), "envelope"));
                  tmp_1 = actionPayload(this, "machineTurn");
                }
                tmp_0 = tmp_1;
                break;
              default:
                tmp_0 = errorBase(this, "Unsupported command: " + name);
                break;
            }
            var result = tmp_0;
            tmp = Canon_instance.d8(result);
          } catch ($p) {
            var tmp_2;
            if ($p instanceof IllegalArgumentException) {
              var e = $p;
              var tmp_3 = Canon_instance;
              var tmp1_elvis_lhs = e.message;
              tmp_2 = tmp_3.d8(errorBase(this, tmp1_elvis_lhs == null ? "Command rejected" : tmp1_elvis_lhs));
            } else {
              throw $p;
            }
            tmp = tmp_2;
          }
          return tmp;
        };
        protoOf(KadiRuntimeJs).queryJson = function(name, argsJson) {
          var queryName = toString(trim(isCharSequence(name) ? name : THROW_CCE())).toLowerCase();
          if (charSequenceLength(queryName) === 0)
            return Canon_instance.d8(errorBase(this, "Query name is required"));
          var args = parseArgs(this, argsJson);
          var tmp;
          switch (queryName) {
            case "state":
              var playerId = intArg(this, args, "Player id is required");
              tmp = okBase(this, statePayload(this, playerId));
              break;
            case "legalcards":
              var playerId_0 = intArg(this, args, "Player id is required");
              tmp = okBase(this, Canon_instance.b8(listOf([to("playerId", playerId_0), to("legalCards", this.yd_1.dd(playerId_0))])));
              break;
            case "considerplay":
              var playerId_1 = intArg(this, args, "Player id is required");
              var cardName = args.w("cardName");
              var reason = this.yd_1.id(playerId_1, cardName);
              var tmp_0 = Canon_instance;
              var tmp_1 = to("playerId", playerId_1);
              var tmp_2 = to("cardName", cardName);
              var tmp_3 = to("legal", reason == null);
              tmp = okBase(this, tmp_0.b8(listOf([tmp_1, tmp_2, tmp_3, to("reason", reason == null ? "OK" : reason)])));
              break;
            case "clientturnprofile":
              var playerId_2 = intArg(this, args, "Player id is required");
              tmp = okBase(this, this.yd_1.ld(playerId_2));
              break;
            default:
              return Canon_instance.d8(errorBase(this, "Unsupported query: " + queryName));
          }
          var result = tmp;
          return Canon_instance.d8(result);
        };
        protoOf(KadiRuntimeJs).stateDtoJson = function(playerId) {
          return Canon_instance.d8(this.yd_1.kd(playerId));
        };
        protoOf(KadiRuntimeJs).legalCards = function(playerId) {
          var this_0 = this.yd_1.dd(playerId);
          return copyToArray(this_0);
        };
        protoOf(KadiRuntimeJs).reason = function(playerId, cardName) {
          var tmp0_elvis_lhs = this.yd_1.id(playerId, cardName);
          return tmp0_elvis_lhs == null ? "" : tmp0_elvis_lhs;
        };
        protoOf(KadiRuntimeJs).currentPlayerId = function() {
          return this.yd_1.ed();
        };
        protoOf(KadiRuntimeJs).winnerId = function() {
          return this.yd_1.fd();
        };
        protoOf(KadiRuntimeJs).playerIds = function() {
          var this_0 = this.yd_1.bd();
          return copyToArray(this_0);
        };
        protoOf(KadiRuntimeJs).machineIds = function() {
          var this_0 = this.yd_1.jd();
          return copyToArray(this_0);
        };
        protoOf(KadiRuntimeJs).isHumanTurn = function() {
          return !this.yd_1.sa(this.yd_1.ed()) && this.yd_1.fd() === 0;
        };
        protoOf(KadiRuntimeJs).machineTurnReady = function() {
          return this.yd_1.sa(this.yd_1.ed());
        };
        protoOf(KadiRuntimeJs).hydrateState = function(rawJson) {
          var raw = JsJson_instance.qd(rawJson);
          var playerIds = intListValue(this, raw["playerIds"]);
          var handsInput = LinkedHashMap_init_$Create$_0();
          var _iterator__ex2g4s = playerIds.g();
          while (_iterator__ex2g4s.h()) {
            var pid = _iterator__ex2g4s.i();
            var value = strListValue(this, raw["hands"][pid.toString()]);
            handsInput.p2(pid, value);
          }
          var tmp0_safe_receiver = cardNameOf(this, raw["topCard"]);
          var tmp;
          if (tmp0_safe_receiver == null) {
            tmp = null;
          } else {
            tmp = listOf_0(cardByName(this, tmp0_safe_receiver));
          }
          var topCard = tmp;
          var tmp_0 = this;
          var tmp_1 = intValue(this, raw["gameId"]);
          var tmp_2 = emptyList();
          var tmp_3 = emptyList();
          var tmp_4 = topCard == null ? emptyList() : topCard;
          var tmp2_safe_receiver = cardNameOf(this, raw["directive"]);
          var tmp_5;
          if (tmp2_safe_receiver == null) {
            tmp_5 = null;
          } else {
            tmp_5 = cardByName(this, tmp2_safe_receiver);
          }
          var tmp_6 = tmp_5;
          var destination = LinkedHashMap_init_$Create$(mapCapacity(handsInput.j()));
          var tmp0_iterator = handsInput.x().g();
          while (tmp0_iterator.h()) {
            var element = tmp0_iterator.i();
            var tmp_7 = element.t();
            var names = element.u();
            var destination_0 = ArrayList_init_$Create$_0(collectionSizeOrDefault(names, 10));
            var tmp0_iterator_0 = names.g();
            while (tmp0_iterator_0.h()) {
              var item = tmp0_iterator_0.i();
              var tmp$ret$6 = cardByName(this, item);
              destination_0.e(tmp$ret$6);
            }
            destination.p2(tmp_7, destination_0);
          }
          tmp_0.yd_1 = new KadiBoundGame(new KadiGameState(tmp_1, playerIds, tmp_2, tmp_3, tmp_4, tmp_6, destination, true, intValue(this, raw["currentPlayerId"]), intValue(this, raw["penaltyCount"]), boolValue(this, raw["jokerPenalty"]), familyOrNull(this, raw["requestedFamily"]), boolValue(this, raw["turnHasPlayed"]), boolValue(this, raw["lastCardAnnounced"]), intValue(this, raw["direction"]), intValue(this, raw["blockedPlayerId"]), strOrNull(this, raw["blockedCardType"]), intValue(this, raw["winnerId"])));
        };
        CardJv_instance = new CardJv();
        KadiRules_instance = new KadiRules();
        JsJson_instance = new JsJson();
        function $jsExportAll$(_2) {
          var $tz = _2.tz || (_2.tz = {});
          var $tz$co = $tz.co || ($tz.co = {});
          var $tz$co$lastikadi = $tz$co.lastikadi || ($tz$co.lastikadi = {});
          var $tz$co$lastikadi$kadi = $tz$co$lastikadi.kadi || ($tz$co$lastikadi.kadi = {});
          var $tz$co$lastikadi$kadi$runtime = $tz$co$lastikadi$kadi.runtime || ($tz$co$lastikadi$kadi.runtime = {});
          $tz$co$lastikadi$kadi$runtime.KadiRuntimeJs = KadiRuntimeJs;
        }
        $jsExportAll$(_);
        return _;
      })(module.exports, require_kotlin_kotlin_stdlib(), require_portable_rule_proof_runtime_core());
    }
  });

  // lastikadi-game-runtime-interface/dist/index.js
  var require_index = __commonJS({
    "lastikadi-game-runtime-interface/dist/index.js"(exports) {
      var root = require_portable_rule_proof_kadi_runtime_browser();
      exports.KadiRuntimeJs = root.tz.co.lastikadi.kadi.runtime.KadiRuntimeJs;
    }
  });
  return require_index();
})();
