
interface IPie {
    x0: number;
    y0: number;
    radius: number;
  };
  
  interface IParts {
    value: number;
    label: string;
    startAngle: number;
    endAngle: number;
  };
  
  export class PieChart {
  
    private readonly colors = ['#ff0000', '#ff8700', '#ffd300', '#deff0a', '#a1ff0a', '#0aff99', '#0aefff', '#147df5', '#580aff', '#be0aff'];
    private context: CanvasRenderingContext2D;
    private tipContext: CanvasRenderingContext2D;
    private data: IParts[];
    private pie: IPie;
    private slices: number = 0;
  
    constructor(private canvas: HTMLCanvasElement, private tooltip: HTMLCanvasElement) {
      let a = canvas.getContext('2d');
      if (a != null) {
        this.context = a;
      } else {
        throw new Error('Failed to get 2D context for canvas');
      }
      a = tooltip.getContext('2d');
      if (a != null) {
        this.tipContext = a;
      } else {
        throw new Error('Failed to get 2D context for tooltip canvas');
      }
      //this.context = canvas.getContext('2d');
      //this.tipContext = tooltip.getContext('2d');
      this.data = this.getData(canvas);
  
      canvas.addEventListener('click', (e) => this.onClick(e));
      canvas.addEventListener('mousemove', (e) => this.onMouseOver(e));
      canvas.addEventListener('mouseleave', (e) => this.onMouseLeave(e));
  
      this.pie = {
        x0: this.canvas.width / 2,
        y0: this.canvas.height / 2,
        radius: Math.min(this.canvas.width, this.canvas.height) / 2 * .9
      };
    }
  
    private getData(elem: HTMLCanvasElement): IParts[] {
      const stringValues = elem.getAttribute('data-values');
      const stringLabels = elem.getAttribute('data-labels');
      console.log(stringLabels);
      console.log(stringValues);    
      if (stringValues == null) {
        throw new Error('Failed to get stringValues');
      }  
      if (stringLabels == null) {
        throw new Error('Failed to get stringLabels');
      }  
      const values: number[] = JSON.parse(stringValues);
      const labels: string[] = JSON.parse(stringLabels);
  
      if (Array.isArray(values) && Array.isArray(labels)) {
  
        let data: IParts[] = [];
        let startAngle = 0;
        const sum = this.sum(values);
        this.slices = values.length;
  
        values.forEach((value, idx) => {
          let endAngle = startAngle + value / sum * 2 * Math.PI;
  
          data.push({
            value: value,
            label: labels[idx],
            startAngle: startAngle,
            endAngle: endAngle
          });
  
          startAngle = endAngle;
        });
  
        return data;
      }
      else {
        throw new Error('Data missing or not set properly');
      }
    }
  
    private clear() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  
    private sum(array: number[]): number {
      let sum = 0;
      array.forEach(value => sum += value);
      return sum;
    }
  
    render() {
        //this.tooltip.style.position = "absolute";
  
      let p = 0;
      let interval = setInterval(() => {
  
        if (p <= 100) {
          this.drawPie(p);
          p += 5;
        }
        else {
          clearInterval(interval);
        }
      }, 60);
    }
  
    drawPie(p: number, pidx?: number) {
  
      const ctx = this.context;
      const pie = this.pie;
      this.clear();
  
      this.data.forEach((part, idx) => {
  
        // Set style
        ctx.fillStyle = this.colors[Math.floor(((idx * this.colors.length) / this.slices) % this.colors.length)];
        //console.log(((idx * this.colors.length) / this.slices) % this.colors.length)
        ctx.strokeStyle = 'grey';
  
        ctx.beginPath();
        ctx.moveTo(pie.x0, pie.y0);
  
        if (typeof pidx === 'number') {
          if (pidx === idx) {
            ctx.arc(pie.x0, pie.y0, pie.radius * 1.05, part.startAngle * (p / 100), part.endAngle * (p / 100));
          }
          else {
            ctx.arc(pie.x0, pie.y0, pie.radius, part.startAngle * (p / 100), part.endAngle * (p / 100));
          }
        }
        else {
          ctx.arc(pie.x0, pie.y0, pie.radius, part.startAngle * (p / 100), part.endAngle * (p / 100));
        }
  
        ctx.fill();
        //ctx.stroke();
        ctx.closePath();
      });
  
      // ctx.beginPath();
      // ctx.moveTo(pie.x0, pie.y0);
      // ctx.arc(pie.x0, pie.y0, pie.radius * 0.4, 0, 2 * Math.PI);
      // ctx.fillStyle = 'white';
      // ctx.fill();
      // ctx.closePath();
    }
  
    private onClick(event: MouseEvent) {
      const { dataIdx } = this.getCoordinates(event);
      console.log(`Label: ${this.getInfo(dataIdx)}`);
    }
  
    private getCoordinates(event: MouseEvent) {
  
      const pie = this.pie;
      const rect = this.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const radius = Math.sqrt((x - pie.x0) * (x - pie.x0) + (y - pie.y0) * (y - pie.y0));
      const angle = Math.atan2((y - pie.y0), (x - pie.x0)) + (y < pie.y0 ? 2 * Math.PI : 0);
  
      let dataIdx = -1;
  
      if (radius <= pie.radius) {
        this.data.forEach((part, idx) => {
          if (angle >= part.startAngle && angle < part.endAngle) {
            dataIdx = idx;
          }
        });
      }
  
      return {
        clientX: event.clientX,
        clientY: event.clientY,
        x: x,
        y: y,
        radius: radius,
        angle: angle,
        dataIdx: dataIdx
      };
    }
  
    private getInfo(dataIdx: number): string {
      return dataIdx > -1 ? `${this.data[dataIdx].label}: ${this.data[dataIdx].value}` : 'Out of pie';
    }
  
    private onMouseOver(event: MouseEvent) {
  
      const { clientX, clientY, radius, angle, dataIdx } = this.getCoordinates(event);
      const width = this.tooltip.width;
      const height = this.tooltip.height;

  
      this.drawPie(100, dataIdx);
  
  
      if (radius <= this.pie.radius) {
  
        let offsetX = 0;
        if (clientX - width / 2 > 0) {
  
          if (clientX + width / 2 >= window.innerWidth) {
            offsetX = clientX - width;
          }
          else {
            offsetX = width / 2;
          }
        }
        else {
          offsetX = clientX;
        }
  
        // Position
        this.tooltip.style.left = (clientX - offsetX).toString() + "px";
        //console.log(this.tooltip.style.left)
        this.tooltip.style.top = (clientY - 40).toString() + "px";
        //console.log(this.tooltip.style.top)
  
        // Clear tip
        this.tipContext.clearRect(0, 0, width, height);
        this.tooltip.style.display = 'block';
        
        // Resize tooltip
        this.tipContext.font = 'bold 10px sans-serif';
        let tipWidth = this.tipContext.measureText(this.getInfo(dataIdx)).width;
        this.tooltip.width = tipWidth * 3 + 5;
  
         // Draw color box
        this.tipContext.rect(10, 7, 10, 10);
        this.tipContext.fillStyle = this.colors[Math.floor(((dataIdx * this.colors.length) / this.slices) % this.colors.length)];
        this.tipContext.fill();
  
        // Write text
        this.tipContext.textAlign = "left";
        this.tipContext.fillStyle = "white";
        this.tipContext.font = "15px sans-serif";
        this.tipContext.fillText(this.getInfo(dataIdx), 23, 18);
        
      }
      else {
        this.tooltip.style.display = 'none';
      }
    }
  
    private onMouseLeave(event: MouseEvent) {
      this.drawPie(100);
      this.tooltip.style.display = 'none';
    }
  
  }