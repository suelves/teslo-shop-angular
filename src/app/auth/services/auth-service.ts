import { computed, inject, Service, signal } from "@angular/core";
import { User } from "../interfaces/user.interface";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { AuthResponse } from "../interfaces/auth-response.interface";
import { catchError, map, Observable, of, tap } from "rxjs";
import { rxResource } from "@angular/core/rxjs-interop";

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
 const baseUrl = environment.baseUrl;

@Service()
export class AuthService {
    private _authStatus = signal<AuthStatus>('checking');
    private _user = signal<User | null>(null);
    private _token = signal<string | null>(localStorage.getItem('token'));

    private http = inject(HttpClient);

    private checStatusResource = rxResource({
        stream: () => this.checkStatus()
    })
    public authStatus = computed<AuthStatus>(() => {
        if (this._authStatus() === 'checking') return 'checking';
        if (this._user()) return 'authenticated';
        return 'not-authenticated'
    });

    public registerStatus = signal(false);
    
    public user = computed<User | null>(() => this._user());
    public token = computed(() => this._token());
    public isAdmin = computed(() => this._user()?.roles.includes('admin') ?? false);
    
    public login(email: string, password: string): Observable<boolean> {
        return this.http.post<AuthResponse>(`${baseUrl}/auth/login`, {
            email: email,
            password: password
        }).pipe(
            map(resp => this.handleAuthSuccess(resp)),
            catchError((err) =>this.handleAuthError(err))
        );
    }


    public register(email: string, fullName: string, password: string): Observable<boolean> {
        const params = {
            email: email,
            fullName: fullName,
            password: password
        };
        // console.log("abans de enviar paams:", params);
        
        return this.http.post(`${ baseUrl }/auth/register`, params).pipe(
            // tap(req => console.log("la peticio es",req)),
            map(req => true),
            // catchError((err) => {
            //     console.log("ERRRRROOOOORRR", err);
                
            //     return of(false);
            // })
        );
    }

    public logout(): void {
        this._user.set(null);
        this._token.set(null);
        this._authStatus.set('not-authenticated');
        localStorage.removeItem('token');
    }

    public checkStatus(): Observable<boolean> {
        const token = localStorage.getItem('token');
        // console.log("Aixo es dispara");
        
        if (!token) return of(false);

        return this.http.get<AuthResponse>(`${ baseUrl }/auth/check-status`, {
            // headers: {
            //     Authorization: `Bearer ${ token }`
            // }
        }).pipe(
            map(resp => this.handleAuthSuccess(resp)),
            catchError((err: unknown) => this.handleAuthError(err))
        )
    }

    private handleAuthSuccess(resp: AuthResponse): boolean {
        this._authStatus.set('authenticated');
        this._user.set(resp.user);
        this._token.set(resp.token);
        localStorage.setItem('token', resp.token);
        // console.log("Estem autenticats :)", this.user());
        return true;
    }
    
    private handleAuthError(error: unknown): Observable<boolean> {
        this.logout()
        return of(false);
    }
}