import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastrService } from 'ngx-toastr';
import { Router} from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggin: BehaviorSubject<boolean> =  new BehaviorSubject<boolean>(false);
  isLoggedInGuard : boolean = false; 

  constructor( private afAuth: AngularFireAuth ,private toastr: ToastrService,private router: Router) { }

  login( email: any, password: any){
    this.afAuth.signInWithEmailAndPassword(email,password).then((logRef) => {
       this.toastr.success('Logged in Successfully');
       this.loadUser();
       this.loggin.next(true);
       this.isLoggedInGuard = true;
       this.router.navigate(['/'])
    }).catch(e =>{
      this.toastr.warning(e);
    })
  }

  loadUser(){
    this.afAuth.authState.subscribe(user => {
      console.log(JSON.parse(JSON.stringify(user)))
      localStorage.setItem('user',JSON.stringify(user));
    })
  }

  logOut(){
    this.afAuth.signOut().then(()=>{
      this.toastr.success('User logged out successfully')
      localStorage.removeItem('user')
      this.loggin.next(false);
      this.isLoggedInGuard = false;
      this.router.navigate(['/login'])
    })
  }

  isLoggedIn(){
    return this.loggin.asObservable();
  }
}
