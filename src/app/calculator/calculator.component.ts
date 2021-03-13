import { Component, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css'],
})

export class CalculatorComponent implements OnInit {
  
  constructor(private renderer: Renderer2) {
    this.renderer = renderer;
  }

  ngOnInit(): void {
  }

  type: String = 'number';
  vectorSize: number = 3;
  matrixSize: number = 3;

  onSelect(type: String) {
    this.type = type;
  }

  changeVector(method: string): void {
    const root1 = this.renderer.selectRootElement('#vector_1', true);
    const root2 = this.renderer.selectRootElement('#vector_2', true);
    if(method === "inc") {
      this.vectorSize++;
      const inputElement1 = this.renderer.createElement('input');
      const inputElement2 = this.renderer.createElement('input');
      this.renderer.addClass(inputElement1, 'vector_input_1');
      this.renderer.addClass(inputElement2, 'vector_input_2');
      this.renderer.appendChild(root1, inputElement1);
      this.renderer.appendChild(root2, inputElement2);
    } else if(method === "dec") {
      if (this.vectorSize > 2) {
        this.vectorSize--;
        const inputElement1 = this.renderer.selectRootElement('.vector_input_1');
        const inputElement2 = this.renderer.selectRootElement('.vector_input_2');
        this.renderer.removeChild(root1, inputElement1);
        this.renderer.removeChild(root2, inputElement2);
      }
    }
  }

  changeMatrix(method: string): void {
    if(method === "inc") {
      this.matrixSize++;
      this.printMatrix();
    } else if (method === "dec") {
      if (this.matrixSize > 2) {
        this.matrixSize--;
        this.printMatrix();
      }
    }
  }

  printMatrix(): void {
    const root1 = this.renderer.selectRootElement('#matrix_1', false);
    const root2 = this.renderer.selectRootElement('#matrix_2', false);
    for (let i = 0; i < this.matrixSize; i++) {
      for (let j = 0; j < this.matrixSize; j++) {
        const inputElement1 = this.renderer.createElement('input');
        const inputElement2 = this.renderer.createElement('input');
        this.renderer.addClass(inputElement1, 'matrix_input');
        this.renderer.addClass(inputElement2, 'matrix_input');
        this.renderer.appendChild(root1, inputElement1);
        this.renderer.appendChild(root2, inputElement2);
      }
      const br1 = this.renderer.createElement('br');
      const br2 = this.renderer.createElement('br');
      this.renderer.appendChild(root1, br1);
      this.renderer.appendChild(root2, br2);
    }
  }

  takeValues(): void {
    const div = this.renderer.selectRootElement('.number_calc', true);
    console.log(this.renderer.nextSibling(div));
  }
}