// typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-agropre-logo',
  template: `
    <svg
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 186 206"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      [attr.class]="className">
      <mask id="mask0_53_763" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="10" y="10" width="168" height="168">
        <path d="M177.5 10H10V177.5H177.5V10Z" fill="white"/>
      </mask>
      <g mask="url(#mask0_53_763)">
        <image
          [attr.href]="src"
          x="10" y="10"
          width="168" height="168"
          preserveAspectRatio="xMidYMid meet"
          role="img" aria-label="Logotipo de AgroPre" />
      </g>
    </svg>
  `,
  styles: ``
})
export class AgropreLogoComponent {
  @Input() src: string = 'assets/agropre.png';
  @Input() size: number = 32;
  @Input() className: string = '';
}
