type Point = {
    x: number;
    y: number;
  };
  
  type Size = {
    width: number;
    height: number;
  };
  
  type Rect = {
    position: Point; // координата центра прямоугольника
    size: Size;
  };
  
  type ConnectionPoint = {
    point: Point;
    angle: number; // угол в градусах
  };
  
  const dataConverter = (
    rect1: Rect, 
    rect2: Rect, 
    cPoint1: ConnectionPoint, 
    cPoint2: ConnectionPoint
  ): Point[] => {
    const points: Point[] = [];
  
    // Проверка на корректность точки соединения
    const checkConnectionPoint = (rect: Rect, cPoint: ConnectionPoint): boolean => {
      const { x, y } = rect.position;
      const { width, height } = rect.size;
      
      const left = x - width / 2;
      const right = x + width / 2;
      const top = y - height / 2;
      const bottom = y + height / 2;
  
      return (
        (cPoint.point.x === left && cPoint.point.y >= top && cPoint.point.y <= bottom) || 
        (cPoint.point.x === right && cPoint.point.y >= top && cPoint.point.y <= bottom) || 
        (cPoint.point.y === top && cPoint.point.x >= left && cPoint.point.x <= right) || 
        (cPoint.point.y === bottom && cPoint.point.x >= left && cPoint.point.x <= right)   
      );
    };
  
    if (!checkConnectionPoint(rect1, cPoint1) || !checkConnectionPoint(rect2, cPoint2)) {
      throw new Error("Connection points must lie on the edges of the rectangles.");
    }
  
    // Преобразование углов в радианы
    const angleToRadians = (angle: number) => (angle * Math.PI) / 180;
  
    // Вычисление смещенных точек для соединения
    const offsetDistance = 20; // расстояние от границ прямоугольников
    const angle1 = angleToRadians(cPoint1.angle);
    const angle2 = angleToRadians(cPoint2.angle);
  
    const p1 = {
      x: cPoint1.point.x + Math.cos(angle1) * offsetDistance,
      y: cPoint1.point.y + Math.sin(angle1) * offsetDistance,
    };
  
    const p2 = {
      x: cPoint2.point.x + Math.cos(angle2) * offsetDistance,
      y: cPoint2.point.y + Math.sin(angle2) * offsetDistance,
    };
  
    points.push(cPoint1.point, p1, p2, cPoint2.point);
  
    return points;
  };
  //Этап 2
  const drawCanvas = (canvasId: string, rect1: Rect, rect2: Rect, points: Point[]) => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
  
    if (!ctx) {
      throw new Error("Failed to get canvas context.");
    }
  
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    // Отрисовка первого прямоугольника
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(
      rect1.position.x - rect1.size.width / 2,
      rect1.position.y - rect1.size.height / 2,
      rect1.size.width,
      rect1.size.height
    );
  
    // Отрисовка второго прямоугольника
    ctx.fillStyle = 'lightgreen';
    ctx.fillRect(
      rect2.position.x - rect2.size.width / 2,
      rect2.position.y - rect2.size.height / 2,
      rect2.size.width,
      rect2.size.height
    );
  
    // Отрисовка ломаной линии
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    
    ctx.stroke();
  };
  
  // Пример использования
  const rect1: Rect = { position: { x: 100, y: 100 }, size: { width: 50, height: 50 } };
  const rect2: Rect = { position: { x: 300, y: 300 }, size: { width: 50, height: 50 } };
  const cPoint1: ConnectionPoint = { point: { x: 100, y: 125 }, angle: 90 };
  const cPoint2: ConnectionPoint = { point: { x: 300, y: 275 }, angle: -90 };
  
  const points = dataConverter(rect1, rect2, cPoint1, cPoint2);
  drawCanvas('myCanvas', rect1, rect2, points);
  