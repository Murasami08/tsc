var dataConverter = function (rect1, rect2, cPoint1, cPoint2) {
    var points = [];
    // Проверка на корректность точки соединения
    var checkConnectionPoint = function (rect, cPoint) {
        var _a = rect.position, x = _a.x, y = _a.y;
        var _b = rect.size, width = _b.width, height = _b.height;
        var left = x - width / 2;
        var right = x + width / 2;
        var top = y - height / 2;
        var bottom = y + height / 2;
        return ((cPoint.point.x === left && cPoint.point.y >= top && cPoint.point.y <= bottom) ||
            (cPoint.point.x === right && cPoint.point.y >= top && cPoint.point.y <= bottom) ||
            (cPoint.point.y === top && cPoint.point.x >= left && cPoint.point.x <= right) ||
            (cPoint.point.y === bottom && cPoint.point.x >= left && cPoint.point.x <= right));
    };
    if (!checkConnectionPoint(rect1, cPoint1) || !checkConnectionPoint(rect2, cPoint2)) {
        throw new Error("Connection points must lie on the edges of the rectangles.");
    }
    // Преобразование углов в радианы
    var angleToRadians = function (angle) { return (angle * Math.PI) / 180; };
    // Вычисление смещенных точек для соединения
    var offsetDistance = 20; // расстояние от границ прямоугольников
    var angle1 = angleToRadians(cPoint1.angle);
    var angle2 = angleToRadians(cPoint2.angle);
    var p1 = {
        x: cPoint1.point.x + Math.cos(angle1) * offsetDistance,
        y: cPoint1.point.y + Math.sin(angle1) * offsetDistance,
    };
    var p2 = {
        x: cPoint2.point.x + Math.cos(angle2) * offsetDistance,
        y: cPoint2.point.y + Math.sin(angle2) * offsetDistance,
    };
    points.push(cPoint1.point, p1, p2, cPoint2.point);
    return points;
};
//Этап 2
var drawCanvas = function (canvasId, rect1, rect2, points) {
    var canvas = document.getElementById(canvasId);
    var ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error("Failed to get canvas context.");
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Отрисовка первого прямоугольника
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(rect1.position.x - rect1.size.width / 2, rect1.position.y - rect1.size.height / 2, rect1.size.width, rect1.size.height);
    // Отрисовка второго прямоугольника
    ctx.fillStyle = 'lightgreen';
    ctx.fillRect(rect2.position.x - rect2.size.width / 2, rect2.position.y - rect2.size.height / 2, rect2.size.width, rect2.size.height);
    // Отрисовка ломаной линии
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
};
// Пример использования
var rect1 = { position: { x: 100, y: 100 }, size: { width: 50, height: 50 } };
var rect2 = { position: { x: 300, y: 300 }, size: { width: 50, height: 50 } };
var cPoint1 = { point: { x: 100, y: 125 }, angle: 90 };
var cPoint2 = { point: { x: 300, y: 275 }, angle: -90 };
var points = dataConverter(rect1, rect2, cPoint1, cPoint2);
drawCanvas('myCanvas', rect1, rect2, points);
