import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from '@openng/optimus-ui/button';
import { InputText } from '@openng/optimus-ui/inputtext';
import { Message } from '@openng/optimus-ui/message';
import { ToastModule } from '@openng/optimus-ui/toast';
import { AuthService } from '../../services/auth-service';
import { MessageService } from '@openng/optimus-ui/api';
import { HttpErrorResponse } from '@angular/common/http';
import { asapScheduler } from 'rxjs';

@Component({
  imports: [ButtonModule, 
    InputText, 
    Message, 
    RouterLink, 
    ReactiveFormsModule,
  ToastModule],
  providers: [MessageService],
  selector: 'app-register-page',
  styleUrl: './register-page.css',
  templateUrl: './register-page.html',
})
export class RegisterPage {
  private formBuilder = inject(FormBuilder);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);
  private router = inject(Router);
  public registerForm = this.formBuilder.group({
    email: ['', [Validators.required ,Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    fullName: ['', Validators.required] 
  });

  public onSubmit(): void {
    // console.log(this.registerForm.value, this.registerForm.valid);
    if (this.registerForm.invalid) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Error de formulari', 
        life: 3000 });
        return;
    }

    const { email = '', fullName = '', password = ''} = this.registerForm.value;
    this.authService.register(email!, fullName!, password!)
      .subscribe({
        next: (isRegisted) => {
        if (isRegisted) {
          
          this.authService.registerStatus.set(true);
          this.router.navigateByUrl('/auth/login');
          return;
        }
      },
      error: (err: HttpErrorResponse) => {
        // console.log("ELL  ERRRRORORORORORO", err);
        const errorMessage = Array.isArray(err.error.message) ? err.error.message.join(',') : err.error.message; 
        this.messageService.add({ 
          severity: 'error', 
          summary: err.error.error, 
          detail: errorMessage , 
          life: 7000 });
      }
      });
  }
}
