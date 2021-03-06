(function () {
    var z = function (h) {
        return h ? "string" == typeof h ? [h] : Array.prototype.slice.call(h) : []
    }
        , A = function (h, l) {
            for (var b = 0; b < h.length; b++)
                if (h[b] == l)
                    return !0;
            return !1
        }
        , B = function (h, l, b) {
            for (var g = [], a = h.x, c = h.y, d = ">", f = 0, e, k; f < b.length; f++)
                if (e = b.charAt(f),
                    k = b.substr(f),
                    /^[><+\\-]$/.test(e)) {
                    d = e;
                    ">" == e ? a += h.cell.colSpan : "<" == e ? a-- : "+" == e ? c-- : "-" == e ? c += h.cell.rowSpan : "\\" == e && (c += h.cell.rowSpan,
                        a += h.cell.colSpan);
                    if (0 > c || c >= l.length || 0 > a || a >= l[c].length)
                        return [];
                    h = l[c][a];
                    h.refCell && (h = h.cell);
                    a = h.x;
                    c = h.y
                } else if (e = /^\d+[:a-z]*/i.exec(k))
                    if (k = parseInt(/^\d/.exec(k)[0], 10),
                        0 === k && 0 === f)
                        g.push(h),
                            f += e[0].length - 1;
                    else
                        for (var w = 0; w < k; w++) {
                            if (0 < w) {
                                e = d;
                                ">" == e ? a += h.cell.colSpan : "<" == e ? a-- : "+" == e ? c-- : "-" == e ? c += h.cell.rowSpan : "\\" == e && (c += h.cell.rowSpan,
                                    a += h.cell.colSpan);
                                if (0 > c || c >= l.length || 0 > a || a >= l[c].length)
                                    return [];
                                h = l[c][a];
                                h.refCell && (h = h.cell);
                                a = h.x;
                                c = h.y
                            }
                            g.push(h)
                        }
                else if (/[.]{3}\s*$/.test(k))
                    return g.concat(B(h, l, b));
            return g
        }
        , C = function (h) {
            for (var l = {}, b = [], g = [], a = 0, c; a < h.length; a++)
                c = h[a],
                    l[1E9 * c.y + c.x] = c.cell;
            for (a in l)
                l.hasOwnProperty(a) && b.push({
                    order: a,
                    cell: l[a]
                });
            b.sort(function (a, b) {
                return a.order - b.order
            });
            for (a = 0; a < b.length; a++)
                g.push(b[a].cell);
            return g
        }
        , n = function (h) {
            var l = {};
            this.element = h;
            this.isAChildCell = function (b) {
                if (!n.isACell(b))
                    return !1;
                for (; b = b.parentElement;) {
                    if (b == this.element)
                        return !0;
                    if (n.isACell(b))
                        break
                }
                return !1
            }
                ;
            this.normalize = function (b) {
                b = b || this.matrix();
                var g = !1
                    , a = 0;
                a: for (; a < b.length; a++) {
                    var c = b[a];
                    for (var d = 0, f; d < c.length; d++)
                        if (f = c[d],
                            !f.refCell)
                            continue a;
                    g = !0;
                    for (d = 0; d < c.length; d++)
                        f = c[d],
                            --f.refCell.cell.rowSpan,
                            d += f.refCell.cell.colSpan - 1
                }
                var e = 0;
                for (a = 0; a < b.length; a++)
                    e = Math.max(e, b[a].length);
                d = 0;
                a: for (; d < e; d++) {
                    for (a = 0; a < b.length; a++)
                        if ((f = b[a][d]) && !f.refCell)
                            continue a;
                    g = !0;
                    for (a = 0; a < b.length; a++)
                        if (f = b[a][d])
                            --f.refCell.cell.colSpan,
                                a += f.refCell.cell.rowSpan - 1
                }
                d = h.rows;
                for (a = 0; a < d.length; a++)
                    (c = d[a]) && 0 >= c.cells.length && (c.parentNode.removeChild(c),
                        a--,
                        g = !0);
                if (g)
                    for (e = 0,
                        b = this.matrix(),
                        a = 0; a < b.length; a++)
                        e = Math.max(e, b[a].length);
                for (a = 0; a < b.length; a++)
                    d[a] && (g = d[a].cells,
                        b[a].length < e && g && g[0] && (g[g.length - 1].colSpan += e - g.length));
                return !0
            }
                ;
            this.clearCache = function () {
                l = {}
            }
                ;
            this.removeCol = function (b) {
                b || 0 === b || "0" === b || (b = -1);
                for (var g = this.matrix(), a = 0; a < g.length; a++) {
                    var c = g[a];
                    if (0 > b) {
                        var d = c.length + b;
                        0 > d && (d = 0)
                    } else
                        d = b >= c.length ? c.length - 1 : b;
                    if (d = c[d])
                        a += (d.refCell || d).cell.rowSpan - 1,
                            d.refCell ? --d.refCell.cell.colSpan : 1 < d.cell.colSpan ? --d.cell.colSpan : d.cell.parentElement.removeChild(d.cell)
                }
            }
                ;
            this.removeRow = function (b) {
                b || 0 === b || "0" === b || (b = -1);
                var g = this.element
                    , a = this.matrix();
                0 > b ? (b = a.length + b,
                    0 > b && (b = 0)) : b >= a.length && (b = a.length - 1);
                var c = a[b];
                a = a[b + 1];
                for (var d = 0; d < c.length; d++) {
                    var f = c[d];
                    if (f.refCell)
                        1 < f.refCell.cell.rowSpan && --f.refCell.cell.rowSpan;
                    else if (1 < f.cell.rowSpan && a) {
                        0 !== f.cell.rowSpan && --f.cell.rowSpan;
                        for (var e = a[d], k = d; k < a.length; k++)
                            a[k].cell && (e = a[k].cell,
                                k = a.length);
                        g.rows[b + 1].insertBefore(f.cell, e)
                    }
                    d += (f.refCell || f).cell.colSpan - 1
                }
                g.rows[b].parentElement.removeChild(g.rows[b])
            }
                ;
            this.insertCol = function (b, g) {
                b || 0 === b || "0" === b || (b = -1);
                for (var a = this.element, c = this.matrix(), d = 0; d < c.length; d++) {
                    var f = c[d];
                    if (0 > b) {
                        var e = f.length + b + 1;
                        0 > e && (e = 0)
                    } else
                        e = b > f.length ? f.length : b;
                    f = 0 === e ? c[d][e] : c[d][e - 1];
                    var k = c[d][e - 1];
                    if (k && (k.refCell || 1 != k.cell.colSpan))
                        (k.refCell || k).cell.colSpan += 1,
                            d += (k.refCell || k).cell.rowSpan - 1;
                    else {
                        k = c[d][e];
                        var h = d;
                        f ? (f = f.cell || f.refCell,
                            e = document.createElement(f.tagName),
                            e.rowSpan = f.rowSpan,
                            d += f.rowSpan - 1) : e = document.createElement("TD");
                        g && g.call(this, e);
                        a.rows[h].insertBefore(e, k ? k.cell : null)
                    }
                }
            }
                ;
            this.insertRow = function (b, g) {
                b || 0 === b || "0" === b || (b = -1);
                var a = this.element
                    , c = document.createElement("tr")
                    , d = this.matrix();
                0 > b ? (b = d.length + b + 1,
                    0 > b && (b = 0)) : b > d.length && (b = d.length);
                if (d = 0 == b ? d[b] : d[b - 1])
                    for (var f = 0; f < d.length; f++) {
                        var e = d[f];
                        if (e && (e.refCell || 1 != e.cell.rowSpan))
                            (e.refCell || e).cell.rowSpan += 1,
                                f += (e.refCell || e).cell.colSpan - 1;
                        else {
                            e = e.cell || e.refCell;
                            var k = document.createElement(e.tagName);
                            k.colSpan = e.colSpan;
                            f += e.colSpan - 1;
                            g && g.call(this, k);
                            c.appendChild(k)
                        }
                    }
                else
                    k = document.createElement("td"),
                        g && g.call(this, k),
                        c.appendChild(k);
                ((a.rows[0] || {}).parentElement || a).insertBefore(c, a.rows[b])
            }
                ;
            this.split = function (b, g) {
                b.tagName && (b = [b]);
                b = Array.prototype.slice.call(b);
                for (var a = 0; a < b.length; a++) {
                    var c = b[a];
                    if (!(1 >= c.rowSpan && 1 >= c.colSpan)) {
                        var d = this.matrix()
                            , f = this.position(c, d)
                            , e = Array(c.rowSpan);
                        for (a = 0; a < c.rowSpan; a++) {
                            e[a] = document.createDocumentFragment();
                            for (var k = 0; k < c.colSpan; k++)
                                if (0 !== a || 0 !== k) {
                                    var w = document.createElement(c.tagName);
                                    g && g.call(this, w);
                                    e[a].appendChild(w)
                                }
                        }
                        c.rowSpan = c.colSpan = 1;
                        for (a = 0; a < e.length; a++) {
                            c = d[f.y + a];
                            w = null;
                            for (k = f.x + (0 === a ? 1 : 0); k < c.length; k++)
                                c[k].cell && (w = c[k].cell,
                                    k = c.length);
                            h.rows[f.y + a].insertBefore(e[a], w)
                        }
                    }
                }
            }
                ;
            this.mergeVertical = function (b, g) {
                for (var a = !1, c = 0; c < n.maxIteration; c++)
                    if (this._mergeVertical(b, g))
                        a = !0;
                    else
                        break;
                return a
            }
                ;
            this.mergeHorizontal = function (b, g) {
                for (var a = !1, c = 0; c < n.maxIteration; c++)
                    if (this._mergeHorizontal(b, g))
                        a = !0;
                    else
                        break;
                return a
            }
                ;
            this.first = function () {
                for (var b = this.element.rows, g = 0; g < b.length; g++)
                    for (var a = b[g].cells; 0 < a.length;)
                        return a[0];
                return null
            }
                ;
            this.last = function () {
                for (var b = this.element.rows, g = b.length - 1; 0 <= g; g--)
                    for (var a = b[g].cells, c = a.length - 1; 0 <= c;)
                        return a[c];
                return null
            }
                ;
            this.cells = function (b, g) {
                if (1 > arguments)
                    return [];
                1 == arguments ? (g = b,
                    b = this.first()) : "[object Array]" === Object.prototype.toString.call(b) && (b = this.cell.apply(this, b));
                if (!this.isAChildCell(b))
                    return [];
                var a = [];
                if (!this.isAChildCell(b))
                    return a;
                a = g.split(/,+/g);
                for (var c = [], d = this.matrix(), f = this.position(b, d), e = 0; e < a.length; e++)
                    c = c.concat(B(d[f.y][f.x], d, a[e]));
                return C(c)
            }
                ;
            this.cell = function (b, g, a) {
                a = a || this.matrix();
                0 > g && (g = a.length + g);
                if (0 > g || g >= a.length)
                    return null;
                g = a[g];
                0 > b && (b = g.length + b);
                if (0 > b || b >= g.length)
                    return null;
                b = g[b];
                return b.cell || b.refCell.cell
            }
                ;
            this.merge = function (b, g) {
                for (var a, c, d = !1, f = 0; f < n.maxIteration; f++)
                    if (c = this._mergeVertical(b, g),
                        a = this._mergeHorizontal(b, g),
                        c || a)
                        d = !0;
                    else if (!c && !a)
                        break;
                return d
            }
                ;
            this._mergeVertical = function (b, g) {
                b = z(b);
                if (1 >= b.length)
                    return !1;
                for (var a = this.matrix(), c = !1, d = 0, f = b.length; d < f; d++) {
                    var e = b[d]
                        , k = []
                        , h = e.colSpan
                        , p = e.rowSpan;
                    if (this.isAChildCell(e)) {
                        var l = this.position(e, a);
                        if (!l)
                            continue;
                        for (var m = l.y + e.rowSpan; m < a.length; m++)
                            for (var n = [], v = 0, r = a[m], y = 0, t = l.x; t < r.length; t++) {
                                var q = r[t].cell;
                                y += (q || {}).colSpan || 1;
                                v = 0 === v ? (q || {}).rowSpan : v;
                                q && A(b, q) && y <= h && q.rowSpan == v ? (n.push(q),
                                    h === y && (k = k.concat(n),
                                        p += v,
                                        t = r.length),
                                    t += q.colSpan - 1,
                                    m += q.rowSpan - 1) : (t = r.length,
                                        m = a.length)
                            }
                    }
                    if (0 < k.length) {
                        g && g.call(this, h, p, e, k);
                        for (m = 0; m < k.length; m++)
                            k[m].parentElement.removeChild(k[m]);
                        e.rowSpan = p;
                        e.colSpan = h;
                        c = !0
                    }
                }
                return c
            }
                ;
            this._mergeHorizontal = function (b, g) {
                b = z(b);
                if (1 >= b.length)
                    return !1;
                for (var a = this.matrix(), c = !1, d = 0, f = b.length; d < f; d++) {
                    var e = b[d]
                        , k = []
                        , h = e.rowSpan
                        , p = e.colSpan;
                    if (this.isAChildCell(e)) {
                        var l = this.position(e, a);
                        if (!l)
                            continue;
                        for (var m = l.x + e.colSpan, n = a[l.y].length; m < n; m++)
                            for (var v = [], r = 0, y = 0, t = l.y; t < a.length; t++) {
                                var q = a[t][m].cell;
                                y += (q || {}).rowSpan || 1;
                                r = 0 === r ? (q || {}).colSpan : r;
                                q && A(b, q) && y <= h && q.colSpan == r ? (v.push(q),
                                    h === y && (k = k.concat(v),
                                        p += r,
                                        t = a.length),
                                    t += q.rowSpan - 1,
                                    m += q.colSpan - 1) : (t = a.length,
                                        m = n)
                            }
                    }
                    if (0 < k.length) {
                        g && g.call(this, p, h, e, k);
                        for (m = 0; m < k.length; m++)
                            k[m].parentElement.removeChild(k[m]);
                        e.rowSpan = h;
                        e.colSpan = p;
                        c = !0
                    }
                }
                return c
            }
                ;
            this.position = function (b, g) {
                g = g || this.matrix();
                for (var a = 0, c; a < g.length; a++) {
                    c = g[a];
                    for (var d = 0, f; d < c.length; d++)
                        if ((f = c[d]) && f.cell == b)
                            return {
                                x: f.x,
                                y: f.y
                            }
                }
                return null
            }
                ;
            this.matrix = function (b) {
                var g = this.element
                    , a = []
                    , c = []
                    , d = g.rows;
                g = g.innerHTML;
                if (n.cache && l[g])
                    return l[g];
                this.clearCache();
                for (var f = 0; f < d.length; f++)
                    a.push([]);
                for (f = 0; f < d.length; f++)
                    for (var e = d[f], k = 0, h = 0; h < e.cells.length; h++) {
                        var p = e.cells[h];
                        if ("object" != typeof a[f][k] && !1 !== a[f][k]) {
                            var x = b ? parseInt(p.getAttribute("rowSpan"), 10) : p.rowSpan;
                            x = Math.floor(Math.abs(isNaN(x) ? 1 : x));
                            0 === x && !b && p.ownerDocument && "BackCompat" == p.ownerDocument.compatMode && (x = 1);
                            if (1 == x)
                                if (!p.colSpan || 2 > p.colSpan)
                                    a[f][k] = {
                                        cell: p,
                                        x: k,
                                        y: f
                                    };
                                else
                                    for (var m = a[f][k] = {
                                        cell: p,
                                        x: k,
                                        y: f
                                    }, u = 1; u < p.colSpan; u++)
                                        a[f][k + u] = {
                                            refCell: m,
                                            x: k + u,
                                            y: f
                                        };
                            else {
                                m = a[f][k] = {
                                    cell: p,
                                    x: k,
                                    y: f
                                };
                                0 === x && c.push(m);
                                u = 0;
                                for (var v = Math.max(x, 1); u < v; u++)
                                    for (var r = 0; r < p.colSpan; r++)
                                        if (0 !== u || 0 !== r) {
                                            var y = a[f + u][k + r] = {
                                                refCell: m,
                                                x: k + r,
                                                y: f + u
                                            };
                                            0 === x && c.push(y)
                                        }
                            }
                        } else
                            h--;
                        k++
                    }
                if (c.length)
                    for (f = 0; f < c.length; f++)
                        for (b = c[f],
                            d = b.x,
                            h = b.y + 1; h < a.length; h++)
                            for (a[h].splice(d, 0, {
                                x: d,
                                y: h,
                                refCell: b.refCell || b
                            }),
                                e = d + 1; e < a[h].length; e++)
                                a[h][e].x += 1;
                n.cache && (l[g] = a);
                return a
            }
                ;
            this.getCellPosition = function (b) {
                for (var g = [], a = this.element.rows, c = 0; c < a.length; c++)
                    g.push([]);
                for (c = 0; c < a.length; c++)
                    for (var d = a[c].cells, f = 0, e = 0; e < d.length; e++) {
                        var k = d[e];
                        if (g[c][f])
                            e--,
                                f++;
                        else {
                            if (k == b)
                                return {
                                    x: c,
                                    y: f
                                };
                            for (var h = 1; h < k.rowSpan; h++)
                                for (var l = 0; l < k.colSpan; l++)
                                    g[c + h][f + l] = !0;
                            f += k.colSpan
                        }
                    }
            }
                ;
            this.rel = function (b, g) {
                var a = this.element.rows[g];
                if (a)
                    return a.cells[b]
            }
                ;
            this.getCellByPosition = function (b, g) {
                var a = []
                    , c = this.element.rows;
                if (b >= c.length)
                    return null;
                for (var d = 0; d < c.length; d++)
                    a.push([]);
                d = 0;
                for (var f = Math.min(c.length, b + 1); d < f; d++)
                    for (var e = c[d].cells, h = 0, l = 0; l < e.length; l++) {
                        var p = e[l];
                        if (a[d][h])
                            l--,
                                h++;
                        else {
                            if (d == b && h == g)
                                return p;
                            for (var n = 1; n < p.rowSpan; n++)
                                for (var m = 0; m < p.colSpan; m++)
                                    a[d + n][h + m] = !0;
                            h += p.colSpan
                        }
                    }
            }
        };
    n.isACell = function (h) {
        return h && ("TD" == h.tagName || "TH" == h.tagName)
    }
        ;
    n.rowSpan = function (h) {
        if (n.isACell(h)) {
            if (0 === h.rowSpan) {
                if (-1 == h.cellIndex)
                    return 1;
                h = h.parentElement;
                var l = 1;
                if (!h || "TR" != h.tagName)
                    return -1;
                for (; h = h.nextSibling;)
                    "TR" == h.tagName && l++;
                return l
            }
            return h.rowSpan
        }
        return null
    }
        ;
    n.maxIteration = 50;
    n.cache = !0;
    n.build = 5;
    n.version = "0.2";
    n.stable = !0;
    window.Table = n
}
)();
