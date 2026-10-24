import { Component, computed, effect, input, signal } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { FormUtils } from '../../../utils/fotm-utils';

@Component({
  imports: [],
  selector: 'form-label-error',
  styleUrl: './form-label-error.css',
  templateUrl: './form-label-error.html',
})
export class FormLabelError {
  
  
  public control = input.required<AbstractControl>()
  private controlVersion = signal(0);

  public controlEffect = effect((onCOmplete) => {
    const control = this.control();

    const subscription = this.control().events.subscribe(() => {
      this.controlVersion.update(value => value + 1);
    });

    onCOmplete(() => {
      subscription.unsubscribe();
    });
  });
  public errorMessage = computed(() => {
    this.controlVersion();
    // console.log("aixo passsa? hi ha errors?", this.control());
    
    const errors: ValidationErrors = this.control().errors || {};
    if (this.control().touched && Object.keys(errors).length > 0){
      console.log("hi ha la tira d'errors");
      
    }
    return this.control().touched && Object.keys(errors).length > 0
    ? FormUtils.getTextError(errors) : null;
  });
}
