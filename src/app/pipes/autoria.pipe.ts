import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'autoria'
})
export class AutoriaPipe implements PipeTransform {

  transform(autoria: string[]): string {
    if(autoria) {
      return autoria[0]
    }
    return''
  }

}
