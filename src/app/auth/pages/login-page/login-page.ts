import { AfterViewInit, Component, inject, OnInit, signal } from '@angular/core';
import { Button, ButtonModule } from '@openng/optimus-ui/button';
import { InputText } from '@openng/optimus-ui/inputtext';
import { MessageService } from '@openng/optimus-ui/api';
import { Message } from '@openng/optimus-ui/message';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastModule } from '@openng/optimus-ui/toast';
import { AuthService } from '../../services/auth-service';
import { asapScheduler, Observable, of } from 'rxjs';
@Component({
  imports: [ButtonModule, 
    InputText, 
    Message, 
    RouterLink, 
    ReactiveFormsModule,
  ToastModule],
  providers: [MessageService],
  selector: 'app-login-page',
  styleUrl: './login-page.css',
  templateUrl: './login-page.html',
})
export class LoginPage implements OnInit {
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email ]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  public hasError = signal(false);
  public isPosting = signal(false);


  public ngOnInit(): void {

    // console.log("els states", history.state);
    
    if (this.authService.registerStatus()) {
      // console.log("aqui entrem????");
    asapScheduler.schedule(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Registrat',
        detail: 'El registre ha sigut correcte',
        life: 5000
      });
      this.authService.registerStatus.set(false);
    }); 
    }
  }



  public onSubmit(): void {
    // console.log(this.loginForm.status);
    // console.log('email', this.loginForm.controls['email'].value, this.loginForm.controls['email'].status);
    // console.log('password', this.loginForm.controls['password'].value, this.loginForm.controls['password'].status)

    if (this.loginForm.invalid) {
      this.hasError.set(true);
      asapScheduler.schedule(() => {
        this.hasError.set(false);
      });
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error de formulari', life: 3000 });
      return;
    }

    const { email = '', password = ''} = this.loginForm.value;
    // console.log({email, password});
    this.authService.login(email!, password!).subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigateByUrl('/');
        return;
      }
      
      this.hasError.set(true);
      asapScheduler.schedule(() => {
        this.hasError.set(false);
      });
       this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'No autenticat', 
          life: 3000 });
      
    });
  }

  
}
