
import { AbstractControl } from '@angular/forms';
export class MyValidators{

    static cleanUnnecessaryWhiteSpaces(cadena: string){
        const cleanString = cadena.replace(/\s{2,}/g, ' ').trim();
        return cleanString;
    }

    // static cleanUnnecessaryWhiteSpaces(control: AbstractControl){
    //     const value = control.value;
    //     const cleanString = value.replace(/\s{2,}/g, ' ').trim();
    //     return cleanString;
    // }
}
