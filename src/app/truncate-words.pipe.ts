import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncatewords',
})
export class TruncateWordsPipe implements PipeTransform {
  transform(value: string, lines: number): string {
    if (!value) return '';

    const div = document.createElement('div');
    div.innerHTML = value;
    div.style.display = '-webkit-box';
    div.style.webkitBoxOrient = 'vertical';
    div.style.overflow = 'hidden';
    div.style.textOverflow = 'ellipsis';
    div.style.webkitLineClamp = lines.toString();
    div.style.maxHeight = `${lines * 15}px`; // Adjust line height as needed

    return div.textContent ?? div.innerText;
  }
}
