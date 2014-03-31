﻿Elm.Native.Array = {};
Elm.Native.Array.make = function(elm) {
    elm.Native = elm.Native || {};
    elm.Native.Array = elm.Native.Array || {};
    if (elm.Native.Array.values) return elm.Native.Array.values;
    if ('values' in Elm.Native.Array)
      return elm.Native.Array.values = Elm.Native.Array.values;

    var List = Elm.Native.List.make(elm);

    // A RRB-Tree has two distinct data types.
    // Leaf -> "height"  is always 0
    //         "table"   is an array of elements
    // Node -> "height"  is always greater than 0
    //         "table"   is an array of child nodes
    //         "lengths" is an array of accumulated lengths of the child nodes

    // M is the maximal table size. 32 seems fast. E is the allowed increase
    // of search steps when concatting to find an index. Lower values will 
    // decrease balancing, but will increase search steps.
    var M = 32;
    var E = 2;

    // An empty array.
    var empty = { ctor:"_Array", height:0, table:new Array() };

    // Gets the value at index i recursively.
    function get(i, a) {
      if (a.height == 0) {
        if (i < a.table.length) {
          return a.table[i];
        } else {
          throw new Error("Index "+ i +" on the array is out of range. Check the length first or you safeGet.");
        }
      }

      var slot = getSlot(i, a);
      var sub = slot > 0 ? a.lengths[slot-1] : 0;
      return get(i - sub, a.table[slot]);
    }

    // Sets the value at the index i. Only the nodes leading to i will get
    // copied and updated.
    function set(i, item, a) {
      if (length(a) <= i) {
        return a;
      }
      var newA = nodeCopy(a);
      newA.table = a.table.slice();

      if (a.height == 0) {
        newA.table[i] = item;
      } else {
        var slot = getSlot(i, a);
        var sub = slot > 0 ? a.lengths[slot-1] : 0;
        newA.table[slot] = set(i - sub, item, a.table[slot]);
      }
      return newA;
    }

    // Pushes an item via push_ to the bottom right of a tree.
    function push(item, a) {
      var pushed = push_(item, a);
      if (pushed !== null) {
        return pushed;
      }

      newTree = create(item, a.height);
      return siblise(a, newTree);
    }

    // Recursively tries to push an item to the bottom-right most
    // tree possible. If there is no space left for the item,
    // null will be returned.
    function push_(item, a) {
      // Handle resursion stop at leaf level.
      if (a.height == 0) {
        if (a.table.length < M) {
          var newA = { ctor:"_Array", height:0, table:a.table.slice() };
          newA.table.push(item);
          return newA;
        } else {
          return null;
        }
      }

      // Recursively push
      var pushed = push_(item, botRight(a));

      // There was space in the bottom right tree, so the slot will
      // be updated.
      if (pushed != null) {
        var newA = nodeCopy(a);
        newA.table[newA.table.length - 1] = pushed;
        newA.lengths[newA.lengths.length - 1]++;
        return newA
      }

      // When there was no space left, check if there is space left
      // for a new slot with a tree which contains only the item
      // at the bottom.
      if (a.table.length < M) {
        var newSlot = create(item, a.height - 1);
        var newA = nodeCopy(a);
        newA.table.push(newSlot);
        newA.lengths.push(newA.lengths[newA.lengths.length - 1] + length(newSlot));
        return newA
      } else {
        return null;
      }
    }

    // Converts an array into a list of elements.
    function elements(a) {
      return elements_(List.Nil, a);
    }

    function elements_(list, a) {
      for (var i = a.table.length - 1; i >= 0; i--) {
        list = a.height == 0 ? List.Cons(a.table[i], list) : elements_(list, a.table[i]);
      }
      return list;
    }

    // Maps a function over an array.
    function map(f, a) {
      var newA = { ctor:"_Array", height:a.height, table:new Array(a.table) };
      if (a.height > 0) { newA.lengths = a.lengths; }
      for (var i = 0; i < a.table.length; i++) {
        newA.table[i] = a.height == 0 ? f(a.table[i]) : map(f, a.table[i]);
      }
      return newA;
    }

    function assocMap(f, a) {
      var newA = { ctor:"_Array", height:a.height, table:new Array(a.table) };
      if (a.height > 0) { newA.lengths = a.lengths; }
      for (var i = 0; i < a.table.length; i++) {
        newA.table[i] = a.height == 0 ? A2(f, i, a.table[i]) : assocMap(f, a.table[i]);
      }
      return newA;
    }

    function foldl(f, b, a) {
      for (var i = a.table.length - 1; i >= 0; i--) {
        b = A2(f, a.height == 0 ? a.table[i] : foldl(f, b, a.table[i]), b);
      }
      return b;
    }

    function foldr(f, b, a) {
      for (var i = 0; i < a.table.length; i++) {
        b = A2(f, a.height == 0 ? a.table[i] : foldr(f, b, a.table[i]), b);
      }
      return b;
    }

    // Returns a sliced tree. The to is inclusive, but this may change,
    // when I understand, why e.g. JS does not handle it this way. :-)
    // If from or to is negative, they will select from the end on.
    // TODO: currently, it slices the right, then the left. This can be
    // optimized.
    function slice(from, to, a) {
      if (from < 0) { from += length(a); }
      if (to < 0)   { to += length(a); }
      return sliceLeft(from, sliceRight(to, a));
    }

    function sliceRight(to, a) {
      if (to == length(a)) {
        return a;
      }

      // Handle leaf level.
      if (a.height == 0) {
        var newA = { ctor:"_Array", height:0 };
        newA.table = a.table.slice(0, to + 1);
        return newA;
      }

      // Slice the right recursively.
      var right = getSlot(to, a);
      var sliced = sliceRight(to - (right > 0 ? a.lengths[right - 1] : 0), a.table[right]);

      // Maybe the a node is not even needed, as sliced contains the whole slice.
      if (right == 0) {
        return sliced;
      }

      // Create new node.
      var newA = { ctor:"_Array", height:a.height
                                , table:a.table.slice(0, right + 1)
                                , lengths:a.lengths.slice(0, right + 1) };
      newA.table[right] = sliced;
      newA.lengths[right] = length(sliced) + (right > 0 ? newA.lengths[right - 1] : 0);
      return newA;
    }

    function sliceLeft(from, a) {
      if (from == 0) {
        return a;
      }

      // Handle leaf level.
      if (a.height == 0) {
        var newA = { ctor:"_Array", height:0 };
        newA.table = a.table.slice(from, a.table.length + 1);
        return newA;
      }

      // Slice the left recursively.
      var left = getSlot(from, a);
      var sliced = sliceLeft(from - (left > 0 ? a.lengths[left - 1] : 0), a.table[left]);

      // Maybe the a node is not even needed, as sliced contains the whole slice.
      if (left == a.table.length - 1) {
        return sliced;
      }

      // Create new node.
      var newA = { ctor:"_Array", height:a.height
                                , table:a.table.slice(left, a.table.length + 1)
                                , lengths:new Array(a.table.length - left) };
      newA.table[left] = sliced;
      var len = 0;
      for (var i = 0; i < newA.table.length; i++) {
        len += length(newA.table[i]);
        newA.lengths[i] = len;
      }

      return newA;
    }

    // Concats two trees.
    // TODO: Add support for concatting trees of different sizes. Current
    // behavior will just rise the lower tree and then concat them.
    function concat(a, b) {
      if (b.height > a.height) { return concat(parentise(a, b.height), b); }
      if (a.height > b.height) { return concat(a, parentise(b, a.height)); }
      if (a.height == 0) { return concat(parentise(a, 1), parentise(b, 1)); }

      var c = concat_(a, b);
      if (c[1].table.length > 0) {
        return siblise(c[0], c[1]);
      } else {
        return c[0];
      }
    }

    // Returns an array of two nodes. The second node _may_ be empty. This case
    // needs to be handled by the function, that called concat_. May be only
    // called for trees with an minimal height of 1.
    function concat_(a, b) {
      if (a.height == 1) {
        // Check if balancing is needed and return based on that.
        var toRemove = calcToRemove(a, b);
        if (toRemove <= E) {
          return [a,b];
        }

        return shuffle(a, b, toRemove);
      }

      var concated = concat_(botRight(a), botLeft(b));
      a = nodeCopy(a), b = nodeCopy(b);

      // Adjust the bottom right side of the new tree.
      a.table[a.table.length - 1] = concated[0];
      a.lengths[a.lengths.length - 1] = length(concated[0])
      a.lengths[a.lengths.length - 1] += a.lengths.length > 1 ? a.lengths[a.lengths.length - 2] : 0;

      // Adjust the bottom left side of the new tree.
      if (concated[1].table.length > 0) {
        b.table[0] = concated[1];
        b.lengths[0] = length(concated[1]);
        for (var i = 1, len = length(b.table[0]); i < b.lengths.length; i++) {
          len += length(b.table[i]);
          b.lengths[i] = len;
        }
      } else {
        b.table.shift();
        for (var i = 1; i < b.lengths.length; i++) {
          b.lengths[i] = b.lengths[i] - b.lengths[0];
        }
        b.lengths.shift();
      }

      // Check if balancing is needed and return based on that.
      var toRemove = calcToRemove(a, b);
      if (toRemove <= E || b.table.length == 0) {
        return [a,b];
      }

      return shuffle(a, b, toRemove);
    }

    // Returns the extra search steps for E. Refer to the paper.
    function calcToRemove(a, b) {
      var subLengths = 0;
      for (var i = 0; i < a.table.length; i++) {
        subLengths += a.table[i].table.length;
      }
      for (var i = 0; i < b.table.length; i++) {
        subLengths += b.table[i].table.length;
      }

      var toRemove = a.table.length + b.table.length
      return toRemove - (Math.floor((subLengths - 1) / M) + 1);
    }

    // get2 and set2 are helpers for accessing over two arrays.
    function get2(a, b, index) {
      return index < a.length ? a[index] : b[index - a.length];
    }

    function set2(a, b, index, value) {
      if (index < a.length) {
        a[index] = value;
      } else {
        b[index - a.length] = value;
      }
    }

    // Creates a node or leaf with a given length at their arrays for perfomance.
    // Is only used by shuffle.
    function createNode(h, length) {
      if (length < 0) { length = 0; }
      var a = { ctor:"_Array", height:h, table:new Array(length) };
      if (h > 0) {
        a.lengths = new Array(length);
      }
      return a;
    }

    function saveSlot(a, b, index, slot) {
      set2(a.table, b.table, index, slot);

      var l = (index == 0 || index == a.lengths.length) ?
                0 : get2(a.lengths, a.lengths, index - 1);
      set2(a.lengths, b.lengths, index, l + length(slot));
    }

    // Returns an array of two balanced nodes.
    function shuffle(a, b, toRemove) {
      var newA = createNode(a.height, Math.min(M, a.table.length + b.table.length - toRemove));
      var newB = createNode(a.height, newA.table.length - (a.table.length + b.table.length - toRemove));

      // Skip the slots with size M. More precise: copy the slot references
      // to the new node
      var read = 0;
      while (get2(a.table, b.table, read).table.length % M == 0) {
        set2(newA.table, newB.table, read, get2(a.table, b.table, read));
        set2(newA.lengths, newB.lengths, read, get2(a.lengths, b.lengths, read));
        read++;
      }

      // Pulling items from left to right, caching in a slot before writing
      // it into the new nodes.
      var write = read;
      var slot = new createNode(a.height - 1, 0);
      var from = 0;

      // If the current slot is still containing data, then there will be at
      // least one more write, so we do not break this loop yet.
      while (read - write - (slot.table.length > 0 ? 1 : 0) < toRemove) {
        // Find out the max possible items for copying.
        var source = get2(a.table, b.table, read);
        var to = Math.min(M - slot.table.length, source.table.length)

        // Copy and adjust size table.
        slot.table = slot.table.concat(source.table.slice(from, to));
        if (slot.height > 0) {
          var len = slot.lengths.length;
          for (var i = len; i < len + to - from; i++) {
            slot.lengths[i] = length(slot.table[i]);
            slot.lengths[i] += (i > 0 ? slot.lengths[i - 1] : 0);
          }
        }

        from += to;

        // Only proceed to next slots[i] if the current one was
        // fully copied.
        if (source.table.length <= to) {
          read++; from = 0;
        }

        // Only create a new slot if the current one is filled up.
        if (slot.table.length == M) {
          saveSlot(newA, newB, write, slot);
          slot = createNode(a.height - 1,0);
          write++;
        }
      }

      // Cleanup after the loop. Copy the last slot into the new nodes.
      if (slot.table.length > 0) {
        saveSlot(newA, newB, write, slot);
        write++;
      }

      // Shift the untouched slots to the left
      while (read < a.table.length + b.table.length ) {
        saveSlot(newA, newB, write, get2(a.table, b.table, read));
        read++; write++;
      }

      return [newA, newB];
    }

    // Navigation functions
    function botRight(a) { return a.table[a.table.length - 1]; }
    function botLeft(a)  { return a.table[0]; }

    // Copies a node for updating. Note that you should not use this if
    // only updating only one of "table" or "lengths" for performance reasons.
    function nodeCopy(a) {
      var newA = { ctor:"_Array", height:a.height
                                , table:a.table.slice() };
      if (a.height > 0) { newA.lengths = a.lengths.slice(); }
      return newA;
    }

    // Returns how many items are in the tree.
    function length(a) {
      if (a.height == 0) {
        return a.table.length;
      } else {
        return a.lengths[a.lengths.length - 1];
      }
    }

    // Calculates in which slot the item probably is, then
    // find the exact slot in "lengths". Returns the index.
    function getSlot(i, a) {
      var slot = Math.floor(i / (Math.pow(M, a.height)));
      while (a.lengths[slot] <= i) {
        slot++
      }
      return slot;
    }

    // Recursively creates a tree with a given height containing
    // only the given item.
    function create(item, h) {
      if (h == 0) {
        return { ctor:"_Array", height:0
                              , table:[item] };
      } else {
        return { ctor:"_Array", height:h
                              , table:[create(item, h - 1)]
                              , lengths:[1] };
      }
    }

    // Recursively creates a tree that contains the given tree.
    function parentise(tree, h) {
      if (h == tree.height) {
        return tree;
      } else {
        return { ctor:"_Array", height:h
                              , table:[parentise(tree, h - 1)]
                              , lengths:[length(tree)] };
      }
    }

    // Emphasizes blood brotherhood beneath two trees.
    function siblise(a, b) {
      return { ctor:"_Array", height:a.height + 1
                            , table:[a, b]
                            , lengths:[length(a), length(a) + length(b)] };
    }

    Elm.Native.Array.values = {
      empty:empty,
      elements:elements,
      concat:F2(concat),
      push:F2(push),
      slice:F3(slice),
      get:F2(get),
      set:F3(set),
      map:F2(map),
      assocMap:F2(assocMap),
      foldl:F3(foldl),
      foldr:F3(foldr),
      length:length
    };

    return elm.Native.Array.values = Elm.Native.Array.values;
}
